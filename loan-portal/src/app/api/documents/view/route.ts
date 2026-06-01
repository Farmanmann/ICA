import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { decryptFile } from "@/lib/kms"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const loanId = searchParams.get("loanId")
    const docType = searchParams.get("docType") // "id_document" | "income_proof" | "bank_statements"

    if (!loanId || !docType) {
      return NextResponse.json({ error: "Missing loanId or docType" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Fetch loan — RLS ensures only admin or the borrower can access
    const { data: loan, error: loanError } = await supabase
      .from("loans")
      .select("documents, borrower_id")
      .eq("id", loanId)
      .single()

    if (loanError || !loan) {
      return NextResponse.json({ error: "Loan not found or access denied" }, { status: 404 })
    }

    const docMeta = loan.documents?.[docType]
    if (!docMeta?.path || !docMeta?.encryptedKey) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Download encrypted blob from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("loan-documents")
      .download(docMeta.path)

    if (downloadError || !fileData) throw downloadError || new Error("Download failed")

    const encryptedBuffer = Buffer.from(await fileData.arrayBuffer())

    // Decrypt using KMS
    const decryptedBuffer = await decryptFile(
      encryptedBuffer,
      docMeta.encryptedKey,
      docMeta.iv,
      docMeta.authTag
    )

    // Determine content type from original filename
    const name = docMeta.name || "document"
    const ext = name.split(".").pop()?.toLowerCase()
    const contentType =
      ext === "pdf" ? "application/pdf" :
      ext === "png" ? "image/png" :
      ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
      "application/octet-stream"

    return new NextResponse(decryptedBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${name}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (err: any) {
    console.error("Document view error:", err)
    return NextResponse.json({ error: err.message || "Failed to retrieve document" }, { status: 500 })
  }
}

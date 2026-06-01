import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { encryptFile } from "@/lib/kms"

export async function POST(request: NextRequest) {
  try {
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

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const docType = formData.get("docType") as string | null

    if (!file || !docType) {
      return NextResponse.json({ error: "Missing file or docType" }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split(".").pop()
    const storagePath = `${user.id}/${docType}.${ext}.enc`

    // Encrypt with KMS (envelope encryption — unique data key per file)
    const { encryptedData, encryptedKey, iv, authTag } = await encryptFile(fileBuffer)

    // Upload encrypted blob to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("loan-documents")
      .upload(storagePath, encryptedData, {
        upsert: true,
        contentType: "application/octet-stream",
      })

    if (uploadError) throw uploadError

    return NextResponse.json({
      path: storagePath,
      encryptedKey,
      iv,
      authTag,
      name: file.name,
    })
  } catch (err: any) {
    console.error("Document upload error:", err)
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 })
  }
}

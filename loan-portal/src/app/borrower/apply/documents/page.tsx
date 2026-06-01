"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, X, ArrowRight, ArrowLeft, Loader2, Lock } from "lucide-react"

type DocKey = "idDocument" | "incomeProof" | "bankStatements"
type DocMeta = { path: string; encryptedKey: string; iv: string; authTag: string; name: string } | null

export default function ApplyStep4() {
  const [documents, setDocuments] = useState<{
    idDocument: string | null
    idDocumentMeta: DocMeta
    incomeProof: string | null
    incomeProofMeta: DocMeta
    bankStatements: string | null
    bankStatementsMeta: DocMeta
  }>({
    idDocument: null,
    idDocumentMeta: null,
    incomeProof: null,
    incomeProofMeta: null,
    bankStatements: null,
    bankStatementsMeta: null,
  })
  const [uploading, setUploading] = useState<DocKey | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("loanApplication")
    if (saved) {
      const data = JSON.parse(saved)
      if (data.documents) {
        setDocuments((prev) => ({ ...prev, ...data.documents }))
      }
    }
  }, [])

  const handleFileUpload = async (docType: DocKey, file: File) => {
    setError("")
    setUploading(docType)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("docType", docType)

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Upload failed")
      }

      const meta: DocMeta = await res.json()
      const metaKey = `${docType}Meta` as keyof typeof documents

      setDocuments((prev) => ({
        ...prev,
        [docType]: file.name,
        [metaKey]: meta,
      }))
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.")
    } finally {
      setUploading(null)
    }
  }

  const removeDocument = (docType: DocKey) => {
    const metaKey = `${docType}Meta` as keyof typeof documents
    setDocuments((prev) => ({
      ...prev,
      [docType]: null,
      [metaKey]: null,
    }))
  }

  const handleNext = () => {
    setError("")
    const saved = localStorage.getItem("loanApplication")
    const existingData = saved ? JSON.parse(saved) : {}
    localStorage.setItem("loanApplication", JSON.stringify({
      ...existingData,
      documents,
      currentStep: 4,
    }))
    window.location.href = "/borrower/apply/review"
  }

  const handleBack = () => {
    const saved = localStorage.getItem("loanApplication")
    const existingData = saved ? JSON.parse(saved) : {}
    localStorage.setItem("loanApplication", JSON.stringify({ ...existingData, documents }))
    window.location.href = "/borrower/apply/financial-info"
  }

  const renderUploadSlot = (docType: DocKey, label: string, required = false) => {
    const name = documents[docType]
    const metaKey = `${docType}Meta` as keyof typeof documents
    const meta = documents[metaKey] as DocMeta
    const isUploading = uploading === docType
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {!name ? (
          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isUploading ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:bg-slate-50"}`}>
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
            ) : (
              <Upload className="h-8 w-8 text-slate-400 mb-2" />
            )}
            <p className="text-sm text-slate-600">{isUploading ? "Encrypting & uploading..." : "Click to upload or drag and drop"}</p>
            <p className="text-xs text-slate-500">PDF, PNG, JPG (Max 5MB)</p>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(docType, file)
              }}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-slate-900">{name}</p>
                <p className="text-xs text-green-700 flex items-center gap-1">
                  {meta ? (
                    <><Lock className="h-3 w-3" /> KMS encrypted &amp; stored securely</>
                  ) : (
                    "Saved locally"
                  )}
                </p>
              </div>
            </div>
            <button onClick={() => removeDocument(docType)} className="text-red-600 hover:text-red-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Apply for Financing</h1>
          <p className="text-slate-600">Step 4 of 5: Upload Documents</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 4 of 5</span>
            <span className="text-sm text-slate-600">80% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "80%" }} />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <p className="text-sm text-slate-600">Upload supporting documents for faster processing</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderUploadSlot("idDocument", "Government-Issued ID", true)}
            {renderUploadSlot("incomeProof", "Proof of Income (Pay Stubs / Tax Returns)")}
            {renderUploadSlot("bankStatements", "Bank Statements (Last 3 Months) — Optional")}

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Document Guidelines</p>
                  <ul className="list-disc pl-5 space-y-1 text-blue-800">
                    <li>All documents must be clear and readable</li>
                    <li>File size should not exceed 5MB per document</li>
                    <li>Accepted formats: PDF, PNG, JPG</li>
                    <li>Documents are encrypted with AWS KMS before storage</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={!!uploading}>
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

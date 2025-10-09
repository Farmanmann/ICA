"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, X, ArrowRight, ArrowLeft } from "lucide-react"

export default function ApplyStep4() {
  const [documents, setDocuments] = useState<any>({
    idDocument: null,
    incomeProof: null,
    bankStatements: null
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("loanApplication")
    if (saved) {
      const data = JSON.parse(saved)
      // Documents are stored as file names only for demo
      if (data.documents) {
        setDocuments(data.documents)
      }
    }
  }, [])

  const handleFileUpload = (docType: string, file: any) => {
    if (file) {
      setDocuments({
        ...documents,
        [docType]: file.name
      })
    }
  }

  const removeDocument = (docType: string) => {
    setDocuments({
      ...documents,
      [docType]: null
    })
  }

  const handleNext = () => {
    setError("")

    // Optional: make documents required
    // if (!documents.idDocument || !documents.incomeProof) {
    //   setError("Please upload required documents")
    //   return
    // }

    const saved = localStorage.getItem("loanApplication")
    const existingData = saved ? JSON.parse(saved) : {}
    localStorage.setItem("loanApplication", JSON.stringify({
      ...existingData,
      documents,
      currentStep: 4
    }))

    window.location.href = "/borrower/apply/review"
  }

  const handleBack = () => {
    const saved = localStorage.getItem("loanApplication")
    const existingData = saved ? JSON.parse(saved) : {}
    localStorage.setItem("loanApplication", JSON.stringify({
      ...existingData,
      documents
    }))
    window.location.href = "/borrower/apply/financial-info"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Apply for a Loan</h1>
          <p className="text-slate-600">Step 4 of 5: Upload Documents</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 4 of 5</span>
            <span className="text-sm text-slate-600">80% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: "80%" }}></div>
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
            {/* ID Document */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Government-Issued ID
              </label>
              {!documents.idDocument ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500">PDF, PNG, JPG (Max 5MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload("idDocument", e.target.files?.[0])}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-slate-900">{documents.idDocument}</p>
                      <p className="text-xs text-slate-600">Uploaded successfully</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDocument("idDocument")}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Proof of Income */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Proof of Income (Pay Stubs / Tax Returns)
              </label>
              {!documents.incomeProof ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500">PDF, PNG, JPG (Max 5MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload("incomeProof", e.target.files?.[0])}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-slate-900">{documents.incomeProof}</p>
                      <p className="text-xs text-slate-600">Uploaded successfully</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDocument("incomeProof")}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Bank Statements */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Bank Statements (Last 3 Months) - Optional
              </label>
              {!documents.bankStatements ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500">PDF, PNG, JPG (Max 5MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload("bankStatements", e.target.files?.[0])}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-slate-900">{documents.bankStatements}</p>
                      <p className="text-xs text-slate-600">Uploaded successfully</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDocument("bankStatements")}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Document Guidelines</p>
                  <ul className="list-disc pl-5 space-y-1 text-blue-800">
                    <li>All documents must be clear and readable</li>
                    <li>File size should not exceed 5MB per document</li>
                    <li>Accepted formats: PDF, PNG, JPG</li>
                    <li>Documents will be securely stored and encrypted</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
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
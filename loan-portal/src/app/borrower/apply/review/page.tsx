"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Edit, Send, ArrowLeft, AlertCircle } from "lucide-react"

export default function ApplyStep5() {
  const [applicationData, setApplicationData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("loanApplication")
    if (saved) setApplicationData(JSON.parse(saved))
  }, [])

  const handleSubmit = async () => {
    setError("")

    if (!applicationData.documents?.idDocument) {
      setError("A government-issued ID is required to submit your application. Please go back to the Documents step and upload your ID.")
      return
    }

    setLoading(true)
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("You must be logged in to submit an application")

      const { error: insertError } = await supabase.from("loans").insert({
        borrower_id: user.id,
        borrower_name: applicationData.borrower_name,
        email: applicationData.email,
        phone: applicationData.phone,
        address: applicationData.home_address || applicationData.address,
        loan_type: applicationData.loan_type,
        purpose: applicationData.purpose,
        buying_stage: applicationData.buying_stage,
        property_address: applicationData.property_address,
        property_value: applicationData.property_value ? parseFloat(applicationData.property_value) : null,
        amount: parseFloat(applicationData.amount),
        term: parseInt(applicationData.term),
        employment_status: applicationData.employment_status,
        annual_income: applicationData.annual_income ? parseFloat(applicationData.annual_income) : null,
        status: "Pending",
      })

      if (insertError) throw insertError
      localStorage.removeItem("loanApplication")
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-8">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted!</h1>
            <p className="text-slate-600 mb-6">
              Your financing application has been received. We'll review it and get back to you within 2-3 business days.
            </p>
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = "/borrower/dashboard"}>
                Go to Dashboard
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = "/"}>
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!applicationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 flex items-center justify-center p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600 mb-4">No application data found</p>
            <Button onClick={() => window.location.href = "/borrower/apply/personal-info"}>Start Application</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasId = !!applicationData.documents?.idDocument

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Apply for Financing</h1>
          <p className="text-slate-600">Step 5 of 5: Review & Submit</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 5 of 5</span>
            <span className="text-sm text-slate-600">100% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }} />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Financing Details */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Financing Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = "/borrower/apply/personal-info"}>
              <Edit className="h-4 w-4 mr-2" />Edit
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Financing Type</p>
              <p className="font-semibold capitalize">{applicationData.loan_type?.replace(/_/g, " ") || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Purpose</p>
              <p className="font-semibold capitalize">{applicationData.purpose?.replace(/_/g, " ") || "Not specified"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-600">Home Buying Stage</p>
              <p className="font-semibold capitalize">{applicationData.buying_stage?.replace(/_/g, " ") || "Not specified"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = "/borrower/apply/personal-info"}>
              <Edit className="h-4 w-4 mr-2" />Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-slate-600">Home Address</p>
              <p className="font-semibold">{applicationData.home_address || applicationData.address || "Not provided"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Property Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = "/borrower/apply/propertly-details"}>
              <Edit className="h-4 w-4 mr-2" />Edit
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-sm text-slate-600">Property Address</p>
              <p className="font-semibold">{applicationData.property_address || "Not provided"}</p>
            </div>
            {applicationData.property_value && (
              <div>
                <p className="text-sm text-slate-600">Property Value</p>
                <p className="font-semibold">${parseFloat(applicationData.property_value).toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Financial Information</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = "/borrower/apply/financial-info"}>
              <Edit className="h-4 w-4 mr-2" />Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-slate-600">Estimated Purchase Price</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${parseFloat(applicationData.amount).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Repayment Term</p>
                <p className="text-2xl font-bold text-slate-900">{applicationData.term} months</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Employment Status</p>
                <p className="font-semibold capitalize">{applicationData.employment_status || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Annual Income</p>
                <p className="font-semibold">
                  {applicationData.annual_income ? `$${parseFloat(applicationData.annual_income).toLocaleString()}` : "Not provided"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = "/borrower/apply/documents"}>
              <Edit className="h-4 w-4 mr-2" />Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Government ID — required */}
              <div className={`flex items-center justify-between p-3 rounded-lg border ${hasId ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-center gap-2">
                  {hasId
                    ? <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    : <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                  }
                  <span className="text-sm font-medium">
                    Government ID
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </div>
                {hasId
                  ? <span className="text-xs text-green-700 font-semibold">{applicationData.documents.idDocument}</span>
                  : <span className="text-xs text-red-600 font-semibold">Required — not uploaded</span>
                }
              </div>

              {/* Income Proof — optional */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2">
                  {applicationData.documents?.incomeProof
                    ? <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    : <div className="h-5 w-5 rounded-full border-2 border-slate-300 shrink-0" />
                  }
                  <span className="text-sm font-medium">Income Proof</span>
                </div>
                <span className="text-xs text-slate-500">
                  {applicationData.documents?.incomeProof || "Not uploaded"}
                </span>
              </div>

              {/* Bank Statements — optional */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2">
                  {applicationData.documents?.bankStatements
                    ? <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    : <div className="h-5 w-5 rounded-full border-2 border-slate-300 shrink-0" />
                  }
                  <span className="text-sm font-medium">Bank Statements</span>
                </div>
                <span className="text-xs text-slate-500">
                  {applicationData.documents?.bankStatements || "Not uploaded"}
                </span>
              </div>
            </div>

            {!hasId && (
              <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700">
                  A government-issued ID is required before you can submit. <button className="underline font-semibold" onClick={() => window.location.href = "/borrower/apply/documents"}>Upload it now →</button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Agreement */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                By submitting this application, you agree to our{" "}
                <a href="/terms" className="underline font-medium">Terms & Conditions</a> and{" "}
                <a href="/privacy" className="underline font-medium">Privacy Policy</a>.
                You confirm that all information provided is accurate and complete.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.location.href = "/borrower/apply/documents"} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !hasId}
            className={`flex-1 ${hasId ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-300 cursor-not-allowed"}`}
          >
            {loading ? "Submitting..." : "Submit Application"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {!hasId && (
          <p className="text-center text-sm text-red-600 mt-3">Upload a government ID to enable submission.</p>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Edit, Send, ArrowLeft } from "lucide-react"

export default function ApplyStep5() {
  const [applicationData, setApplicationData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("loanApplication")
    if (saved) {
      setApplicationData(JSON.parse(saved))
    }
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("http://127.0.0.1:8000/api/loans/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...applicationData,
          status: "Pending",
          amount: parseFloat(applicationData.amount),
          term: parseInt(applicationData.term)
        })
      })

      if (!res.ok) throw new Error("Failed to submit application")

      // Clear saved data
      localStorage.removeItem("loanApplication")
      setSuccess(true)
    } catch (err) {
      setError("Failed to submit application. Please try again.")
      console.error("Submission error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    window.location.href = "/borrower/apply/documents"
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
              Your loan application has been received. We'll review it and get back to you within 2-3 business days.
            </p>
            <div className="space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = '/borrower/dashboard'}
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
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
            <Button onClick={() => window.location.href = '/borrower/apply/personal-info'}>
              Start Application
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Apply for a Loan</h1>
          <p className="text-slate-600">Step 5 of 5: Review & Submit</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 5 of 5</span>
            <span className="text-sm text-slate-600">100% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full transition-all duration-500" style={{ width: "100%" }}></div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/borrower/apply/personal-info'}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Full Name</p>
              <p className="font-semibold">{applicationData.borrower_name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p className="font-semibold">{applicationData.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Phone</p>
              <p className="font-semibold">{applicationData.phone}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Address</p>
              <p className="font-semibold">{applicationData.address || "Not provided"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Property Details</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/borrower/apply/property-details'}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-sm text-slate-600">Property Address</p>
              <p className="font-semibold">{applicationData.property_address}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Property Value</p>
              <p className="font-semibold">
                {applicationData.property_value ? `$${parseFloat(applicationData.property_value).toLocaleString()}` : "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Purpose</p>
              <p className="font-semibold capitalize">{applicationData.purpose || "Not specified"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Financial Information</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/borrower/apply/financial-info'}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-slate-600">Loan Amount</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${parseFloat(applicationData.amount).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Repayment Term</p>
                <p className="text-2xl font-bold text-slate-900">{applicationData.term} months</p>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-900 mb-1">Monthly Payment</p>
              <p className="text-2xl font-bold text-green-600">
                ${(parseFloat(applicationData.amount) / parseInt(applicationData.term)).toFixed(2)}
              </p>
              <p className="text-xs text-green-800 mt-1">Interest-free</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
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
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/borrower/apply/documents'}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {applicationData.documents?.idDocument ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Government ID: {applicationData.documents.idDocument}</span>
                  </>
                ) : (
                  <span className="text-sm text-slate-500">No Government ID uploaded</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {applicationData.documents?.incomeProof ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Income Proof: {applicationData.documents.incomeProof}</span>
                  </>
                ) : (
                  <span className="text-sm text-slate-500">No Income Proof uploaded</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {applicationData.documents?.bankStatements ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Bank Statements: {applicationData.documents.bankStatements}</span>
                  </>
                ) : (
                  <span className="text-sm text-slate-500">No Bank Statements uploaded</span>
                )}
              </div>
            </div>
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
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {loading ? "Submitting..." : "Submit Application"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
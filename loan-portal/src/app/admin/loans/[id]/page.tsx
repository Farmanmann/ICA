"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft, User, Mail, Phone, MapPin, Building, Car,
  DollarSign, Calendar, FileText, Download, CheckCircle, XCircle
} from "lucide-react"

export default function LoanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const loanId = params.id

  const [loan, setLoan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchLoanDetails()
  }, [loanId])

  const fetchLoanDetails = async () => {
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:8000/api/loans/${loanId}/`)
      if (!res.ok) throw new Error("Failed to fetch loan details")
      const data = await res.json()
      setLoan(data)
      setError("")
    } catch (err) {
      setError("Unable to load loan details")
      console.error("Failed to load loan:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateLoanStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/loans/${loanId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error("Failed to update status")
      await fetchLoanDetails()
      alert(`Loan ${newStatus.toLowerCase()} successfully!`)
    } catch (err) {
      console.error("Failed to update loan:", err)
      alert("Failed to update loan status")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading loan details...</div>
      </div>
    )
  }

  if (error || !loan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error || "Loan not found"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Loan #{loan.id}</h1>
                <p className="text-sm text-slate-600">
                  {loan.loan_type_display} - {loan.purpose_display}
                </p>
              </div>
            </div>
            <Badge
              variant={
                loan.status === "Approved"
                  ? "default"
                  : loan.status === "Pending"
                  ? "secondary"
                  : "destructive"
              }
              className="text-lg px-4 py-2"
            >
              {loan.status}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Action Buttons */}
        {loan.status === "Pending" && (
          <div className="flex gap-3">
            <Button
              onClick={() => updateLoanStatus("Approved")}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Loan
            </Button>
            <Button
              onClick={() => updateLoanStatus("Rejected")}
              variant="destructive"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Loan
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Loan Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Loan Amount</p>
                    <p className="text-3xl font-bold text-slate-900">
                      ${parseFloat(loan.amount).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Loan Term</p>
                    <p className="text-3xl font-bold text-slate-900">{loan.term} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Monthly Payment</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${loan.monthly_payment.toFixed(2)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">Interest-free</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Repayment</p>
                    <p className="text-2xl font-bold text-slate-900">
                      ${parseFloat(loan.amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Borrower Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Borrower Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </p>
                    <p className="font-semibold">{loan.borrower_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                    <p className="font-semibold">{loan.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </p>
                    <p className="font-semibold">{loan.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </p>
                    <p className="font-semibold">{loan.address || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {loan.purpose === "car" ? (
                    <><Car className="h-5 w-5" />Vehicle Details</>
                  ) : (
                    <><Building className="h-5 w-5" />Property Details</>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loan.purpose === "car" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Make</p>
                      <p className="font-semibold">{loan.vehicle_make || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Model</p>
                      <p className="font-semibold">{loan.vehicle_model || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Year</p>
                      <p className="font-semibold">{loan.vehicle_year || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Vehicle Value</p>
                      <p className="font-semibold">
                        {loan.vehicle_value ? `$${parseFloat(loan.vehicle_value).toLocaleString()}` : "N/A"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Property Address</p>
                      <p className="font-semibold">{loan.property_address || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Property Value</p>
                      <p className="font-semibold">
                        {loan.property_value ? `$${parseFloat(loan.property_value).toLocaleString()}` : "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Employment Status</p>
                    <p className="font-semibold capitalize">
                      {loan.employment_status || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Annual Income</p>
                    <p className="font-semibold">
                      {loan.annual_income ? `$${parseFloat(loan.annual_income).toLocaleString()}` : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Credit Score</p>
                    <p className="font-semibold">{loan.credit_score || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loan.documents && loan.documents.length > 0 ? (
                  <div className="space-y-3">
                    {loan.documents.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-semibold">{doc.document_type}</p>
                            <p className="text-sm text-slate-600">
                              Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                            </p>
                            {doc.notes && (
                              <p className="text-sm text-slate-500 mt-1">{doc.notes}</p>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                    <p>No documents uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Application Submitted</p>
                  <p className="font-semibold">
                    {new Date(loan.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(loan.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Last Updated</p>
                  <p className="font-semibold">
                    {new Date(loan.updated_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(loan.updated_at).toLocaleTimeString()}
                  </p>
                </div>
                {loan.due_date && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Due Date</p>
                    <p className="font-semibold">
                      {new Date(loan.due_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Loan Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Repayment Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${loan.total_paid.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Remaining Balance</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${loan.remaining_balance.toFixed(2)}
                  </p>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Progress</span>
                    <span>{loan.stats.payment_progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${loan.stats.payment_progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

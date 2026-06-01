"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft, User, Mail, Phone, MapPin, Building,
  DollarSign, Calendar, FileText, CheckCircle, XCircle, Lock, ExternalLink
} from "lucide-react"

const LOAN_TYPE_LABELS: Record<string, string> = {
  murabaha: "Murabaha (Cost-Plus Financing)",
  musharaka: "Musharakah (Partnership)",
  no_preference: "No Preference",
}
const PURPOSE_LABELS: Record<string, string> = {
  home_purchase: "Home Purchase",
  refinance: "Refinance",
  investment_home: "Investment Home",
}

export default function LoanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const loanId = params.id

  const [loan, setLoan] = useState<any>(null)
  const [bids, setBids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchLoanDetails()
  }, [loanId])

  const fetchLoanDetails = async () => {
    try {
      setLoading(true)
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from("loans")
        .select("*")
        .eq("id", loanId)
        .single()
      if (fetchError) throw fetchError
      setLoan(data)

      // Fetch bids for this loan
      const { data: bidsData } = await supabase
        .from("bids")
        .select("*")
        .eq("loan_id", loanId)
        .order("created_at", { ascending: false })
      setBids(bidsData ?? [])

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
      setUpdating(true)
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from("loans")
        .update({ status: newStatus })
        .eq("id", loanId)
      if (updateError) throw updateError
      await fetchLoanDetails()
      alert(`Application ${newStatus.toLowerCase()} successfully!`)
    } catch (err) {
      console.error("Failed to update loan:", err)
      alert("Failed to update loan status")
    } finally {
      setUpdating(false)
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

  const monthlyPayment = loan.amount && loan.term ? (parseFloat(loan.amount) / parseInt(loan.term)).toFixed(2) : "0.00"

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Financing #{typeof loan.id === "string" ? loan.id.slice(0, 8).toUpperCase() : loan.id}
                </h1>
                <p className="text-sm text-slate-600">
                  {LOAN_TYPE_LABELS[loan.loan_type] || loan.loan_type} — {PURPOSE_LABELS[loan.purpose] || loan.purpose}
                </p>
              </div>
            </div>
            <Badge
              variant={
                loan.status === "Approved" ? "default" : loan.status === "Pending" ? "secondary" : "destructive"
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
            <Button onClick={() => updateLoanStatus("Approved")} className="bg-green-600 hover:bg-green-700" disabled={updating}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Financing
            </Button>
            <Button onClick={() => updateLoanStatus("Rejected")} variant="destructive" disabled={updating}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject Financing
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financing Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Financing Amount</p>
                    <p className="text-3xl font-bold text-slate-900">
                      ${parseFloat(loan.amount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Financing Term</p>
                    <p className="text-3xl font-bold text-slate-900">{loan.term} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Est. Monthly Payment</p>
                    <p className="text-2xl font-bold text-blue-600">${monthlyPayment}</p>
                    <p className="text-xs text-green-600 mt-1">Interest-free (principal only)</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Down Payment</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {loan.down_payment_percent ? `${loan.down_payment_percent}%` : "Not specified"}
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
                      <User className="h-4 w-4" /> Full Name
                    </p>
                    <p className="font-semibold">{loan.borrower_name || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </p>
                    <p className="font-semibold">{loan.email || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone
                    </p>
                    <p className="font-semibold">{loan.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Home Address
                    </p>
                    <p className="font-semibold">{loan.address || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Date of Birth</p>
                    <p className="font-semibold">{loan.date_of_birth || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Credit Event</p>
                    <p className="font-semibold capitalize">{loan.credit_event?.replace(/_/g, " ") || "None"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" /> Property Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-sm text-slate-600 mb-1">Property Address</p>
                    <p className="font-semibold">{loan.property_address || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Est. Property Value</p>
                    <p className="font-semibold">
                      {loan.property_value ? `$${parseFloat(loan.property_value).toLocaleString()}` : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Property Type</p>
                    <p className="font-semibold capitalize">{loan.property_type?.replace(/_/g, " ") || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Occupancy</p>
                    <p className="font-semibold capitalize">{loan.occupancy_type?.replace(/_/g, " ") || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">First Time Buyer</p>
                    <p className="font-semibold">{loan.first_time_buyer === "yes" ? "Yes" : loan.first_time_buyer === "no" ? "No" : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Co-Borrower</p>
                    <p className="font-semibold">{loan.has_co_borrower === "yes" ? "Yes" : loan.has_co_borrower === "no" ? "No" : "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" /> Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Employment Status</p>
                    <p className="font-semibold capitalize">{loan.employment_status?.replace(/-/g, " ") || "Not provided"}</p>
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
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Buying Stage</p>
                    <p className="font-semibold capitalize">{loan.buying_stage?.replace(/_/g, " ") || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loan.documents && Object.keys(loan.documents).some((k) => loan.documents[k]) ? (
                  <div className="space-y-3">
                    {[
                      { key: "id_document", label: "Government ID" },
                      { key: "income_proof", label: "Income Proof" },
                      { key: "bank_statements", label: "Bank Statements" },
                    ].map(({ key, label }) => {
                      const doc = loan.documents[key]
                      if (!doc) return null
                      const isEncrypted = typeof doc === "object" && doc.encryptedKey
                      const displayName = isEncrypted ? doc.name : (typeof doc === "string" ? doc : key)
                      return (
                        <div key={key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <div>
                              <p className="font-semibold">{label}</p>
                              <p className="text-xs text-slate-500 font-mono">{displayName}</p>
                              {isEncrypted && (
                                <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                                  <Lock className="h-3 w-3" /> KMS encrypted
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-green-600 border-green-600">Uploaded</Badge>
                            {isEncrypted && (
                              <a
                                href={`/api/documents/view?loanId=${loan.id}&docType=${key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button size="sm" variant="outline" className="gap-1">
                                  <ExternalLink className="h-3 w-3" /> View
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                    <p>No documents uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financier Bids */}
            {bids.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Financier Offers ({bids.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="p-3 font-semibold text-sm">Profit Rate</th>
                          <th className="p-3 font-semibold text-sm">APR</th>
                          <th className="p-3 font-semibold text-sm">Monthly Payment</th>
                          <th className="p-3 font-semibold text-sm">Status</th>
                          <th className="p-3 font-semibold text-sm">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bids.map((bid: any) => (
                          <tr key={bid.id} className="border-b hover:bg-slate-50">
                            <td className="p-3">{bid.profit_rate ? `${bid.profit_rate}%` : "—"}</td>
                            <td className="p-3">{bid.apr ? `${bid.apr}%` : "—"}</td>
                            <td className="p-3">{bid.monthly_payment ? `$${parseFloat(bid.monthly_payment).toLocaleString()}` : "—"}</td>
                            <td className="p-3">
                              <Badge variant={bid.status === "accepted" ? "default" : bid.status === "rejected" ? "destructive" : "secondary"}>
                                {bid.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm text-slate-500">{new Date(bid.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Application Submitted</p>
                  <p className="font-semibold">{loan.created_at ? new Date(loan.created_at).toLocaleDateString() : "—"}</p>
                  <p className="text-xs text-slate-500">{loan.created_at ? new Date(loan.created_at).toLocaleTimeString() : ""}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Last Updated</p>
                  <p className="font-semibold">{loan.updated_at ? new Date(loan.updated_at).toLocaleDateString() : "—"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                    loan.status === "Approved" ? "bg-green-100 text-green-800" :
                    loan.status === "Pending" ? "bg-amber-100 text-amber-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {loan.status}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Financing Type</p>
                  <p className="font-semibold">{LOAN_TYPE_LABELS[loan.loan_type] || loan.loan_type}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Purpose</p>
                  <p className="font-semibold">{PURPOSE_LABELS[loan.purpose] || loan.purpose}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Offers Received</p>
                  <p className="text-2xl font-bold text-blue-600">{bids.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock } from "lucide-react"

// Admin document review page — shows all loan applications with their document upload status.
// Admins can approve or reject the application based on document review.

export default function AdminVerificationsPage() {
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadLoans()
  }, [])

  const loadLoans = async () => {
    try {
      setLoading(true)
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("loans")
        .select("id, borrower_name, email, status, documents, created_at, loan_type, purpose")
        .order("created_at", { ascending: false })
      if (fetchError) throw fetchError
      setLoans(data ?? [])
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (loanId: string, newStatus: string) => {
    setUpdating(loanId)
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from("loans")
        .update({ status: newStatus })
        .eq("id", loanId)
      if (updateError) throw updateError
      await loadLoans()
    } catch (err: any) {
      setError(err.message || "Failed to update status")
    } finally {
      setUpdating(null)
    }
  }

  const hasDocuments = (loan: any) =>
    loan.documents && Object.values(loan.documents).some((v) => !!v)

  const filteredLoans = loans.filter((l) => {
    if (filter === "all") return true
    if (filter === "has_docs") return hasDocuments(l)
    if (filter === "no_docs") return !hasDocuments(l)
    return l.status === filter
  })

  const stats = {
    total: loans.length,
    pending: loans.filter((l) => l.status === "Pending").length,
    approved: loans.filter((l) => l.status === "Approved").length,
    rejected: loans.filter((l) => l.status === "Rejected").length,
    withDocs: loans.filter((l) => hasDocuments(l)).length,
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => window.location.href = "/admin/dashboard"}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Verification</h1>
        <p className="text-gray-600">Review borrower applications and approve or reject based on submitted documents.</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">With Docs</p>
            <p className="text-2xl font-bold text-blue-600">{stats.withDocs}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { value: "all", label: "All" },
          { value: "Pending", label: "Pending" },
          { value: "has_docs", label: "Has Documents" },
          { value: "no_docs", label: "No Documents" },
          { value: "Approved", label: "Approved" },
          { value: "Rejected", label: "Rejected" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({filteredLoans.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLoans.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No applications found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type / Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLoans.map((loan) => {
                    const docs = loan.documents || {}
                    const docCount = Object.values(docs).filter((v) => !!v).length
                    return (
                      <tr key={loan.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{loan.borrower_name || "—"}</p>
                            <p className="text-xs text-gray-500">{loan.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 capitalize">{loan.loan_type?.replace(/_/g, " ") || "—"}</p>
                          <p className="text-xs text-gray-500 capitalize">{loan.purpose?.replace(/_/g, " ") || "—"}</p>
                        </td>
                        <td className="px-6 py-4">
                          {docCount > 0 ? (
                            <div className="space-y-1">
                              {docs.id_document && (
                                <div className="flex items-center gap-1 text-xs text-green-700">
                                  <FileText className="h-3 w-3" /> Gov ID
                                </div>
                              )}
                              {docs.income_proof && (
                                <div className="flex items-center gap-1 text-xs text-green-700">
                                  <FileText className="h-3 w-3" /> Income Proof
                                </div>
                              )}
                              {docs.bank_statements && (
                                <div className="flex items-center gap-1 text-xs text-green-700">
                                  <FileText className="h-3 w-3" /> Bank Statements
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No documents</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              loan.status === "Approved" ? "default" :
                              loan.status === "Rejected" ? "destructive" : "secondary"
                            }
                          >
                            {loan.status === "Pending" && <Clock className="h-3 w-3 mr-1 inline" />}
                            {loan.status === "Approved" && <CheckCircle className="h-3 w-3 mr-1 inline" />}
                            {loan.status === "Rejected" && <XCircle className="h-3 w-3 mr-1 inline" />}
                            {loan.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(loan.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.location.href = `/admin/loans/${loan.id}`}
                            >
                              View
                            </Button>
                            {loan.status === "Pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  disabled={updating === loan.id}
                                  onClick={() => updateStatus(loan.id, "Approved")}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  disabled={updating === loan.id}
                                  onClick={() => updateStatus(loan.id, "Rejected")}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

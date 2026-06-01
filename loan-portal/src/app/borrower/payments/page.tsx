"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, ArrowLeft, CheckCircle, Clock } from "lucide-react"

export default function PaymentTracking() {
  const [loans, setLoans] = useState<any[]>([])
  const [selectedLoan, setSelectedLoan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      setLoading(true)
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError("You must be logged in."); return }

      const { data, error: fetchError } = await supabase
        .from("loans")
        .select("*")
        .eq("borrower_id", user.id)
        .eq("status", "Approved")
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError
      setLoans(data ?? [])
      if (data && data.length > 0) setSelectedLoan(data[0])
    } catch (err: any) {
      setError("Unable to load loans.")
      console.error("Failed to load loans:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-slate-600">Loading payment information...</p>
      </div>
    )
  }

  if (loans.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <CreditCard className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Active Loans</h3>
            <p className="text-slate-600 mb-6">
              You don't have any approved loans to make payments on.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = "/borrower/apply/personal-info"}>
              Apply for Financing
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const monthlyPayment = selectedLoan ? parseFloat(selectedLoan.amount) / parseInt(selectedLoan.term) : 0

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = "/borrower/dashboard"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Payment Management</h1>
          <p className="text-sm text-slate-600">Track and manage your loan payments</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loan Selector */}
        {loans.length > 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Select Loan</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={selectedLoan?.id}
                onChange={(e) => {
                  const loan = loans.find(l => l.id === e.target.value)
                  setSelectedLoan(loan)
                }}
              >
                {loans.map(loan => (
                  <option key={loan.id} value={loan.id}>
                    Loan — ${parseFloat(loan.amount).toLocaleString()} over {loan.term} months
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        )}

        {selectedLoan && (
          <>
            {/* Loan Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-linear-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Financing Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${parseFloat(selectedLoan.amount).toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="bg-linear-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Estimated Monthly Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${monthlyPayment.toFixed(0)}</div>
                  <p className="text-xs opacity-90 mt-1">over {selectedLoan.term} months</p>
                </CardContent>
              </Card>

              <Card className="bg-linear-to-br from-emerald-500 to-emerald-600 text-white border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-semibold leading-snug">{selectedLoan.property_address || "—"}</div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Processing — Coming Soon */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Payment Portal Coming Soon</h3>
                  <p className="text-slate-600 max-w-md mx-auto mb-6">
                    Online payment processing is being set up. Your financing team will contact you directly with payment instructions for your approved financing.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">Your financing has been approved and is active.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}

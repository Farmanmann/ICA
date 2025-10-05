"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Calendar, CheckCircle, Clock, DollarSign, Download, ArrowLeft } from "lucide-react"

export default function PaymentTracking() {
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [loans, setLoans] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://127.0.0.1:8000/api/loans/")
      if (!res.ok) throw new Error("Failed to fetch loans")
      const data = await res.json()
      const approvedLoans = data.filter(l => l.status === "Approved")
      setLoans(approvedLoans)
      if (approvedLoans.length > 0) {
        setSelectedLoan(approvedLoans[0])
        generateMockPayments(approvedLoans[0])
      }
    } catch (err) {
      setError("Unable to load loans.")
      console.error("Failed to load loans:", err)
    } finally {
      setLoading(false)
    }
  }

  const generateMockPayments = (loan) => {
    // Generate mock payment history
    const mockPayments = [
      {
        id: 1,
        date: "2025-03-15",
        amount: parseFloat(loan.amount) / parseInt(loan.term),
        status: "completed",
        method: "Bank Transfer"
      },
      {
        id: 2,
        date: "2025-04-15",
        amount: parseFloat(loan.amount) / parseInt(loan.term),
        status: "completed",
        method: "Bank Transfer"
      },
      {
        id: 3,
        date: "2025-05-15",
        amount: parseFloat(loan.amount) / parseInt(loan.term),
        status: "pending",
        method: "Pending"
      }
    ]
    setPayments(mockPayments)
  }

  const handlePayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      setError("Please enter a valid payment amount")
      return
    }

    setSuccess("Payment processed successfully!")
    setShowPaymentForm(false)
    setPaymentAmount("")
    
    // In real app, send payment to backend
    setTimeout(() => setSuccess(""), 3000)
  }

  const calculateStats = (loan) => {
    const totalAmount = parseFloat(loan.amount)
    const monthlyPayment = totalAmount / parseInt(loan.term)
    const paidPayments = payments.filter(p => p.status === "completed")
    const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0)
    const remaining = totalAmount - totalPaid
    const percentPaid = (totalPaid / totalAmount) * 100

    return {
      totalAmount,
      monthlyPayment,
      totalPaid,
      remaining,
      percentPaid,
      paymentsMade: paidPayments.length,
      paymentsRemaining: parseInt(loan.term) - paidPayments.length
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-slate-600">Loading payment information...</p>
      </div>
    )
  }

  if (loans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <CreditCard className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Active Loans</h3>
            <p className="text-slate-600 mb-6">
              You don't have any approved loans to make payments on.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Apply for a Loan
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = selectedLoan ? calculateStats(selectedLoan) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Payment Management</h1>
          <p className="text-sm text-slate-600">Track and manage your loan payments</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

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
                  const loan = loans.find(l => l.id === parseInt(e.target.value))
                  setSelectedLoan(loan)
                  generateMockPayments(loan)
                }}
              >
                {loans.map(loan => (
                  <option key={loan.id} value={loan.id}>
                    Loan #{loan.id} - ${parseFloat(loan.amount).toLocaleString()}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        )}

        {/* Payment Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Loan Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${stats.totalAmount.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${stats.totalPaid.toLocaleString()}</div>
                <p className="text-xs opacity-90 mt-1">{stats.percentPaid.toFixed(0)}% complete</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${stats.remaining.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${stats.monthlyPayment.toFixed(0)}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progress Bar */}
        {stats && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Repayment Progress</span>
                  <span>{stats.paymentsMade} of {selectedLoan.term} payments made</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${stats.percentPaid}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{stats.paymentsRemaining} payments remaining</span>
                <span className="font-semibold text-slate-900">{stats.percentPaid.toFixed(1)}% paid</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Make Payment Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showPaymentForm ? (
                <div>
                  <p className="text-sm text-slate-600 mb-4">
                    Next payment due: <strong>May 15, 2025</strong>
                  </p>
                  <Button 
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Make Payment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Amount</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder={stats?.monthlyPayment.toFixed(2)}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Suggested: ${stats?.monthlyPayment.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option>Bank Transfer</option>
                      <option>Credit Card</option>
                      <option>Debit Card</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handlePayment}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Submit Payment
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowPaymentForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Statement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        payment.status === "completed" ? "bg-green-100" : "bg-amber-100"
                      }`}>
                        {payment.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          ${payment.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={payment.status === "completed" ? "default" : "secondary"}
                      >
                        {payment.status === "completed" ? "Completed" : "Pending"}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">{payment.method}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
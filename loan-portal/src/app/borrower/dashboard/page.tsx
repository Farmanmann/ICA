"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Home, DollarSign, Calendar, TrendingUp, FileText, CreditCard, LogOut, ArrowRight } from "lucide-react"

export default function BorrowerDashboard() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedLoan, setSelectedLoan] = useState(null)
  
  // Mock borrower email - in real app, get from auth
  const borrowerEmail = "borrower@example.com"

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://127.0.0.1:8000/api/loans/")
      if (!res.ok) throw new Error("Failed to fetch loans")
      const data = await res.json()
      // Filter loans for this borrower (in real app, filter by user ID)
      setLoans(data.filter((loan: any) => loan.email === borrowerEmail || loan.borrower_name))
      setError("")
    } catch (err) {
      setError("Unable to load your loans. Please try again.")
      console.error("Failed to load loans:", err)
    } finally {
      setLoading(false)
    }
  }

  const calculateMonthlyPayment = (amount: any, term: any) => {
    return (parseFloat(amount) / parseInt(term)).toFixed(2)
  }

  const calculateRemainingBalance = (loan: any) => {
    // Mock calculation - in real app, subtract payments made
    return parseFloat(loan.amount)
  }

  const activeLoan = loans.find((l: any) => l.status === "Approved")
  const pendingLoans = loans.filter((l: any) => l.status === "Pending")
  const totalBorrowed = loans
    .filter((l: any) => l.status === "Approved")
    .reduce((sum: number, l: any) => sum + parseFloat(l.amount || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Loans</h1>
            <p className="text-sm text-slate-600">Welcome back!</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4 mr-2" />
            Apply for New Loan
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
              <Home className="h-4 w-4 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {loans.filter((l: any) => l.status === "Approved").length}
              </div>
              <p className="text-xs opacity-90 mt-1">Currently active</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
              <DollarSign className="h-4 w-4 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalBorrowed.toLocaleString()}</div>
              <p className="text-xs opacity-90 mt-1">Interest-free</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Calendar className="h-4 w-4 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingLoans.length}</div>
              <p className="text-xs opacity-90 mt-1">Under review</p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-slate-500">
              Loading your loans...
            </CardContent>
          </Card>
        ) : loans.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Loans Yet</h3>
              <p className="text-slate-600 mb-6">
                Start your property journey by applying for an interest-free loan.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Apply for a Loan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Active Loan Highlight */}
            {activeLoan && (
              <Card className="border-2 border-blue-500 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Active Loan</CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        Property: {(activeLoan as any).property_address || "Not specified"}
                      </p>
                    </div>
                    <Badge className="bg-green-500">Approved</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Loan Amount</p>
                      <p className="text-2xl font-bold text-slate-900">
                        ${parseFloat((activeLoan as any).amount).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Monthly Payment</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${calculateMonthlyPayment((activeLoan as any).amount, (activeLoan as any).term)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Loan Term</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {(activeLoan as any).term} months
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Remaining</p>
                      <p className="text-2xl font-bold text-amber-600">
                        ${calculateRemainingBalance(activeLoan as any).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                      <span>Repayment Progress</span>
                      <span>0% paid</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: "0%" }} />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Make Payment
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Loans List */}
            <Card>
              <CardHeader>
                <CardTitle>All Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loans.map((loan: any) => (
                    <div
                      key={loan.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          loan.status === "Approved" ? "bg-green-100" : 
                          loan.status === "Pending" ? "bg-amber-100" : "bg-red-100"
                        }`}>
                          <Home className={`h-6 w-6 ${
                            loan.status === "Approved" ? "text-green-600" : 
                            loan.status === "Pending" ? "text-amber-600" : "text-red-600"
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            Loan #{loan.id}
                          </h4>
                          <p className="text-sm text-slate-600">
                            ${parseFloat(loan.amount).toLocaleString()} · {loan.term} months
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            loan.status === "Approved" ? "default" :
                            loan.status === "Pending" ? "secondary" : "destructive"
                          }
                        >
                          {loan.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
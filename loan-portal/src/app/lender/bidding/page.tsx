"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Home, DollarSign, Calendar, User, MapPin, Briefcase, TrendingUp, X, CheckCircle } from "lucide-react"

export default function LenderBiddingPage() {
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedLoan, setSelectedLoan] = useState<any>(null)
  const [bidAmount, setBidAmount] = useState("")
  const [bidSubmitting, setBidSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [filterTerm, setFilterTerm] = useState("all")

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://127.0.0.1:8000/api/loans/")
      if (!res.ok) throw new Error("Failed to fetch loans")
      const data = await res.json()
      
      // Filter only pending loans available for bidding
      const available = data.filter((l: any) => l.status === "Pending")
      setLoans(available)
      setError("")
    } catch (err) {
      setError("Unable to load loan applications.")
      console.error("Failed to load loans:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleBid = async () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      setError("Please enter a valid bid amount")
      return
    }

    if (parseFloat(bidAmount) > parseFloat(selectedLoan.amount)) {
      setError("Bid amount cannot exceed loan amount")
      return
    }

    setBidSubmitting(true)
    setError("")

    // Simulate API call - in real app, submit to backend
    setTimeout(() => {
      setSuccess(`Bid of $${parseFloat(bidAmount).toLocaleString()} placed successfully!`)
      setBidSubmitting(false)
      setSelectedLoan(null)
      setBidAmount("")
      
      setTimeout(() => setSuccess(""), 3000)
    }, 1000)
  }

  const filteredLoans = filterTerm === "all" 
    ? loans 
    : loans.filter((l: any) => l.term === parseInt(filterTerm))

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Browse Loan Applications</h1>
              <p className="text-sm text-slate-600">Review and bid on available loans</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/lender/dashboard'}>
              Back to Dashboard
            </Button>
          </div>
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

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700">Filter by term:</span>
              <select
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Terms</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
                <option value="48">48 months</option>
                <option value="60">60 months</option>
              </select>
              <Badge variant="outline">{filteredLoans.length} loans available</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Loans Grid */}
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-slate-500">
              Loading available loans...
            </CardContent>
          </Card>
        ) : filteredLoans.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Home className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No loans available for bidding at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLoans.map((loan: any) => (
              <Card key={loan.id} className="border-2 hover:shadow-lg transition-all">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Loan #{loan.id}</CardTitle>
                    <Badge className="bg-blue-600">Available</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Loan Amount */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-slate-600">Loan Amount</span>
                      </div>
                      <span className="font-bold text-xl text-slate-900">
                        ${parseFloat(loan.amount).toLocaleString()}
                      </span>
                    </div>

                    {/* Term */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-slate-600" />
                        <span className="text-sm text-slate-600">Repayment Term</span>
                      </div>
                      <span className="font-semibold text-slate-900">{loan.term} months</span>
                    </div>

                    {/* Monthly Payment */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-slate-600" />
                        <span className="text-sm text-slate-600">Monthly Payment</span>
                      </div>
                      <span className="font-semibold text-green-600">
                        ${(parseFloat(loan.amount) / parseInt(loan.term)).toFixed(2)}
                      </span>
                    </div>

                    {/* Borrower Info */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">
                          {loan.borrower_name || "Anonymous Borrower"}
                        </span>
                      </div>
                      {loan.property_address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-slate-600 mt-0.5" />
                          <span className="text-sm text-slate-600">{loan.property_address}</span>
                        </div>
                      )}
                      {loan.employment_status && (
                        <div className="flex items-center gap-2 mt-2">
                          <Briefcase className="h-4 w-4 text-slate-600" />
                          <span className="text-sm text-slate-600 capitalize">{loan.employment_status}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setSelectedLoan(loan)
                        setBidAmount(loan.amount)
                      }}
                    >
                      Place Bid
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Bid Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Place Your Bid</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedLoan(null)
                    setBidAmount("")
                    setError("")
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900 mb-2">
                  <strong>Loan #{selectedLoan.id}</strong>
                </p>
                <p className="text-sm text-blue-800">
                  Requested Amount: ${parseFloat(selectedLoan.amount).toLocaleString()}
                </p>
                <p className="text-sm text-blue-800">
                  Term: {selectedLoan.term} months
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Bid Amount
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter bid amount"
                />
                <p className="text-xs text-slate-500 mt-1">
                  You can bid the full amount or a portion of it
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-900 font-medium mb-2">Interest-Free Lending</p>
                <p className="text-sm text-green-800">
                  This is a 0% interest loan. You'll receive back exactly what you lend, 
                  helping families achieve property ownership through ethical finance.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedLoan(null)
                    setBidAmount("")
                    setError("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleBid}
                  disabled={bidSubmitting}
                >
                  {bidSubmitting ? "Submitting..." : "Submit Bid"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, TrendingUp, Users, Menu, LogOut, Eye, Home, Calendar } from "lucide-react"

export default function LenderDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loans, setLoans] = useState<any[]>([])
  const [myBids, setMyBids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://127.0.0.1:8000/api/loans/")
      if (!res.ok) throw new Error("Failed to fetch loans")
      const data = await res.json()
      
      // Filter available loans (pending status)
      const available = data.filter((l: any) => l.status === "Pending")
      setLoans(available)
      
      // Mock bids data - in real app, fetch from backend
      setMyBids([
        { id: 1, loanId: 1, amount: 50000, status: "pending", bidDate: "2025-01-15" },
        { id: 2, loanId: 3, amount: 75000, status: "accepted", bidDate: "2025-01-10" }
      ])
      
      setError("")
    } catch (err) {
      setError("Unable to load data. Please try again.")
      console.error("Failed to load data:", err)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    totalInvested: 125000,
    activeLoans: 2,
    pendingBids: 1,
    totalReturns: 0 // Interest-free, so 0
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 bg-slate-900 text-white flex flex-col p-4 shadow-lg">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Lender Portal</h2>
            <p className="text-slate-400 text-sm">Welcome back</p>
          </div>
          <nav className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start text-left bg-slate-800 text-white hover:bg-slate-700">
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="justify-start text-left hover:bg-slate-800 text-white"
              onClick={() => window.location.href = '/lender/bidding'}
            >
              Browse Loans
            </Button>
            <Button 
              variant="ghost" 
              className="justify-start text-left hover:bg-slate-800 text-white"
              onClick={() => window.location.href = '/lender/settings'}
            >
              Settings
            </Button>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white border-b p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-900">Lender Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">Lender</Badge>
            <Button variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                <DollarSign className="h-4 w-4 opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${stats.totalInvested.toLocaleString()}</div>
                <p className="text-xs opacity-90 mt-1">Across all loans</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <Home className="h-4 w-4 opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.activeLoans}</div>
                <p className="text-xs opacity-90 mt-1">Currently funding</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Bids</CardTitle>
                <Calendar className="h-4 w-4 opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.pendingBids}</div>
                <p className="text-xs opacity-90 mt-1">Awaiting decision</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Social Impact</CardTitle>
                <TrendingUp className="h-4 w-4 opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.activeLoans}</div>
                <p className="text-xs opacity-90 mt-1">Families helped</p>
              </CardContent>
            </Card>
          </div>

          {/* My Bids */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Bids</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/lender/bidding'}
                >
                  Browse More Loans
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-slate-500">Loading bids...</div>
              ) : myBids.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">You haven't placed any bids yet</p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.location.href = '/lender/bidding'}
                  >
                    Browse Available Loans
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBids.map((bid: any) => (
                    <div key={bid.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          bid.status === "accepted" ? "bg-green-100" : 
                          bid.status === "pending" ? "bg-amber-100" : "bg-red-100"
                        }`}>
                          <Home className={`h-6 w-6 ${
                            bid.status === "accepted" ? "text-green-600" : 
                            bid.status === "pending" ? "text-amber-600" : "text-red-600"
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Loan #{bid.loanId}</h4>
                          <p className="text-sm text-slate-600">
                            Bid Amount: ${bid.amount.toLocaleString()} · {new Date(bid.bidDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            bid.status === "accepted" ? "default" :
                            bid.status === "pending" ? "secondary" : "destructive"
                          }
                        >
                          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Loans Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Available Loan Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-slate-500">Loading loans...</div>
              ) : loans.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No loans available at the moment</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Loan ID</th>
                        <th className="text-left p-3 font-semibold">Borrower</th>
                        <th className="text-left p-3 font-semibold">Amount</th>
                        <th className="text-left p-3 font-semibold">Term</th>
                        <th className="text-left p-3 font-semibold">Property</th>
                        <th className="text-left p-3 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.slice(0, 5).map((loan: any) => (
                        <tr key={loan.id} className="border-b hover:bg-slate-50">
                          <td className="p-3 font-medium">#{loan.id}</td>
                          <td className="p-3">{loan.borrower_name || "Anonymous"}</td>
                          <td className="p-3 font-semibold">${parseFloat(loan.amount).toLocaleString()}</td>
                          <td className="p-3">{loan.term} months</td>
                          <td className="p-3 text-sm">{loan.property_address || "N/A"}</td>
                          <td className="p-3">
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => window.location.href = '/lender/bidding'}
                            >
                              View & Bid
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Your Social Impact</h3>
                  <p className="text-slate-700 mb-4">
                    By lending ${stats.totalInvested.toLocaleString()} interest-free, you've helped {stats.activeLoans} 
                    {stats.activeLoans === 1 ? ' family' : ' families'} achieve their property ownership dreams. 
                    Your contribution follows Sharia principles and makes a real difference in people's lives.
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-slate-900">${stats.totalInvested.toLocaleString()}</p>
                      <p className="text-slate-600">Total Invested</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{stats.activeLoans}</p>
                      <p className="text-slate-600">Families Helped</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">0%</p>
                      <p className="text-slate-600">Interest Charged</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
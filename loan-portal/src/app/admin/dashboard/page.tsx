"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Menu, DollarSign, Clock, CheckCircle, XCircle, Search } from "lucide-react"

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://127.0.0.1:8000/api/loans/")
      if (!res.ok) throw new Error("Failed to fetch loans")
      const data = await res.json()
      setApplications(data)
      setError("")
    } catch (err) {
      setError("Unable to load loan applications. Please check your connection.")
      console.error("Failed to load loans:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateLoanStatus = async (loanId: any, newStatus: any) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/loans/${loanId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error("Failed to update status")
      await fetchLoans()
    } catch (err) {
      console.error("Failed to update loan:", err)
      alert("Failed to update loan status")
    }
  }

  const filteredApplications = applications.filter((loan: any) => {
    const matchesSearch = loan.borrower_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         loan.id.toString().includes(searchTerm)
    const matchesFilter = filterStatus === "all" || loan.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: applications.length,
    approved: applications.filter((a: any) => a.status === "Approved").length,
    pending: applications.filter((a: any) => a.status === "Pending").length,
    rejected: applications.filter((a: any) => a.status === "Rejected").length,
    totalAmount: applications.reduce((sum: number, a: any) => sum + parseFloat(a.amount || 0), 0)
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 bg-slate-900 text-white flex flex-col p-4 shadow-lg">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Property Loans</h2>
            <p className="text-slate-400 text-sm">Admin Panel</p>
          </div>
          <nav className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start text-left bg-slate-800 text-white hover:bg-slate-700">
              Dashboard
            </Button>
            <Button variant="ghost" className="justify-start text-left hover:bg-slate-800 text-white">
              Applications
            </Button>
            <Button variant="ghost" className="justify-start text-left hover:bg-slate-800 text-white">
              Borrowers
            </Button>
            <Button variant="ghost" className="justify-start text-left hover:bg-slate-800 text-white">
              Payments
            </Button>
            <Button variant="ghost" className="justify-start text-left hover:bg-slate-800 text-white">
              Reports
            </Button>
            <Button variant="ghost" className="justify-start text-left hover:bg-slate-800 text-white">
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
            <h1 className="text-xl font-bold text-slate-900">Loan Management Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">Admin</Badge>
            <Button variant="outline">Logout</Button>
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
                <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                <DollarSign className="h-4 w-4 opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total}</div>
                <p className="text-xs opacity-90 mt-1">${stats.totalAmount.toLocaleString()} total value</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.approved}</div>
                <p className="text-xs opacity-90 mt-1">{stats.total > 0 ? Math.round((stats.approved/stats.total)*100) : 0}% approval rate</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.pending}</div>
                <p className="text-xs opacity-90 mt-1">Awaiting review</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.rejected}</div>
                <p className="text-xs opacity-90 mt-1">Declined applications</p>
              </CardContent>
            </Card>
          </div>

          {/* Applications Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Loan Applications</CardTitle>
                <Button onClick={fetchLoans} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by borrower or ID..."
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-slate-500">Loading applications...</div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No applications found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Loan ID</th>
                        <th className="text-left p-3 font-semibold">Borrower</th>
                        <th className="text-left p-3 font-semibold">Amount</th>
                        <th className="text-left p-3 font-semibold">Term</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                        <th className="text-left p-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map((loan: any) => (
                        <tr key={loan.id} className="border-b hover:bg-slate-50">
                          <td className="p-3 font-medium">#{loan.id}</td>
                          <td className="p-3">{loan.borrower_name || "Unassigned"}</td>
                          <td className="p-3 font-semibold">${parseFloat(loan.amount).toLocaleString()}</td>
                          <td className="p-3">{loan.term} months</td>
                          <td className="p-3">
                            <Badge
                              variant={
                                loan.status === "Approved"
                                  ? "default"
                                  : loan.status === "Pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {loan.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              {loan.status === "Pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                    onClick={() => updateLoanStatus(loan.id, "Approved")}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                    onClick={() => updateLoanStatus(loan.id, "Rejected")}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="ghost">
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
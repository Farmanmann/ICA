"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download, Filter, ArrowLeft, PieChart } from "lucide-react"

export default function ReportsAnalytics() {
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dateRange, setDateRange] = useState("all")

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://127.0.0.1:8000/api/loans/")
      if (!res.ok) throw new Error("Failed to fetch loans")
      const data = await res.json()
      setLoans(data)
      setError("")
    } catch (err) {
      setError("Unable to load reports data.")
      console.error("Failed to load loans:", err)
    } finally {
      setLoading(false)
    }
  }

  const calculateMetrics = () => {
    const approved = loans.filter((l: any) => l.status === "Approved")
    const pending = loans.filter((l: any) => l.status === "Pending")
    const rejected = loans.filter((l: any) => l.status === "Rejected")
    
    const totalDisbursed = approved.reduce((sum: number, l: any) => sum + parseFloat(l.amount || 0), 0)
    const avgLoanSize = approved.length > 0 ? totalDisbursed / approved.length : 0
    const approvalRate = loans.length > 0 ? (approved.length / loans.length) * 100 : 0
    
    return {
      totalLoans: loans.length,
      approved: approved.length,
      pending: pending.length,
      rejected: rejected.length,
      totalDisbursed,
      avgLoanSize,
      approvalRate
    }
  }

  const getLoansByTerm = () => {
    const terms: any = {}
    loans.forEach((loan: any) => {
      const term = loan.term || "Unknown"
      terms[term] = (terms[term] || 0) + 1
    })
    return terms
  }

  const getLoansByStatus = () => {
    const statuses = {
      Approved: loans.filter((l: any) => l.status === "Approved").length,
      Pending: loans.filter((l: any) => l.status === "Pending").length,
      Rejected: loans.filter((l: any) => l.status === "Rejected").length
    }
    return statuses
  }

  const getTopBorrowers = () => {
    const borrowers: Record<string, { count: number; total: number }> = {}
    loans.forEach((loan: any) => {
      const name = loan.borrower_name || "Unknown"
      if (!borrowers[name]) {
        borrowers[name] = { count: 0, total: 0 }
      }
      borrowers[name].count += 1
      borrowers[name].total += parseFloat(loan.amount || 0)
    })
    
    return Object.entries(borrowers)
      .map(([name, data]: [string, any]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  }

  const metrics = calculateMetrics()
  const loansByTerm = getLoansByTerm()
  const loansByStatus = getLoansByStatus()
  const topBorrowers = getTopBorrowers()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
              <p className="text-sm text-slate-600">Comprehensive loan portfolio insights</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Date Range Selector */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Report Period:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Time</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-slate-500">
              Loading analytics...
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                  <BarChart3 className="h-4 w-4 opacity-75" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.totalLoans}</div>
                  <p className="text-xs opacity-90 mt-1">All applications</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
                  <DollarSign className="h-4 w-4 opacity-75" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${metrics.totalDisbursed.toLocaleString()}</div>
                  <p className="text-xs opacity-90 mt-1">Approved loans</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg Loan Size</CardTitle>
                  <TrendingUp className="h-4 w-4 opacity-75" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${metrics.avgLoanSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <p className="text-xs opacity-90 mt-1">Per approved loan</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                  <Users className="h-4 w-4 opacity-75" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.approvalRate.toFixed(1)}%</div>
                  <p className="text-xs opacity-90 mt-1">{metrics.approved} of {metrics.totalLoans}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Loan Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Loan Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(loansByStatus).map(([status, count]: [string, any]) => {
                      const percentage = metrics.totalLoans > 0 ? (count / metrics.totalLoans) * 100 : 0
                      const color = 
                        status === "Approved" ? "bg-green-500" :
                        status === "Pending" ? "bg-amber-500" : "bg-red-500"
                      
                      return (
                        <div key={status}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">{status}</span>
                            <span className="text-sm text-slate-600">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3">
                            <div
                              className={`${color} h-3 rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Loans by Term */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Loans by Term Length
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(loansByTerm)
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([term, count]: [string, any]) => {
                        const percentage = metrics.totalLoans > 0 ? (count / metrics.totalLoans) * 100 : 0
                        
                        return (
                          <div key={term}>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-slate-700">{term} months</span>
                              <span className="text-sm text-slate-600">{count} loans</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-3">
                              <div
                                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Borrowers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top Borrowers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topBorrowers.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">No borrower data available</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Rank</th>
                          <th className="text-left p-3 font-semibold">Borrower</th>
                          <th className="text-left p-3 font-semibold">Loans</th>
                          <th className="text-left p-3 font-semibold">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topBorrowers.map((borrower, index) => (
                          <tr key={borrower.name} className="border-b hover:bg-slate-50">
                            <td className="p-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                {index + 1}
                              </div>
                            </td>
                            <td className="p-3 font-medium">{borrower.name}</td>
                            <td className="p-3">{borrower.count}</td>
                            <td className="p-3 font-semibold text-green-600">
                              ${borrower.total.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-600 mb-2">Active Loans</p>
                    <p className="text-4xl font-bold text-blue-600">{metrics.approved}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-600 mb-2">Pending Review</p>
                    <p className="text-4xl font-bold text-amber-600">{metrics.pending}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-600 mb-2">Rejected</p>
                    <p className="text-4xl font-bold text-red-600">{metrics.rejected}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
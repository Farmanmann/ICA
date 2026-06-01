"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, ArrowLeft, PieChart } from "lucide-react"

export default function ReportsAnalytics() {
  const [loans, setLoans] = useState<any[]>([])
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
      const { data, error: fetchError } = await supabase
        .from("loans")
        .select("*")
        .order("created_at", { ascending: false })
      if (fetchError) throw fetchError
      setLoans(data ?? [])
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
    return { totalLoans: loans.length, approved: approved.length, pending: pending.length, rejected: rejected.length, totalDisbursed, avgLoanSize, approvalRate }
  }

  const getLoansByTerm = () => {
    const terms: any = {}
    loans.forEach((loan: any) => {
      const term = loan.term || "Unknown"
      terms[term] = (terms[term] || 0) + 1
    })
    return terms
  }

  const getLoansByType = () => {
    const types: any = {}
    loans.forEach((loan: any) => {
      const t = loan.loan_type?.replace(/_/g, " ") || "Unknown"
      types[t] = (types[t] || 0) + 1
    })
    return types
  }

  const getLoansByStatus = () => ({
    Approved: loans.filter((l: any) => l.status === "Approved").length,
    Pending: loans.filter((l: any) => l.status === "Pending").length,
    Rejected: loans.filter((l: any) => l.status === "Rejected").length,
  })

  const metrics = calculateMetrics()
  const loansByTerm = getLoansByTerm()
  const loansByType = getLoansByType()
  const loansByStatus = getLoansByStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="sm" onClick={() => window.location.href = "/admin/dashboard"}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
              <p className="text-sm text-slate-600">Comprehensive financing portfolio insights</p>
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

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-slate-500">Loading analytics...</CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <BarChart3 className="h-4 w-4 opacity-75" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.totalLoans}</div>
                  <p className="text-xs opacity-90 mt-1">All time</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
                  <DollarSign className="h-4 w-4 opacity-75" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${metrics.totalDisbursed.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <p className="text-xs opacity-90 mt-1">{metrics.approved} applications</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg Financing Size</CardTitle>
                  <TrendingUp className="h-4 w-4 opacity-75" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${metrics.avgLoanSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <p className="text-xs opacity-90 mt-1">Per approved application</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" /> Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(loansByStatus).map(([status, count]: [string, any]) => {
                      const percentage = metrics.totalLoans > 0 ? (count / metrics.totalLoans) * 100 : 0
                      const color = status === "Approved" ? "bg-green-500" : status === "Pending" ? "bg-amber-500" : "bg-red-500"
                      return (
                        <div key={status}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">{status}</span>
                            <span className="text-sm text-slate-600">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3">
                            <div className={`${color} h-3 rounded-full`} style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* By Financing Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" /> By Financing Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(loansByType).map(([type, count]: [string, any]) => {
                      const percentage = metrics.totalLoans > 0 ? (count / metrics.totalLoans) * 100 : 0
                      return (
                        <div key={type}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700 capitalize">{type}</span>
                            <span className="text-sm text-slate-600">{count}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3">
                            <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* By Term */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" /> By Term Length
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
                              <span className="text-sm text-slate-600">{count}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-3">
                              <div className="bg-purple-500 h-3 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-slate-600 mb-2">Active Financing</p>
                  <p className="text-4xl font-bold text-blue-600">{metrics.approved}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-slate-600 mb-2">Pending Review</p>
                  <p className="text-4xl font-bold text-amber-600">{metrics.pending}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-slate-600 mb-2">Rejected</p>
                  <p className="text-4xl font-bold text-red-600">{metrics.rejected}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

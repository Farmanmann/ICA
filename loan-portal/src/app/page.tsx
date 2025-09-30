"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Menu } from "lucide-react"

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/loans/")
      .then((res) => res.json())
      .then(setApplications)
      .catch((err) => console.error("Failed to load loans:", err))
  }, [])

  return (
    <div className="flex min-h-screen bg-background text-background-foreground">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 bg-slate-900 text-white flex flex-col p-4">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="flex flex-col gap-3">
            <Button variant="ghost" className="justify-start text-left">
              Dashboard
            </Button>
            <Button variant="ghost" className="justify-start text-left">
              Applications
            </Button>
            <Button variant="ghost" className="justify-start text-left">
              Users
            </Button>
            <Button variant="ghost" className="justify-start text-left">
              Reports
            </Button>
            <Button variant="ghost" className="justify-start text-left">
              Settings
            </Button>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-slate-800 text-white p-4 shadow">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu />
            </Button>
            <h1 className="text-lg font-bold">Loan Management Dashboard</h1>
          </div>
          <div>
            <Button variant="secondary">Logout</Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{applications.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Approved Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-500">
                  {applications.filter((a) => a.status === "Approved").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-500">
                  {applications.filter((a) => a.status === "Pending").length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Applications Table */}
          <Card>
            <CardHeader>
              <CardTitle>Loan Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell>{loan.id}</TableCell>
                      <TableCell>{loan.borrower_name || "Unassigned"}</TableCell>
                      <TableCell>${loan.amount}</TableCell>
                      <TableCell>{loan.term}</TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

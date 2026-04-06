"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const islamicPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l5.878 18.09h19.022l-15.389 11.18 5.878 18.091L30 36.18l-15.389 11.181 5.878-18.091L5.1 18.09h19.022L30 0z' fill='%23006948' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", display: "inline-block", verticalAlign: "middle" }}
    >
      {name}
    </span>
  )
}

function bidStatusBadge(status: string) {
  if (status === "accepted")
    return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Accepted</span>
  if (status === "pending")
    return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Pending</span>
  return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Funded</span>
}

export default function LenderDashboard() {
  const [loans, setLoans] = useState<any[]>([])
  const [myBids, setMyBids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    document.head.appendChild(link)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()

      const [loansRes, bidsRes] = await Promise.all([
        supabase
          .from("loans")
          .select("*")
          .eq("status", "Pending")
          .order("created_at", { ascending: false }),
        user
          ? supabase
              .from("bids")
              .select("*, loans(property_address, borrower_name, term)")
              .eq("lender_id", user.id)
              .order("created_at", { ascending: false })
          : Promise.resolve({ data: [], error: null }),
      ])

      if (loansRes.error) throw loansRes.error

      setLoans(loansRes.data ?? [])
      setMyBids(bidsRes.data ?? [])
      setError("")
    } catch (err) {
      setError("Unable to load data. Please try again.")
      console.error("Failed to load data:", err)
    } finally {
      setLoading(false)
    }
  }

  const totalInvested = myBids.reduce((sum: number, b: any) => sum + parseFloat(b.amount || 0), 0)
  const stats = {
    totalInvested,
    activeLoans: myBids.filter((b: any) => b.status === "accepted").length,
    pendingBids: myBids.filter((b: any) => b.status === "pending").length,
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-950 flex flex-col py-6 z-50 shadow-2xl overflow-y-auto">
        <div className="px-6 mb-10">
          <h1 className="text-lg font-bold text-white tracking-tight">Noor Financing</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500 font-bold mt-1">Ethical Capital</p>
        </div>

        <div className="flex items-center px-6 mb-10 space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Icon name="person" className="text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Financier Portal</p>
            <p className="text-xs text-slate-400">Verified Financier</p>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          <a className="flex items-center space-x-3 bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 py-3 px-4 transition-transform duration-200 hover:translate-x-1" href="#">
            <Icon name="dashboard" className="text-[20px]" />
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a
            className="flex items-center space-x-3 text-slate-400 hover:text-white py-3 px-4 hover:bg-slate-900 transition-all hover:translate-x-1"
            href="/lender/bidding"
          >
            <Icon name="search_check" className="text-[20px]" />
            <span className="text-sm font-medium">Browse Applications</span>
          </a>
          <a className="flex items-center space-x-3 text-slate-400 hover:text-white py-3 px-4 hover:bg-slate-900 transition-all hover:translate-x-1" href="#investments">
            <Icon name="account_balance_wallet" className="text-[20px]" />
            <span className="text-sm font-medium">My Investments</span>
          </a>
          <a className="flex items-center space-x-3 text-slate-400 hover:text-white py-3 px-4 hover:bg-slate-900 transition-all hover:translate-x-1" href="#">
            <Icon name="analytics" className="text-[20px]" />
            <span className="text-sm font-medium">Impact Report</span>
          </a>
          <a
            className="flex items-center space-x-3 text-slate-400 hover:text-white py-3 px-4 hover:bg-slate-900 transition-all hover:translate-x-1"
            href="/lender/settings"
          >
            <Icon name="settings" className="text-[20px]" />
            <span className="text-sm font-medium">Settings</span>
          </a>
        </nav>

        <div className="px-4 mt-auto">
          <button
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-900/20 mb-6"
            onClick={() => window.location.href = "/lender/bidding"}
          >
            New Investment
          </button>
          <a className="flex items-center space-x-3 text-slate-400 hover:text-white py-3 px-4 hover:bg-slate-900 transition-all rounded-lg" href="#">
            <Icon name="logout" className="text-[20px]" />
            <span className="text-sm font-medium">Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="ml-64 p-8 min-h-screen"
        style={{ backgroundColor: "#faf8ff", backgroundImage: islamicPattern }}
      >
        {/* Top Bar */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#131b2e]">Financier Dashboard</h2>
            <p className="text-[#565e74] text-sm mt-1">Welcome back. Here's a summary of your portfolio.</p>
          </div>
          <button
            className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #006948, #00855d)", boxShadow: "0 8px 24px rgba(0,105,72,0.15)" }}
            onClick={() => window.location.href = "/lender/bidding"}
          >
            <Icon name="add_circle" className="text-white text-sm" />
            Browse New Applications
          </button>
        </header>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-widest text-[#565e74] mb-2">Total Invested</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-[#131b2e]">${stats.totalInvested.toLocaleString()}</h3>
              <span className="text-emerald-600 text-xs font-bold flex items-center gap-0.5">
                <Icon name="trending_up" className="text-[14px]" />
                8%
              </span>
            </div>
            <p className="text-sm text-[#565e74]/70 mt-1">Across {stats.activeLoans} properties</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-widest text-[#565e74] mb-2">Active Financing</p>
            <h3 className="text-4xl font-black text-[#131b2e]">{stats.activeLoans}</h3>
            <p className="text-sm text-[#565e74]/70 mt-1">Currently funding</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-widest text-[#565e74] mb-2">Pending Bids</p>
            <h3 className="text-4xl font-black text-[#131b2e]">{stats.pendingBids}</h3>
            <p className="text-sm text-[#565e74]/70 mt-1">Awaiting decision</p>
          </div>
        </section>

        {/* My Investments Table */}
        <section id="investments" className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
          <div className="px-8 py-6 border-b border-[#eaedff]">
            <h4 className="text-xl font-bold text-[#131b2e]">My Investments</h4>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-[#565e74]">Loading investments...</div>
            ) : myBids.length === 0 ? (
              <div className="py-12 text-center text-[#565e74]">
                <p className="mb-2 font-medium">No bids placed yet.</p>
                <a href="/lender/bidding" className="text-[#006948] text-sm font-bold hover:underline">Browse applications →</a>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ background: "#f2f3ff" }}>
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#565e74]">Property</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#565e74]">Borrower</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#565e74]">Amount Bid</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#565e74]">Term</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#565e74]">Monthly Return</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#565e74]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaedff]">
                  {myBids.map((bid: any) => {
                    const loan = bid.loans
                    const monthlyReturn = loan?.term ? parseFloat(bid.amount) / parseInt(loan.term) : null
                    return (
                      <tr key={bid.id} className="hover:bg-[#006948]/5 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                              <img
                                src={["/house1.jpg","/house2.jpg","/house3.avif","/house4.webp","/house5.webp","/house6.jpg"][bid.loan_id.charCodeAt(0) % 6]}
                                alt={loan?.property_address || "Property"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-[#131b2e]">{loan?.property_address || "—"}</p>
                              <p className="text-xs text-slate-400 font-mono">{bid.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-[#131b2e]">{loan?.borrower_name || "—"}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-[#131b2e]">${parseFloat(bid.amount).toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm text-[#565e74]">{loan?.term ? `${loan.term} mo` : "—"}</p>
                        </td>
                        <td className="px-6 py-5">
                          {monthlyReturn
                            ? <p className="text-sm font-bold text-emerald-600">${monthlyReturn.toFixed(2)}</p>
                            : <p className="text-sm font-bold text-[#565e74] italic">TBD</p>
                          }
                        </td>
                        <td className="px-6 py-5">
                          {bidStatusBadge(bid.status)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Available Applications */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h4 className="text-xl font-bold text-[#131b2e]">New Applications</h4>
              <p className="text-sm text-[#565e74]">
                {loading ? "Loading..." : `${loans.length} investment opportunit${loans.length === 1 ? "y" : "ies"} available`}
              </p>
            </div>
            <a className="text-[#006948] font-bold text-sm hover:underline underline-offset-4 flex items-center gap-1" href="/lender/bidding">
              View All
              <Icon name="arrow_forward" className="text-[18px]" />
            </a>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-[#565e74]">Loading applications...</div>
          ) : loans.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-[#565e74]">
              No new applications available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loans.slice(0, 3).map((loan: any, idx: number) => (
                <div key={loan.id} className="bg-white rounded-xl shadow-sm overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={["/house1.jpg","/house2.jpg","/house3.avif","/house4.webp","/house5.webp","/house6.jpg"][idx % 6]}
                      alt={loan.property_address || "Property"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md shadow-sm">
                      <span className="text-[10px] font-bold text-[#006948] uppercase">New Listing</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h5 className="font-bold text-[#131b2e]">
                      {loan.property_address || `Financing #${loan.id}`}
                    </h5>
                    <p className="text-xs text-[#565e74] mb-4">{loan.borrower_name || "Anonymous"}</p>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#565e74] font-bold">Funding Needed</p>
                        <p className="text-lg font-black text-[#131b2e]">${parseFloat(loan.amount).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-[#565e74] font-bold">Term</p>
                        <p className="text-sm font-bold text-[#131b2e]">{loan.term} mo</p>
                      </div>
                    </div>
                    <button
                      className="w-full text-white py-3 rounded-lg font-bold text-sm transition-colors shadow-lg"
                      style={{ background: "#006948", boxShadow: "0 4px 12px rgba(0,105,72,0.15)" }}
                      onClick={() => window.location.href = "/lender/bidding"}
                    >
                      Bid Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="ml-64 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Noor Financing</h4>
            <p className="text-sm text-slate-500 max-w-md leading-relaxed">
              © 2025 Noor Financing. Sharia-Compliant Ethical Investing. Empowering communities through interest-free capital and shared growth.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 md:justify-end">
            <a className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 transition-all" href="#">Privacy Policy</a>
            <a className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 transition-all" href="#">Terms of Service</a>
            <a className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 transition-all" href="#">Sharia Certificate</a>
            <a className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 transition-all" href="#">Equal Housing</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

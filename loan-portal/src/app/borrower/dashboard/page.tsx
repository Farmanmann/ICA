"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const islamicPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l2.5 12.5L45 15l-12.5 2.5L30 30l-2.5-12.5L15 15l12.5-2.5z' fill='%23006948' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`


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

function statusBadge(status: string) {
  if (status === "Approved")
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#85f8c4] text-[#005137]">
        ACTIVE
      </span>
    )
  if (status === "Pending")
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ffdcc3] text-[#6e3900]">
        UNDER REVIEW
      </span>
    )
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e2e7ff] text-[#565e74]">
      CLOSED
    </span>
  )
}

function statusDot(status: string) {
  if (status === "Approved") return <div className="w-2 h-2 rounded-full bg-[#006948] animate-pulse" />
  if (status === "Pending") return <div className="w-2 h-2 rounded-full bg-[#8d4b00]" />
  return <div className="w-2 h-2 rounded-full bg-[#565e74]" />
}

export default function BorrowerDashboard() {
  const [loans, setLoans] = useState<any[]>([])
  const [bids, setBids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    document.head.appendChild(link)
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      setLoading(true)
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email ?? null)

      const { data: loansData, error: fetchError } = await supabase
        .from("loans")
        .select("*")
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError
      setLoans(loansData ?? [])

      // Fetch all bids on these loans
      if (loansData && loansData.length > 0) {
        const loanIds = loansData.map((l: any) => l.id)
        const { data: bidsData } = await supabase
          .from("bids")
          .select("*, loans(property_address)")
          .in("loan_id", loanIds)
          .order("created_at", { ascending: false })
        setBids(bidsData ?? [])
      }

      setError("")
    } catch (err) {
      setError("Unable to load your applications. Please try again.")
      console.error("Failed to load loans:", err)
    } finally {
      setLoading(false)
    }
  }

  const calculateMonthlyPayment = (amount: any, term: any) => {
    return (parseFloat(amount) / parseInt(term)).toFixed(2)
  }

  const activeLoan = loans.find((l: any) => l.status === "Approved") as any
  const totalBorrowed = loans
    .filter((l: any) => l.status === "Approved")
    .reduce((sum: number, l: any) => sum + parseFloat(l.amount || 0), 0)

  const monthlyPayment = activeLoan
    ? parseFloat(calculateMonthlyPayment(activeLoan.amount, activeLoan.term))
    : 0

  return (
    <div
      className="min-h-screen text-[#131b2e]"
      style={{ backgroundColor: "#faf8ff", backgroundImage: islamicPattern, fontFamily: "Inter, sans-serif" }}
    >
      {/* Nav */}
      <nav
        className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20"
        style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 4px 24px 0 rgba(15,23,42,0.05)" }}
      >
        <div className="text-xl font-black text-emerald-900 tracking-tight">Noor Financing</div>
        <div className="hidden md:flex items-center gap-8">
          <a className="text-emerald-700 font-bold border-b-2 border-emerald-600 pb-1 text-sm uppercase tracking-widest" href="#">Dashboard</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100/50 rounded-lg transition-all active:scale-95">
            <Icon name="notifications" className="text-slate-600" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-[#bccac0]/30">
            <div className="w-10 h-10 rounded-full border-2 border-[#00855d] bg-emerald-100 flex items-center justify-center">
              <Icon name="person" className="text-emerald-700" />
            </div>
            {userEmail ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#565e74] hidden md:block">{userEmail}</span>
                <button
                  className="text-xs font-bold text-[#006948] border border-[#006948] px-3 py-1.5 rounded-lg hover:bg-[#85f8c4]/20 transition-all"
                  onClick={async () => {
                    const { createClient } = await import("@/lib/supabase/client")
                    await createClient().auth.signOut()
                    window.location.href = "/auth/login"
                  }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <a href="/auth/login" className="text-xs font-bold text-[#006948] border border-[#006948] px-3 py-1.5 rounded-lg hover:bg-[#85f8c4]/20 transition-all">
                Log In
              </a>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Hero */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#131b2e]">
              Welcome back 👋
            </h1>
            <p className="text-lg text-[#565e74] font-medium">Your home ownership journey, step by step.</p>
          </div>
          <button className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 group text-white"
            style={{ background: "linear-gradient(135deg, #006948, #00855d)", boxShadow: "0 8px 24px rgba(0,105,72,0.2)" }}
            onClick={() => window.location.href = "/borrower/apply/personal-info"}>
            Apply for New Financing
            <Icon name="arrow_forward" className="text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#006948]">
            <div className="flex items-center justify-between mb-4">
              <span className="p-2 rounded-lg" style={{ background: "#85f8c4" }}>
                <Icon name="home" className="text-[#005137]" />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#131b2e]">
              {loading ? "—" : loans.filter((l: any) => l.status === "Approved").length}
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-[#565e74] mt-1">Active Financing</p>
            <p className="text-sm text-[#565e74]/70 mt-2">Approved &amp; funded</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="p-2 rounded-lg" style={{ background: "#85f8c4" }}>
                <Icon name="payments" className="text-[#005137]" />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#131b2e]">
              {loading ? "—" : `$${totalBorrowed.toLocaleString()}`}
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-[#565e74] mt-1">Total Amount</p>
            <p className="text-sm text-[#565e74]/70 mt-2">Interest-free</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="p-2 rounded-lg" style={{ background: "#ffdcc3" }}>
                <Icon name="calendar_today" className="text-[#8d4b00]" />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#131b2e]">
              {loading ? "—" : activeLoan ? `$${monthlyPayment.toLocaleString()}` : "N/A"}
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-[#565e74] mt-1">Monthly Payment</p>
            <p className="text-sm text-[#565e74]/70 mt-2">Next due date</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="p-2 rounded-lg" style={{ background: "#85f8c4" }}>
                <Icon name="trending_up" className="text-[#005137]" />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#131b2e]">
              {loading ? "—" : loans.filter((l: any) => l.status === "Approved").length > 0 ? "0%" : "—"}
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-[#565e74] mt-1">Progress</p>
            <p className="text-sm text-[#565e74]/70 mt-2">of total paid</p>
          </div>
        </section>

        {/* Active Loan Card */}
        {!loading && activeLoan && (
          <section className="relative group">
            <div
              className="absolute -inset-1 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"
              style={{ background: "linear-gradient(to right, #006948, #00855d)" }}
            />
            <div
              className="relative border-l-8 border-[#006948] rounded-xl overflow-hidden shadow-2xl"
              style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            >
              <div className="p-8 md:p-10 flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-8">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 bg-[#e2e7ff] rounded-full text-xs font-bold tracking-wider text-[#131b2e] uppercase">
                      {activeLoan.property_address || "Property"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-[#005137]" style={{ background: "#85f8c4" }}>
                      ACTIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#565e74] mb-1">Financing Amount</p>
                      <p className="text-xl font-bold text-[#131b2e]">${parseFloat(activeLoan.amount).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#565e74] mb-1">Monthly Payment</p>
                      <p className="text-xl font-bold text-[#131b2e]">${monthlyPayment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#565e74] mb-1">Term</p>
                      <p className="text-xl font-bold text-[#131b2e]">{activeLoan.term} mo</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#565e74] mb-1">Remaining Balance</p>
                      <p className="text-xl font-bold text-[#131b2e]">${parseFloat(activeLoan.amount).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold tracking-widest uppercase">
                      <span className="text-[#565e74]">Repayment Progress</span>
                      <span className="text-[#006948]">0% Completed</span>
                    </div>
                    <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: "#e2e7ff" }}>
                      <div className="h-full rounded-full" style={{ width: "0%", background: "linear-gradient(to right, #006948, #00855d)" }} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <button className="px-8 py-3 rounded-lg font-bold shadow-md hover:-translate-y-0.5 transition-all text-white" style={{ background: "#006948" }}>
                      Make Payment
                    </button>
                    <button
                      className="px-8 py-3 border-2 border-[#006948] text-[#006948] rounded-lg font-bold hover:bg-[#85f8c4]/20 transition-all"
                      onClick={() => window.location.href = `/loans/${(activeLoan as any).id}`}
                    >
                      View Full Details
                    </button>
                  </div>
                </div>

                <div className="lg:w-80 shrink-0">
                  <div className="h-full min-h-[200px] w-full rounded-xl overflow-hidden relative">
                    <img
                      src={["/house1.jpg","/house2.jpg","/house3.avif","/house4.webp","/house5.webp","/house6.jpg"][activeLoan.id.charCodeAt(0) % 6]}
                      alt={activeLoan.property_address || "Property"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-[#565e74]">
            Loading your financing...
          </div>
        )}

        {/* Empty State */}
        {!loading && loans.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Icon name="description" className="text-[#bccac0] mb-4" />
            <h3 className="text-xl font-semibold text-[#131b2e] mb-2">No Financing Yet</h3>
            <p className="text-[#565e74] mb-6">Start your home journey by applying for interest-free financing.</p>
            <button className="px-8 py-3 rounded-lg font-bold text-white" style={{ background: "#006948" }}
              onClick={() => window.location.href = "/borrower/apply/personal-info"}>
              Apply for Financing
            </button>
          </div>
        )}

        {/* Financing Offers (Bids) */}
        {!loading && bids.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-[#131b2e]">Financing Offers</h2>
              <span className="text-sm font-bold text-[#006948] bg-[#85f8c4]/30 px-3 py-1 rounded-full">{bids.length} offer{bids.length !== 1 ? "s" : ""} received</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bccac0]/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#bccac0]/20" style={{ background: "#f2f3ff" }}>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#565e74]">Property</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#565e74]">Offer Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#565e74]">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#565e74]">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#bccac0]/10">
                    {bids.map((bid: any) => (
                      <tr key={bid.id} className="hover:bg-[#85f8c4]/5 transition-colors">
                        <td className="px-6 py-5 text-sm font-medium text-[#565e74]">
                          {bid.loans?.property_address || "Property"}
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-[#131b2e]">
                          ${parseFloat(bid.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ffdcc3] text-[#6e3900] uppercase">
                            {bid.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-[#565e74]">
                          {new Date(bid.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Applications Table */}
        {!loading && loans.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-[#131b2e]">All Applications</h2>
              <button className="text-sm font-bold text-[#006948] hover:underline underline-offset-4">View Archive</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bccac0]/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#bccac0]/20" style={{ background: "#f2f3ff" }}>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#565e74]">Loan ID</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#565e74]">Property Address</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#565e74]">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#565e74]">Term</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#565e74]">Status</th>
                      <th className="px-6 py-4 text-right" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#bccac0]/10">
                    {loans.map((loan: any) => (
                      <tr key={loan.id} className="hover:bg-[#85f8c4]/5 transition-colors cursor-pointer group" onClick={() => window.location.href = `/loans/${loan.id}`}>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {statusDot(loan.status)}
                            <span className="font-bold text-[#131b2e]">#{loan.id.slice(0, 8).toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-[#565e74]">
                          {loan.property_address || "Not specified"}
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-[#131b2e]">
                          ${parseFloat(loan.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-5 text-sm text-[#565e74]">
                          {loan.term} mo
                        </td>
                        <td className="px-6 py-5">
                          {statusBadge(loan.status)}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Icon name="chevron_right" className="text-[#565e74] group-hover:text-[#006948] transition-colors" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="text-lg font-bold text-slate-900">Noor Financing</div>
            <p className="text-sm leading-relaxed text-slate-500">© 2025 Noor Financing. Sharia-Compliant Ethical Investing.</p>
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

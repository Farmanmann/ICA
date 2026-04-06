"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, Calendar, User, MapPin, Briefcase, TrendingUp, X, CheckCircle } from "lucide-react"

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

export default function LenderBiddingPage() {
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedLoan, setSelectedLoan] = useState<any>(null)
  const [bidAmount, setBidAmount] = useState("")
  const [bidSubmitting, setBidSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [filterTerm, setFilterTerm] = useState("all")
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    document.head.appendChild(link)
    init()
  }, [])

  const init = async () => {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
    fetchLoans(supabase)
  }

  const fetchLoans = async (supabase: any) => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from("loans")
        .select("*")
        .eq("status", "Pending")
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError
      setLoans(data ?? [])
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
    if (!currentUser) {
      setError("You must be logged in to place a bid")
      return
    }

    setBidSubmitting(true)
    setError("")

    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const { error: insertError } = await supabase.from("bids").insert({
        loan_id: selectedLoan.id,
        lender_id: currentUser.id,
        amount: parseFloat(bidAmount),
        status: "pending",
      })

      if (insertError) throw insertError

      setSuccess(`Bid of $${parseFloat(bidAmount).toLocaleString()} placed successfully!`)
      setSelectedLoan(null)
      setBidAmount("")
      setTimeout(() => setSuccess(""), 4000)
    } catch (err: any) {
      setError(err.message || "Failed to submit bid. Please try again.")
    } finally {
      setBidSubmitting(false)
    }
  }

  const filteredLoans = filterTerm === "all"
    ? loans
    : loans.filter((l: any) => l.term === parseInt(filterTerm))

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
            <p className="text-xs text-slate-400">{currentUser?.email ?? "Verified Financier"}</p>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          <a className="flex items-center space-x-3 text-slate-400 hover:text-white py-3 px-4 hover:bg-slate-900 transition-all hover:translate-x-1" href="/lender/dashboard">
            <Icon name="dashboard" className="text-[20px]" />
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a className="flex items-center space-x-3 bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 py-3 px-4 transition-transform duration-200" href="/lender/bidding">
            <Icon name="search_check" className="text-[20px]" />
            <span className="text-sm font-medium">Browse Applications</span>
          </a>
          <a className="flex items-center space-x-3 text-slate-400 hover:text-white py-3 px-4 hover:bg-slate-900 transition-all hover:translate-x-1" href="#">
            <Icon name="account_balance_wallet" className="text-[20px]" />
            <span className="text-sm font-medium">My Investments</span>
          </a>
          <a className="flex items-center space-x-3 text-slate-400 hover:text-white py-3 px-4 hover:bg-slate-900 transition-all hover:translate-x-1" href="#">
            <Icon name="analytics" className="text-[20px]" />
            <span className="text-sm font-medium">Impact Report</span>
          </a>
          <a className="flex items-center space-x-3 text-slate-400 hover:text-white py-3 px-4 hover:bg-slate-900 transition-all hover:translate-x-1" href="/lender/settings">
            <Icon name="settings" className="text-[20px]" />
            <span className="text-sm font-medium">Settings</span>
          </a>
        </nav>

        <div className="px-4 mt-auto">
          <a className="flex items-center space-x-3 text-slate-400 hover:text-white py-3 px-4 hover:bg-slate-900 transition-all rounded-lg" href="#">
            <Icon name="logout" className="text-[20px]" />
            <span className="text-sm font-medium">Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 min-h-screen" style={{ backgroundColor: "#faf8ff" }}>
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#131b2e]">Browse Applications</h2>
            <p className="text-[#565e74] text-sm mt-1">Review and fund available financing requests.</p>
          </div>
        </header>

        {success && (
          <Alert className="mb-6 bg-emerald-50 border-emerald-200">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 flex items-center gap-4">
          <span className="text-sm font-medium text-slate-700">Filter by term:</span>
          <select
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
          >
            <option value="all">All Terms</option>
            <option value="12">12 months</option>
            <option value="24">24 months</option>
            <option value="60">60 months</option>
            <option value="120">120 months</option>
            <option value="180">180 months</option>
            <option value="360">360 months</option>
          </select>
          <Badge variant="outline">{filteredLoans.length} available</Badge>
        </div>

        {/* Loans Grid */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-[#565e74]">
            Loading available financing...
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-[#565e74]">
            No financing applications available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLoans.map((loan: any, idx: number) => (
              <div key={loan.id} className="bg-white rounded-xl shadow-sm border-2 border-transparent hover:border-emerald-200 hover:shadow-md transition-all overflow-hidden">
                {/* Property Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={["/house1.jpg","/house2.jpg","/house3.avif","/house4.webp","/house5.webp","/house6.jpg"][idx % 6]}
                    alt={loan.property_address || "Property"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-white font-bold text-sm drop-shadow">
                    {loan.property_address || "Property"}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">Available</span>
                </div>

                <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-[#131b2e] text-sm leading-tight">{loan.property_address || loan.borrower_name || "Financing Application"}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Ref: {loan.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-slate-600">Financing Amount</span>
                    </div>
                    <span className="font-bold text-lg text-[#131b2e]">${parseFloat(loan.amount).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">Term</span>
                    </div>
                    <span className="font-semibold text-sm text-[#131b2e]">{loan.term} months</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">Monthly Payment</span>
                    </div>
                    <span className="font-semibold text-sm text-emerald-600">
                      ${(parseFloat(loan.amount) / parseInt(loan.term)).toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    {loan.borrower_name && (
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs text-slate-600">{loan.borrower_name}</span>
                      </div>
                    )}
                    {loan.property_address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span className="text-xs text-slate-600">{loan.property_address}</span>
                      </div>
                    )}
                    {loan.employment_status && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs text-slate-600 capitalize">{loan.employment_status}</span>
                      </div>
                    )}
                  </div>

                  <button
                    className="w-full py-3 text-white rounded-lg font-bold text-sm transition-colors mt-2"
                    style={{ background: "linear-gradient(135deg, #006948, #00855d)" }}
                    onClick={() => {
                      setSelectedLoan(loan)
                      setBidAmount(loan.amount)
                      setError("")
                    }}
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="ml-64 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Noor Financing</h4>
            <p className="text-sm text-slate-500 max-w-md leading-relaxed">
              © 2025 Noor Financing. Sharia-Compliant Ethical Investing.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 md:justify-end">
            <a className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 transition-all" href="#">Privacy Policy</a>
            <a className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 transition-all" href="#">Terms of Service</a>
            <a className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 transition-all" href="#">Sharia Certificate</a>
          </div>
        </div>
      </footer>

      {/* Bid Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#131b2e]">Place Your Bid</h2>
              <button
                className="text-slate-400 hover:text-slate-600 transition-colors"
                onClick={() => { setSelectedLoan(null); setBidAmount(""); setError("") }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="font-bold text-sm text-[#131b2e] mb-1">
                  {selectedLoan.property_address || selectedLoan.borrower_name || "Financing Application"}
                </p>
                <p className="text-sm text-slate-600">Requested: <strong>${parseFloat(selectedLoan.amount).toLocaleString()}</strong></p>
                <p className="text-sm text-slate-600">Term: <strong>{selectedLoan.term} months</strong></p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Bid Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Enter bid amount"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">You can bid the full amount or a portion of it</p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <p className="text-sm text-emerald-900 font-medium">0% Interest · Sharia Compliant</p>
                <p className="text-xs text-emerald-800 mt-1">You'll receive back exactly what you contribute — no interest charged.</p>
              </div>

              {!currentUser && (
                <p className="text-sm text-amber-600 font-medium text-center">You must be logged in to place a bid.</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => { setSelectedLoan(null); setBidAmount(""); setError("") }}>
                  Cancel
                </Button>
                <button
                  className="flex-1 py-2 text-white rounded-lg font-bold text-sm disabled:opacity-60 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #006948, #00855d)" }}
                  onClick={handleBid}
                  disabled={bidSubmitting || !currentUser}
                >
                  {bidSubmitting ? "Submitting..." : "Submit Bid"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

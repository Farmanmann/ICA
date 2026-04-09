"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, CheckCircle, Info, DollarSign, Percent, Home, Briefcase, TrendingUp } from "lucide-react"

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

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 shrink-0 w-44">{label}</span>
      <span className="text-sm font-medium text-[#131b2e] text-right">{value || "—"}</span>
    </div>
  )
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  single_family: "Single Family Home",
  townhome: "Townhome",
  condominium: "Condominium",
  multi_family: "Multi-Family Home",
}
const OCCUPANCY_LABELS: Record<string, string> = {
  primary: "Primary Residence",
  secondary: "Secondary / Vacation",
  investment: "Investment Property",
}
const PURPOSE_LABELS: Record<string, string> = {
  home_purchase: "Home Purchase",
  refinance: "Refinance",
  investment_home: "Investment Home",
}
const LOAN_TYPE_LABELS: Record<string, string> = {
  murabaha: "Murabaha",
  musharaka: "Musharakah",
  no_preference: "No Preference",
}

export default function LenderBiddingPage() {
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [filterTerm, setFilterTerm] = useState("all")
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Detail panel
  const [detailLoan, setDetailLoan] = useState<any>(null)

  // Offer modal
  const [offerLoan, setOfferLoan] = useState<any>(null)
  const [offerData, setOfferData] = useState({ profit_rate: "", apr: "", monthly_payment: "", note: "" })
  const [offerSubmitting, setOfferSubmitting] = useState(false)

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
    } finally {
      setLoading(false)
    }
  }

  const handleSendOffer = async () => {
    if (!offerData.profit_rate && !offerData.apr && !offerData.monthly_payment) {
      setError("Please enter at least one offer term (profit rate, APR, or monthly payment)")
      return
    }
    if (!currentUser) { setError("You must be logged in to send an offer"); return }

    setOfferSubmitting(true)
    setError("")
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { error: insertError } = await supabase.from("bids").insert({
        loan_id: offerLoan.id,
        lender_id: currentUser.id,
        amount: parseFloat(offerLoan.amount),
        profit_rate: offerData.profit_rate ? parseFloat(offerData.profit_rate) : null,
        apr: offerData.apr ? parseFloat(offerData.apr) : null,
        monthly_payment: offerData.monthly_payment ? parseFloat(offerData.monthly_payment) : null,
        note: offerData.note || null,
        status: "pending",
      })
      if (insertError) throw insertError
      setSuccess("Offer sent successfully!")
      setOfferLoan(null)
      setDetailLoan(null)
      setOfferData({ profit_rate: "", apr: "", monthly_payment: "", note: "" })
      setTimeout(() => setSuccess(""), 4000)
    } catch (err: any) {
      setError(err.message || "Failed to send offer. Please try again.")
    } finally {
      setOfferSubmitting(false)
    }
  }

  const filteredLoans = filterTerm === "all" ? loans : loans.filter((l: any) => l.term === parseInt(filterTerm))

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
          <a className="flex items-center space-x-3 bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 py-3 px-4" href="/lender/bidding">
            <Icon name="search_check" className="text-[20px]" />
            <span className="text-sm font-medium">Browse Applications</span>
          </a>
          <a className="flex items-center space-x-3 text-slate-400 hover:text-white py-3 px-4 hover:bg-slate-900 transition-all hover:translate-x-1" href="#">
            <Icon name="account_balance_wallet" className="text-[20px]" />
            <span className="text-sm font-medium">My Offers</span>
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
            <p className="text-[#565e74] text-sm mt-1">Review borrower profiles and send financing offers.</p>
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
            <option value="180">180 months (15 yr)</option>
            <option value="240">240 months (20 yr)</option>
            <option value="360">360 months (30 yr)</option>
          </select>
          <Badge variant="outline">{filteredLoans.length} available</Badge>
        </div>

        {/* Loans Grid */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-[#565e74]">Loading available financing...</div>
        ) : filteredLoans.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-[#565e74]">No financing applications available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLoans.map((loan: any, idx: number) => (
              <div
                key={loan.id}
                className="bg-white rounded-xl shadow-sm border-2 border-transparent hover:border-emerald-200 hover:shadow-md transition-all overflow-hidden cursor-pointer"
                onClick={() => setDetailLoan(loan)}
              >
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

                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-[#131b2e] text-sm">{loan.property_address || "Financing Application"}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">Ref: {loan.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      {PROPERTY_TYPE_LABELS[loan.property_type] || "—"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Purchase Price</p>
                      <p className="font-bold text-[#131b2e]">${parseFloat(loan.amount).toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Term</p>
                      <p className="font-bold text-[#131b2e]">{loan.term} mo</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Down Payment</p>
                      <p className="font-bold text-[#131b2e]">{loan.down_payment_percent ? `${loan.down_payment_percent}%` : "—"}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Occupancy</p>
                      <p className="font-bold text-[#131b2e] text-xs">{OCCUPANCY_LABELS[loan.occupancy_type] || "—"}</p>
                    </div>
                  </div>

                  <button
                    className="w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setDetailLoan(loan) }}
                  >
                    <Info className="h-4 w-4" />
                    View Full Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="ml-64 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Noor Financing</h4>
            <p className="text-sm text-slate-500">© 2026 Noor Financing. Sharia-Compliant Ethical Investing.</p>
          </div>
          <div className="flex flex-wrap gap-6 md:justify-end">
            <a className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 transition-all" href="#">Privacy Policy</a>
            <a className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 transition-all" href="#">Terms of Service</a>
            <a className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 transition-all" href="#">Sharia Certificate</a>
          </div>
        </div>
      </footer>

      {/* Detail Panel */}
      {detailLoan && !offerLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50" onClick={() => setDetailLoan(null)}>
          <div
            className="bg-white h-full w-full max-w-xl shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold text-[#131b2e]">Borrower Profile</h2>
                <p className="text-xs text-slate-400 font-mono">Ref: {detailLoan.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setDetailLoan(null)}>
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Property Image */}
            <div className="relative h-52 w-full overflow-hidden">
              <img
                src={["/house1.jpg","/house2.jpg","/house3.avif","/house4.webp","/house5.webp","/house6.jpg"][loans.indexOf(detailLoan) % 6]}
                alt={detailLoan.property_address || "Property"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-5 text-white">
                <p className="font-bold text-sm">{detailLoan.property_address || "Property"}</p>
                <p className="text-xs text-white/80">{PROPERTY_TYPE_LABELS[detailLoan.property_type] || ""}</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Property Details */}
              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <Home className="h-3.5 w-3.5" /> Property Details
                </h3>
                <div className="bg-slate-50 rounded-xl p-4">
                  <DetailRow label="Address" value={detailLoan.property_address} />
                  <DetailRow label="Home to Finance" value={detailLoan.property_address} />
                  <DetailRow label="Property Type" value={PROPERTY_TYPE_LABELS[detailLoan.property_type]} />
                  <DetailRow label="Occupancy" value={OCCUPANCY_LABELS[detailLoan.occupancy_type]} />
                  <DetailRow label="Est. Property Value" value={detailLoan.property_value ? `$${parseFloat(detailLoan.property_value).toLocaleString()}` : null} />
                  <DetailRow label="First Time Buyer" value={detailLoan.first_time_buyer === "yes" ? "Yes" : detailLoan.first_time_buyer === "no" ? "No" : null} />
                  <DetailRow label="Co-Borrower" value={detailLoan.has_co_borrower === "yes" ? "Yes" : detailLoan.has_co_borrower === "no" ? "No" : null} />
                </div>
              </section>

              {/* Financing Details */}
              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5" /> Financing Request
                </h3>
                <div className="bg-slate-50 rounded-xl p-4">
                  <DetailRow label="Financing Type" value={LOAN_TYPE_LABELS[detailLoan.loan_type]} />
                  <DetailRow label="Purpose" value={PURPOSE_LABELS[detailLoan.purpose]} />
                  <DetailRow label="Est. Purchase Price" value={detailLoan.amount ? `$${parseFloat(detailLoan.amount).toLocaleString()}` : null} />
                  <DetailRow label="Repayment Term" value={detailLoan.term ? `${detailLoan.term} months` : null} />
                  <DetailRow label="Down Payment" value={detailLoan.down_payment_percent ? `${detailLoan.down_payment_percent}%` : null} />
                </div>
              </section>

              {/* Borrower Profile */}
              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5" /> Borrower Profile
                </h3>
                <div className="bg-slate-50 rounded-xl p-4">
                  <DetailRow label="Employment Status" value={detailLoan.employment_status ? detailLoan.employment_status.replace(/-/g, " ") : null} />
                  <DetailRow label="Annual Income" value={detailLoan.annual_income ? `$${parseFloat(detailLoan.annual_income).toLocaleString()}` : null} />
                  <DetailRow label="Credit Score" value={detailLoan.credit_score} />
                  <DetailRow label="Date of Birth" value={detailLoan.date_of_birth} />
                  <DetailRow label="Buying Stage" value={detailLoan.buying_stage?.replace(/_/g, " ")} />
                  <DetailRow label="Home Address" value={detailLoan.address} />
                </div>
              </section>

              {/* Send Offer CTA */}
              <button
                className="w-full py-4 text-white rounded-xl font-bold text-sm transition-all hover:opacity-90 shadow-lg"
                style={{ background: "linear-gradient(135deg, #006948, #00855d)" }}
                onClick={() => {
                  setOfferData({ profit_rate: "", apr: "", monthly_payment: "", note: "" })
                  setError("")
                  setOfferLoan(detailLoan)
                }}
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Offer Modal */}
      {offerLoan && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-[#131b2e]">Send Financing Offer</h2>
                <p className="text-xs text-slate-500 mt-0.5">{offerLoan.property_address || "Application"}</p>
              </div>
              <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => { setOfferLoan(null); setError("") }}>
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-slate-50 rounded-xl p-4 text-sm">
                <p className="font-bold text-[#131b2e]">{offerLoan.property_address || "Financing Application"}</p>
                <p className="text-slate-500 mt-1">Requested: <strong>${parseFloat(offerLoan.amount).toLocaleString()}</strong> · {offerLoan.term} months</p>
              </div>

              <p className="text-xs text-slate-500">Enter the loan terms you are willing to offer. Fill in the fields that apply.</p>

              {/* Profit Rate */}
              <div>
                <label className="flex text-sm font-medium text-slate-700 mb-1.5 items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Profit Rate (%)
                </label>
                <input
                  type="number"
                  value={offerData.profit_rate}
                  onChange={(e) => setOfferData({ ...offerData, profit_rate: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                  placeholder="e.g. 5.25"
                  step="0.01"
                  min="0"
                />
              </div>

              {/* APR */}
              <div>
                <label className="flex text-sm font-medium text-slate-700 mb-1.5 items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  APR (%)
                </label>
                <input
                  type="number"
                  value={offerData.apr}
                  onChange={(e) => setOfferData({ ...offerData, apr: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                  placeholder="e.g. 5.50"
                  step="0.01"
                  min="0"
                />
              </div>

              {/* Monthly Payment */}
              <div>
                <label className="flex text-sm font-medium text-slate-700 mb-1.5 items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Monthly Payment ($)
                </label>
                <input
                  type="number"
                  value={offerData.monthly_payment}
                  onChange={(e) => setOfferData({ ...offerData, monthly_payment: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                  placeholder="e.g. 1850.00"
                  step="0.01"
                  min="0"
                />
              </div>

              {/* Note */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Note (optional)</label>
                <textarea
                  value={offerData.note}
                  onChange={(e) => setOfferData({ ...offerData, note: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                  rows={2}
                  placeholder="Any additional terms or conditions..."
                />
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <p className="text-sm text-emerald-900 font-medium">Sharia-Compliant Offer</p>
                <p className="text-xs text-emerald-800 mt-0.5">All financing is structured to be interest-free and compliant with Islamic finance principles.</p>
              </div>

              <div className="flex gap-3 pt-1">
                <Button variant="outline" className="flex-1" onClick={() => { setOfferLoan(null); setError("") }}>Cancel</Button>
                <button
                  className="flex-1 py-2.5 text-white rounded-lg font-bold text-sm disabled:opacity-60 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #006948, #00855d)" }}
                  onClick={handleSendOffer}
                  disabled={offerSubmitting || !currentUser}
                >
                  {offerSubmitting ? "Sending..." : "Send Offer"}
                </button>
              </div>
              {!currentUser && <p className="text-sm text-amber-600 font-medium text-center">You must be logged in to send an offer.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

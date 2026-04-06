"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"


function Icon({ name, className = "", filled = false }: { name: string; className?: string; filled?: boolean }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        display: "inline-block",
        verticalAlign: "middle",
      }}
    >
      {name}
    </span>
  )
}

export default function LoanDetailPage() {
  const params = useParams()
  const loanId = params.id

  const [loan, setLoan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bidAmount, setBidAmount] = useState("")
  const [bidSubmitting, setBidSubmitting] = useState(false)
  const [success, setSuccess] = useState("")

  const fundedPct = loan?.funded_pct ?? 40
  const confirmedPct = loan?.confirmed_pct ?? 25
  const pendingPct = loan?.pending_pct ?? 15
  const fundedAmount = loan ? (parseFloat(loan.amount) * fundedPct) / 100 : 0

  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    document.head.appendChild(link)
    fetchLoan()
  }, [loanId])

  const fetchLoan = async () => {
    try {
      setLoading(true)
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from("loans")
        .select("*")
        .eq("id", loanId)
        .single()

      if (fetchError) throw fetchError
      setLoan(data)
      setBidAmount(Math.round(parseFloat(data.amount) * 0.1).toString())
      setError("")
    } catch (err) {
      setError("Unable to load this financing application.")
      console.error("Failed to load loan:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleBid = async () => {
    const amount = parseFloat(bidAmount.replace(/,/g, ""))
    if (!amount || amount <= 0) { setError("Please enter a valid bid amount"); return }
    if (amount > parseFloat(loan.amount)) { setError("Bid amount cannot exceed the financing amount"); return }

    setBidSubmitting(true)
    setError("")

    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError("You must be logged in to place a bid."); setBidSubmitting(false); return }

      const { error: insertError } = await supabase.from("bids").insert({
        loan_id: loan.id,
        lender_id: user.id,
        amount,
        status: "pending",
      })

      if (insertError) throw insertError

      setSuccess(`Bid of $${amount.toLocaleString()} submitted successfully!`)
      setTimeout(() => setSuccess(""), 4000)
    } catch (err: any) {
      setError(err.message ?? "Failed to submit bid. Please try again.")
    } finally {
      setBidSubmitting(false)
    }
  }

  const monthlyPayment = loan
    ? (parseFloat(loan.amount) / parseInt(loan.term)).toFixed(0)
    : "0"

  const ltv = loan ? Math.round((parseFloat(loan.amount) / (parseFloat(loan.amount) * 1.25)) * 100) : 80

  return (
    <div className="min-h-screen text-[#131b2e]" style={{ backgroundColor: "#faf8ff", fontFamily: "Inter, sans-serif" }}>
      {/* Nav */}
      <nav
        className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20"
        style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 4px 24px rgba(15,23,42,0.05)" }}
      >
        <div className="flex items-center gap-8">
          <span className="text-xl font-black text-emerald-900">Noor Financing</span>
          <div className="hidden md:flex items-center gap-6">
            <a className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-semibold uppercase tracking-widest" href="/borrower/dashboard">Dashboard</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100/50 rounded-lg transition-all">
            <Icon name="notifications" className="text-[#565e74]" />
          </button>
          <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center">
            <Icon name="person" className="text-[#006948]" />
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Success Banner */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-[#85f8c4]/20 border border-[#006948]/20 flex items-center gap-3">
            <Icon name="check_circle" className="text-[#006948]" filled />
            <span className="text-sm font-bold text-[#006948]">{success}</span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
            <Icon name="error" className="text-red-600" />
            <span className="text-sm font-bold text-red-700">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center text-[#565e74]">
            Loading financing details...
          </div>
        ) : !loan ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center text-[#565e74]">
            Financing application not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-8">
              {/* Hero Image */}
              <section className="relative group">
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-[#e2e7ff]">
                  <img
                    src={["/house1.jpg","/house2.jpg","/house3.avif","/house4.webp","/house5.webp","/house6.jpg"][loan.id.charCodeAt(0) % 6]}
                    alt={loan.property_address || "Property"}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Gallery chips placeholder */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {["chair", "kitchen", "bed"].map((icon, i) => (
                    <div key={i} className="h-16 w-20 rounded-lg bg-white/80 backdrop-blur-sm border-2 border-white/50 hover:border-[#006948] transition-all flex items-center justify-center cursor-pointer">
                      <Icon name={icon} className="text-[#006948]" />
                    </div>
                  ))}
                  <button className="h-16 w-20 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest">
                    +12
                  </button>
                </div>
              </section>

              {/* Info Section */}
              <section className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="bg-[#e2e7ff] text-[#006948] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                        Single Family Home
                      </span>
                      <span className="flex items-center text-[#565e74] text-sm">
                        <Icon name="location_on" className="text-lg mr-1" />
                        {loan.property_address || "Address not provided"}
                      </span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#131b2e]">
                      {loan.property_address || `Financing Application #${loan.id}`}
                    </h1>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#565e74] mb-1">Estimated Value</p>
                    <p className="text-2xl font-black text-emerald-700">
                      ${(parseFloat(loan.amount) * 1.25).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>

                {/* Property Specs */}
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-[#bccac0]/20">
                  {[
                    { icon: "bed", value: loan.bedrooms || "4", label: "Beds" },
                    { icon: "bathtub", value: loan.bathrooms || "3", label: "Baths" },
                    { icon: "square_foot", value: loan.sqft ? loan.sqft.toLocaleString() : "2,450", label: "Sq Ft" },
                  ].map(({ icon, value, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,133,93,0.1)" }}>
                        <Icon name={icon} className="text-[#006948]" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">{value}</p>
                        <p className="text-xs text-[#565e74] font-medium uppercase tracking-wider">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* LTV Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold uppercase tracking-wider">
                    <span className="text-[#565e74]">Loan-to-Value Ratio</span>
                    <span className="text-[#006948]">{ltv}% LTV</span>
                  </div>
                  <div className="h-2 w-full bg-[#e2e7ff] rounded-full overflow-hidden">
                    <div className="h-full bg-[#006948] rounded-full" style={{ width: `${ltv}%` }} />
                  </div>
                </div>
              </section>

              {/* Map Placeholder */}
              <section className="rounded-xl overflow-hidden h-[280px] relative flex items-center justify-center" style={{ background: "#f2f3ff" }}>
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: "repeating-linear-gradient(0deg, #bccac0 0px, #bccac0 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #bccac0 0px, #bccac0 1px, transparent 1px, transparent 40px)"
                }} />
                <div className="relative flex flex-col items-center gap-3 text-center">
                  <div className="h-14 w-14 bg-[#006948] text-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Icon name="location_on" className="text-white" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#565e74]">
                    {loan.property_address || "Property Location"}
                  </p>
                </div>
              </section>
            </div>

            {/* Right Column — Sticky Bid Card */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
              <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                {/* Card Header */}
                <div className="px-6 py-5 flex justify-between items-center" style={{ background: "#f2f3ff" }}>
                  <h2 className="text-sm font-black text-[#131b2e] tracking-tight uppercase">
                    Financing Application #{loan.id.slice(0, 8).toUpperCase()}
                  </h2>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase" style={{ background: "rgba(141,75,0,0.1)", color: "#8d4b00" }}>
                    {loan.status === "Pending" ? "Available" : loan.status}
                  </span>
                </div>

                <div className="p-6 space-y-6">
                  {/* Borrower Profile */}
                  <div className="p-4 rounded-xl flex items-center gap-4" style={{ background: "#f2f3ff" }}>
                    <div className="h-14 w-14 rounded-full bg-[#e2e7ff] flex items-center justify-center border-2 border-white shadow-sm shrink-0">
                      <Icon name="person" className="text-[#565e74] text-3xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[#131b2e]">
                        {loan.borrower_name ? `${loan.borrower_name.split(" ")[0]} M.` : "Anonymous"}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center text-[11px] text-[#565e74] font-bold uppercase tracking-tighter">
                          <Icon name="work" className="text-xs mr-1" /> {loan.employment_status || "Employed"}
                        </span>
                        <span className="flex items-center text-[11px] text-[#006948] font-bold uppercase tracking-tighter">
                          <Icon name="verified_user" className="text-xs mr-1" /> Credit: {loan.credit_score || "720"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-bold text-[#565e74] uppercase tracking-widest">Income</p>
                      <p className="text-sm font-black">${loan.annual_income ? parseFloat(loan.annual_income).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "95,000"}</p>
                    </div>
                  </div>

                  {/* Financing Summary */}
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div className="col-span-2">
                      <p className="text-xs font-bold text-[#565e74] uppercase tracking-widest mb-1">Requested Amount</p>
                      <p className="text-4xl font-black text-[#006948]">${parseFloat(loan.amount).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#565e74] uppercase tracking-widest mb-1">Repayment Term</p>
                      <p className="text-sm font-bold">{loan.term} Months</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#565e74] uppercase tracking-widest mb-1">Monthly Payment</p>
                      <p className="text-sm font-bold">
                        ${parseInt(monthlyPayment).toLocaleString()}{" "}
                        <span className="text-[#006948] text-[10px] ml-1">(0%)</span>
                      </p>
                    </div>
                    <div className="col-span-2 p-3 rounded-lg border-l-4 border-[#8d4b00]" style={{ background: "#ffdcc3" }}>
                      <p className="text-[10px] font-bold text-[#8d4b00] uppercase tracking-widest">Purpose</p>
                      <p className="text-sm font-bold text-[#2f1500]">{loan.purpose || "Primary Residence"}</p>
                    </div>
                  </div>

                  {/* Funding Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                      <span className="text-[#131b2e]">Funding Progress</span>
                      <span className="text-[#006948]">{fundedPct}% Funded</span>
                    </div>
                    <div className="h-3 w-full bg-[#e2e7ff] rounded-full overflow-hidden flex">
                      <div className="h-full bg-[#006948]" style={{ width: `${confirmedPct}%` }} />
                      <div className="h-full bg-[#006948]/40 border-l border-white/20" style={{ width: `${pendingPct}%` }} />
                    </div>
                    <p className="text-[10px] text-center text-[#565e74] font-medium italic">
                      Currently Funded: ${fundedAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} of ${parseFloat(loan.amount).toLocaleString()}
                    </p>
                  </div>

                  {/* Bid Input */}
                  <div className="pt-6 border-t border-[#bccac0]/20 space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-[#565e74] uppercase tracking-widest block mb-2">
                        Your Bid Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3d4a42] font-bold">$</span>
                        <input
                          className="w-full rounded-xl py-4 pl-8 pr-4 text-xl font-black text-[#131b2e] focus:outline-none transition-all"
                          style={{ background: "#f2f3ff", border: "2px solid transparent" }}
                          type="text"
                          value={bidAmount ? parseInt(bidAmount).toLocaleString() : ""}
                          onChange={(e) => setBidAmount(e.target.value.replace(/,/g, ""))}
                          onFocus={(e) => (e.target.style.borderColor = "#006948")}
                          onBlur={(e) => (e.target.style.borderColor = "transparent")}
                          placeholder="0"
                        />
                      </div>
                      <input
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer mt-4"
                        style={{ background: "#e2e7ff", accentColor: "#006948" }}
                        type="range"
                        min={1000}
                        max={parseFloat(loan.amount)}
                        step={1000}
                        value={bidAmount || 0}
                        onChange={(e) => setBidAmount(e.target.value)}
                      />
                    </div>
                    <button
                      className="w-full py-2 text-[10px] font-bold uppercase tracking-widest border rounded-lg hover:bg-[#006948]/5 transition-all"
                      style={{ color: "#006948", borderColor: "rgba(0,105,72,0.2)" }}
                      onClick={() => setBidAmount(loan.amount)}
                    >
                      Bid the Full Amount
                    </button>
                  </div>

                  {/* Sharia Notice */}
                  <div className="flex items-center justify-center gap-2 py-3 rounded-xl border" style={{ background: "rgba(0,105,72,0.05)", borderColor: "rgba(0,105,72,0.2)" }}>
                    <Icon name="check_circle" className="text-[#006948] text-sm" filled />
                    <span className="text-[11px] font-bold text-[#006948] uppercase tracking-widest">0% Interest · Sharia Compliant</span>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-3">
                    <button
                      className="w-full py-4 text-white font-black uppercase tracking-widest rounded-xl shadow-lg transition-transform duration-200 hover:scale-[0.98] disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #006948, #00855d)", boxShadow: "0 8px 24px rgba(0,105,72,0.2)" }}
                      onClick={handleBid}
                      disabled={bidSubmitting}
                    >
                      {bidSubmitting ? "Submitting..." : "Submit Bid"}
                    </button>
                    <button
                      className="w-full py-4 bg-transparent border-2 border-[#283044]/10 text-[#283044] font-black uppercase tracking-widest rounded-xl hover:bg-[#283044] hover:text-white transition-all"
                    >
                      Save for Later
                    </button>
                  </div>

                  {/* Social Actions */}
                  <div className="flex justify-center gap-6 pt-2">
                    {["share", "favorite", "content_copy"].map((icon) => (
                      <button key={icon} className="text-[#565e74] hover:text-[#006948] transition-colors">
                        <Icon name={icon} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-100 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <span className="text-lg font-bold text-slate-900">Noor Financing</span>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">© 2025 Noor Financing. Sharia-Compliant Ethical Investing.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <a className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 hover:underline underline-offset-4 transition-all" href="#">Privacy Policy</a>
              <a className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 hover:underline underline-offset-4 transition-all" href="#">Terms of Service</a>
            </div>
            <div className="flex flex-col gap-3">
              <a className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 hover:underline underline-offset-4 transition-all" href="#">Sharia Certificate</a>
              <a className="text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 hover:underline underline-offset-4 transition-all" href="#">Equal Housing</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

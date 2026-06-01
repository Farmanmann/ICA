"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Calendar, TrendingUp, Calculator, ArrowRight, Home, Percent } from "lucide-react"

type FinancingType = "murabaha" | "musharaka"

const TERM_OPTIONS = [
  { months: 120, label: "10 years" },
  { months: 180, label: "15 years" },
  { months: 240, label: "20 years" },
  { months: 360, label: "30 years" },
]

export default function LoanCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(400000)
  const [downPaymentPct, setDownPaymentPct] = useState(20)
  const [termMonths, setTermMonths] = useState(360)
  const [profitRate, setProfitRate] = useState(5.5)
  const [financingType, setFinancingType] = useState<FinancingType>("murabaha")

  const loanAmount = purchasePrice * (1 - downPaymentPct / 100)
  const monthlyRate = profitRate / 100 / 12

  // Murabaha: total markup spread evenly (cost-plus sale, no compounding)
  // Musharakah: amortizing (declining balance — rent on co-owned share)
  const calcMonthly = () => {
    if (financingType === "murabaha") {
      const years = termMonths / 12
      const totalCost = loanAmount * (1 + (profitRate / 100) * years)
      return totalCost / termMonths
    } else {
      if (monthlyRate === 0) return loanAmount / termMonths
      return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)
    }
  }

  const monthly = calcMonthly()
  const totalCost = monthly * termMonths
  const totalProfit = totalCost - loanAmount

  // Conventional comparison at 7% APR
  const convRate = 0.07 / 12
  const convMonthly = (loanAmount * convRate * Math.pow(1 + convRate, termMonths)) /
    (Math.pow(1 + convRate, termMonths) - 1)
  const convTotal = convMonthly * termMonths
  const convInterest = convTotal - loanAmount

  const fmt = (n: number) => n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24">
        {/* Hero */}
        <section className="py-12 px-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Financing Calculator</h1>
            <p className="text-xl text-slate-600">
              Estimate your monthly payments under Murabaha or Musharakah structures.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" /> Financing Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-7">
                  {/* Financing Type */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-3">Financing Structure</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "murabaha" as FinancingType, label: "Murabaha", desc: "Cost-plus sale" },
                        { value: "musharaka" as FinancingType, label: "Musharakah", desc: "Declining partnership" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setFinancingType(opt.value)}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            financingType === opt.value
                              ? "border-blue-600 bg-blue-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <p className="font-semibold text-sm text-slate-900">{opt.label}</p>
                          <p className="text-xs text-slate-500">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Purchase Price */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Home className="h-4 w-4" /> Purchase Price
                      </label>
                      <span className="text-xl font-bold text-blue-600">${purchasePrice.toLocaleString()}</span>
                    </div>
                    <input type="range" min="100000" max="2000000" step="5000"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1"><span>$100k</span><span>$2M</span></div>
                    <div className="flex gap-2 mt-3">
                      {[250000, 400000, 600000, 800000].map((v) => (
                        <button key={v} onClick={() => setPurchasePrice(v)}
                          className={`flex-1 py-1.5 text-xs border-2 rounded-lg font-medium transition-all ${purchasePrice === v ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                          ${v / 1000}k
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Down Payment */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" /> Down Payment
                      </label>
                      <span className="text-xl font-bold text-blue-600">
                        {downPaymentPct}% — ${(purchasePrice * downPaymentPct / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <input type="range" min="3" max="50" step="1"
                      value={downPaymentPct}
                      onChange={(e) => setDownPaymentPct(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1"><span>3%</span><span>50%</span></div>
                  </div>

                  {/* Profit Rate */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Percent className="h-4 w-4" /> Profit Rate
                      </label>
                      <span className="text-xl font-bold text-blue-600">{profitRate.toFixed(2)}%</span>
                    </div>
                    <input type="range" min="1" max="12" step="0.25"
                      value={profitRate}
                      onChange={(e) => setProfitRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1"><span>1%</span><span>12%</span></div>
                  </div>

                  {/* Term */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Repayment Term
                      </label>
                      <span className="text-xl font-bold text-blue-600">{termMonths / 12} years</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {TERM_OPTIONS.map((opt) => (
                        <button key={opt.months} onClick={() => setTermMonths(opt.months)}
                          className={`py-2 text-sm border-2 rounded-lg font-medium transition-all ${termMonths === opt.months ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-5">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0">
                  <CardHeader>
                    <CardTitle className="text-white text-sm uppercase tracking-wider opacity-80">
                      {financingType === "murabaha" ? "Murabaha" : "Musharakah"} — Monthly Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold mb-1">${fmt(monthly)}</div>
                    <p className="text-blue-100">per month · {termMonths / 12} year term</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-xs text-slate-500">Financed Amount</p>
                        <p className="text-lg font-bold">${fmt(loanAmount)}</p>
                      </div>
                      <DollarSign className="h-6 w-6 text-slate-400 self-center" />
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-xs text-slate-500">Total Cost</p>
                        <p className="text-lg font-bold">${fmt(totalCost)}</p>
                      </div>
                      <TrendingUp className="h-6 w-6 text-slate-400 self-center" />
                    </div>
                    <div className="flex justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <p className="text-xs text-blue-700 font-medium">Total Halal Profit</p>
                        <p className="text-lg font-bold text-blue-700">${fmt(totalProfit)}</p>
                      </div>
                      <div className="text-blue-600 font-bold self-center">{profitRate}%</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-slate-900 mb-2 text-sm">Why This Is Sharia-Compliant</h3>
                    {financingType === "murabaha" ? (
                      <p className="text-xs text-slate-600 leading-relaxed">In a <strong>Murabaha</strong> transaction, the financier purchases the property and sells it to you at a pre-agreed markup. You pay in fixed installments. The profit is a disclosed markup on a sale — not interest.</p>
                    ) : (
                      <p className="text-xs text-slate-600 leading-relaxed">In a <strong>Musharakah</strong> arrangement, you and the financier co-own the property. You gradually buy out their share while paying rent on their portion. The profit rate reflects the rent — not interest on a loan.</p>
                    )}
                  </CardContent>
                </Card>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                  onClick={() => window.location.href = "/borrower/apply/personal-info"}
                >
                  Apply for This Financing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Comparison Table */}
            <Card className="mt-10">
              <CardHeader>
                <CardTitle>Noor Financing vs. Conventional Bank (7% APR)</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left p-4 font-semibold">Option</th>
                      <th className="text-right p-4 font-semibold">Monthly</th>
                      <th className="text-right p-4 font-semibold">Profit / Interest</th>
                      <th className="text-right p-4 font-semibold">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-blue-50">
                      <td className="p-4 font-medium text-blue-700">
                        Noor — {financingType === "murabaha" ? "Murabaha" : "Musharakah"} ({profitRate}%)
                      </td>
                      <td className="text-right p-4 font-bold text-blue-700">${fmt(monthly)}</td>
                      <td className="text-right p-4 font-bold text-blue-700">${fmt(totalProfit)}</td>
                      <td className="text-right p-4 font-bold text-blue-700">${fmt(totalCost)}</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-600">Traditional Bank (7% APR)</td>
                      <td className="text-right p-4 text-slate-600">${fmt(convMonthly)}</td>
                      <td className="text-right p-4 text-red-600">${fmt(convInterest)}</td>
                      <td className="text-right p-4 text-slate-600">${fmt(convTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}

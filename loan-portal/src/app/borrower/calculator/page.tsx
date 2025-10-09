"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Calendar, TrendingUp, Calculator, ArrowRight } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(50000)
  const [loanTerm, setLoanTerm] = useState(36)

  const calculateMonthlyPayment = () => {
    return (loanAmount / loanTerm).toFixed(2)
  }

  const calculateTotalPayment = () => {
    return loanAmount
  }

  const calculateTotalInterest = () => {
    return 0 // Interest-free
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-12 px-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Loan Calculator</h1>
            <p className="text-xl text-slate-600">
              Calculate your monthly payments for an interest-free loan
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Loan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Loan Amount Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Loan Amount
                      </label>
                      <span className="text-2xl font-bold text-blue-600">
                        ${loanAmount.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="500000"
                      step="1000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>$1,000</span>
                      <span>$500,000</span>
                    </div>
                  </div>

                  {/* Loan Term Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Loan Term
                      </label>
                      <span className="text-2xl font-bold text-blue-600">
                        {loanTerm} months
                      </span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="60"
                      step="12"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>12 months</span>
                      <span>60 months</span>
                    </div>
                  </div>

                  {/* Quick Selection Buttons */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-3">Common Loan Amounts</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[25000, 50000, 100000, 200000].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setLoanAmount(amount)}
                          className={`p-2 text-sm border-2 rounded-lg transition-all ${
                            loanAmount === amount
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          ${amount / 1000}k
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-3">Common Terms</p>
                    <div className="grid grid-cols-5 gap-2">
                      {[12, 24, 36, 48, 60].map((term) => (
                        <button
                          key={term}
                          onClick={() => setLoanTerm(term)}
                          className={`p-2 text-sm border-2 rounded-lg transition-all ${
                            loanTerm === term
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {term}mo
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Card */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                  <CardHeader>
                    <CardTitle className="text-white">Monthly Payment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold mb-2">
                      ${calculateMonthlyPayment()}
                    </div>
                    <p className="text-blue-100">Per month for {loanTerm} months</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm text-slate-600">Total Loan Amount</p>
                        <p className="text-2xl font-bold text-slate-900">
                          ${loanAmount.toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-slate-400" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm text-slate-600">Total to Repay</p>
                        <p className="text-2xl font-bold text-slate-900">
                          ${calculateTotalPayment().toLocaleString()}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-slate-400" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="text-sm text-green-900 font-medium">Total Interest</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${calculateTotalInterest()}
                        </p>
                      </div>
                      <div className="text-green-600 text-xl font-bold">0%</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Benefits */}
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-slate-900 mb-3">Interest-Free Benefits</h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Pay only what you borrow - no interest charges</li>
                      <li>• Fixed monthly payments you can plan for</li>
                      <li>• No hidden fees or surprise charges</li>
                      <li>• Early repayment without penalties</li>
                      <li>• Sharia-compliant ethical financing</li>
                    </ul>
                  </CardContent>
                </Card>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                  onClick={() => window.location.href = '/borrower/apply/personal-info'}
                >
                  Apply for This Loan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Comparison Table */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Interest-Free vs Traditional Loan Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left p-4 font-semibold">Loan Type</th>
                        <th className="text-right p-4 font-semibold">Monthly Payment</th>
                        <th className="text-right p-4 font-semibold">Total Interest</th>
                        <th className="text-right p-4 font-semibold">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b bg-green-50">
                        <td className="p-4 font-medium">
                          PropertyLoans (0% Interest)
                        </td>
                        <td className="text-right p-4 font-bold text-green-600">
                          ${calculateMonthlyPayment()}
                        </td>
                        <td className="text-right p-4 font-bold text-green-600">
                          $0
                        </td>
                        <td className="text-right p-4 font-bold text-green-600">
                          ${loanAmount.toLocaleString()}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 text-slate-600">
                          Traditional Bank (5% APR)
                        </td>
                        <td className="text-right p-4 text-slate-600">
                          ${((loanAmount * (0.05/12) * Math.pow(1 + 0.05/12, loanTerm)) / (Math.pow(1 + 0.05/12, loanTerm) - 1)).toFixed(2)}
                        </td>
                        <td className="text-right p-4 text-red-600">
                          ${(((loanAmount * (0.05/12) * Math.pow(1 + 0.05/12, loanTerm)) / (Math.pow(1 + 0.05/12, loanTerm) - 1)) * loanTerm - loanAmount).toFixed(0)}
                        </td>
                        <td className="text-right p-4 text-slate-600">
                          ${(((loanAmount * (0.05/12) * Math.pow(1 + 0.05/12, loanTerm)) / (Math.pow(1 + 0.05/12, loanTerm) - 1)) * loanTerm).toFixed(0)}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 text-slate-600">
                          Traditional Bank (7% APR)
                        </td>
                        <td className="text-right p-4 text-slate-600">
                          ${((loanAmount * (0.07/12) * Math.pow(1 + 0.07/12, loanTerm)) / (Math.pow(1 + 0.07/12, loanTerm) - 1)).toFixed(2)}
                        </td>
                        <td className="text-right p-4 text-red-600">
                          ${(((loanAmount * (0.07/12) * Math.pow(1 + 0.07/12, loanTerm)) / (Math.pow(1 + 0.07/12, loanTerm) - 1)) * loanTerm - loanAmount).toFixed(0)}
                        </td>
                        <td className="text-right p-4 text-slate-600">
                          ${(((loanAmount * (0.07/12) * Math.pow(1 + 0.07/12, loanTerm)) / (Math.pow(1 + 0.07/12, loanTerm) - 1)) * loanTerm).toFixed(0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
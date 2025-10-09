"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, Briefcase, TrendingUp, Calendar, ArrowRight, ArrowLeft } from "lucide-react"

export default function ApplyStep3() {
  const [formData, setFormData] = useState({
    amount: "",
    term: "",
    employment_status: "",
    annual_income: "",
    credit_score: ""
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("loanApplication")
    if (saved) {
      const data = JSON.parse(saved)
      setFormData({
        amount: data.amount || "",
        term: data.term || "",
        employment_status: data.employment_status || "",
        annual_income: data.annual_income || "",
        credit_score: data.credit_score || ""
      })
    }
  }, [])

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const calculateMonthlyPayment = () => {
    if (formData.amount && formData.term) {
      return (parseFloat(formData.amount) / parseInt(formData.term)).toFixed(2)
    }
    return "0.00"
  }

  const handleNext = () => {
    setError("")

    if (!formData.amount || !formData.term) {
      setError("Please enter loan amount and term")
      return
    }

    if (parseFloat(formData.amount) < 1000) {
      setError("Minimum loan amount is $1,000")
      return
    }

    const saved = localStorage.getItem("loanApplication")
    const existingData = saved ? JSON.parse(saved) : {}
    localStorage.setItem("loanApplication", JSON.stringify({
      ...existingData,
      ...formData,
      currentStep: 3
    }))

    window.location.href = "/borrower/apply/documents"
  }

  const handleBack = () => {
    const saved = localStorage.getItem("loanApplication")
    const existingData = saved ? JSON.parse(saved) : {}
    localStorage.setItem("loanApplication", JSON.stringify({
      ...existingData,
      ...formData
    }))
    window.location.href = "/borrower/apply/property-details"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Apply for a Loan</h1>
          <p className="text-slate-600">Step 3 of 5: Financial Information</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 3 of 5</span>
            <span className="text-sm text-slate-600">60% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: "60%" }}></div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
            <p className="text-sm text-slate-600">Tell us about your finances</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Loan Amount Requested *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="50000"
                min="1000"
              />
              <p className="text-xs text-slate-500 mt-1">Minimum: $1,000</p>
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Repayment Term *
              </label>
              <select
                name="term"
                value={formData.term}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select term</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
                <option value="48">48 months</option>
                <option value="60">60 months</option>
              </select>
            </div>

            {/* Monthly Payment Preview */}
            {formData.amount && formData.term && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Estimated Monthly Payment</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${calculateMonthlyPayment()}
                </p>
                <p className="text-xs text-blue-800 mt-2">
                  Interest-free • Total repayment: ${parseFloat(formData.amount).toLocaleString()}
                </p>
              </div>
            )}

            {/* Employment Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Employment Status
              </label>
              <select
                name="employment_status"
                value={formData.employment_status}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select status</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="retired">Retired</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Annual Income */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Annual Income
              </label>
              <input
                type="number"
                name="annual_income"
                value={formData.annual_income}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="75000"
              />
            </div>

            {/* Credit Score */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Credit Score (Optional)
              </label>
              <input
                type="number"
                name="credit_score"
                value={formData.credit_score}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="700"
                min="300"
                max="850"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
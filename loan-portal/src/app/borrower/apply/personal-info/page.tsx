"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, ArrowRight, Building, Briefcase, Home } from "lucide-react"

interface LoanOption {
  value: string
  label: string
}

export default function ApplyStep1() {
  const [formData, setFormData] = useState({
    loan_type: "murabaha",
    purpose: "",
    home_address: "",
    buying_stage: ""
  })
  const loanTypes: LoanOption[] = [
    { value: "murabaha", label: "Murabaha (Cost-Plus Financing)" },
    { value: "musharaka", label: "Musharakah (Partnership)" },
    { value: "no_preference", label: "No Preference" },
  ]
  const purposes: LoanOption[] = [
    { value: "home_purchase", label: "Home Purchase" },
    { value: "refinance", label: "Refinance" },
    { value: "investment_home", label: "Investment Home" },
  ]
  const buyingStages: LoanOption[] = [
    { value: "just_exploring", label: "Just exploring my options" },
    { value: "researching", label: "Researching and comparing lenders" },
    { value: "found_home", label: "I found a home I want to buy" },
    { value: "under_contract", label: "I'm under contract" },
    { value: "refinancing", label: "I'm looking to refinance my current home" },
  ]
  const [error, setError] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("loanApplication")
    if (saved) {
      const data = JSON.parse(saved)
      setFormData({
        loan_type: data.loan_type || "murabaha",
        purpose: data.purpose || "",
        home_address: data.home_address || "",
        buying_stage: data.buying_stage || ""
      })
    }
  }, [])

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleNext = () => {
    setError("")

    if (!formData.loan_type || !formData.purpose || !formData.buying_stage) {
      setError("Please fill in all required fields")
      return
    }

    const saved = localStorage.getItem("loanApplication")
    const existingData = saved ? JSON.parse(saved) : {}
    localStorage.setItem("loanApplication", JSON.stringify({
      ...existingData,
      ...formData,
      currentStep: 1
    }))

    window.location.href = "/borrower/apply/propertly-details"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Apply for Financing</h1>
          <p className="text-slate-600">Step 1 of 5: Personal Information</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 1 of 5</span>
            <span className="text-sm text-slate-600">20% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: "20%" }}></div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Financing Application</CardTitle>
            <p className="text-sm text-slate-600">Tell us about the financing you need</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Financing Type */}
            <div>
              <label className="flex text-sm font-medium text-slate-700 mb-2 items-center gap-2">
                <Building className="h-4 w-4" />
                Financing Type *
              </label>
              <select
                name="loan_type"
                value={formData.loan_type}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {loanTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Choose the Islamic financing structure for your application
              </p>
            </div>

            {/* Financing Purpose */}
            <div>
              <label className="flex text-sm font-medium text-slate-700 mb-2 items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Financing Purpose *
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select a purpose</option>
                {purposes.map(purpose => (
                  <option key={purpose.value} value={purpose.value}>{purpose.label}</option>
                ))}
              </select>
            </div>

            {/* Where in Buying Process */}
            <div>
              <label className="flex text-sm font-medium text-slate-700 mb-2 items-center gap-2">
                <Home className="h-4 w-4" />
                Where are you in the home buying process? *
              </label>
              <select
                name="buying_stage"
                value={formData.buying_stage}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select your stage</option>
                {buyingStages.map(stage => (
                  <option key={stage.value} value={stage.value}>{stage.label}</option>
                ))}
              </select>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
            </div>

            {/* Home Address */}
            <div>
              <label className="flex text-sm font-medium text-slate-700 mb-2 items-center gap-2">
                <MapPin className="h-4 w-4" />
                Home Address *
              </label>
              <textarea
                name="home_address"
                value={formData.home_address}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => window.location.href = "/"}
                className="flex-1"
              >
                Cancel
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

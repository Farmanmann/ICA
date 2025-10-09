"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Home, DollarSign, ArrowRight, ArrowLeft } from "lucide-react"

export default function ApplyStep2() {
  const [formData, setFormData] = useState({
    property_address: "",
    property_value: "",
    purpose: ""
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("loanApplication")
    if (saved) {
      const data = JSON.parse(saved)
      setFormData({
        property_address: data.property_address || "",
        property_value: data.property_value || "",
        purpose: data.purpose || ""
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

    if (!formData.property_address) {
      setError("Please enter the property address")
      return
    }

    const saved = localStorage.getItem("loanApplication")
    const existingData = saved ? JSON.parse(saved) : {}
    localStorage.setItem("loanApplication", JSON.stringify({
      ...existingData,
      ...formData,
      currentStep: 2
    }))

    window.location.href = "/borrower/apply/financial-info"
  }

  const handleBack = () => {
    const saved = localStorage.getItem("loanApplication")
    const existingData = saved ? JSON.parse(saved) : {}
    localStorage.setItem("loanApplication", JSON.stringify({
      ...existingData,
      ...formData
    }))
    window.location.href = "/borrower/apply/personal-info"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Apply for a Loan</h1>
          <p className="text-slate-600">Step 2 of 5: Property Details</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 2 of 5</span>
            <span className="text-sm text-slate-600">40% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: "40%" }}></div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
            <p className="text-sm text-slate-600">Tell us about the property</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Home className="h-4 w-4" />
                Property Address *
              </label>
              <textarea
                name="property_address"
                value={formData.property_address}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="456 Property Ave, City, State, ZIP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Estimated Property Value
              </label>
              <input
                type="number"
                name="property_value"
                value={formData.property_value}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="150000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Loan Purpose
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select purpose</option>
                <option value="purchase">Property Purchase</option>
                <option value="renovation">Renovation</option>
                <option value="refinance">Refinance</option>
                <option value="other">Other</option>
              </select>
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
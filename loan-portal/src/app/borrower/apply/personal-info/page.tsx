"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Phone, MapPin, ArrowRight } from "lucide-react"

export default function ApplyStep1() {
  const [formData, setFormData] = useState({
    borrower_name: "",
    email: "",
    phone: "",
    address: ""
  })
  const [error, setError] = useState("")

  useEffect(() => {
    // Load saved data from localStorage
    const saved = localStorage.getItem("loanApplication")
    if (saved) {
      const data = JSON.parse(saved)
      setFormData({
        borrower_name: data.borrower_name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || ""
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

    // Validation
    if (!formData.borrower_name || !formData.email || !formData.phone) {
      setError("Please fill in all required fields")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    // Save to localStorage
    const saved = localStorage.getItem("loanApplication")
    const existingData = saved ? JSON.parse(saved) : {}
    localStorage.setItem("loanApplication", JSON.stringify({
      ...existingData,
      ...formData,
      currentStep: 1
    }))

    // Navigate to next step
    window.location.href = "/borrower/apply/property-details"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Apply for a Loan</h1>
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
            <CardTitle>Personal Information</CardTitle>
            <p className="text-sm text-slate-600">Tell us about yourself</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </label>
              <input
                type="text"
                name="borrower_name"
                value={formData.borrower_name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Current Address
              </label>
              <textarea
                name="address"
                value={formData.address}
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
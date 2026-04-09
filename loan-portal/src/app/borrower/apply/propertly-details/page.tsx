"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Home, DollarSign, ArrowRight, ArrowLeft, Percent, Users } from "lucide-react"

export default function ApplyStep2() {
  const [formData, setFormData] = useState({
    property_address: "",
    property_value: "",
    property_type: "",
    occupancy_type: "",
    down_payment_percent: "",
    first_time_buyer: "",
    has_co_borrower: ""
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("loanApplication")
    if (saved) {
      const data = JSON.parse(saved)
      setFormData({
        property_address: data.property_address || "",
        property_value: data.property_value || "",
        property_type: data.property_type || "",
        occupancy_type: data.occupancy_type || "",
        down_payment_percent: data.down_payment_percent || "",
        first_time_buyer: data.first_time_buyer || "",
        has_co_borrower: data.has_co_borrower || ""
      })
    }
  }, [])

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNext = () => {
    setError("")
    if (!formData.property_address) {
      setError("Please enter the property address")
      return
    }
    if (!formData.property_type) {
      setError("Please select a property type")
      return
    }
    if (!formData.occupancy_type) {
      setError("Please select how you will use this property")
      return
    }
    if (!formData.first_time_buyer) {
      setError("Please indicate if this is your first home purchase")
      return
    }
    if (!formData.has_co_borrower) {
      setError("Please indicate if you will have a co-borrower")
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
    localStorage.setItem("loanApplication", JSON.stringify({ ...existingData, ...formData }))
    window.location.href = "/borrower/apply/personal-info"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Apply for Financing</h1>
          <p className="text-slate-600">Step 2 of 5: Property Details</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 2 of 5</span>
            <span className="text-sm text-slate-600">40% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: "40%" }} />
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
            <p className="text-sm text-slate-600">Tell us about the home you want to finance</p>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Property Address */}
            <div>
              <label className="flex text-sm font-medium text-slate-700 mb-2 items-center gap-2">
                <Home className="h-4 w-4" />
                Property Address *
              </label>
              <textarea
                name="property_address"
                value={formData.property_address}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="456 Oak Street, City, State, ZIP"
              />
              <p className="text-xs text-slate-500 mt-1">Enter the address of the property you wish to finance. If not yet identified, enter your target city/area.</p>
            </div>

            {/* Estimated Home Value */}
            <div>
              <label className="flex text-sm font-medium text-slate-700 mb-2 items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Estimated Home Value
              </label>
              <input
                type="number"
                name="property_value"
                value={formData.property_value}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="350000"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="flex text-sm font-medium text-slate-700 mb-2 items-center gap-2">
                <Home className="h-4 w-4" />
                Property Type *
              </label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select property type</option>
                <option value="single_family">Single Family Home</option>
                <option value="townhome">Townhome</option>
                <option value="condominium">Condominium</option>
                <option value="multi_family">Multi-Family Home (2–4 units)</option>
              </select>
            </div>

            {/* Occupancy Type */}
            <div>
              <label className="flex text-sm font-medium text-slate-700 mb-2 items-center gap-2">
                <Home className="h-4 w-4" />
                How will you use this property? *
              </label>
              <select
                name="occupancy_type"
                value={formData.occupancy_type}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select occupancy type</option>
                <option value="primary">Primary Residence</option>
                <option value="secondary">Secondary / Vacation Home</option>
                <option value="investment">Investment Property</option>
              </select>
            </div>

            {/* Down Payment */}
            <div>
              <label className="flex text-sm font-medium text-slate-700 mb-2 items-center gap-2">
                <Percent className="h-4 w-4" />
                Down Payment Percentage
              </label>
              <input
                type="number"
                name="down_payment_percent"
                value={formData.down_payment_percent}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="20"
                min="0"
                max="100"
              />
              <p className="text-xs text-slate-500 mt-1">Enter the percentage you plan to put down (e.g. 20 for 20%)</p>
            </div>

            <div className="border-t pt-6 space-y-5">
              {/* First Time Buyer */}
              <div>
                <label className="flex text-sm font-medium text-slate-700 mb-3 items-center gap-2">
                  <Home className="h-4 w-4" />
                  Is this your first time buying a home? *
                </label>
                <div className="flex gap-3">
                  {["yes", "no"].map((val) => (
                    <label
                      key={val}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.first_time_buyer === val
                          ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="first_time_buyer"
                        value={val}
                        checked={formData.first_time_buyer === val}
                        onChange={handleChange}
                        className="hidden"
                      />
                      {val === "yes" ? "Yes, first time" : "No, I've owned before"}
                    </label>
                  ))}
                </div>
              </div>

              {/* Co-Borrower */}
              <div>
                <label className="flex text-sm font-medium text-slate-700 mb-3 items-center gap-2">
                  <Users className="h-4 w-4" />
                  Will you have a co-borrower? *
                </label>
                <div className="flex gap-3">
                  {["yes", "no"].map((val) => (
                    <label
                      key={val}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.has_co_borrower === val
                          ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="has_co_borrower"
                        value={val}
                        checked={formData.has_co_borrower === val}
                        onChange={handleChange}
                        className="hidden"
                      />
                      {val === "yes" ? "Yes" : "No"}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">A co-borrower shares responsibility for the financing with you</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700">
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

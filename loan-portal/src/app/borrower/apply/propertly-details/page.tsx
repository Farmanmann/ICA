"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Home, DollarSign, ArrowRight, ArrowLeft, Car } from "lucide-react"

export default function ApplyStep2() {
  const [formData, setFormData] = useState({
    purpose: "",
    property_address: "",
    property_value: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_value: ""
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("loanApplication")
    if (saved) {
      const data = JSON.parse(saved)
      setFormData({
        purpose: data.purpose || "",
        property_address: data.property_address || "",
        property_value: data.property_value || "",
        vehicle_make: data.vehicle_make || "",
        vehicle_model: data.vehicle_model || "",
        vehicle_year: data.vehicle_year || "",
        vehicle_value: data.vehicle_value || ""
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

    // Validate based on purpose
    if (formData.purpose === "property" || formData.purpose === "renovation") {
      if (!formData.property_address) {
        setError("Please enter the property address")
        return
      }
    } else if (formData.purpose === "car") {
      if (!formData.vehicle_make || !formData.vehicle_model || !formData.vehicle_year) {
        setError("Please fill in all vehicle details")
        return
      }
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Apply for Financing</h1>
          <p className="text-slate-600">Step 2 of 5: Asset Details</p>
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
            <CardTitle>
              {formData.purpose === "car" ? "Vehicle Information" : "Property Information"}
            </CardTitle>
            <p className="text-sm text-slate-600">
              {formData.purpose === "car"
                ? "Tell us about the vehicle you want to finance"
                : "Tell us about the home"}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Property Fields - Show for property, renovation */}
            {(formData.purpose === "property" || formData.purpose === "renovation") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Home Address *
                  </label>
                  <textarea
                    name="property_address"
                    value={formData.property_address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="456 Home Ave, City, State, ZIP"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Estimated Home Value
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
              </>
            )}

            {/* Vehicle Fields - Show for car */}
            {formData.purpose === "car" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Vehicle Make *
                  </label>
                  <input
                    type="text"
                    name="vehicle_make"
                    value={formData.vehicle_make}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., Toyota, Honda, Ford"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Vehicle Model *
                  </label>
                  <input
                    type="text"
                    name="vehicle_model"
                    value={formData.vehicle_model}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., Camry, Accord, F-150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Vehicle Year *
                  </label>
                  <input
                    type="number"
                    name="vehicle_year"
                    value={formData.vehicle_year}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="2024"
                    min="1900"
                    max="2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Estimated Vehicle Value
                  </label>
                  <input
                    type="number"
                    name="vehicle_value"
                    value={formData.vehicle_value}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="25000"
                  />
                </div>
              </>
            )}

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
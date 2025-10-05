"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Lock, Phone, Eye, EyeOff, Building, CheckCircle } from "lucide-react"

export default function LenderSignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    password: "",
    confirmPassword: "",
    lenderType: "individual"
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions")
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      // In real app, create lender account via backend
      window.location.href = "/lender/dashboard"
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Lender Account</h1>
            <p className="text-slate-600">Join our community of ethical lenders</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign Up as Lender</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {/* Lender Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Lender Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, lenderType: "individual" })}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                        formData.lenderType === "individual"
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, lenderType: "organization" })}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                        formData.lenderType === "organization"
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      Organization
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Organization (conditional) */}
                {formData.lenderType === "organization" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Organization Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Company Name LLC"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Create a password (min. 8 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 mb-2">Password must contain:</p>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className={`h-4 w-4 ${formData.password.length >= 8 ? 'text-green-600' : 'text-slate-300'}`} />
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className={`h-4 w-4 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-slate-300'}`} />
                      One uppercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className={`h-4 w-4 ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-slate-300'}`} />
                      One number
                    </li>
                  </ul>
                </div>

                {/* Lender Benefits Info */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">As a Lender, you'll be able to:</p>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• Browse and bid on loan applications</li>
                    <li>• Support ethical, interest-free financing</li>
                    <li>• Help families achieve property ownership</li>
                    <li>• Earn social impact through Sharia-compliant lending</li>
                  </ul>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1"
                  />
                  <label className="text-sm text-slate-600">
                    I agree to the{" "}
                    <a href="/terms" className="text-blue-600 hover:underline">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Sign Up Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
                >
                  {loading ? "Creating Account..." : "Create Lender Account"}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Already have an account?</span>
                  </div>
                </div>

                {/* Login Link */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = '/auth/login'}
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 mb-2">Looking to borrow instead?</p>
            <a href="/auth/signup-borrower" className="text-blue-600 hover:underline text-sm font-medium">
              Create a Borrower Account
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
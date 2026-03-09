"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Lock, Phone, Eye, EyeOff, Building, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function LenderSignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    password: "",

    confirmPassword: "",
    lenderType: "organization"
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

    if (!formData.organization) {
      setError("Please enter your organization name")
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

    try {
      // Import Supabase client
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      // Sign up with Supabase
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            role: 'lender',
            lender_type: formData.lenderType,
            organization: formData.organization,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      // Redirect to check-email page
      window.location.href = `/auth/check-email?email=${encodeURIComponent(formData.email)}`
    } catch (err: any) {
      console.error('Registration error:', err)
      if (err.message) {
        setError(err.message)
      } else {
        setError("Registration failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Organization Lender Account</h1>
            <p className="text-slate-600">Join our community of ethical organizational lenders</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign Up as Organization Lender</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
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

                {/* Organization */}
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
                    <span className="px-2 bg-white text-slate-500"></span>
                  </div>
                </div>

                {/* Login Link */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = '/'}
                >
                  Homepage
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <a href="/">
              <Image
                src="/NoorFinancingLogo.png"
                alt="Noor Financing"
                width={200}
                height={120}
                className="h-28 md:h-32 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                priority
              />
            </a>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <a href="/privacy" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              Privacy Policy
            </a>
            <a href="/advertising-disclosure" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              Advertising Disclosure
            </a>
            <a href="/security-policy" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              Security Policy
            </a>
            <a href="/terms" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              Terms of Use
            </a>
            <a href="/licenses" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              Licenses & Legal Disclosures
            </a>
            <a href="/electronic-disclosure" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              Electronic Disclosure
            </a>
            <a href="/dnc" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              DNC
            </a>
            <a href="/sms-terms" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              SMS Terms & Conditions
            </a>
            <a href="/accessibility" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              Accessibility Statement
            </a>
          </div>

          {/* Legal Row */}
          <div className="max-w-6xl mx-auto mt-10 px-6">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">

              {/* Legal Text */}
              <p className="text-slate-400 text-xs leading-relaxed text-left md:max-w-4xl">
                Noor Financing LLC is a Marketing Lead Generator and is a Duly Licensed Mortgage Company, as required by law, with its main office located at 800 Bonaventure Way Suite 111, Sugar Land, TX 77479. NMLS Unique Identifier #2780355. Noor Financing is a marketplace; we do not fund, originate, or service loans. All credit decisions are made by independent third-party lenders. Noor Financing technology and processes are proprietary to Noor Financing LLC. © 2026 Noor Financing LLC. All Rights Reserved. This site is directed at, and made available to, persons in Texas only. 
              </p>

              {/* Equal Housing Logo */}
              <div className="flex-shrink-0">
                <Image
                  src="/EqualHousingWebLogo.png"
                  alt="Equal Housing Opportunity"
                  width={80}
                  height={80}
                  className="opacity-80"
                />
              </div>

            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
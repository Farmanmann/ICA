"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userType, setUserType] = useState<"borrower" | "lender" | "admin">("borrower")

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      // In real app, authenticate with backend
      // For now, redirect based on user type
      if (userType === "admin") {
        window.location.href = "/admin/dashboard"
      } else if (userType === "lender") {
        window.location.href = "/lender/dashboard"
      } else {
        window.location.href = "/borrower/dashboard"
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to access your account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* User Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  I am a:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType("borrower")}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                      userType === "borrower"
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    Borrower
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("lender")}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                      userType === "lender"
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    Lender
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("admin")}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                      userType === "admin"
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="space-y-4">
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
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-slate-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Don't have an account?</span>
                  </div>
                </div>

                {/* Sign Up Links */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = '/auth/signup-borrower'}
                  >
                    Sign up as Borrower
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = '/auth/signup-lender'}
                  >
                    Sign up as Lender
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Note */}
          <p className="text-center text-sm text-slate-500 mt-6">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
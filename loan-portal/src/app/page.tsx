"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Shield, TrendingUp, Users, CheckCircle, Menu, X, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">ICA-Loans</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="/products" className="text-slate-600 hover:text-blue-600 transition-colors">Products</a>
              <a href="/sharia" className="text-slate-600 hover:text-blue-600 transition-colors">Sharia Compliance</a>
              <a href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">About</a>
              <a href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors">Contact</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" onClick={() => window.location.href = '/auth/login'}>
                Login
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '/auth/signup-borrower'}>
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <a href="/how-it-works" className="block text-slate-600 hover:text-blue-600">How It Works</a>
              <a href="/products" className="block text-slate-600 hover:text-blue-600">Products</a>
              <a href="/sharia" className="block text-slate-600 hover:text-blue-600">Sharia Compliance</a>
              <a href="/about" className="block text-slate-600 hover:text-blue-600">About</a>
              <a href="/contact" className="block text-slate-600 hover:text-blue-600">Contact</a>
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="ghost" className="w-full" onClick={() => window.location.href = '/auth/login'}>
                  Login
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '/auth/signup-borrower'}>
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Interest-Free Property Loans
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Achieve your property dreams with Sharia-compliant, interest-free financing. 
                No banks, no interest, just transparent and ethical lending.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
                  onClick={() => window.location.href = '/borrower/apply/personal-info'}
                >
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8"
                  onClick={() => window.location.href = '/borrower/calculator'}
                >
                  Calculate Payment
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-slate-700">0% Interest</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-slate-700">Sharia Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-slate-700">Fast Approval</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-2xl flex items-center justify-center">
                <Home className="h-48 w-48 text-white opacity-20" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <p className="text-sm text-slate-600 mb-1">Average Loan Amount</p>
                <p className="text-3xl font-bold text-slate-900">$150,000</p>
              </div>
              <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <p className="text-sm text-slate-600 mb-1">Approval Rate</p>
                <p className="text-3xl font-bold text-green-600">95%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose PropertyLoans?</h2>
            <p className="text-xl text-slate-600">
              Experience ethical, transparent, and interest-free property financing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>0% Interest</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Completely interest-free loans. Pay back only what you borrow, nothing more.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Sharia Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Fully certified and compliant with Islamic financial principles and guidelines.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Fast Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Get approved in days, not weeks. Simple application process with quick decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle>Direct Lending</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Connect directly with lenders. No banks, no hidden fees, complete transparency.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Simple, transparent, and fast</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Apply Online</h3>
              <p className="text-slate-600">
                Complete our simple 5-step application form. Takes less than 10 minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Get Approved</h3>
              <p className="text-slate-600">
                Receive approval within 2-3 business days. We review every application carefully.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Receive Funds</h3>
              <p className="text-slate-600">
                Get your funds and start your property journey. Simple repayment terms.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.href = '/how-it-works'}
            >
              Learn More About Our Process
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied borrowers who chose ethical, interest-free financing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8"
              onClick={() => window.location.href = '/borrower/apply/personal-info'}
            >
              Apply for a Loan
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-blue-700 text-lg px-8"
              onClick={() => window.location.href = '/auth/signup-lender'}
            >
              Become a Lender
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Home className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">PropertyLoans</span>
              </div>
              <p className="text-slate-400">
                Interest-free, Sharia-compliant property financing for everyone.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="/about" className="block text-slate-400 hover:text-white">About Us</a>
                <a href="/how-it-works" className="block text-slate-400 hover:text-white">How It Works</a>
                <a href="/products" className="block text-slate-400 hover:text-white">Products</a>
                <a href="/sharia" className="block text-slate-400 hover:text-white">Sharia Compliance</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="/faq" className="block text-slate-400 hover:text-white">FAQ</a>
                <a href="/contact" className="block text-slate-400 hover:text-white">Contact Us</a>
                <a href="/terms" className="block text-slate-400 hover:text-white">Terms & Conditions</a>
                <a href="/privacy" className="block text-slate-400 hover:text-white">Privacy Policy</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Get Started</h4>
              <div className="space-y-2">
                <a href="/borrower/apply/personal-info" className="block text-slate-400 hover:text-white">Apply for Loan</a>
                <a href="/auth/signup-lender" className="block text-slate-400 hover:text-white">Become a Lender</a>
                <a href="/borrower/calculator" className="block text-slate-400 hover:text-white">Loan Calculator</a>
                <a href="/auth/login" className="block text-slate-400 hover:text-white">Login</a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>© 2025 PropertyLoans. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
"use client"

import { Home } from "lucide-react"

export default function Footer() {
  return (
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
              <a href="/about" className="block text-slate-400 hover:text-white transition-colors">
                About Us
              </a>
              <a href="/how-it-works" className="block text-slate-400 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="/products" className="block text-slate-400 hover:text-white transition-colors">
                Products
              </a>
              <a href="/sharia" className="block text-slate-400 hover:text-white transition-colors">
                Sharia Compliance
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              <a href="/faq" className="block text-slate-400 hover:text-white transition-colors">
                FAQ
              </a>
              <a href="/contact" className="block text-slate-400 hover:text-white transition-colors">
                Contact Us
              </a>
              <a href="/terms" className="block text-slate-400 hover:text-white transition-colors">
                Terms & Conditions
              </a>
              <a href="/privacy" className="block text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Get Started</h4>
            <div className="space-y-2">
              <a href="/borrower/apply/personal-info" className="block text-slate-400 hover:text-white transition-colors">
                Apply for Loan
              </a>
              <a href="/auth/signup-lender" className="block text-slate-400 hover:text-white transition-colors">
                Become a Lender
              </a>
              <a href="/borrower/calculator" className="block text-slate-400 hover:text-white transition-colors">
                Loan Calculator
              </a>
              <a href="/auth/login" className="block text-slate-400 hover:text-white transition-colors">
                Login
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>&copy; 2025 PropertyLoans. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
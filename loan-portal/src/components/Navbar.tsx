"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, Menu, X } from "lucide-react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">PropertyLoans</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="/products" className="text-slate-600 hover:text-blue-600 transition-colors">
              Products
            </a>
            <a href="/sharia" className="text-slate-600 hover:text-blue-600 transition-colors">
              Sharia Compliance
            </a>
            <a href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">
              About
            </a>
            <a href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors">
              Contact
            </a>
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
            <a href="/how-it-works" className="block text-slate-600 hover:text-blue-600">
              How It Works
            </a>
            <a href="/products" className="block text-slate-600 hover:text-blue-600">
              Products
            </a>
            <a href="/sharia" className="block text-slate-600 hover:text-blue-600">
              Sharia Compliance
            </a>
            <a href="/about" className="block text-slate-600 hover:text-blue-600">
              About
            </a>
            <a href="/contact" className="block text-slate-600 hover:text-blue-600">
              Contact
            </a>
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
  )
}
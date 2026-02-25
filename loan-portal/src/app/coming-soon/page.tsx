"use client"

import { useEffect, useState } from "react"
import { Home, Shield, TrendingUp, Sparkles } from "lucide-react"



export default function ComingSoon() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Expected launch date - update this as needed
  const launchDate = new Date(2026, 3, 1) // months are 0-based: 3 = April
  const formattedDate = "March 2026"
  //const formattedDate = launchDate.toLocaleDateString("en-US", { year: "numeric", month: "long" })

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/2 left-1/2 w-full h-full bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}  
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-2xl">
                <Home className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          {/* Brand name */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Noor Financing
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-blue-200 mb-4 font-light">
            Interest-Free Property Financing
          </p>

          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Sharia-compliant, ethical lending for your property dreams
          </p>

          {/* Coming soon badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-12">
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            <span className="text-white font-medium">Coming Soon</span>
          </div>

          {/* Launch date */}
          <div className="mb-16">
            <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Expected Launch</p>
            <p className="text-3xl md:text-4xl font-bold text-white">{formattedDate}</p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">0% Interest</h3>
              <p className="text-slate-400 text-sm">Completely interest-free financing</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Sharia Compliant</h3>
              <p className="text-slate-400 text-sm">Certified Islamic finance principles</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Fast & Transparent</h3>
              <p className="text-slate-400 text-sm">Quick approval, no hidden fees</p>
            </div>
          </div>

        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

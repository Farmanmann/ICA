"use client";

import { useEffect, useState } from "react";
import { Home, Shield, TrendingUp, Sparkles, User } from "lucide-react";
import Image from "next/image";

export default function ComingSoon() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Expected launch date - update this as needed
  const launchDate = new Date("2025-05-01");
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };
  const formattedDate = launchDate.toLocaleDateString("en-US", options);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {" "}
      {/* add pt-20 after hidden */}
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/2 left-1/2 w-full h-full bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 pb-32 md:pb-40">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Logo */}

          <div className="pt-20 mb-16 flex justify-center">
            <div className="relative flex items-center justify-center">
              {/* Glow (scaled down) */}
              <div className="absolute w-[350px] h-[350px] bg-blue-500 blur-[100px] opacity-20 rounded-full"></div>

              <Image
                src="/NoorFinancingLogo.png"
                alt="Noor Financing"
                width={800}
                height={400}
                className="relative z-10 w-[200px] md:w-[275px] lg:w-[325px] h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-blue-200 mb-4 font-light">
            Interest-Free Financing Marketplace
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
          <div className="mb-12">
            <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">
              Expected Launch
            </p>
            <p className="text-3xl md:text-4xl font-bold text-white">
              {formattedDate}
            </p>
          </div>
          {/* Waitlist CTAs */}
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
              <a
                href="/auth/signup-borrower"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-500 hover:to-green-400 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <User className="h-5 w-5" />
                <span>Join the waitlist</span>
              </a>
              <a
                href="/auth/signup-lender"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Sign Up As A Lender</span>
              </a>
            </div>
            <p className="text-slate-400 text-sm text-center">
              Be among the first to access ethical, interest-free property
              financing
            </p>
          </div>
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">0% Interest</h3>
              <p className="text-slate-400 text-sm">
                Completely interest-free financing
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Sharia Compliant
              </h3>
              <p className="text-slate-400 text-sm">
                Certified Islamic finance principles
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Fast & Transparent
              </h3>
              <p className="text-slate-400 text-sm">
                Quick approval, no hidden fees
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      
      <footer className="relative z-10 bg-slate-900/50 backdrop-blur-sm border-t border-white/10 py-12">
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
            <a
              href="/privacy"
              className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/advertising-disclosure"
              className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors"
            >
              Advertising Disclosure
            </a>
            <a
              href="/security-policy"
              className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors"
            >
              Security Policy
            </a>
            <a
              href="/terms"
              className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors"
            >
              Terms of Use
            </a>
            <a
              href="/licenses"
              className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors"
            >
              Licenses & Legal Disclosures
            </a>
            <a
              href="/electronic-disclosure"
              className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors"
            >
              Electronic Disclosure
            </a>
            <a
              href="/dnc"
              className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors"
            >
              DNC
            </a>
            <a
              href="/sms-terms"
              className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors"
            >
              SMS Terms & Conditions
            </a>
            <a
              href="/accessibility"
              className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors"
            >
              Accessibility Statement
            </a>
          </div>

          {/* Legal Text */}
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
  );
}

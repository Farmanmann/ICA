"use client";

import { useEffect, useState } from "react";
import { Shield, TrendingUp, Sparkles, User, X, Mail, Lock, Phone, Eye, EyeOff, Building, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function ComingSoon() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);

  // Lender drawer state
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Lender signup form
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t1 = setTimeout(() => setStep(1), 80);
    const t2 = setTimeout(() => setStep(2), 350);
    const t3 = setTimeout(() => setStep(3), 620);
    const t4 = setTimeout(() => setStep(4), 900);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const openDrawer = () => {
    setShowDrawer(true);
    setFormSuccess(false);
    setFormError("");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setDrawerVisible(true))
    );
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setTimeout(() => {
      setShowDrawer(false);
      setFormData({ fullName: "", email: "", phone: "", organization: "", password: "", confirmPassword: "" });
      setAgreedToTerms(false);
      setFormError("");
      setFormSuccess(false);
    }, 400);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLenderSignup = async () => {
    setFormError("");
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setFormError("Please fill in all required fields.");
      return;
    }
    if (!formData.organization) {
      setFormError("Please enter your organization name.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (!agreedToTerms) {
      setFormError("Please agree to the Terms & Conditions.");
      return;
    }
    setFormLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            role: "lender",
            lender_type: "organization",
            organization: formData.organization,
          },
        },
      });
      if (signUpError) throw signUpError;
      if (signUpData.user?.identities?.length === 0) {
        setFormError("An account with this email already exists. Please log in instead.");
        return;
      }
      setFormSuccess(true);
    } catch (err: any) {
      setFormError(err.message || "Registration failed. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const formattedDate = "May 2026";

  const fadeUp = (active: boolean) =>
    `transition-all duration-700 ease-out ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-1/2 left-1/2 w-full h-full bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 pb-32 md:pb-40">
        <div className="max-w-4xl mx-auto text-center">

          {/* Logo */}
          <div className={`pt-20 mb-16 flex justify-center ${fadeUp(step >= 1)}`}>
            <div className="relative flex items-center justify-center">
              <div className="absolute w-[350px] h-[350px] bg-blue-500 blur-[100px] opacity-20 rounded-full" />
              <Image
                src="/nflogowhite.png"
                alt="Noor Financing"
                width={800}
                height={400}
                className="relative z-10 w-[200px] md:w-[275px] lg:w-[325px] h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Tagline */}
          <div className={fadeUp(step >= 2)}>
            <p className="text-2xl md:text-3xl text-blue-200 mb-4 font-light">
              Interest-Free Financing Marketplace
            </p>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Sharia-compliant, ethical financing for your home dreams
            </p>
          </div>

          {/* Launch badge */}
          <div className={`mb-8 ${fadeUp(step >= 2)}`}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
              <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
              <span className="text-white font-medium">Launching May 2026</span>
            </div>
          </div>

          {/* Expected launch date */}
          <div className={`mb-12 ${fadeUp(step >= 3)}`}>
            <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Expected Launch</p>
            <p className="text-3xl md:text-4xl font-bold text-white">{formattedDate}</p>
          </div>

          {/* CTAs */}
          <div className={`mb-16 ${fadeUp(step >= 3)}`}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
              <a
                href="/auth/signup-borrower"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-green-500/30 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <User className="h-5 w-5" />
                <span>Join the Waitlist</span>
              </a>
              <button
                onClick={openDrawer}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-blue-500/30 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Sign Up As A Financier</span>
              </button>
            </div>
            <p className="text-slate-400 text-sm">
              Be among the first to access ethical, interest-free home financing
            </p>
          </div>

          {/* Feature cards */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto ${fadeUp(step >= 4)}`}>
            {[
              { icon: <Shield className="h-6 w-6 text-blue-400" />, bg: "bg-blue-500/20", title: "0% Interest", desc: "Completely interest-free financing" },
              { icon: <Sparkles className="h-6 w-6 text-green-400" />, bg: "bg-green-500/20", title: "Sharia Compliant", desc: "Certified Islamic finance principles" },
              { icon: <TrendingUp className="h-6 w-6 text-purple-400" />, bg: "bg-purple-500/20", title: "Fast & Transparent", desc: "Quick approval, no hidden fees" },
            ].map((card, i) => (
              <div
                key={card.title}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/25 hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  {card.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{card.title}</h3>
                <p className="text-slate-400 text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900/50 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <a href="/">
              <Image
                src="/nflogowhite.png"
                alt="Noor Financing"
                width={200}
                height={120}
                className="h-28 md:h-32 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                priority
              />
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {[
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/advertising-disclosure", label: "Advertising Disclosure" },
              { href: "/security-policy", label: "Security Policy" },
              { href: "/terms", label: "Terms of Use" },
              { href: "/licenses", label: "Licenses & Legal Disclosures" },
              { href: "/electronic-disclosure", label: "Electronic Disclosure" },
              { href: "/dnc", label: "DNC" },
              { href: "/sms-terms", label: "SMS Terms & Conditions" },
              { href: "/accessibility", label: "Accessibility Statement" },
            ].map((link) => (
              <a key={link.href} href={link.href} className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <div className="max-w-6xl mx-auto mt-10 px-6">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              <p className="text-slate-400 text-xs leading-relaxed text-left md:max-w-4xl">
                Noor Financing LLC is a Marketing Lead Generator and is a Duly Licensed Mortgage Company, as required by law, with its main office located at 800 Bonaventure Way Suite 111, Sugar Land, TX 77479. NMLS Unique Identifier #2780355. Noor Financing is a marketplace; we do not fund, originate, or service loans. All credit decisions are made by independent third-party financiers. Noor Financing technology and processes are proprietary to Noor Financing LLC. © 2026 Noor Financing LLC. All Rights Reserved. This site is directed at, and made available to, persons in Texas only.
              </p>
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

      {/* Lender Signup Drawer */}
      {showDrawer && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          style={{ transition: "background 0.4s ease", background: drawerVisible ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0)" }}
          onClick={closeDrawer}
        >
          <div
            className="h-full w-full max-w-md overflow-y-auto flex flex-col shadow-2xl"
            style={{
              background: "linear-gradient(160deg, #0f172a 0%, #0c1a3a 60%, #0f1e42 100%)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              transform: drawerVisible ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-white/10" style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)" }}>
              <div>
                <h2 className="text-lg font-bold text-white">Financier Registration</h2>
                <p className="text-xs text-blue-300 mt-0.5">Secure your spot for May 2026 launch</p>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 px-6 py-6">
              {formSuccess ? (
                /* Success State */
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-6 animate-bounce-once">
                    <CheckCircle className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">You're on the list!</h3>
                  <p className="text-slate-300 mb-2">We've sent a confirmation to</p>
                  <p className="text-blue-300 font-semibold mb-6">{formData.email}</p>
                  <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                    Check your inbox to verify your email. We'll reach out before our May 2026 launch with next steps.
                  </p>
                  <button
                    onClick={closeDrawer}
                    className="mt-8 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200 border border-white/20"
                  >
                    Close
                  </button>
                </div>
              ) : (
                /* Form */
                <div className="space-y-5">
                  {/* Benefits banner */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-2">
                    <p className="text-blue-200 text-sm font-semibold mb-2">As a Financier, you'll be able to:</p>
                    <ul className="space-y-1 text-sm text-blue-300/90">
                      <li>• Browse and send offers on financing applications</li>
                      <li>• Support ethical, interest-free home financing</li>
                      <li>• Earn impact through Sharia-compliant investing</li>
                    </ul>
                  </div>

                  {formError && (
                    <div className="bg-red-500/15 border border-red-500/30 rounded-xl p-3 text-sm text-red-300">
                      {formError}
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Organization */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Organization *</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                        placeholder="Company Name LLC"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-9 pr-10 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                        placeholder="Min. 8 characters"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-9 pr-10 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                        placeholder="Re-enter password"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password strength */}
                  <div className="rounded-xl p-3 space-y-1.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {[
                      { label: "At least 8 characters", check: formData.password.length >= 8 },
                      { label: "One uppercase letter", check: /[A-Z]/.test(formData.password) },
                      { label: "One number", check: /[0-9]/.test(formData.password) },
                    ].map((req) => (
                      <div key={req.label} className="flex items-center gap-2">
                        <CheckCircle className={`h-3.5 w-3.5 transition-colors duration-300 ${req.check ? "text-green-400" : "text-slate-600"}`} />
                        <span className={`text-xs transition-colors duration-300 ${req.check ? "text-green-300" : "text-slate-500"}`}>{req.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${agreedToTerms ? "bg-blue-500 border-blue-500" : "border-slate-600"}`}>
                        {agreedToTerms && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 leading-relaxed">
                      I agree to the{" "}
                      <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">Terms & Conditions</a>
                      {" "}and{" "}
                      <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>
                    </span>
                  </label>

                  {/* Submit */}
                  <button
                    onClick={handleLenderSignup}
                    disabled={formLoading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300 disabled:opacity-60 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: formLoading ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg, #3b82f6, #2563eb)" }}
                  >
                    {formLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Creating Account...
                      </span>
                    ) : "Create Financier Account"}
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors">Log in</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(30px, -50px) scale(1.1); }
          66%  { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

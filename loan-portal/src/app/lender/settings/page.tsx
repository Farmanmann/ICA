"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Phone, Lock, Building, DollarSign, Bell, CheckCircle, ShieldCheck, ShieldOff } from "lucide-react"

export default function LenderSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    lenderType: "individual"
  })

  const [preferences, setPreferences] = useState({
    minLoanAmount: "10000",
    maxLoanAmount: "500000",
    preferredTerms: ["12", "24", "36"],
    emailNotifications: true,
    smsNotifications: false,
    bidAlerts: true
  })

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  })

  const [mfaEnrolled, setMfaEnrolled] = useState(false)
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null)
  const [mfaStep, setMfaStep] = useState<"idle" | "enrolling" | "verifying">("idle")
  const [mfaQrCode, setMfaQrCode] = useState("")
  const [mfaSecret, setMfaSecret] = useState("")
  const [mfaEnrollFactorId, setMfaEnrollFactorId] = useState("")
  const [mfaCode, setMfaCode] = useState("")
  const [mfaLoading, setMfaLoading] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setProfileData({
            fullName: user.user_metadata?.full_name || user.user_metadata?.name || "",
            email: user.email || "",
            phone: user.user_metadata?.phone || "",
            organization: user.user_metadata?.organization || "",
            lenderType: user.user_metadata?.lender_type || "individual",
          })
          if (user.user_metadata?.lender_preferences) {
            setPreferences(prev => ({ ...prev, ...user.user_metadata.lender_preferences }))
          }

          const { data: factors } = await supabase.auth.mfa.listFactors()
          const totp = factors?.totp?.[0]
          if (totp && totp.status === "verified") {
            setMfaEnrolled(true)
            setMfaFactorId(totp.id)
          }
        }
      } catch (err) {
        console.error("Failed to load user:", err)
      } finally {
        setInitialLoading(false)
      }
    }
    loadUser()
  }, [])

  const handleProfileUpdate = async () => {
    setLoading(true)
    setError("")
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.fullName,
          phone: profileData.phone,
          organization: profileData.organization,
          lender_type: profileData.lenderType,
        }
      })
      if (updateError) throw updateError
      setSuccess("Profile updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to update profile.")
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesUpdate = async () => {
    setLoading(true)
    setError("")
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        data: { lender_preferences: preferences }
      })
      if (updateError) throw updateError
      setSuccess("Preferences updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to update preferences.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    setLoading(true)
    setError("")
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })
      if (updateError) throw updateError
      setSuccess("Password changed successfully!")
      setPasswordData({ newPassword: "", confirmPassword: "" })
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to change password.")
    } finally {
      setLoading(false)
    }
  }

  const handleMfaEnroll = async () => {
    setMfaLoading(true)
    setError("")
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        issuer: "Noor Financing",
      })
      if (enrollError) throw enrollError
      setMfaQrCode(data.totp.qr_code)
      setMfaSecret(data.totp.secret)
      setMfaEnrollFactorId(data.id)
      setMfaStep("verifying")
    } catch (err: any) {
      setError(err.message || "Failed to start MFA enrollment.")
    } finally {
      setMfaLoading(false)
    }
  }

  const handleMfaVerify = async () => {
    if (mfaCode.length !== 6) { setError("Enter the 6-digit code from your authenticator app"); return }
    setMfaLoading(true)
    setError("")
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: mfaEnrollFactorId })
      if (challengeError) throw challengeError
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: mfaEnrollFactorId,
        challengeId: challenge.id,
        code: mfaCode,
      })
      if (verifyError) throw verifyError
      setMfaEnrolled(true)
      setMfaFactorId(mfaEnrollFactorId)
      setMfaStep("idle")
      setMfaCode("")
      setMfaQrCode("")
      setMfaSecret("")
      setSuccess("Two-factor authentication enabled!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message?.includes("Invalid") ? "Invalid code. Try again." : (err.message || "Verification failed."))
      setMfaCode("")
    } finally {
      setMfaLoading(false)
    }
  }

  const handleMfaUnenroll = async () => {
    if (!mfaFactorId) return
    setMfaLoading(true)
    setError("")
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: mfaFactorId })
      if (unenrollError) throw unenrollError
      setMfaEnrolled(false)
      setMfaFactorId(null)
      setSuccess("Two-factor authentication disabled.")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to disable MFA.")
    } finally {
      setMfaLoading(false)
    }
  }

  const toggleTerm = (term: string) => {
    if (preferences.preferredTerms.includes(term)) {
      setPreferences({
        ...preferences,
        preferredTerms: preferences.preferredTerms.filter((t) => t !== term)
      })
    } else {
      setPreferences({
        ...preferences,
        preferredTerms: [...preferences.preferredTerms, term]
      })
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
              <p className="text-sm text-slate-600">Manage your financier account preferences</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/lender/dashboard'}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "profile"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "preferences"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Financing Preferences
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "security"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Security
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Lender Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Financier Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setProfileData({ ...profileData, lenderType: "individual" })}
                    className={`p-3 border-2 rounded-lg text-sm font-medium ${
                      profileData.lenderType === "individual"
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-slate-200"
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    onClick={() => setProfileData({ ...profileData, lenderType: "organization" })}
                    className={`p-3 border-2 rounded-lg text-sm font-medium ${
                      profileData.lenderType === "organization"
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-slate-200"
                    }`}
                  >
                    Organization
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Organization */}
              {profileData.lenderType === "organization" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Organization Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={profileData.organization}
                      onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={profileData.email}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed here. Contact support if needed.</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <Button
                onClick={handleProfileUpdate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financing Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Min/Max Loan Amount */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Minimum Financing Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="number"
                        value={preferences.minLoanAmount}
                        onChange={(e) => setPreferences({ ...preferences, minLoanAmount: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Maximum Financing Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="number"
                        value={preferences.maxLoanAmount}
                        onChange={(e) => setPreferences({ ...preferences, maxLoanAmount: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Terms */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Preferred Financing Terms
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {["12", "24", "36", "48", "60"].map((term) => (
                      <button
                        key={term}
                        onClick={() => toggleTerm(term)}
                        className={`p-3 border-2 rounded-lg text-sm font-medium ${
                          preferences.preferredTerms.includes(term)
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-slate-200"
                        }`}
                      >
                        {term} mo
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">Email Notifications</p>
                    <p className="text-sm text-slate-600">Receive updates via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">SMS Notifications</p>
                    <p className="text-sm text-slate-600">Receive text message alerts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.smsNotifications}
                    onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">New Financing Alerts</p>
                    <p className="text-sm text-slate-600">Get notified when new financing is available</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.bidAlerts}
                    onChange={(e) => setPreferences({ ...preferences, bidAlerts: e.target.checked })}
                    className="w-5 h-5"
                  />
                </label>
              </CardContent>
            </Card>

            <Button
              onClick={handlePreferencesUpdate}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <Button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Changing..." : "Change Password"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Two-Factor Authentication (2FA)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mfaEnrolled && mfaStep === "idle" && (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <ShieldCheck className="h-5 w-5 text-green-600 shrink-0" />
                      <div>
                        <p className="font-medium text-green-800">2FA is enabled</p>
                        <p className="text-sm text-green-700">Your account is protected with an authenticator app.</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleMfaUnenroll}
                      disabled={mfaLoading}
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <ShieldOff className="h-4 w-4 mr-2" />
                      {mfaLoading ? "Disabling..." : "Disable 2FA"}
                    </Button>
                  </>
                )}

                {!mfaEnrolled && mfaStep === "idle" && (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <ShieldOff className="h-5 w-5 text-slate-500 shrink-0" />
                      <div>
                        <p className="font-medium text-slate-800">2FA is not enabled</p>
                        <p className="text-sm text-slate-600">Add an extra layer of security using an authenticator app.</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleMfaEnroll}
                      disabled={mfaLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      {mfaLoading ? "Setting up..." : "Enable 2FA"}
                    </Button>
                  </>
                )}

                {mfaStep === "verifying" && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-700">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, or Apple Passwords), then enter the 6-digit code to confirm.
                    </p>
                    {mfaQrCode && (
                      <div className="flex justify-center">
                        <img src={mfaQrCode} alt="MFA QR Code" className="w-48 h-48 border rounded-lg" />
                      </div>
                    )}
                    <div className="p-3 bg-slate-50 rounded-lg text-center">
                      <p className="text-xs text-slate-500 mb-1">Can't scan? Enter this key manually:</p>
                      <p className="font-mono text-sm font-medium text-slate-800 break-all">{mfaSecret}</p>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => e.key === "Enter" && handleMfaVerify()}
                      className="w-full text-center text-2xl font-mono tracking-[0.5em] py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="000000"
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => { setMfaStep("idle"); setMfaCode(""); setMfaQrCode(""); setMfaSecret("") }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleMfaVerify}
                        disabled={mfaLoading || mfaCode.length !== 6}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        {mfaLoading ? "Verifying..." : "Confirm & Enable"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Phone, Lock, Bell, CheckCircle, ShieldCheck, ShieldOff } from "lucide-react"

export default function BorrowerSettings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // MFA state
  const [mfaEnrolled, setMfaEnrolled] = useState(false)
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null)
  const [mfaStep, setMfaStep] = useState<"idle" | "enrolling">("idle")
  const [mfaQrCode, setMfaQrCode] = useState("")
  const [mfaSecret, setMfaSecret] = useState("")
  const [mfaEnrollFactorId, setMfaEnrollFactorId] = useState("")
  const [mfaCode, setMfaCode] = useState("")
  const [mfaLoading, setMfaLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: ""
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    loanUpdates: true,
    paymentReminders: true,
    marketingEmails: false
  })

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  })

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
            address: user.user_metadata?.address || "",
          })
        }
        // Load MFA status
        const { data: factors } = await supabase.auth.mfa.listFactors()
        const totp = factors?.totp?.[0]
        if (totp) { setMfaEnrolled(true); setMfaFactorId(totp.id) }
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
          address: profileData.address,
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

  const handleNotificationsUpdate = async () => {
    setLoading(true)
    setError("")
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        data: { notification_preferences: notifications }
      })
      if (updateError) throw updateError
      setSuccess("Notification preferences updated!")
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
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: "totp", issuer: "Noor Financing" })
      if (enrollError) throw enrollError
      setMfaQrCode(data.totp.qr_code)
      setMfaSecret(data.totp.secret)
      setMfaEnrollFactorId(data.id)
      setMfaStep("enrolling")
    } catch (err: any) {
      setError(err.message || "Failed to start MFA setup.")
    } finally {
      setMfaLoading(false)
    }
  }

  const handleMfaVerify = async () => {
    if (mfaCode.length !== 6) { setError("Enter the 6-digit code"); return }
    setMfaLoading(true)
    setError("")
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId: mfaEnrollFactorId, code: mfaCode })
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
              <p className="text-sm text-slate-600">Manage your account preferences</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/borrower/dashboard'}>
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
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "notifications"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Notifications
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address
                </label>
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
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

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
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
                  checked={notifications.emailNotifications}
                  onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
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
                  checked={notifications.smsNotifications}
                  onChange={(e) => setNotifications({ ...notifications, smsNotifications: e.target.checked })}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">Loan Updates</p>
                  <p className="text-sm text-slate-600">Get notified about loan status changes</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.loanUpdates}
                  onChange={(e) => setNotifications({ ...notifications, loanUpdates: e.target.checked })}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">Payment Reminders</p>
                  <p className="text-sm text-slate-600">Reminders before payment due dates</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.paymentReminders}
                  onChange={(e) => setNotifications({ ...notifications, paymentReminders: e.target.checked })}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">Marketing Emails</p>
                  <p className="text-sm text-slate-600">Product updates and offers</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.marketingEmails}
                  onChange={(e) => setNotifications({ ...notifications, marketingEmails: e.target.checked })}
                  className="w-5 h-5"
                />
              </label>

              <Button
                onClick={handleNotificationsUpdate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <>
          <Card>
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

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-slate-700 mb-2">Password Requirements:</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains at least one uppercase letter</li>
                  <li>• Contains at least one number</li>
                </ul>
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

          {/* MFA Card */}
          <Card className="mt-6">
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
                      <p className="font-medium text-green-900">2FA is enabled</p>
                      <p className="text-sm text-green-700">Your account is protected with an authenticator app.</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleMfaUnenroll}
                    disabled={mfaLoading}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <ShieldOff className="h-4 w-4 mr-2" />
                    {mfaLoading ? "Disabling..." : "Disable Two-Factor Authentication"}
                  </Button>
                </>
              )}

              {!mfaEnrolled && mfaStep === "idle" && (
                <>
                  <p className="text-sm text-slate-600">
                    Add an extra layer of security. After enabling, you will need to enter a code from your authenticator app each time you log in.
                  </p>
                  <Button
                    onClick={handleMfaEnroll}
                    disabled={mfaLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    {mfaLoading ? "Setting up..." : "Enable Two-Factor Authentication"}
                  </Button>
                </>
              )}

              {mfaStep === "enrolling" && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-700 font-medium">Scan this QR code with your authenticator app</p>
                  {mfaQrCode && (
                    <div className="flex justify-center p-4 bg-white border rounded-lg">
                      <img src={mfaQrCode} alt="MFA QR Code" className="w-48 h-48" />
                    </div>
                  )}
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Can't scan? Enter this code manually:</p>
                    <p className="font-mono text-sm text-slate-800 break-all">{mfaSecret}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Enter the 6-digit code to confirm</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full text-center text-2xl font-mono tracking-widest py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="000000"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => { setMfaStep("idle"); setMfaCode(""); setMfaQrCode(""); setMfaSecret("") }}>Cancel</Button>
                    <Button onClick={handleMfaVerify} disabled={mfaLoading || mfaCode.length !== 6} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      {mfaLoading ? "Verifying..." : "Activate 2FA"}
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

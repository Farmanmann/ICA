"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Phone, Lock, Building, DollarSign, Bell, CheckCircle } from "lucide-react"

export default function LenderSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    organization: "ABC Investments LLC",
    lenderType: "organization"
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
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleProfileUpdate = () => {
    setLoading(true)
    setTimeout(() => {
      setSuccess("Profile updated successfully!")
      setLoading(false)
      setTimeout(() => setSuccess(""), 3000)
    }, 1000)
  }

  const handlePreferencesUpdate = () => {
    setLoading(true)
    setTimeout(() => {
      setSuccess("Preferences updated successfully!")
      setLoading(false)
      setTimeout(() => setSuccess(""), 3000)
    }, 1000)
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    setLoading(true)
    setTimeout(() => {
      setSuccess("Password changed successfully!")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setLoading(false)
      setTimeout(() => setSuccess(""), 3000)
    }, 1000)
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
              <p className="text-sm text-slate-600">Manage your lender account preferences</p>
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
            Lending Preferences
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
                  Lender Type
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
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
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
                <CardTitle>Lending Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Min/Max Loan Amount */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Minimum Loan Amount
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
                      Maximum Loan Amount
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
                    Preferred Loan Terms
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
                    <p className="font-medium text-slate-900">New Loan Alerts</p>
                    <p className="text-sm text-slate-600">Get notified when new loans are available</p>
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
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

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
        )}
      </main>
    </div>
  )
}
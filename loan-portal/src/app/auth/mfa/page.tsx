"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldCheck } from "lucide-react"

export default function MFAChallengePage() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [factorId, setFactorId] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      // Make sure user is actually in an aal1 session that needs upgrading
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (!aal || aal.currentLevel === "aal2") {
        // Already verified or no MFA needed — go to dashboard
        redirectToDashboard(supabase)
        return
      }

      const { data: factors } = await supabase.auth.mfa.listFactors()
      const totp = factors?.totp?.[0]
      if (!totp) {
        // No factor enrolled, send to login
        window.location.href = "/auth/login"
        return
      }
      setFactorId(totp.id)
    }
    init()
  }, [])

  const redirectToDashboard = async (supabase: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role
    if (role === "admin") window.location.href = "/admin/dashboard"
    else if (role === "lender") window.location.href = "/lender/dashboard"
    else window.location.href = "/borrower/dashboard"
  }

  const handleVerify = async () => {
    if (!factorId) return
    if (code.length !== 6) { setError("Enter the 6-digit code from your authenticator app"); return }
    setLoading(true)
    setError("")
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId })
      if (challengeError) throw challengeError
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code,
      })
      if (verifyError) throw verifyError
      await redirectToDashboard(supabase)
    } catch (err: any) {
      setError(err.message?.includes("Invalid") ? "Invalid code. Try again." : (err.message || "Verification failed."))
      setCode("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Two-Factor Verification</h1>
          <p className="text-slate-600 mt-2 text-sm">Enter the 6-digit code from your authenticator app</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Authenticator Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              className="w-full text-center text-3xl font-mono tracking-[0.5em] py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="000000"
              autoFocus
            />

            <Button
              onClick={handleVerify}
              disabled={loading || code.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 py-5"
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>

            <p className="text-xs text-center text-slate-500">
              Open Google Authenticator, Authy, or Apple Passwords and enter the current code for Noor Financing.
            </p>

            <div className="text-center pt-2">
              <button
                className="text-sm text-slate-500 hover:text-slate-700"
                onClick={async () => {
                  const { createClient } = await import("@/lib/supabase/client")
                  await createClient().auth.signOut()
                  window.location.href = "/auth/login"
                }}
              >
                Sign out and use a different account
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, ArrowRight, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function BidSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [verified, setVerified] = useState<boolean | null>(null)

  useEffect(() => {
    // Give the webhook a moment to process, then show confirmation
    const timer = setTimeout(() => setVerified(true), 1500)
    return () => clearTimeout(timer)
  }, [sessionId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            {verified === null ? (
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            )}
          </div>
          <CardTitle className="text-2xl text-slate-900">
            {verified === null ? "Processing payment..." : "Offer Submitted!"}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {verified === null
              ? "Please wait while we confirm your payment."
              : "Your $35 payment was received and your financing offer has been submitted to the borrower."}
          </CardDescription>
        </CardHeader>

        {verified && (
          <CardContent className="space-y-3 pt-4">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-sm text-emerald-800">
              <p className="font-semibold mb-1">What happens next?</p>
              <ul className="space-y-1 list-disc list-inside text-emerald-700">
                <li>The borrower has been notified of your offer</li>
                <li>They can accept, reject, or request changes</li>
                <li>You'll receive an email when they respond</li>
              </ul>
            </div>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => window.location.href = "/lender/bidding"}
            >
              Browse More Applications
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = "/lender/dashboard"}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

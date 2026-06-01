"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, ShieldCheck, FileText, User, Landmark } from "lucide-react"

export default function VerificationPage() {
  const [loan, setLoan] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { window.location.href = "/auth/login"; return }

        const { data } = await supabase
          .from("loans")
          .select("status, documents")
          .eq("borrower_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        setLoan(data)
      } catch {
        // no loan yet — show default state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const hasId = !!loan?.documents?.id_document
  const hasIncome = !!loan?.documents?.income_proof
  const hasBank = !!loan?.documents?.bank_statements
  const appStatus = loan?.status

  const steps = [
    {
      icon: User,
      title: "Identity Verification",
      description: "Government-issued photo ID",
      done: hasId,
      required: true,
    },
    {
      icon: FileText,
      title: "Income Verification",
      description: "Pay stubs, tax returns, or employment letter",
      done: hasIncome,
      required: false,
    },
    {
      icon: Landmark,
      title: "Bank Statement",
      description: "Last 3 months of bank statements",
      done: hasBank,
      required: false,
    },
    {
      icon: ShieldCheck,
      title: "Application Review",
      description: "Our team reviews your submitted application",
      done: appStatus === "Approved" || appStatus === "Funded",
      required: true,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Verification Status</h1>
            <p className="text-sm text-slate-600">Track your application verification progress</p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = "/borrower/dashboard"}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Overall status banner */}
        {appStatus && (
          <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${
            appStatus === "Approved" || appStatus === "Funded"
              ? "bg-green-50 border-green-200"
              : appStatus === "Pending"
              ? "bg-amber-50 border-amber-200"
              : "bg-slate-50 border-slate-200"
          }`}>
            {appStatus === "Approved" || appStatus === "Funded" ? (
              <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
            ) : (
              <Clock className="h-6 w-6 text-amber-500 shrink-0" />
            )}
            <div>
              <p className="font-semibold text-slate-900">
                Application Status: <span className="capitalize">{appStatus}</span>
              </p>
              <p className="text-sm text-slate-600">
                {appStatus === "Pending" && "Your application is under review. We'll notify you within 2–3 business days."}
                {(appStatus === "Approved" || appStatus === "Funded") && "Congratulations! Your application has been approved."}
                {appStatus === "Rejected" && "Your application was not approved. Please contact us for more information."}
              </p>
            </div>
          </div>
        )}

        {/* Verification steps */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={i}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    step.done ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    step.done ? "bg-green-100" : "bg-slate-100"
                  }`}>
                    {step.done
                      ? <CheckCircle className="h-5 w-5 text-green-600" />
                      : <Icon className="h-5 w-5 text-slate-400" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {step.title}
                      {step.required && <span className="text-red-500 ml-1 text-xs">*required</span>}
                    </p>
                    <p className="text-sm text-slate-600">{step.description}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                    step.done ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {step.done ? "Complete" : "Pending"}
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* If documents missing, nudge to upload */}
        {loan && !hasId && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-amber-900">Government ID required</p>
              <p className="text-sm text-amber-800 mb-3">
                Upload your government-issued ID to complete the minimum verification requirements.
              </p>
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700"
                onClick={() => window.location.href = "/borrower/apply/documents"}
              >
                Upload Documents
              </Button>
            </div>
          </div>
        )}

        {!loan && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <p className="text-blue-900 font-medium mb-3">No application found.</p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = "/borrower/apply/personal-info"}>
              Start Application
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

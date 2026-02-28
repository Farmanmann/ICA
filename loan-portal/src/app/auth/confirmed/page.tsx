"use client"

import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmailConfirmedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Email Confirmed!</CardTitle>
          <CardDescription>
            Your email has been successfully verified. Welcome to Noor Financial!
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            onClick={() => router.push('/')}
            className="w-full"
          >
            Go to Home Page
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, CheckCircle, DollarSign, Home, Users, Calendar, Shield, ArrowRight } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">How It Works</h1>
            <p className="text-xl text-slate-600">
              Get your interest-free property loan in three simple steps. 
              We've made the process transparent, fast, and completely Sharia-compliant.
            </p>
          </div>
        </section>

        {/* Main Process Steps */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-16">
              {/* Step 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      1
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Submit Your Application</h2>
                  </div>
                  <p className="text-lg text-slate-600 mb-6">
                    Fill out our simple 5-step online application form. We'll ask about your personal details, 
                    the property you're interested in, and your financial situation. The entire process takes 
                    less than 10 minutes.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-slate-900">Personal Information</p>
                        <p className="text-slate-600">Basic details about you and your contact information</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-slate-900">Property Details</p>
                        <p className="text-slate-600">Information about the property you want to finance</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-slate-900">Financial Information</p>
                        <p className="text-slate-600">Your income, employment, and credit details</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 flex items-center justify-center h-96">
                  <FileText className="h-48 w-48 text-blue-600 opacity-50" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8 flex items-center justify-center h-96 md:order-first">
                  <CheckCircle className="h-48 w-48 text-green-600 opacity-50" />
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      2
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Review & Approval</h2>
                  </div>
                  <p className="text-lg text-slate-600 mb-6">
                    Our team reviews your application within 2-3 business days. We carefully assess your 
                    eligibility and match you with suitable lenders. You'll receive a notification once 
                    your application is approved.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-slate-900">Fast Processing</p>
                        <p className="text-slate-600">Get a decision within 2-3 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-slate-900">Transparent Criteria</p>
                        <p className="text-slate-600">Clear requirements with no hidden surprises</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-slate-900">Sharia Compliance Check</p>
                        <p className="text-slate-600">Every loan is verified for Islamic compliance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      3
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Receive Funds & Repay</h2>
                  </div>
                  <p className="text-lg text-slate-600 mb-6">
                    Once approved, funds are disbursed directly to you or the property seller. You'll 
                    receive a clear repayment schedule with fixed monthly payments. No interest, no hidden 
                    fees, just simple and transparent terms.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-slate-900">Quick Disbursement</p>
                        <p className="text-slate-600">Receive funds within days of approval</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-slate-900">Fixed Payments</p>
                        <p className="text-slate-600">Same payment amount every month, no surprises</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-slate-900">Online Management</p>
                        <p className="text-slate-600">Track payments and loan status in your dashboard</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-8 flex items-center justify-center h-96">
                  <DollarSign className="h-48 w-48 text-purple-600 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">What Makes Us Different</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <Shield className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">100% Interest-Free</h3>
                  <p className="text-slate-600">
                    Pay back only what you borrow. No interest charges, ever. Completely Sharia-compliant financing.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Direct Lending</h3>
                  <p className="text-slate-600">
                    Connect directly with individual lenders. No banks involved, complete transparency in every transaction.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Calendar className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Flexible Terms</h3>
                  <p className="text-slate-600">
                    Choose repayment terms from 12 to 60 months. Find a payment schedule that works for your budget.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">Application Timeline</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Day 1: Application Submitted</h3>
                  <p className="text-slate-600">Complete your online application in under 10 minutes.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Day 1-3: Under Review</h3>
                  <p className="text-slate-600">Our team carefully reviews your application and verifies information.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Day 3: Approval Decision</h3>
                  <p className="text-slate-600">Receive notification of your approval status and loan terms.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Day 5-7: Funds Disbursed</h3>
                  <p className="text-slate-600">Sign final documents and receive your funds within days.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands who have chosen ethical, interest-free financing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-slate-100"
                onClick={() => window.location.href = '/borrower/apply/personal-info'}
              >
                Start Application
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-blue-700"
                onClick={() => window.location.href = '/borrower/calculator'}
              >
                Calculate Payment
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Book, Users, Award, FileCheck } from "lucide-react"

export default function ShariaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">Sharia Compliance & Certification</h1>
            <p className="text-xl text-slate-600">
              100% certified interest-free financing in accordance with Islamic principles
            </p>
          </div>
        </section>

        {/* What is Sharia Compliance */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">What is Sharia Compliance?</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Sharia compliance means adhering to Islamic law and principles in all financial transactions. 
                Our platform operates on ethical guidelines that prohibit interest (Riba) and promote fairness, 
                transparency, and social responsibility.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-2">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">No Interest (Riba)</h3>
                  <p className="text-slate-600">
                    Absolutely zero interest charged on any loans. Interest-based transactions are strictly prohibited in Islam.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-2">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileCheck className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Transparency</h3>
                  <p className="text-slate-600">
                    All terms, conditions, and fees are clearly disclosed. No hidden charges or deceptive practices.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-2">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Ethical Business</h3>
                  <p className="text-slate-600">
                    Fair dealings, risk-sharing, and socially responsible practices aligned with Islamic values.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Islamic Finance Models */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Financing Models</h2>
              <p className="text-lg text-slate-600">
                We use authentic Islamic financing structures approved by our Sharia Board
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardContent className="pt-8">
                  <Badge className="mb-4 bg-blue-600">Murabaha</Badge>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Cost-Plus Financing</h3>
                  <p className="text-slate-600 mb-4">
                    In Murabaha, we purchase the property and sell it to you at a pre-agreed markup. You repay 
                    the total amount in fixed installments with no interest charges.
                  </p>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Transparent pricing disclosed upfront</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Fixed monthly payments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Property ownership transfers to you</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <Badge className="mb-4 bg-purple-600">Ijara</Badge>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Lease-to-Own</h3>
                  <p className="text-slate-600 mb-4">
                    Ijara is a lease agreement where we own the property and lease it to you. Over time, you 
                    gradually acquire ownership through payments that combine rent and equity building.
                  </p>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Rent payments build equity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Gradual ownership transfer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Sharia-compliant structure</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Sharia Board */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Sharia Advisory Board</h2>
              <p className="text-lg text-slate-600">
                Distinguished Islamic scholars ensuring compliance with Sharia principles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Dr. Omar Khan</h3>
                  <p className="text-green-600 mb-3">Chairman</p>
                  <p className="text-sm text-slate-600">
                    PhD in Islamic Finance, 20+ years experience in Sharia advisory
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Sheikh Abdullah Rahman</h3>
                  <p className="text-blue-600 mb-3">Senior Scholar</p>
                  <p className="text-sm text-slate-600">
                    Islamic jurisprudence expert, certified Sharia auditor
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Dr. Fatima Hassan</h3>
                  <p className="text-purple-600 mb-3">Board Member</p>
                  <p className="text-sm text-slate-600">
                    Islamic banking specialist, professor of Islamic economics
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-green-50 border-2 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Book className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Board Responsibilities</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Review and approve all financial products and services</li>
                      <li>• Conduct regular audits of transactions and contracts</li>
                      <li>• Issue Sharia compliance certificates</li>
                      <li>• Provide guidance on Islamic finance matters</li>
                      <li>• Ensure ongoing adherence to Sharia principles</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Certifications & Compliance</h2>
              <p className="text-lg text-slate-600">
                Recognized and certified by leading Islamic finance authorities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardContent className="pt-8">
                  <Award className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">AAOIFI Compliant</h3>
                  <p className="text-slate-600">
                    Certified by the Accounting and Auditing Organization for Islamic Financial Institutions, 
                    the global standard-setter for Islamic finance.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <Award className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">IFSB Standards</h3>
                  <p className="text-slate-600">
                    Adheres to Islamic Financial Services Board standards for governance, risk management, 
                    and transparency.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <Award className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Regular Audits</h3>
                  <p className="text-slate-600">
                    Quarterly Sharia compliance audits conducted by independent scholars and internal 
                    review processes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <Award className="h-12 w-12 text-amber-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Transparency Reports</h3>
                  <p className="text-slate-600">
                    Annual Sharia compliance reports published and made available to all stakeholders 
                    for complete transparency.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Sharia Compliance Matters</h2>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">For Muslims</h3>
                  <p className="text-slate-600">
                    Sharia compliance allows Muslims to finance property ownership without compromising their 
                    religious beliefs. It provides peace of mind that all transactions are halal and ethical.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">For Everyone</h3>
                  <p className="text-slate-600">
                    Sharia-compliant financing benefits everyone by promoting ethical business practices, 
                    transparency, fairness, and social responsibility. It's not just about religion - it's 
                    about doing business the right way.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Global Recognition</h3>
                  <p className="text-slate-600">
                    Islamic finance is a rapidly growing global industry valued at over $3 trillion. It's 
                    recognized worldwide as a viable alternative to conventional banking, offering stability 
                    and ethical principles.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-green-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Experience Ethical Financing</h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands who have chosen Sharia-compliant property financing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-slate-100"
                onClick={() => window.location.href = '/borrower/apply/personal-info'}
              >
                Apply Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-green-700"
                onClick={() => window.location.href = '/contact'}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

// XCircle component (since it's not imported from lucide-react)
function XCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6m0-6l6 6" />
    </svg>
  )
}
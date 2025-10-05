"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Heart, Target, Users, TrendingUp, ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">About PropertyLoans</h1>
            <p className="text-xl text-slate-600">
              We're on a mission to make ethical, interest-free property financing accessible to everyone. 
              No banks, no interest, just transparent and fair lending.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Story</h2>
                <p className="text-lg text-slate-600 mb-4">
                  PropertyLoans was founded in 2023 with a simple belief: property financing should be 
                  accessible, ethical, and aligned with your values. We saw too many people struggling 
                  with high-interest mortgages and predatory lending practices.
                </p>
                <p className="text-lg text-slate-600 mb-4">
                  We created a platform that connects borrowers directly with ethical lenders, eliminating 
                  banks and their interest charges. Every loan on our platform is completely interest-free 
                  and Sharia-compliant, making property ownership accessible to everyone.
                </p>
                <p className="text-lg text-slate-600">
                  Today, we've helped thousands of families achieve their property dreams through transparent, 
                  fair, and ethical financing. We're proud to be leading the way in interest-free lending.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-12 flex items-center justify-center h-96">
                <Users className="h-48 w-48 text-blue-600 opacity-50" />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardContent className="pt-8">
                  <Target className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                  <p className="text-lg text-slate-600">
                    To provide accessible, ethical, and interest-free property financing that empowers 
                    individuals and families to achieve their homeownership dreams without compromising 
                    their values or financial wellbeing.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-8">
                  <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                  <p className="text-lg text-slate-600">
                    To become the leading platform for interest-free property financing globally, setting 
                    the standard for transparent, ethical lending and making Sharia-compliant financing 
                    the norm rather than the exception.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">Our Core Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-2 hover:shadow-lg transition-all">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Transparency</h3>
                  <p className="text-slate-600">
                    No hidden fees, no fine print. Every term and condition is clear, straightforward, 
                    and easy to understand.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 hover:shadow-lg transition-all">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Ethics</h3>
                  <p className="text-slate-600">
                    We operate on Islamic principles of fairness and justice. Every loan is 100% 
                    interest-free and Sharia-compliant.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 hover:shadow-lg transition-all">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Community</h3>
                  <p className="text-slate-600">
                    We connect borrowers directly with lenders, building a community of ethical 
                    finance supporters.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 bg-blue-600">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-12">Our Impact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-white mb-2">$50M+</div>
                <div className="text-blue-100">Total Loans Funded</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">2,500+</div>
                <div className="text-blue-100">Happy Borrowers</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">95%</div>
                <div className="text-blue-100">Approval Rate</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">0%</div>
                <div className="text-blue-100">Interest Charged</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-slate-900 mb-4">Our Leadership Team</h2>
            <p className="text-center text-slate-600 mb-12 text-lg">
              Dedicated professionals committed to ethical finance
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Ahmed Hassan</h3>
                  <p className="text-blue-600 mb-3">Founder & CEO</p>
                  <p className="text-slate-600 text-sm">
                    15 years in Islamic finance. Passionate about making ethical lending accessible.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Sarah Mitchell</h3>
                  <p className="text-green-600 mb-3">Chief Operating Officer</p>
                  <p className="text-slate-600 text-sm">
                    Expert in fintech operations with a focus on customer experience.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Dr. Omar Khan</h3>
                  <p className="text-purple-600 mb-3">Head of Sharia Board</p>
                  <p className="text-slate-600 text-sm">
                    Islamic scholar ensuring all products meet Sharia compliance standards.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Join Our Community</h2>
            <p className="text-xl text-slate-600 mb-8">
              Be part of the movement towards ethical, interest-free property financing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = '/borrower/apply/personal-info'}
              >
                Apply for a Loan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
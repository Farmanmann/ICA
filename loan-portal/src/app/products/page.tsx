"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Building, Hammer, RefreshCw, CheckCircle, ArrowRight } from "lucide-react"

export default function ProductsPage() {
  const products = [
    {
      icon: Home,
      name: "Home Purchase Loan",
      tagline: "Buy Your Dream Home",
      description: "Finance the purchase of your residential property with our interest-free home loans. Perfect for first-time buyers and families looking to upgrade.",
      features: [
        "Up to $500,000 loan amount",
        "12 to 60 months repayment terms",
        "0% interest rate",
        "Quick approval within 3 days",
        "Flexible down payment options"
      ],
      color: "blue"
    },
    {
      icon: Building,
      name: "Investment Property Loan",
      tagline: "Build Your Portfolio",
      description: "Expand your real estate investment portfolio with Sharia-compliant financing. Ideal for investors looking to purchase rental properties.",
      features: [
        "Up to $750,000 loan amount",
        "24 to 60 months repayment terms",
        "0% interest rate",
        "Investment property qualified",
        "Multiple property financing available"
      ],
      color: "green"
    },
    {
      icon: Hammer,
      name: "Renovation Loan",
      tagline: "Upgrade Your Space",
      description: "Transform your existing property with our renovation financing. From minor upgrades to major remodels, we've got you covered.",
      features: [
        "Up to $200,000 loan amount",
        "12 to 48 months repayment terms",
        "0% interest rate",
        "No collateral required",
        "Fast disbursement for contractors"
      ],
      color: "purple"
    },
    {
      icon: RefreshCw,
      name: "Refinancing Loan",
      tagline: "Better Terms, Same Property",
      description: "Refinance your existing mortgage with interest-free terms. Switch from conventional financing to Sharia-compliant loans.",
      features: [
        "Replace existing mortgages",
        "12 to 60 months repayment terms",
        "0% interest rate",
        "Simplified approval process",
        "No prepayment penalties"
      ],
      color: "amber"
    }
  ]

  const colorClasses: any = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-amber-600"
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">Our Loan Products</h1>
            <p className="text-xl text-slate-600">
              Choose from our range of interest-free, Sharia-compliant loan products. 
              Whatever your property needs, we have a solution that fits.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {products.map((product, index) => {
                const Icon = product.icon
                return (
                  <Card key={index} className="border-2 hover:shadow-xl transition-all">
                    <CardHeader className={`bg-gradient-to-r ${colorClasses[product.color]} text-white`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="h-8 w-8" />
                            <Badge className="bg-white/20 text-white border-white/30">
                              0% Interest
                            </Badge>
                          </div>
                          <CardTitle className="text-2xl mb-2">{product.name}</CardTitle>
                          <p className="text-white/90">{product.tagline}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-slate-600 mb-6">{product.description}</p>
                      
                      <h4 className="font-semibold text-slate-900 mb-3">Key Features:</h4>
                      <ul className="space-y-2 mb-6">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button 
                        className="w-full bg-slate-900 hover:bg-slate-800"
                        onClick={() => window.location.href = '/borrower/apply/personal-info'}
                      >
                        Apply for This Loan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">Product Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg">
                <thead>
                  <tr className="border-b bg-slate-900 text-white">
                    <th className="text-left p-4 font-semibold">Product</th>
                    <th className="text-left p-4 font-semibold">Max Amount</th>
                    <th className="text-left p-4 font-semibold">Term Length</th>
                    <th className="text-left p-4 font-semibold">Interest Rate</th>
                    <th className="text-left p-4 font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-blue-50">
                    <td className="p-4 font-medium">Home Purchase Loan</td>
                    <td className="p-4">$500,000</td>
                    <td className="p-4">12-60 months</td>
                    <td className="p-4"><Badge className="bg-green-100 text-green-800">0%</Badge></td>
                    <td className="p-4">First-time homebuyers</td>
                  </tr>
                  <tr className="border-b hover:bg-blue-50">
                    <td className="p-4 font-medium">Investment Property Loan</td>
                    <td className="p-4">$750,000</td>
                    <td className="p-4">24-60 months</td>
                    <td className="p-4"><Badge className="bg-green-100 text-green-800">0%</Badge></td>
                    <td className="p-4">Real estate investors</td>
                  </tr>
                  <tr className="border-b hover:bg-blue-50">
                    <td className="p-4 font-medium">Renovation Loan</td>
                    <td className="p-4">$200,000</td>
                    <td className="p-4">12-48 months</td>
                    <td className="p-4"><Badge className="bg-green-100 text-green-800">0%</Badge></td>
                    <td className="p-4">Home improvement</td>
                  </tr>
                  <tr className="hover:bg-blue-50">
                    <td className="p-4 font-medium">Refinancing Loan</td>
                    <td className="p-4">Varies</td>
                    <td className="p-4">12-60 months</td>
                    <td className="p-4"><Badge className="bg-green-100 text-green-800">0%</Badge></td>
                    <td className="p-4">Existing mortgage holders</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Eligibility Requirements */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">General Eligibility</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Basic Requirements</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">18 years or older</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Proof of stable income</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Valid government ID</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Good credit history</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Documentation Needed</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Proof of income (pay stubs)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Bank statements (3 months)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Property documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Valid identification</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Apply?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Choose the loan product that fits your needs and get started today
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
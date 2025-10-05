"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What is PropertyLoans?",
          a: "PropertyLoans is an interest-free, Sharia-compliant property financing platform that connects borrowers directly with ethical lenders. We eliminate banks and interest charges, making property ownership accessible through transparent and fair lending."
        },
        {
          q: "How is this different from a traditional mortgage?",
          a: "Unlike traditional mortgages, we charge 0% interest. You only pay back the principal amount borrowed. There are no hidden fees, and all transactions comply with Islamic Sharia principles. We connect you directly with lenders, removing banks from the equation."
        },
        {
          q: "Who can use PropertyLoans?",
          a: "Anyone 18 years or older with a stable income and good credit history can apply. You don't need to be Muslim to use our services - our interest-free model is available to everyone who values ethical financing."
        }
      ]
    },
    {
      category: "Application Process",
      questions: [
        {
          q: "How long does the application take?",
          a: "The online application takes less than 10 minutes to complete. You'll go through 5 simple steps covering personal information, property details, financial information, document upload, and final review."
        },
        {
          q: "What documents do I need?",
          a: "You'll need: valid government-issued ID, proof of income (recent pay stubs or tax returns), bank statements from the last 3 months, and property documents (purchase agreement or appraisal). We'll guide you through uploading these during the application."
        },
        {
          q: "How long until I get approved?",
          a: "Most applications are reviewed within 2-3 business days. You'll receive an email notification as soon as a decision is made. Complex cases may take slightly longer."
        },
        {
          q: "What happens if my application is denied?",
          a: "If denied, we'll explain why and suggest steps to improve your eligibility. You can reapply after addressing the concerns. Common reasons include insufficient income, poor credit history, or incomplete documentation."
        }
      ]
    },
    {
      category: "Loan Terms",
      questions: [
        {
          q: "How much can I borrow?",
          a: "Loan amounts vary by product: Home Purchase loans up to $500,000, Investment Property loans up to $750,000, Renovation loans up to $200,000, and Refinancing loans vary based on your existing mortgage."
        },
        {
          q: "What are the repayment terms?",
          a: "Repayment terms range from 12 to 60 months depending on the loan type and amount. You'll make fixed monthly payments with no interest charges."
        },
        {
          q: "Are there any fees?",
          a: "We charge a one-time origination fee to cover processing costs. There are no hidden fees, and we'll clearly disclose all costs upfront. Late payment fees may apply if you miss a payment deadline."
        },
        {
          q: "Can I pay off my loan early?",
          a: "Yes! We encourage early repayment and charge no prepayment penalties. Paying off your loan early can help you save on any applicable fees."
        }
      ]
    },
    {
      category: "Sharia Compliance",
      questions: [
        {
          q: "What makes this Sharia-compliant?",
          a: "All our loans are structured to comply with Islamic principles: 0% interest (no Riba), transparent terms, ethical practices, and regular audits by our Sharia Advisory Board. We follow Murabaha and Ijara financing models."
        },
        {
          q: "Is PropertyLoans certified?",
          a: "Yes, we are certified by recognized Islamic finance authorities. Our Sharia Advisory Board includes qualified Islamic scholars who review all products and ensure ongoing compliance."
        },
        {
          q: "Do I need to be Muslim to apply?",
          a: "No. While our financing is Sharia-compliant, it's available to everyone regardless of religion. Many non-Muslims choose us because they prefer ethical, interest-free financing."
        }
      ]
    },
    {
      category: "Payments",
      questions: [
        {
          q: "How do I make payments?",
          a: "You can make payments through your online dashboard using bank transfer, debit card, or credit card. We also offer automatic payment setup to ensure you never miss a due date."
        },
        {
          q: "What if I miss a payment?",
          a: "Late payments may incur a fee as specified in your loan agreement. If you anticipate difficulty making a payment, contact us immediately. We'll work with you to find a solution."
        },
        {
          q: "Can I change my payment date?",
          a: "In some cases, yes. Contact our support team to discuss your situation. We understand circumstances change and will try to accommodate reasonable requests."
        }
      ]
    },
    {
      category: "For Lenders",
      questions: [
        {
          q: "How do I become a lender?",
          a: "Sign up through our lender registration page. You'll need to verify your identity, link a funding source, and complete our lender onboarding. Once approved, you can start bidding on loan applications."
        },
        {
          q: "How do lenders make money with 0% interest?",
          a: "Lenders participate for ethical reasons and potential profit-sharing arrangements. Some lenders view this as charitable giving (Sadaqah), while others appreciate the social impact of enabling property ownership."
        },
        {
          q: "What protection do lenders have?",
          a: "All loans are secured by the property being financed. We conduct thorough borrower verification and credit checks. Lenders can review borrower profiles before choosing which loans to fund."
        }
      ]
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  let questionIndex = 0

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-slate-600">
              Find answers to common questions about our interest-free property loans
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqs.map((category, categoryIdx) => (
              <div key={categoryIdx}>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((faq) => {
                    const currentIndex = questionIndex++
                    const isOpen = openIndex === currentIndex
                    
                    return (
                      <Card key={currentIndex} className="border-2 hover:border-blue-500 transition-all">
                        <CardContent className="p-0">
                          <button
                            onClick={() => toggleFAQ(currentIndex)}
                            className="w-full text-left p-6 flex items-center justify-between"
                          >
                            <span className="font-semibold text-lg text-slate-900 pr-4">
                              {faq.q}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-6">
                              <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 px-6 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Still Have Questions?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Our team is here to help. Contact us for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-slate-100"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Support
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-blue-700"
                onClick={() => window.location.href = '/borrower/apply/personal-info'}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
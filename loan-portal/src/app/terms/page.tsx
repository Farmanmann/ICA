"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">Terms & Conditions</h1>
            <p className="text-xl text-slate-600">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-slate-500 mt-4">Last Updated: January 2025</p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-8">
                <div className="space-y-8 text-slate-700">
                  {/* Section 1 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                    <p className="mb-4">
                      By accessing and using Noor Financial ("the Platform"), you accept and agree to be bound by the terms 
                      and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                    <p>
                      These Terms and Conditions govern your use of our website and services. By registering for an account, 
                      applying for a loan, or using any of our services, you acknowledge that you have read, understood, and 
                      agree to be bound by these terms.
                    </p>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Eligibility</h2>
                    <p className="mb-3">To use our services, you must:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Be at least 18 years of age</li>
                      <li>Have the legal capacity to enter into binding contracts</li>
                      <li>Provide accurate and complete information during registration</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>Be a resident of a jurisdiction where our services are available</li>
                    </ul>
                  </div>

                  {/* Section 3 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Loan Terms</h2>
                    <p className="mb-3">All loans provided through Noor Financial are subject to the following:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>All loans are interest-free and comply with Islamic Sharia principles</li>
                      <li>Loan amounts, terms, and conditions are determined on a case-by-case basis</li>
                      <li>Borrowers must provide accurate financial information</li>
                      <li>Loans are subject to approval and may be denied at our discretion</li>
                      <li>Monthly payments must be made on time as per the agreed schedule</li>
                      <li>Late payments may result in additional fees or penalties</li>
                    </ul>
                  </div>

                  {/* Section 4 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">4. User Responsibilities</h2>
                    <p className="mb-3">As a user of our platform, you agree to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Provide truthful, accurate, and complete information</li>
                      <li>Update your information promptly if circumstances change</li>
                      <li>Use the platform only for lawful purposes</li>
                      <li>Not attempt to manipulate, hack, or otherwise interfere with the platform</li>
                      <li>Not use the platform to engage in fraudulent activities</li>
                      <li>Maintain confidentiality of your account credentials</li>
                    </ul>
                  </div>

                  {/* Section 5 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Payment Terms</h2>
                    <p className="mb-4">
                      Borrowers agree to repay loans according to the schedule provided at the time of loan approval. 
                      Payments must be made through the methods specified on the platform.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Payments are due on the specified date each month</li>
                      <li>Late payments may incur fees as specified in your loan agreement</li>
                      <li>Early repayment is allowed without penalties</li>
                      <li>Failed payments may result in loan default</li>
                    </ul>
                  </div>

                  {/* Section 6 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Sharia Compliance</h2>
                    <p className="mb-4">
                      All loans and financial transactions on Noor Financial are structured to comply with Islamic Sharia 
                      principles. This includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Zero interest (Riba) charged on any loans</li>
                      <li>Transparent and fair terms</li>
                      <li>No hidden fees or charges</li>
                      <li>Ethical lending practices</li>
                      <li>Regular audits by our Sharia Advisory Board</li>
                    </ul>
                  </div>

                  {/* Section 7 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Privacy and Data Protection</h2>
                    <p className="mb-4">
                      We are committed to protecting your privacy. Your personal information will be collected, used, 
                      and stored in accordance with our Privacy Policy and applicable data protection laws.
                    </p>
                    <p>
                      By using our services, you consent to the collection and use of your information as described 
                      in our Privacy Policy.
                    </p>
                  </div>

                  {/* Section 8 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Intellectual Property</h2>
                    <p className="mb-4">
                      All content on the Noor Financial platform, including but not limited to text, graphics, logos, 
                      images, and software, is the property of Noor Financial or its content suppliers and is protected 
                      by intellectual property laws.
                    </p>
                    <p>
                      You may not reproduce, distribute, modify, or create derivative works from any content without 
                      express written permission.
                    </p>
                  </div>

                  {/* Section 9 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Limitation of Liability</h2>
                    <p className="mb-4">
                      Noor Financial shall not be liable for any indirect, incidental, special, consequential, or 
                      punitive damages resulting from your use or inability to use the service.
                    </p>
                    <p>
                      We do not guarantee that the service will be uninterrupted, timely, secure, or error-free.
                    </p>
                  </div>

                  {/* Section 10 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Termination</h2>
                    <p className="mb-4">
                      We reserve the right to terminate or suspend your account and access to the service at our sole 
                      discretion, without notice, for conduct that we believe violates these Terms and Conditions or 
                      is harmful to other users, us, or third parties, or for any other reason.
                    </p>
                  </div>

                  {/* Section 11 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to Terms</h2>
                    <p className="mb-4">
                      We reserve the right to modify these Terms and Conditions at any time. Changes will be effective 
                      immediately upon posting to the website. Your continued use of the service after changes are 
                      posted constitutes your acceptance of the modified terms.
                    </p>
                  </div>

                  {/* Section 12 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Governing Law</h2>
                    <p className="mb-4">
                      These Terms and Conditions shall be governed by and construed in accordance with the laws of 
                      the State of Texas, without regard to its conflict of law provisions.
                    </p>
                  </div>

                  {/* Section 13 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Contact Information</h2>
                    <p className="mb-4">
                      If you have any questions about these Terms and Conditions, please contact us at:
                    </p>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-semibold">Noor Financial</p>
                      <p>Email: farmannoorali2@gmail.com</p>
                      <p>Phone: 281-903-4718</p>
                      <p>Address: 11006 Hundred Bridge Ln. Sugar Land, Texas, 77498</p>
                    </div>
                  </div>

                  {/* Acceptance */}
                  <div className="border-t pt-8">
                    <p className="text-sm italic">
                      By using Noor Financial, you acknowledge that you have read, understood, and agree to be bound 
                      by these Terms and Conditions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <a href="/">
              <Image
                src="/NoorFinancingLogo.png"
                alt="Noor Financing"
                width={200}
                height={120}
                className="h-28 md:h-32 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                priority
              />
            </a>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <a href="/privacy" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              Privacy Policy
            </a>
            <a href="/advertising-disclosure" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              Advertising Disclosure
            </a>
            <a href="/security-policy" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              Security Policy
            </a>
            <a href="/terms" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              Terms of Use
            </a>
            <a href="/licenses" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              Licenses & Legal Disclosures
            </a>
            <a href="/electronic-disclosure" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              Electronic Disclosure
            </a>
            <a href="/dnc" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              DNC
            </a>
            <a href="/sms-terms" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              SMS Terms & Conditions
            </a>
            <a href="/accessibility" className="text-blue-300 hover:text-blue-200 text-sm text-center transition-colors">
              Accessibility Statement
            </a>
          </div>

          {/* Legal Text */}
          <div className="max-w-4xl mx-auto">
            <p className="text-slate-400 text-xs leading-relaxed text-center">
              Noor Financing LLC is currently in the licensing process and is not yet accepting applications or conducting mortgage brokerage activities. Noor Financing technology and processes are proprietary to Noor Financing LLC. © 2026 Noor Financing LLC. All Rights Reserved. This site is directed at, and made available to, persons in Texas only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

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
                      By accessing and using PropertyLoans ("the Platform"), you accept and agree to be bound by the terms 
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
                    <p className="mb-3">All loans provided through PropertyLoans are subject to the following:</p>
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
                      All loans and financial transactions on PropertyLoans are structured to comply with Islamic Sharia 
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
                      All content on the PropertyLoans platform, including but not limited to text, graphics, logos, 
                      images, and software, is the property of PropertyLoans or its content suppliers and is protected 
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
                      PropertyLoans shall not be liable for any indirect, incidental, special, consequential, or 
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
                      <p className="font-semibold">PropertyLoans</p>
                      <p>Email: legal@propertyloans.com</p>
                      <p>Phone: 1-800-PROPERTY</p>
                      <p>Address: 123 Finance Street, Houston, TX 77002</p>
                    </div>
                  </div>

                  {/* Acceptance */}
                  <div className="border-t pt-8">
                    <p className="text-sm italic">
                      By using PropertyLoans, you acknowledge that you have read, understood, and agree to be bound 
                      by these Terms and Conditions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
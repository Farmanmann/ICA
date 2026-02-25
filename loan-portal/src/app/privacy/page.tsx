"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
            <p className="text-xl text-slate-600">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-slate-500 mt-4">Last Updated: January 2025</p>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-8">
                <div className="space-y-8 text-slate-700">
                  {/* Introduction */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
                    <p className="mb-4">
                      Noor Financial ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                      explains how we collect, use, disclose, and safeguard your information when you use our platform
                      and services.
                    </p>
                    <p>
                      By using Noor Financial, you agree to the collection and use of information in accordance with
                      this policy. If you do not agree with our policies and practices, please do not use our services.
                    </p>
                  </div>

                  {/* Section 1 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                    
                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">Personal Information</h3>
                    <p className="mb-3">We collect personal information that you voluntarily provide to us, including:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                      <li>Name, email address, and phone number</li>
                      <li>Mailing address and residential information</li>
                      <li>Date of birth and government-issued identification</li>
                      <li>Social Security Number or Tax ID</li>
                      <li>Employment and income information</li>
                      <li>Bank account and payment information</li>
                      <li>Credit history and financial data</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-4">Automatically Collected Information</h3>
                    <p className="mb-3">When you access our platform, we automatically collect:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>IP address and browser type</li>
                      <li>Device information and operating system</li>
                      <li>Usage data and navigation patterns</li>
                      <li>Cookies and similar tracking technologies</li>
                      <li>Location data (with your permission)</li>
                    </ul>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
                    <p className="mb-3">We use the information we collect to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Process and manage your loan applications</li>
                      <li>Verify your identity and creditworthiness</li>
                      <li>Communicate with you about your account and services</li>
                      <li>Process payments and prevent fraud</li>
                      <li>Improve our platform and user experience</li>
                      <li>Comply with legal and regulatory requirements</li>
                      <li>Send you marketing communications (with your consent)</li>
                      <li>Analyze usage patterns and trends</li>
                    </ul>
                  </div>

                  {/* Section 3 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Information Sharing and Disclosure</h2>
                    <p className="mb-4">
                      We may share your information with third parties in the following circumstances:
                    </p>
                    
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">With Your Consent</h3>
                    <p className="mb-4">
                      We may share your information when you explicitly authorize us to do so, such as when matching 
                      you with potential lenders.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Service Providers</h3>
                    <p className="mb-3">We may share information with third-party service providers who perform services on our behalf:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                      <li>Payment processors</li>
                      <li>Credit reporting agencies</li>
                      <li>Identity verification services</li>
                      <li>Cloud storage providers</li>
                      <li>Customer support platforms</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Legal Requirements</h3>
                    <p className="mb-3">We may disclose your information if required to do so by law or in response to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Court orders or legal processes</li>
                      <li>Government or regulatory requests</li>
                      <li>Protection of our rights or property</li>
                      <li>Prevention of fraud or illegal activities</li>
                    </ul>
                  </div>

                  {/* Section 4 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
                    <p className="mb-4">
                      We implement appropriate technical and organizational measures to protect your personal information 
                      against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                    <p className="mb-3">Our security measures include:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Encryption of sensitive data in transit and at rest</li>
                      <li>Regular security audits and vulnerability assessments</li>
                      <li>Access controls and authentication procedures</li>
                      <li>Employee training on data protection</li>
                      <li>Secure data centers with physical security measures</li>
                    </ul>
                  </div>

                  {/* Section 5 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Your Privacy Rights</h2>
                    <p className="mb-3">You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                      <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                      <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                      <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                      <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
                      <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                    </ul>
                    <p className="mt-4">
                      To exercise these rights, please contact us at privacy@noorfinancial.com
                    </p>
                  </div>

                  {/* Section 6 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Cookies and Tracking Technologies</h2>
                    <p className="mb-4">
                      We use cookies and similar tracking technologies to enhance your experience on our platform. 
                      Cookies are small data files stored on your device.
                    </p>
                    <p className="mb-3">We use the following types of cookies:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                      <li><strong>Performance Cookies:</strong> Help us understand how you use our platform</li>
                      <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                      <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                    </ul>
                    <p className="mt-4">
                      You can control cookies through your browser settings, but disabling certain cookies may limit 
                      platform functionality.
                    </p>
                  </div>

                  {/* Section 7 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Data Retention</h2>
                    <p className="mb-4">
                      We retain your personal information for as long as necessary to fulfill the purposes outlined in 
                      this Privacy Policy, unless a longer retention period is required by law.
                    </p>
                    <p>
                      When we no longer need your information, we will securely delete or anonymize it in accordance 
                      with our data retention policies.
                    </p>
                  </div>

                  {/* Section 8 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Third-Party Links</h2>
                    <p className="mb-4">
                      Our platform may contain links to third-party websites or services. We are not responsible for 
                      the privacy practices of these third parties. We encourage you to review their privacy policies 
                      before providing any personal information.
                    </p>
                  </div>

                  {/* Section 9 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Children's Privacy</h2>
                    <p className="mb-4">
                      Our services are not intended for individuals under the age of 18. We do not knowingly collect 
                      personal information from children. If we become aware that we have collected information from 
                      a child, we will take steps to delete it promptly.
                    </p>
                  </div>

                  {/* Section 10 */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to This Privacy Policy</h2>
                    <p className="mb-4">
                      We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                      the new Privacy Policy on this page and updating the "Last Updated" date.
                    </p>
                    <p>
                      Your continued use of our services after changes are posted constitutes your acceptance of the 
                      updated Privacy Policy.
                    </p>
                  </div>

                  {/* Contact */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Us</h2>
                    <p className="mb-4">
                      If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-semibold">Noor Financial - Privacy Team</p>
                      <p>Email: farmannoorali2@gmail.com</p>
                      <p>Phone: 281-903-4718</p>
                      <p>Address: 11006 Hundred Bridge Ln</p>
                    </div>
                  </div>

                  {/* Acceptance */}
                  <div className="border-t pt-8">
                    <p className="text-sm italic">
                      By using Noor Financial, you acknowledge that you have read and understood this Privacy Policy
                      and agree to the collection, use, and disclosure of your information as described herein.
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
import Image from "next/image"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mb-8">Last Updated: February 23, 2026</p>

          <div className="prose prose-slate max-w-none space-y-6">
            <div>
              <p>
                Noor Financing LLC ("Noor Financing," "we," "our," or "us") is committed to maintaining the privacy and security of your personal information. This Privacy Policy describes our practices regarding the collection, use, and disclosure of personal information obtained through our website, mobile applications, and other digital properties (collectively, the "Digital Properties"), as well as through our offline business interactions. By using our Services, you agree to the terms of this Privacy Policy.
              </p>
            </div>

            <div>
              <p>
                <strong>Personal Information We Collect.</strong> Depending on your interactions with the Services, we may collect several categories of personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Contact information, including your name, residential address, telephone number, and email address.</li>
                <li>Identifying information, including your Social Security number, date of birth, driver's license number, or other government-issued identifiers.</li>
                <li>Financial information, including income, assets, employment history, credit scores, and debt obligations.</li>
                <li>Sensitive personal information, including financial account credentials and information regarding your preference for Shariah-compliant financing. Pursuant to the Texas Data Privacy and Security Act (TDPSA), the collection of information related to religious or ethical preferences is classified as sensitive data. By initiating an inquiry, you provide express consent for the processing of this data for the purpose of matching you with appropriate financing products.</li>
                <li>Usage data, including IP addresses, device identifiers, browser type, and information regarding your interactions with the Digital Properties.</li>
              </ul>
            </div>

            <div>
              <p>
                <strong>Information Collected Through Automated Means.</strong> We and our service providers use cookies, web beacons, and similar tracking technologies to monitor and memorialize visits to our Digital Properties. This may include site-recording technology that collects information such as page URLs, mouse movements, clicks, and information you input into webforms. We use this information for fraud prevention, security, and to improve the effectiveness of our Services.
              </p>
            </div>

            <div>
              <p>
                <strong>How We Use Personal Information.</strong> We use the personal information we collect for the following business and commercial purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Delivering the Services, specifically connecting you with Network Partners (lenders and financial institutions) to provide financing offers.</li>
                <li>Communicating with you for administrative and marketing purposes, including responding to inquiries and sending promotional materials.</li>
                <li>Verifying your identity and maintaining security to detect and prevent unauthorized transactions or fraudulent activity.</li>
                <li>Satisfying our legal and regulatory obligations, including compliance with the Texas Department of Savings and Mortgage Lending (SML) and federal Anti-Money Laundering (AML) laws.</li>
              </ul>
            </div>

            <div>
              <p>
                <strong>Disclosure of Personal Information.</strong> Noor Financing functions as a marketplace and may disclose your personal information to the following categories of recipients:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Network Partners. When you submit an inquiry for a Shariah-compliant financial product, we disclose your information to lenders and other third parties in our network as necessary to fulfill your request.</li>
                <li>Service Providers. Third parties that provide professional, technical, or administrative support, including credit reporting agencies and cloud storage providers.</li>
                <li>Governmental Authorities. Law enforcement or regulatory bodies as required by law, including in response to subpoenas or court orders.</li>
                <li>Relevant Third Parties. In connection with a merger, acquisition, or sale of business assets.</li>
              </ul>
            </div>

            <div>
              <p>
                <strong>Texas Privacy Rights.</strong> Under the Texas Data Privacy and Security Act (TDPSA), Texas residents have specific rights regarding their personal data:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Access and Correction. You have the right to confirm whether we are processing your data and to request access to or correction of inaccuracies in your personal information.</li>
                <li>Deletion. You have the right to request the deletion of personal data provided by or obtained about you.</li>
                <li>Opt-Out. You have the right to opt out of the processing of your personal data for targeted advertising or the sale of your personal data.</li>
              </ul>
              <p className="mt-4">
                Notwithstanding the foregoing, Noor Financing is a licensed mortgage entity in the State of Texas. Pursuant to 7 TAC §80.204, we are required to maintain certain mortgage-related records for a minimum of three (3) years. We are unable to delete personal information that is subject to these mandatory state or federal record-keeping requirements.
              </p>
            </div>

            <div>
              <p>
                <strong>Your Choices and Opt-Outs.</strong> We provide you with the ability to make choices regarding your personal information:
              </p>
            </div>

            <div>
              <p>
                <strong>Marketing Communications.</strong> You may opt out of receiving promotional communications by following the "unsubscribe" instructions provided in such emails or by contacting us directly.
              </p>
            </div>

            <div>
              <p>
                <strong>Information Security and Retention.</strong> We maintain physical, electronic, and procedural measures designed to safeguard your personal information, including the use of industry-standard encryption and multi-factor authentication. We retain personal information for as long as necessary to fulfill the purposes outlined in this policy or as required to satisfy legal, regulatory, or reporting requirements.
              </p>
            </div>

            <div>
              <p>
                <strong>Children's Privacy.</strong> The Services are not intended for individuals under the age of 18. We do not knowingly collect, sell, or share personal information from or about individuals under the age of 18.
              </p>
            </div>

            <div>
              <p>
                <strong>Services Limited to the United States.</strong> Our Digital Properties are designed for use within the United States and are governed by the laws of the United States and the State of Texas. We make no representation that our Digital Properties are governed by the laws of any other nation.
              </p>
            </div>

            <div>
              <p>
                <strong>Changes to This Privacy Policy.</strong> We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. The "Last Updated" date at the top of this page indicates when the policy was last revised. We encourage you to review this policy periodically.
              </p>
            </div>

            <div>
              <p>
                <strong>Access and Correct Personal Information.</strong> If you have submitted a request for a loan or other financial product through the Services and would like to access or correct certain personal information, or if you wish to exercise your rights under the TDPSA, please contact us at:
              </p>
              <p className="mt-2">
                Email: <a href="mailto:support@noorfinancing.com" className="text-blue-600 hover:underline">support@noorfinancing.com</a>
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Contact Us</h2>
              <p className="mb-4">
                If you have any questions or comments about this Privacy Policy or our information handling and privacy practices, please contact us using the following details:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="font-semibold">Noor Financing, LLC</p>
                <p>Email: <a href="mailto:support@noorfinancing.com" className="text-blue-600 hover:underline">support@noorfinancing.com</a></p>
                <p>Phone: 346-521-8425</p>
                <p>Mail: 800 Bonaventure Way Suite 111</p>
                <p>Sugar Land, TX 77479</p>
                <p className="mt-2">NMLS ID: 2780355</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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

          {/* Legal Row */}
          <div className="max-w-6xl mx-auto mt-10 px-6">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">

              {/* Legal Text */}
              <p className="text-slate-400 text-xs leading-relaxed text-left md:max-w-4xl">
                Noor Financing LLC is a Marketing Lead Generator and is a Duly Licensed Mortgage Company, as required by law, with its main office located at 800 Bonaventure Way Suite 111, Sugar Land, TX 77479. NMLS Unique Identifier #2780355. Noor Financing is a marketplace; we do not fund, originate, or service loans. All credit decisions are made by independent third-party lenders. Noor Financing technology and processes are proprietary to Noor Financing LLC. © 2026 Noor Financing LLC. All Rights Reserved. This site is directed at, and made available to, persons in Texas only. 
              </p>

              {/* Equal Housing Logo */}
              <div className="flex-shrink-0">
                <Image
                  src="/EqualHousingWebLogo.png"
                  alt="Equal Housing Opportunity"
                  width={80}
                  height={80}
                  className="opacity-80"
                />
              </div>

            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

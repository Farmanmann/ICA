import Image from "next/image"

export default function ElectronicDisclosurePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Consent Agreement for Electronic Disclosures and Communications</h1>
          <p className="text-sm text-slate-500 mb-8">Last Updated: February 23, 2026</p>

          <div className="prose prose-slate max-w-none space-y-6">
            <div>
              <p>
                <strong>Overview.</strong> By using Noor Financing, you are choosing to participate in a digital-first marketplace. To provide you with efficient access to our network of participating lenders and ethical financial products, we must conduct our business electronically. This agreement outlines your consent to receive all necessary notices, documents, and disclosures ("Communications") in a digital format.
              </p>
            </div>

            <div>
              <p>
                <strong>Consent to Electronic Delivery.</strong> You agree that Noor Financing and its partners may provide all legally required Communications to you electronically. These will be delivered either to the email address you provided during your inquiry or by making them available through your secure portal on our website. This consent applies to your current inquiry and any future interactions with Noor Financing or our participating providers.
              </p>
            </div>

            <div>
              <p>
                <strong>Technology Requirements.</strong> To access, view, and save your digital Communications, you must have:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>A personal computer or mobile device with reliable internet access</li>
                <li>A secure web browser</li>
                <li>A valid email account</li>
                <li>Software capable of viewing PDF files</li>
                <li>Sufficient electronic storage or a printer to retain copies for your personal records</li>
              </ul>
            </div>

            <div>
              <p>
                <strong>Withdrawing Your Consent.</strong> You may withdraw your consent to do business electronically at any time after your initial inquiry is submitted. To withdraw consent and receive future Communications, please contact us at <a href="mailto:support@noorfinancing.com" className="text-blue-600 hover:underline font-semibold">support@noorfinancing.com</a> or <strong>346-521-8425</strong>. There is no fee for withdrawing your consent; however, please note that withdrawing consent may limit your ability to use certain instantaneous features of our platform. Any withdrawal of consent will not affect the legal validity of Communications previously provided to you electronically.
              </p>
            </div>

            <div>
              <p>
                <strong>Updating Your Information.</strong> It is your responsibility to ensure that Noor Financing has your most current contact information. If your email address or physical mailing address changes, please notify us immediately by either updating it on our website or emailing us at <a href="mailto:support@noorfinancing.com" className="text-blue-600 hover:underline font-semibold">support@noorfinancing.com</a> to ensure your information is up to date.
              </p>
            </div>

            <div className="border-t pt-6 mt-8">
              <p className="font-bold text-center">
                PLEASE PRINT OR SAVE A DIGITAL COPY OF THIS AGREEMENT FOR YOUR RECORDS.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have questions or concerns about this Electronic Disclosure, please contact us:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="font-semibold">Noor Financial - Privacy Team</p>
                <p>Email: <a href="mailto:support@noorfinancing.com" className="text-blue-600 hover:underline">support@noorfinancing.com</a></p>
                <p>Phone: 346-521-8425</p>
                <p>Address: 800 Bonaventure Way Suite 111, Sugar Land, TX 77479</p>
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

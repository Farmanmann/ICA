import Image from "next/image"

export default function DNCPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Do Not Call Policy</h1>
          <p className="text-sm text-slate-500 mb-8">Last Updated: February 23, 2026</p>

          <div className="prose prose-slate max-w-none space-y-6">
            <div>
              <p>
                <strong>Our Commitment to Your Privacy.</strong> Noor Financing respects your preferences regarding marketing communications. If you wish to limit the sales calls you receive, you may request to be added to our internal Do Not Call List. Once your request is processed, Noor Financing will refrain from initiating advertising or solicitation calls to the phone number(s) provided.
              </p>
            </div>

            <div>
              <p>
                <strong>How to Join Our List.</strong> You may update your contact preferences at any time by emailing your request to <a href="mailto:support@noorfinancing.com" className="text-blue-600 hover:underline font-semibold">support@noorfinancing.com</a>. Please include your name and the specific phone number(s) you wish to register. We will process your request promptly; however, please allow up to 30 days for your information to be removed from any active outreach programs.
              </p>
            </div>

            <div>
              <p>
                <strong>Sharing Your Request with Partners.</strong> If you were matched with participating Financiers through our marketplace within the 30 days prior to your request, Noor Financing will notify those specific Financiers of your preference. While we facilitate this notification, we recommend that you also contact those Financiers directly to ensure you are placed on their individual company-specific Do Not Call lists.
              </p>
            </div>

            <div>
              <p>
                <strong>Important Exceptions.</strong> Please be advised that submitting a new inquiry on the Noor Financing website, or providing your phone number to us in a new request after your initial DNC registration, will be considered a "new established business relationship." This action will override your previous Do Not Call request and authorize Noor Financing and its partners to contact you regarding that specific inquiry. Additionally, Noor Financing may still contact you for non-marketing purposes, such as identity verification, fraud prevention, or administrative updates regarding an active request.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have questions or concerns about this Do Not Call Policy, please contact us:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="font-semibold">Noor Financing - Privacy Team</p>
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
                src="/NoorFinancingLogoHQ.png"
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

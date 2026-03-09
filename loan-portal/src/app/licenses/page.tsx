import Image from "next/image"

export default function LicensesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Licenses and Legal Disclosures</h1>
          <p className="text-sm text-slate-500 mb-8">Last Updated: February 23, 2026</p>

          <div className="prose prose-slate max-w-none space-y-6">
            <div>
              <p>
                <strong>General.</strong> Noor Financing is a Texas-based entity with its corporate headquarters located at 800 Bonaventure Way, Suite 111, Sugar Land, TX 77479. Any reference in these Licenses and Disclosures to "we" or "us" or similar words shall refer to Noor Financing. Any reference to "you" or "your" means the person(s) using the Noor Financing websites and/or the services offered through alternative methods. Noor Financing is a marketing lead generator required to be licensed as a Mortgage Company or other state license designation. Noor Financing <strong>DOES NOT</strong> take mortgage applications, originate, service, make loans or credit decisions in connection with loans, nor does Noor Financing issue commitments or lock-in agreements. Noor Financing's services are strictly administrative. Any loan inquiry you submit is <strong>NOT</strong> an application for credit. Rather, it is an inquiry to be matched with Lenders to receive conditional financing offers. You may have to complete an application with a Lender before they extend an unconditional offer. A Lender you select may require you to pay an application or other fee to cover the costs of an appraisal, credit report, or other items. The Lender, not Noor Financing, will determine the amount of any such fee and should provide information to you regarding the refundability of any such fee. Noor Financing does not endorse or recommend the products of any particular Lender.
              </p>
            </div>

            <div>
              <p>
                <strong>Agency and Liability.</strong> Except as otherwise provided for your state, Noor Financing is not an agent of you or any Lender. You should rely on your own judgment in deciding which available financing product, terms, and Lender best suit your personal financial requirements. The Lender is solely responsible for its services to you, and you agree that Noor Financing shall not be liable for any damages or costs of any type arising out of, or in any way connected with, your use of such services. You understand that Lenders may keep your request information whether or not you qualify for a loan with them. In addition, Noor Financing may receive personally identifiable information regarding the disposition of your loan from the Lender in order to fulfill its regulatory requirements. You agree to notify any particular Lender directly if you no longer want to receive communications.
              </p>
            </div>

            <div>
              <p>
                <strong>Fees.</strong> Noor Financing does not charge you any fee for its services. Noor Financing receives its compensation from the Lenders or Providers for the facilities and services provided by Noor Financing (Transmission Fees). This compensation varies by product and service. Marketing fees paid by the Lender or Provider may be included in your rate, points, or term. Although some state licensing laws treat fees paid in exchange for marketing lead generation services as mortgage broker fees or origination fees, this is not the case under federal law.
              </p>
            </div>

            <div>
              <p>
                <strong>Federal Disclosures.</strong> Any request will be forwarded to Lenders or Partners who may make certain disclosures to you. These disclosures, which are required by the Truth in Lending Act (TILA), the Real Estate Settlement Procedures Act (RESPA), and certain other federal and state laws, include details of your cost of credit and good faith estimates of your settlement costs. The Equal Credit Opportunity Act (ECOA) prohibits creditors from discriminating against credit applicants on the basis of race, color, religion, national origin, sex, marital status, or age. The agency that administers compliance with this law for Lenders may include the Federal Trade Commission, Equal Credit Opportunity, Consumer Response Center, Washington, DC 20580.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Texas State Licensing</h2>
              <p className="mb-2">Noor Financing, Texas SML Mortgage Company License, NMLS ID #2780355.</p>
              <p>Amaar Habib, Residential Mortgage Loan Originator, NMLS ID #2780631</p>
            </div>

            <div>
              <p>
                <strong>Texas Residential Mortgage Loan Originator Disclosure.</strong> The information in this disclosure is provided to clarify the nature of our relationship and how we are compensated. This disclosure is a requirement of the Texas Mortgage Company Act. We will submit your loan request to participating Lenders with whom we have entered into separate independent contractor agreements. In connection with this mortgage loan, we are acting as an independent contractor and not as your agent. While we seek to assist you in meeting your financial needs, we do not distribute the products of all lenders in the market and cannot guarantee the lowest or best terms available. Noor Financing will not charge you a fee to use its services; it receives compensation from the Lender for the facilities and services actually provided. These fees are paid by the Lender and are not refundable under any conditions.
              </p>
            </div>

            <div>
              <p>
                <strong>Texas Regulatory Notice.</strong> CONSUMERS WISHING TO FILE A COMPLAINT AGAINST NOOR FINANCING OR A RESIDENTIAL MORTGAGE LOAN ORIGINATOR LICENSED IN TEXAS SHOULD SEND A COMPLETED COMPLAINT FORM TO THE DEPARTMENT OF SAVINGS AND MORTGAGE LENDING (SML); 2601 N. LAMAR BLVD., SUITE 201, AUSTIN, TEXAS 78705; TEL. 1-877-276-5500. FORMS AND INFORMATION ARE AVAILABLE AT WWW.SML.TEXAS.GOV. A TOLL-FREE CONSUMER HOTLINE IS AVAILABLE AT 1-877-276-5550. THE DEPARTMENT MAINTAINS A RECOVERY FUND TO MAKE PAYMENTS OF CERTAIN ACTUAL OUT-OF-POCKET DAMAGES SUSTAINED BY BORROWERS CAUSED BY ACTS OF LICENSED MORTGAGE COMPANY RESIDENTIAL MORTGAGE LOAN ORIGINATORS. FOR MORE INFORMATION ABOUT THE RECOVERY FUND, PLEASE CONSULT THE DEPARTMENT'S WEBSITE AT <a href="https://www.sml.texas.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">WWW.SML.TEXAS.GOV</a>.
              </p>
            </div>

            <div className="border-t pt-6 mt-8">
              <p className="font-bold text-center">
                PLEASE PRINT AND RETAIN A COPY OF THIS DISCLOSURE FOR YOUR RECORDS.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have questions or concerns about these Licenses and Legal Disclosures, please contact us:
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

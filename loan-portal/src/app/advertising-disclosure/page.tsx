import Image from "next/image"

export default function AdvertisingDisclosurePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Advertising Disclosure
          </h1>
          <p className="text-sm text-slate-500 mb-8">Last Updated: February 23, 2026</p>

          <div className="prose prose-slate max-w-none space-y-6">
            <p className="font-semibold">
              NOOR FINANCING LLC IS A MARKETING LEAD GENERATOR AND IS A DULY LICENSED MORTGAGE COMPANY, AS REQUIRED BY LAW, WITH ITS MAIN OFFICE LOCATED AT 434 Apple Core Way, Richmond, TX 77406, TELEPHONE NUMBER 346-521-8425.
            </p>

            <div>
              <p>
                <strong>Advertised Terms and Information.</strong> The information and disclosures provided herein relate to advertised terms made by or through Noor Financing LLC.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Noor Financing LLC is not a lender in any transaction and does not make loans, loan commitments, or lock-rates.</li>
                <li>Interest rates, profit rates, and terms are provided by third-party Network Partners (lenders) with whom Noor Financing LLC may match you.</li>
                <li>All credit decisions, including loan approval and the conditional rates and terms you are offered, are the sole responsibility of the participating lenders and will vary based upon your specific financial situation and the criteria determined by the lenders.</li>
                <li>Not all consumers will qualify for the advertised rates and terms. Noor Financing LLC does not guarantee that any lender will make you a conditional loan offer. Noor Financing LLC arranges for multiple conditional financing offers through its network of nonaffiliated lenders.</li>
              </ul>
            </div>

            <div>
              <p>
                <strong>Licensing and NMLS Identification.</strong> Noor Financing LLC is a licensed mortgage entity in the State of Texas. For a current list of applicable state licensing and specific regulatory disclosures, please visit our <a href="/licenses" className="text-blue-600 hover:underline font-semibold">Licenses and Disclosures</a> page or call for details.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Noor Financing LLC NMLS Unique Identifier #2780355.</li>
                <li>Amaar Asim Habib, Residential Mortgage Loan Originator, NMLS ID #2780631.</li>
              </ul>
            </div>

            <div>
              <p>
                <strong>Shariah-Compliant Product Transparency.</strong> Noor Financing specializes in facilitating access to Shariah-compliant financial products. While these products are structured as profit-sharing or cost-plus arrangements (such as Murabaha, Musharaka, or Ijara) and avoid the use of traditional interest (Riba), they remain subject to United States federal disclosure requirements.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Annual Percentage Rate (APR). In accordance with the federal Truth in Lending Act (TILA) and Regulation Z, the cost of financing for any product featured on this platform is disclosed as an Annual Percentage Rate (APR). This is a regulatory requirement intended to provide consumers with a uniform standard for comparing the costs of different financial products.</li>
                <li>Profit Rates. References to "rates" or "cost of financing" refer to the profit markup or rental rate associated with Shariah-compliant contracts. The APR may include other costs of credit, such as origination fees or points, as required by law.</li>
              </ul>
            </div>

            <div>
              <p>
                <strong>Communications and Consent.</strong> By submitting an inquiry or providing your contact information, you are providing express written consent for Noor Financing LLC and its Network Partners to contact you for marketing and administrative purposes.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Communications may include telephone calls, text messages, and emails.</li>
                <li>You may be contacted via automated technology, including autodialers and pre-recorded messages, even if your number is on a National or State Do Not Call Registry.</li>
                <li>Consent is not a condition of purchase or a requirement to use our Services. You may opt out of these communications at any time by following the instructions provided in our Privacy Policy.</li>
              </ul>
            </div>

            <div>
              <p>
                <strong>Credit Score and FICO Disclosure.</strong> FICO score refers to the FICO credit score report that a lender receives from a consumer reporting agency. Use of this platform authorizes Noor Financing LLC and its participating Network Partners to obtain credit report information to facilitate your request for financing and provide accurate conditional offers.
              </p>
            </div>

            <div>
              <p>
                <strong>Equal Housing Opportunity.</strong> Noor Financing LLC conducts business in accordance with the Fair Housing Act and the Equal Credit Opportunity Act. We do not discriminate on the basis of race, color, religion, national origin, sex, handicap, or familial status. All Shariah-compliant products are available to any qualified applicant regardless of religious or ethical affiliation.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have questions or concerns about this Advertising Disclosure, please contact us:
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
                Noor Financing LLC is currently in the licensing process and is not yet accepting applications or conducting mortgage brokerage activities. Noor Financing technology and processes are proprietary to Noor Financing LLC. © 2026 Noor Financing LLC. All Rights Reserved. This site is directed at, and made available to, persons in Texas only.
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
import Image from "next/image"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Use</h1>
          <p className="text-sm text-slate-500 mb-8">Last Updated: February 23, 2026</p>

          <div className="prose prose-slate max-w-none space-y-6">
            {/* Important Notice */}
            <div className="bg-slate-100 p-4 rounded-lg">
              <p className="font-bold text-sm">
                THIS AGREEMENT CONTAINS A MANDATORY ARBITRATION PROVISION, A JURY TRIAL WAIVER, AND A CLASS ACTION WAIVER THAT RESTRICT YOUR LEGAL REMEDIES IN THE EVENT OF A DISPUTE. PLEASE REVIEW THE SECTION ENTITLED "DISPUTE RESOLUTION" CAREFULLY.
              </p>
            </div>

            {/* Introduction */}
            <div>
              <p>
                This Terms of Use Agreement ("Agreement") governs your access to and use of the websites, mobile applications, and digital services (collectively, the "Services") owned or operated by Noor Financing LLC ("Noor Financing," "we," "us," or "our"). By accessing or using the Services, you acknowledge that you have read, understood, and agree to be bound by this Agreement and our Privacy Policy, which is incorporated herein by reference.
              </p>
            </div>

            {/* Definitions */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Definitions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>"You" or "your" refers to the individual accessing the Services or the entity on whose behalf such individual is acting.</li>
                <li>"Network Partner" refers to the third-party lenders, financial institutions, and service providers that participate in our marketplace to offer Shariah-compliant financial products.</li>
                <li>"Inquiry Form" refers to the digital request you submit to be matched with one or more Network Partners.</li>
              </ul>
            </div>

            {/* Eligibility and Geographic Scope */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Eligibility and Geographic Scope</h2>
              <p>
                The Services are intended solely for individuals who are at least 18 years of age and reside within the United States. By using the Services, you represent and warrant that you meet these eligibility requirements. Noor Financing makes no representation that the Services are appropriate or available for use in locations outside of the United States or the State of Texas.
              </p>
            </div>

            {/* Privacy and Data Retention */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Privacy and Data Retention</h2>
              <p>
                Your use of the Services is subject to our Privacy Policy. As a licensed mortgage entity in the State of Texas, Noor Financing is required by the Texas Department of Savings and Mortgage Lending (SML) and federal law to maintain certain records related to your inquiries for a period of at least three (3) years. You acknowledge that your right to request the deletion of data is subject to these mandatory regulatory retention requirements.
              </p>
            </div>

            {/* Ownership and Intellectual Property */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Ownership and Intellectual Property</h2>
              <p className="mb-4">
                All content, including text, graphics, logos, images, software, and the "look and feel" of the Services (collectively, the "Content"), is the exclusive property of Noor Financing or its licensors.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are granted a limited, non-exclusive, non-transferable license to access the Services for personal, non-commercial use only.</li>
                <li>You may not copy, reproduce, distribute, or create derivative works from the Content without express written authorization.</li>
                <li>Use of any automated system, including "robots," "spiders," or "offline readers," to access or scrape the Services is strictly prohibited.</li>
              </ul>
            </div>

            {/* Prohibited Conduct */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Prohibited Conduct</h2>
              <p className="mb-4">In connection with your use of the Services, you agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide false, inaccurate, or misleading information in any Inquiry Form.</li>
                <li>Use the Services to train, develop, or improve any artificial intelligence (AI) or machine learning models without our prior written consent.</li>
                <li>Impersonate any person or entity or misrepresent your affiliation with a person or entity.</li>
                <li>Interfere with or disrupt the integrity or performance of the Services or the data contained therein.</li>
                <li>Access or attempt to access the Services through any means other than the interface provided by Noor Financing.</li>
              </ul>
            </div>

            {/* Chatbot and AI Disclosure */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Chatbot and Artificial Intelligence Disclosure</h2>
              <p className="mb-4">We may utilize a virtual assistant or Chatbot to facilitate customer support.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Chatbot provides information based on pre-programmed scripts and generative AI.</li>
                <li>Responses provided by the Chatbot are for informational purposes only and do not constitute financial advice, loan approval, or a binding commitment.</li>
                <li>Noor Financing does not warrant the accuracy or reliability of any "Output" generated by the Chatbot. You are solely responsible for verifying any information provided by the Chatbot before taking action.</li>
              </ul>
            </div>

            {/* Disclaimers of Warranty */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Disclaimers of Warranty</h2>
              <p className="font-semibold text-sm">
                THE SERVICES AND ALL CONTENT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. NOOR FINANCING DISCLAIMS ALL WARRANTIES, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Limitation of Liability</h2>
              <p className="font-semibold text-sm">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, NOOR FINANCING SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES. IN NO EVENT SHALL OUR AGGREGATE LIABILITY EXCEED ONE HUNDRED U.S. DOLLARS ($100.00).
              </p>
            </div>

            {/* Indemnification */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Noor Financing and its officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including attorney's fees) arising from: (i) your use of the Services; (ii) your violation of this Agreement; or (iii) your violation of any third-party right, including intellectual property or privacy rights.
              </p>
            </div>

            {/* Dispute Resolution */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Dispute Resolution and Mandatory Arbitration</h2>
              <p className="mb-4">
                Any dispute, claim, or controversy arising out of or relating to this Agreement or the Services shall be resolved through final and binding individual arbitration, rather than in court.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Arbitration Rules.</strong> The arbitration will be administered by the American Arbitration Association (AAA) or JAMS under their respective consumer arbitration rules.</li>
                <li><strong>Class Action Waiver.</strong> YOU AND NOOR FINANCING AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.</li>
                <li><strong>Jury Trial Waiver.</strong> YOU HEREBY WAIVE YOUR CONSTITUTIONAL AND STATUTORY RIGHTS TO GO TO COURT AND HAVE A TRIAL IN FRONT OF A JUDGE OR A JURY.</li>
                <li><strong>Opt-Out.</strong> You have the right to opt out of this arbitration agreement within 30 days of first using the Services by sending written notice to Legal@NoorFinancing.com.</li>
              </ul>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Governing Law</h2>
              <p>
                This Agreement shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law principles. Any legal action not subject to arbitration shall be filed in the state or federal courts located in Fort Bend County, Texas.
              </p>
            </div>

            {/* Modifications to Agreement */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Modifications to Agreement</h2>
              <p>
                Noor Financing reserves the right to modify this Agreement at any time. Changes will be effective immediately upon posting to the Services. Your continued use of the Services following the posting of changes constitutes your acceptance of such modifications.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Information</h2>
              <p className="mb-4">
                If you have questions regarding these Terms of Use, please contact our Legal Department:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <ul className="list-disc pl-6 space-y-1">
                  <li>Email: <a href="mailto:support@noorfinancing.com" className="text-blue-600 hover:underline">support@noorfinancing.com</a></li>
                  <li>Mail: Noor Financing, LLC</li>
                </ul>
                <p className="mt-4">800 Bonaventure Way Suite 111</p>
                <p>Sugar Land, TX 77479</p>
                <p className="mt-4">NMLS ID: 2780355</p>
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
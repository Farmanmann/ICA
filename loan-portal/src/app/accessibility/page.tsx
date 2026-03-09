import Image from "next/image"

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">
            Noor Financing Website Accessibility Statement
          </h1>

          <div className="prose prose-slate max-w-none">
            <p>
              <strong>Our Commitment to Inclusion.</strong> Noor Financing is dedicated to ensuring
              that our digital marketplace is accessible to the widest possible audience,
              regardless of ability or technology. We believe that ethical finance should be
              available to everyone, and we are continually working to improve the user
              experience for those using assistive technologies such as screen readers,
              magnifiers, and alternative input devices.
            </p>

            <p>
              <strong>Accessibility Standards.</strong> To help us make the Noor Financing website
              a positive place for everyone, we use the{" "}
              <strong>Web Content Accessibility Guidelines (WCAG) 2.2 Level AA</strong> as our
              operational standard. These guidelines explain how to make web content more
              accessible for people with disabilities and more user-friendly for all visitors.
            </p>

            <p>
              <strong>Third-Party Content.</strong> While we strive to ensure every page under our
              direct control is fully accessible, Noor Financing may occasionally use third-party
              tools or links to external social media platforms (such as LinkedIn, X, or Instagram).
              These providers may have their own accessibility challenges that are outside of our
              immediate control. We encourage you to review the accessibility policies of these
              third-party services directly.
            </p>

            <p>
              <strong>Accessibility Feedback.</strong> We welcome your feedback on how to improve
              our digital experience. If you encounter any barriers while using our website, or
              if you find any content difficult to access, please reach out to us so we can provide
              the information in an alternative format:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg mt-4">
              <p className="font-semibold">Noor Financial - Privacy Team</p>
              <p>Email: <a href="mailto:support@noorfinancing.com" className="text-blue-600 hover:underline">support@noorfinancing.com</a></p>
              <p>Phone: 346-521-8425</p>
              <p>Address: 800 Bonaventure Way Suite 111, Sugar Land, TX 77479</p>
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

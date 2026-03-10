import Image from "next/image"

export default function SecurityPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Security Policy</h1>
          <p className="text-sm text-slate-500 mb-8">Last Updated: February 23, 2026</p>

          <div className="prose prose-slate max-w-none space-y-6">

            {/* Introduction */}
            <div>
              <p>
                While no data transmission over the Internet or information storage technology can be guaranteed to be 100% secure,
                Noor Financing LLC ("Noor Financing," "we," "our," or "us") understands the importance of protecting the safety of
                your personal information. This Security Policy summarizes the measures we take to protect your information and
                describes how we implement these safeguards across our website and digital services.
              </p>

              <p>
                For additional information about how your information is collected and used, please review our Terms of Use
                Agreement and Privacy Policy.
              </p>
            </div>

            {/* Secure Web Pages */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Secure Web Pages and Encryption
              </h2>

              <p className="mb-4">
                Transmissions between Noor Financing, our users, and authorized third-party partners are protected using
                industry-standard encryption protocols designed to safeguard information transmitted over the Internet.
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>SSL/TLS Encryption.</strong> Our website uses Secure Sockets Layer (SSL) and Transport Layer Security
                  (TLS) technologies to help prevent unauthorized parties from intercepting or reading information transmitted
                  between your browser and our systems.
                </li>

                <li>
                  <strong>Secure Connections.</strong> Users can verify that communications with Noor Financing are secure by
                  checking for the lock icon in their browser’s address bar.
                </li>

                <li>
                  <strong>Data Protection.</strong> We maintain reasonable technical safeguards designed to protect non-public
                  personal information stored in our systems from unauthorized access.
                </li>
              </ul>
            </div>

            {/* Session Management */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Session Management and Access Controls
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Session Management.</strong> Our website and digital services automatically log users out after a
                  period of inactivity to help protect accounts when devices are left unattended.
                </li>

                <li>
                  <strong>Principle of Least Privilege.</strong> Access to consumer data is restricted to employees,
                  contractors, or service providers who require such access to perform legitimate business functions.
                </li>

                <li>
                  <strong>Role-Based Access Controls.</strong> Administrative and technical controls are implemented to limit
                  access to personal information based on job responsibilities.
                </li>
              </ul>
            </div>

            {/* Infrastructure Security */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Infrastructure and Network Protection
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Firewall Protections.</strong> Our infrastructure providers implement network security protections
                  designed to monitor and restrict unauthorized access to systems and data.
                </li>

                <li>
                  <strong>Threat Monitoring.</strong> Monitoring tools and operational safeguards are used to help detect
                  suspicious activity, unauthorized access attempts, and other potential cyber threats.
                </li>
              </ul>
            </div>

            {/* Application Security */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Application Security
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Input Validation.</strong> User input is validated to help protect our systems from malicious or
                  unauthorized data submissions.
                </li>

                <li>
                  <strong>Secure Development Practices.</strong> Our development processes include code reviews and security-
                  conscious development practices intended to reduce vulnerabilities in our software.
                </li>

                <li>
                  <strong>Dependency Updates.</strong> We maintain and update software dependencies and frameworks regularly to
                  address known security vulnerabilities.
                </li>
              </ul>
            </div>

            {/* Security Monitoring */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Security Monitoring
              </h2>

              <p>
                Noor Financing maintains operational monitoring practices designed to detect unusual activity and protect the
                integrity of our systems and user accounts. When suspicious activity is identified, appropriate investigation
                and response procedures are initiated.
              </p>
            </div>

            {/* Vulnerability Reporting */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Vulnerability Reporting
              </h2>

              <p className="mb-4">
                Noor Financing maintains a proactive security posture and encourages the responsible disclosure of potential
                security issues.
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Security researchers and users are invited to report suspected vulnerabilities affecting Noor Financing
                  systems or services.
                </li>

                <li>
                  Reports can be submitted to our security team at{" "}
                  <a href="mailto:support@noorfinancing.com" className="text-blue-600 hover:underline">
                    support@noorfinancing.com
                  </a>.
                </li>

                <li>
                  Our team will acknowledge receipt of each report, conduct an investigation, and take appropriate action for
                  resolution.
                </li>
              </ul>
            </div>

            {/* Incident Response */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Incident Response
              </h2>

              <p>
                In the event of a security incident, Noor Financing follows internal procedures to investigate, contain, and
                remediate the issue. If an incident affects personal information, affected users will be notified as required
                under applicable laws and regulations.
              </p>
            </div>

            {/* Consumer Concerns */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Consumer Concerns
              </h2>

              <p className="mb-4">
                If you have questions or concerns regarding the security of your account or suspect fraudulent activity,
                please contact Noor Financing customer support immediately.
              </p>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="font-semibold">Noor Financing LLC</p>
                <p>
                  Email:{" "}
                  <a href="mailto:support@noorfinancing.com" className="text-blue-600 hover:underline">
                    support@noorfinancing.com
                  </a>
                </p>
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <a href="/privacy" className="text-blue-300 hover:text-blue-200 text-sm text-center">Privacy Policy</a>
            <a href="/advertising-disclosure" className="text-blue-300 hover:text-blue-200 text-sm text-center">Advertising Disclosure</a>
            <a href="/security-policy" className="text-blue-300 hover:text-blue-200 text-sm text-center">Security Policy</a>
            <a href="/terms" className="text-blue-300 hover:text-blue-200 text-sm text-center">Terms of Use</a>
            <a href="/licenses" className="text-blue-300 hover:text-blue-200 text-sm text-center">Licenses & Legal Disclosures</a>
            <a href="/electronic-disclosure" className="text-blue-300 hover:text-blue-200 text-sm text-center">Electronic Disclosure</a>
            <a href="/dnc" className="text-blue-300 hover:text-blue-200 text-sm text-center">DNC</a>
            <a href="/sms-terms" className="text-blue-300 hover:text-blue-200 text-sm text-center">SMS Terms & Conditions</a>
            <a href="/accessibility" className="text-blue-300 hover:text-blue-200 text-sm text-center">Accessibility Statement</a>
          </div>

          <div className="max-w-6xl mx-auto mt-10 px-6">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">

              <p className="text-slate-400 text-xs leading-relaxed text-left md:max-w-4xl">
                Noor Financing LLC is a Marketing Lead Generator and is a Duly Licensed Mortgage Company, as required by law, with its main office located at 800 Bonaventure Way Suite 111, Sugar Land, TX 77479. NMLS Unique Identifier #2780355. Noor Financing is a marketplace; we do not fund, originate, or service loans. All credit decisions are made by independent third-party lenders. Noor Financing technology and processes are proprietary to Noor Financing LLC. © 2026 Noor Financing LLC. All Rights Reserved. This site is directed at, and made available to, persons in Texas only. 
              </p>

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
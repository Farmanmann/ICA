# Noor Financing — Loan Portal

A Sharia-compliant Islamic home financing marketplace connecting borrowers with ethical financiers. Built with Next.js 14 and Supabase.

**Target Launch: May 2026** · Currently live at [noorfinancing.com](https://noorfinancing.com) in pre-launch / coming-soon mode.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, `"use client"` pages) |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| Styling | Tailwind CSS with custom hex color palette |
| UI Components | shadcn/ui (`Card`, `Button`, `Badge`, `Alert`) |
| Icons | Lucide React + Google Material Symbols Outlined |
| Language | TypeScript |
| Deployment | Vercel |

---

## Project Structure

```
loan-portal/
└── src/
    ├── app/
    │   ├── page.tsx                        # Landing / coming-soon page
    │   ├── layout.tsx
    │   ├── auth/                           # Authentication flows
    │   ├── borrower/                       # Borrower portal
    │   ├── lender/                         # Financier portal
    │   ├── admin/                          # Admin portal
    │   └── (legal pages)                   # /privacy, /terms, /faq, etc.
    ├── lib/
    │   ├── supabase/                       # Supabase client/server/middleware
    │   ├── api/                            # API service layer
    │   └── store/                          # Auth + loan application stores
    └── components/
        └── ui/                             # shadcn/ui components
```

---

## Running Locally

```bash
cd loan-portal
npm install
npm run dev
```

App runs at `http://localhost:3000`.

### Environment Variables

Create a `.env.local` file in the `loan-portal/` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## What Is Built

### Landing Page (`/`)
- Coming soon page with animated background, staggered fade-in animations
- "Join the Waitlist" → routes borrowers to signup
- "Sign Up As A Financier" → opens an inline slide-in drawer with the full lender registration form (no page navigation needed)
- Full legal footer with NMLS disclosure, Equal Housing logo, and all compliance links

---

### Authentication (`/auth/`)

| Route | Purpose |
|---|---|
| `/auth/login` | Login for all user types |
| `/auth/signup-borrower` | Borrower registration |
| `/auth/signup-lender` | Lender registration (also embedded in landing page drawer) |
| `/auth/forgot-password` | Password reset request |
| `/auth/reset-password` | Reset form (email link) |
| `/auth/update-password` | Change password when authenticated |
| `/auth/check-email` | Post-signup email verification prompt |
| `/auth/verify-email` | Email verification handler |
| `/auth/confirmed` | Post-verification success screen |
| `/auth/callback` | Supabase OAuth callback route |
| `/auth/auth-code-error` | OAuth error handler |

Supabase auth stores `role` (`borrower` / `lender`), `full_name`, `phone`, `organization`, and `lender_type` in user metadata at signup.

---

### Borrower Portal (`/borrower/`)

#### Dashboard (`/borrower/dashboard`)
- Navy blue color scheme (`#1a3c6e` primary, `#0f2340` dark, `#2463a8` accent)
- Stat cards: **Pending Applications**, **Submitted Applications**, **Offers Received**
- Offers table: Property, Financier, Profit Rate, APR, Monthly Payment, Status
- Reads from Supabase `loans` and `bids` tables filtered to the logged-in borrower

#### 5-Step Loan Application

All steps persist state to `localStorage` under the key `loanApplication`. The final step submits everything to the Supabase `loans` table.

| Step | Route | Fields |
|---|---|---|
| 1 | `/borrower/apply/personal-info` | Financing type (Murabaha / Musharakah / No Preference), Purpose (Home Purchase / Refinance / Investment Home), Home address, Buying stage, Date of birth, Credit event (no / yes / bankruptcy / foreclosure) |
| 2 | `/borrower/apply/propertly-details` ⚠️ | Property address, Estimated property value, Property type (Single Family / Townhome / Condo / Multi-Family), Occupancy (Primary / Secondary / Investment), Down payment %, First-time buyer (yes/no), Co-borrower (yes/no) |
| 3 | `/borrower/apply/financial-info` | Estimated purchase price, Repayment term (free numeric input in months), Employment status, Annual income, Credit score |
| 4 | `/borrower/apply/documents` | Government ID upload (**required**), Income proof (optional), Bank statements (optional) |
| 5 | `/borrower/apply/review` | Review all collected data and submit. Government ID is enforced — Submit button is disabled without it. |

> ⚠️ **Known typo:** The Step 2 folder is named `propertly-details` (not `property-details`). All internal links already reference this misspelled path — do not rename without updating every reference.

#### Other Borrower Pages (stubs)
- `/borrower/settings` — account settings
- `/borrower/payments` — payment history / schedule (placeholder)
- `/borrower/calculator` — financing calculator (placeholder)
- `/borrower/verification` — identity verification (placeholder)

---

### Financier Portal (`/lender/`)

#### Dashboard (`/lender/dashboard`)
- Stat cards: **Offers Sent**, **Offers Accepted**
- My Offers table: Property, Borrower, Profit Rate, APR, Monthly Payment, Status
- Reads from Supabase `bids` table filtered to current financier's `lender_id`

#### Browse Applications (`/lender/bidding`)
- Grid of loan cards showing: purchase price, term, down payment %, occupancy type
- Clicking a card opens a **slide-in right panel** with the full borrower profile:
  - Property Details (address, type, occupancy, value, first-time buyer, co-borrower)
  - Financing Request (type, purpose, purchase price, term, down payment)
  - Borrower Profile (employment, income, credit score, DOB, buying stage, home address)
- "Send Offer" button in the panel opens a modal to submit:
  - Profit Rate (%), APR (%), Total Monthly Payment ($), optional note
  - Inserts a row into Supabase `bids` table
- Filter bar to filter by term length

#### Settings (`/lender/settings`)
- Account settings page

---

### Admin Portal (`/admin/`)

> ⚠️ **Currently broken in production.** The admin portal points to `http://localhost:8000/api/` (a legacy Django backend) and will not function outside of a local development environment with that backend running. This must be migrated to Supabase before launch.

| Route | Purpose |
|---|---|
| `/admin/dashboard` | Lists all loan applications with search and status filter |
| `/admin/loans/[id]` | Individual loan detail view |
| `/admin/verifications` | Manage identity/income verifications |
| `/admin/reports` | Reporting and analytics |

---

### Legal & Static Pages

All pages exist and are accessible. Content should be reviewed by a lawyer before launch.

`/about` · `/contact` · `/faq` · `/how-it-works` · `/products` · `/sharia` · `/privacy` · `/terms` · `/licenses` · `/security-policy` · `/accessibility` · `/advertising-disclosure` · `/electronic-disclosure` · `/sms-terms` · `/dnc`

---

## Database Schema (Supabase)

### `loans` — borrower applications
`borrower_id`, `borrower_name`, `email`, `phone`, `address`, `loan_type`, `purpose`, `buying_stage`, `property_address`, `property_value`, `property_type`, `occupancy_type`, `down_payment_percent`, `first_time_buyer`, `has_co_borrower`, `amount`, `term`, `employment_status`, `annual_income`, `credit_score`, `date_of_birth`, `credit_event`, `status`

### `bids` — financier offers
`loan_id`, `lender_id`, `amount`, `profit_rate`, `apr`, `monthly_payment`, `note`, `status`

---

## Islamic Finance Terminology

| Term | Meaning |
|---|---|
| **Murabaha** | Cost-plus financing — the financier buys the property and sells it to the borrower at a disclosed markup, paid in installments. No interest. |
| **Musharakah** | Partnership financing — both parties co-own the property; the borrower gradually buys out the financier's share over time. |
| **Profit Rate** | The financier's return expressed as a percentage — structured as a profit margin on a sale, not interest on a loan. |
| **APR** | Annual Percentage Rate — total cost of financing including fees. Used for comparison disclosures. |

---

## What Is Left Before Launch

### Critical Blockers

- [ ] **Admin portal migration** — remove all `localhost:8000` references and replace with Supabase queries. All 4 admin pages are broken in production.
- [ ] **Real document uploads** — documents are currently stored as filenames only in localStorage. Actual file upload to Supabase Storage is not implemented. The government ID gate on the review page is client-side only and does not persist or validate a real file server-side.
- [ ] **Supabase Row Level Security (RLS)** — without RLS policies, any authenticated user can read all loan applications and bids. Borrowers should only see their own loans; financiers should only see/create their own bids; admins get full access.
- [ ] **Borrower offer acceptance flow** — borrowers can see offers on the dashboard but cannot accept or reject them. The `bids.status` column exists but there is no UI for acting on it.

### Important UX

- [ ] **Lender bidding — login redirect** — when a financier is not logged in, the "Send Offer" button is disabled but there is no redirect to login. Add a clear login button in the offer modal.
- [ ] **Lender bidding — Info button visibility** — the "View Full Profile" button on cards is reported as hard to see. Needs a styling or positioning fix.
- [ ] **Email notifications** — no transactional emails are sent at any point (application submitted, offer sent, offer accepted). Needs Supabase Edge Functions or a service like Resend/SendGrid.
- [ ] **Borrower calculator** — `/borrower/calculator` is a stub. A Murabaha / Musharakah financing calculator would be a valuable pre-launch feature.
- [ ] **Mobile responsiveness audit** — dashboards and application steps were built desktop-first. Full mobile testing needed.
- [ ] **Rename `propertly-details` folder** — fix the typo in the Step 2 folder name and update all two references (`financial-info/page.tsx` Previous button + anywhere else it is linked).

### Pre-Launch Checklist

- [ ] Legal review of all static pages (Privacy Policy, Terms, Licenses, etc.)
- [ ] Confirm NMLS license number `#2780355` is active and correct
- [ ] Obtain and display Sharia certification on `/sharia` page
- [ ] Set up a separate production Supabase project (do not use the dev project in prod)
- [ ] Configure all environment variables on Vercel for production
- [ ] End-to-end smoke test: borrower signup → 5-step application → financier sees it → sends offer → borrower sees offer on dashboard
- [ ] Set up error monitoring (Sentry or equivalent)
- [ ] Set up analytics (Plausible, PostHog, or equivalent)
- [ ] Accessibility audit (WCAG 2.1 AA — required, given the Accessibility Statement page exists)

---

## Security & Compliance

Noor Financing is a mortgage marketplace subject to the **Gramm-Leach-Bliley Act (GLBA)**. As a licensed mortgage company (NMLS #2780355) that collects non-public personal information (NPI) from borrowers — including SSNs, income, credit scores, date of birth, and financial account data — the platform must implement a written Information Security Program before handling live customer data.

---

### GLBA Requirements

The GLBA Safeguards Rule (16 CFR Part 314, updated 2023) requires financial institutions to:

1. **Designate a qualified individual** responsible for the information security program
2. **Conduct a risk assessment** to identify foreseeable risks to customer NPI
3. **Implement safeguards** based on that risk assessment, including:
   - Access controls (least privilege, MFA for anyone accessing customer data)
   - Encryption of NPI in transit (TLS 1.2+) and at rest
   - Secure development practices
   - Multi-factor authentication for all personnel with access to customer information systems
   - Continuous monitoring or periodic penetration testing and vulnerability assessments
4. **Oversee service providers** — Supabase, Vercel, and any third-party vendors must have appropriate security in place (review their SOC 2 / ISO 27001 reports)
5. **Incident response plan** — written plan for responding to a data breach, including notification procedures
6. **Annual reporting** to the board of directors (or equivalent) on the security program
7. **Report to the FTC** if a breach affects 500+ customers (required within 30 days)

> Companies with fewer than 5,000 customers are exempt from some requirements (annual pen test, written risk assessment) but not from the core safeguards.

---

### Two-Factor Authentication (2FA)

**Current state:** Not implemented. Supabase Auth supports TOTP-based 2FA via `supabase.auth.mfa.*` APIs but it has not been enabled or built into the UI.

**GLBA requires MFA** for any employee or administrator accessing customer NPI. It is strongly recommended for borrowers and financiers as well.

#### Implementation Plan

**Phase 1 — Admin/Internal (required for GLBA compliance)**
- Enable Supabase MFA in the project dashboard (Auth → MFA)
- Gate the `/admin/*` portal behind MFA enrollment — redirect to an enrollment page if `aal` (authenticator assurance level) is not `aal2`
- Use `supabase.auth.mfa.enroll()` to generate a TOTP QR code and `supabase.auth.mfa.challengeAndVerify()` to verify codes

**Phase 2 — Borrowers and Financiers (recommended)**
- Add an optional MFA setup screen in `/borrower/settings` and `/lender/settings`
- On sensitive actions (submitting an application, sending an offer, accepting an offer), check that the session's `aal` is `aal2` and prompt for re-verification if not

**Key Supabase MFA APIs:**
```ts
// Enroll a new TOTP factor
const { data } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
// data.totp.qr_code — display this as a QR code for the authenticator app

// Verify during login
const { data: challenge } = await supabase.auth.mfa.challenge({ factorId })
await supabase.auth.mfa.verify({ factorId, challengeId, code })

// Check current assurance level
const { data: { currentLevel } } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
// currentLevel === 'aal2' means MFA was verified
```

---

### AWS KMS (Key Management Service)

**Current state:** Not implemented. Supabase encrypts data at rest using AES-256 at the infrastructure level, but application-level encryption of the most sensitive fields (SSN, government ID numbers, bank account numbers) using customer-managed keys is not in place.

**Why KMS:** GLBA requires encryption of NPI. Using AWS KMS gives you auditable, customer-managed encryption keys, separation of duties between data access and key access, automatic key rotation, and CloudTrail logs of every key use — all of which support GLBA compliance documentation.

#### What to Encrypt with KMS

The following fields collected in the borrower application should be encrypted at the application level before being written to Supabase, rather than relying solely on Supabase's infrastructure encryption:

| Field | Why |
|---|---|
| Government ID number / scan | Directly identifies the individual |
| Social Security Number (if collected) | Highest-risk NPI |
| Bank account numbers (if collected) | Financial account data |
| Date of birth | Combined with other fields, enables identity theft |

Fields like `annual_income`, `credit_score`, and `address` carry lower risk but may also warrant encryption depending on the risk assessment.

#### Implementation Plan

**Infrastructure setup**
1. Create an AWS KMS Customer Managed Key (CMK) in `us-east-1` (or the region matching your Supabase deployment)
2. Restrict key usage via IAM policy to only the application's IAM role — no direct human access
3. Enable automatic annual key rotation on the CMK
4. Enable AWS CloudTrail to log all KMS API calls

**Application integration**
```ts
// Server-side only (Next.js API Route or Supabase Edge Function)
import { KMSClient, EncryptCommand, DecryptCommand } from "@aws-sdk/client-kms"

const kms = new KMSClient({ region: "us-east-1" })

export async function encryptField(plaintext: string): Promise<string> {
  const { CiphertextBlob } = await kms.send(new EncryptCommand({
    KeyId: process.env.KMS_KEY_ARN,
    Plaintext: Buffer.from(plaintext),
  }))
  return Buffer.from(CiphertextBlob!).toString("base64")
}

export async function decryptField(ciphertext: string): Promise<string> {
  const { Plaintext } = await kms.send(new DecryptCommand({
    CiphertextBlob: Buffer.from(ciphertext, "base64"),
  }))
  return Buffer.from(Plaintext!).toString("utf-8")
}
```

**Architecture note:** Encryption/decryption must happen server-side only (Next.js API Routes or Supabase Edge Functions). Never expose `KMS_KEY_ARN`, `AWS_ACCESS_KEY_ID`, or `AWS_SECRET_ACCESS_KEY` to the client — these must be server-only environment variables (no `NEXT_PUBLIC_` prefix).

**New environment variables required:**
```env
KMS_KEY_ARN=arn:aws:kms:us-east-1:123456789:key/your-key-id
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
```

#### Where This Fits in the Current Codebase

- The borrower application currently writes directly to Supabase from the client (`/borrower/apply/review/page.tsx` → `supabase.from("loans").insert(...)`). To use KMS, this must be moved to a server-side API route that encrypts sensitive fields before inserting.
- Document uploads (government ID scans) must go through a server-side route that encrypts the file or stores it in an S3 bucket with SSE-KMS enabled, rather than directly to Supabase Storage.

---

### Security Checklist (Pre-Launch)

- [ ] **Enable Supabase RLS** on `loans` and `bids` tables
- [ ] **Implement MFA** for all admin users (GLBA required)
- [ ] **Add MFA enrollment UI** in borrower and financier settings
- [ ] **Set up AWS KMS CMK** and implement server-side field encryption for government IDs and other high-sensitivity NPI
- [ ] **Move sensitive writes to API routes** — remove direct Supabase client writes of NPI from browser-side code
- [ ] **Enforce HTTPS everywhere** — confirm Vercel forces TLS; no HTTP fallback
- [ ] **Rotate all secrets** before go-live (Supabase anon key, service role key, AWS keys)
- [ ] **Conduct a penetration test** — required by GLBA Safeguards Rule for companies above 5,000 customers; recommended regardless
- [ ] **Write the Information Security Program document** — required by GLBA; designate a responsible individual
- [ ] **Write the Incident Response Plan** — required by GLBA; include FTC notification procedure for breaches affecting 500+ customers
- [ ] **Review Supabase's SOC 2 report** and add it to your vendor security documentation
- [ ] **Audit CloudTrail logs** after enabling KMS to confirm all key usage is expected
- [ ] **Set up WAF (Web Application Firewall)** on Vercel or AWS CloudFront to protect against OWASP Top 10 attacks
- [ ] **Add Content Security Policy (CSP) headers** in `next.config.js` to mitigate XSS

---

## Key Design Decisions

- **Color palette:** Borrower portal = navy blue (`#1a3c6e`). Financier portal = emerald green (`#006948`). Landing page = dark slate/blue gradient.
- **Multi-step form state:** All 5 application steps share state via `localStorage` key `loanApplication`. There is no server-side draft saving — if a user clears storage, progress is lost.
- **Marketplace only:** Noor Financing does not originate or fund loans. It connects borrowers and financiers. The platform is not a lender.
- **Texas only:** Per legal footer, the platform is currently directed at persons in Texas only.

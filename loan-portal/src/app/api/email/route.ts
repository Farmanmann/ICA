import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = "Noor Financing <no-reply@noorfinancing.com>"

// ─── Email templates ──────────────────────────────────────────────────────────

function applicationSubmittedHtml(borrowerName: string, propertyAddress: string, amount: string, loanType: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f9ff;font-family:Inter,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9ff;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.07)">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a3c6e,#2463a8);padding:36px 40px">
          <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px">Noor Financing</p>
          <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:2px">Sharia-Compliant Home Financing</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px">
          <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#131b2e">Application Received</p>
          <p style="margin:0 0 28px;font-size:16px;color:#565e74">As-salamu alaykum, ${borrowerName}.</p>
          <p style="margin:0 0 28px;font-size:15px;color:#565e74;line-height:1.6">
            Your financing application has been submitted and is now under review. Qualified financiers on our platform will be able to send you offers within 2–3 business days.
          </p>
          <!-- Application Summary -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f3ff;border-radius:12px;overflow:hidden;margin-bottom:28px">
            <tr><td style="padding:20px 24px;border-bottom:1px solid #e2e7ff">
              <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#565e74">Application Summary</p>
            </td></tr>
            <tr><td style="padding:20px 24px">
              <table width="100%">
                <tr>
                  <td style="padding:6px 0"><span style="font-size:13px;color:#565e74">Property</span></td>
                  <td align="right"><span style="font-size:13px;font-weight:600;color:#131b2e">${propertyAddress || "Not yet specified"}</span></td>
                </tr>
                <tr>
                  <td style="padding:6px 0"><span style="font-size:13px;color:#565e74">Financing Amount</span></td>
                  <td align="right"><span style="font-size:13px;font-weight:600;color:#131b2e">$${parseFloat(amount).toLocaleString()}</span></td>
                </tr>
                <tr>
                  <td style="padding:6px 0"><span style="font-size:13px;color:#565e74">Structure</span></td>
                  <td align="right"><span style="font-size:13px;font-weight:600;color:#131b2e;text-transform:capitalize">${loanType?.replace(/_/g, " ")}</span></td>
                </tr>
              </table>
            </td></tr>
          </table>
          <p style="margin:0 0 28px;font-size:14px;color:#565e74;line-height:1.6">
            You can track the status of your application and view incoming offers at any time from your dashboard.
          </p>
          <a href="https://noorfinancing.com/borrower/dashboard" style="display:inline-block;background:linear-gradient(135deg,#1a3c6e,#2463a8);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 28px;border-radius:10px">
            View Your Dashboard →
          </a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #f2f3ff">
          <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6">
            Noor Financing · NMLS #2780355 · Texas only<br>
            © 2026 Noor Financing. All rights reserved.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function offerSentHtml(borrowerName: string, propertyAddress: string, profitRate: string, apr: string, monthlyPayment: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f9ff;font-family:Inter,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9ff;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.07)">
        <tr><td style="background:linear-gradient(135deg,#1a3c6e,#2463a8);padding:36px 40px">
          <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff">Noor Financing</p>
          <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:2px">Sharia-Compliant Home Financing</p>
        </td></tr>
        <tr><td style="padding:40px">
          <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#131b2e">You Have a New Offer!</p>
          <p style="margin:0 0 28px;font-size:16px;color:#565e74">As-salamu alaykum, ${borrowerName}.</p>
          <p style="margin:0 0 28px;font-size:15px;color:#565e74;line-height:1.6">
            A certified financier has reviewed your application for <strong>${propertyAddress || "your property"}</strong> and sent you a financing offer.
          </p>
          <!-- Offer Summary -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f3ff;border-radius:12px;overflow:hidden;margin-bottom:28px">
            <tr><td style="padding:20px 24px;border-bottom:1px solid #e2e7ff">
              <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#565e74">Offer Details</p>
            </td></tr>
            <tr><td style="padding:20px 24px">
              <table width="100%">
                ${profitRate ? `<tr>
                  <td style="padding:6px 0"><span style="font-size:13px;color:#565e74">Profit Rate</span></td>
                  <td align="right"><span style="font-size:13px;font-weight:700;color:#1a3c6e">${profitRate}%</span></td>
                </tr>` : ""}
                ${apr ? `<tr>
                  <td style="padding:6px 0"><span style="font-size:13px;color:#565e74">APR</span></td>
                  <td align="right"><span style="font-size:13px;font-weight:600;color:#131b2e">${apr}%</span></td>
                </tr>` : ""}
                ${monthlyPayment ? `<tr>
                  <td style="padding:6px 0"><span style="font-size:13px;color:#565e74">Monthly Payment</span></td>
                  <td align="right"><span style="font-size:16px;font-weight:800;color:#131b2e">$${parseFloat(monthlyPayment).toLocaleString()}</span></td>
                </tr>` : ""}
              </table>
            </td></tr>
          </table>
          <p style="margin:0 0 28px;font-size:14px;color:#565e74;line-height:1.6">
            Log in to your dashboard to review the full offer details and accept or decline.
          </p>
          <a href="https://noorfinancing.com/borrower/dashboard" style="display:inline-block;background:linear-gradient(135deg,#1a3c6e,#2463a8);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 28px;border-radius:10px">
            Review the Offer →
          </a>
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #f2f3ff">
          <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6">
            Noor Financing · NMLS #2780355 · Texas only<br>© 2026 Noor Financing. All rights reserved.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function offerAcceptedHtml(propertyAddress: string, amount: string, profitRate: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:Inter,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,105,72,0.08)">
        <tr><td style="background:linear-gradient(135deg,#006948,#00855d);padding:36px 40px">
          <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff">Noor Financing</p>
          <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:2px">Financier Portal</p>
        </td></tr>
        <tr><td style="padding:40px">
          <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#131b2e">Your Offer Was Accepted!</p>
          <p style="margin:0 0 28px;font-size:16px;color:#565e74">Congratulations — a borrower has accepted your financing offer.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:12px;overflow:hidden;margin-bottom:28px;border:1px solid #d1fae5">
            <tr><td style="padding:20px 24px;border-bottom:1px solid #d1fae5">
              <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#065f46">Accepted Offer</p>
            </td></tr>
            <tr><td style="padding:20px 24px">
              <table width="100%">
                <tr>
                  <td style="padding:6px 0"><span style="font-size:13px;color:#565e74">Property</span></td>
                  <td align="right"><span style="font-size:13px;font-weight:600;color:#131b2e">${propertyAddress || "—"}</span></td>
                </tr>
                <tr>
                  <td style="padding:6px 0"><span style="font-size:13px;color:#565e74">Financing Amount</span></td>
                  <td align="right"><span style="font-size:13px;font-weight:600;color:#131b2e">$${parseFloat(amount || "0").toLocaleString()}</span></td>
                </tr>
                ${profitRate ? `<tr>
                  <td style="padding:6px 0"><span style="font-size:13px;color:#565e74">Your Profit Rate</span></td>
                  <td align="right"><span style="font-size:13px;font-weight:700;color:#006948">${profitRate}%</span></td>
                </tr>` : ""}
              </table>
            </td></tr>
          </table>
          <p style="margin:0 0 28px;font-size:14px;color:#565e74;line-height:1.6">
            The Noor Financing team will be in touch with next steps for completing the transaction. You can view this offer in your financier dashboard.
          </p>
          <a href="https://noorfinancing.com/lender/dashboard" style="display:inline-block;background:linear-gradient(135deg,#006948,#00855d);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 28px;border-radius:10px">
            View Your Dashboard →
          </a>
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #d1fae5">
          <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6">
            Noor Financing · NMLS #2780355 · Texas only<br>© 2026 Noor Financing. All rights reserved.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body

    if (type === "application_submitted") {
      const { borrowerEmail, borrowerName, propertyAddress, amount, loanType } = body
      if (!borrowerEmail) return NextResponse.json({ error: "Missing borrowerEmail" }, { status: 400 })

      const { error } = await resend.emails.send({
        from: FROM,
        to: borrowerEmail,
        subject: "Your Noor Financing Application Has Been Submitted",
        html: applicationSubmittedHtml(borrowerName, propertyAddress, amount, loanType),
      })
      if (error) throw error

    } else if (type === "offer_sent") {
      const { borrowerEmail, borrowerName, propertyAddress, profitRate, apr, monthlyPayment } = body
      if (!borrowerEmail) return NextResponse.json({ error: "Missing borrowerEmail" }, { status: 400 })

      const { error } = await resend.emails.send({
        from: FROM,
        to: borrowerEmail,
        subject: "You Have a New Financing Offer on Noor",
        html: offerSentHtml(borrowerName, propertyAddress, profitRate, apr, monthlyPayment),
      })
      if (error) throw error

    } else if (type === "offer_accepted") {
      const { lenderEmail, propertyAddress, amount, profitRate } = body
      if (!lenderEmail) return NextResponse.json({ error: "Missing lenderEmail" }, { status: 400 })

      const { error } = await resend.emails.send({
        from: FROM,
        to: lenderEmail,
        subject: "Your Financing Offer Was Accepted — Noor Financing",
        html: offerAcceptedHtml(propertyAddress, amount, profitRate),
      })
      if (error) throw error

    } else {
      return NextResponse.json({ error: "Unknown email type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Email error:", err)
    return NextResponse.json({ error: err.message || "Failed to send email" }, { status: 500 })
  }
}

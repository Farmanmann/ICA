import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil" })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      loan_id,
      lender_id,
      lender_email,
      amount,
      profit_rate,
      apr,
      monthly_payment,
      note,
      borrower_email,
      borrower_name,
      property_address,
    } = body

    if (!loan_id || !lender_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Financing Offer Fee",
              description: `Submit offer for ${property_address || "financing application"}`,
            },
            unit_amount: 7500, // $75.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/lender/bid-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/lender/bidding`,
      customer_email: lender_email || undefined,
      metadata: {
        loan_id,
        lender_id,
        lender_email: lender_email || "",
        amount: String(amount),
        profit_rate: String(profit_rate ?? ""),
        apr: String(apr ?? ""),
        monthly_payment: String(monthly_payment ?? ""),
        note: (note || "").slice(0, 490),
        borrower_email: (borrower_email || "").slice(0, 490),
        borrower_name: (borrower_name || "").slice(0, 490),
        property_address: (property_address || "").slice(0, 490),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("Stripe checkout error:", err)
    return NextResponse.json({ error: err.message || "Failed to create checkout session" }, { status: 500 })
  }
}

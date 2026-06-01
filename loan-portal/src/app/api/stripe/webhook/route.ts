import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil" })

// Use service role key so the webhook can write to DB without an auth session
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true })
    }

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
    } = session.metadata!

    // Insert the bid now that payment is confirmed
    const { error: insertError } = await supabase.from("bids").insert({
      loan_id,
      lender_id,
      lender_email,
      amount: parseFloat(amount),
      profit_rate: profit_rate ? parseFloat(profit_rate) : null,
      apr: apr ? parseFloat(apr) : null,
      monthly_payment: monthly_payment ? parseFloat(monthly_payment) : null,
      note: note || null,
      status: "pending",
      stripe_session_id: session.id,
    })

    if (insertError) {
      console.error("Failed to insert bid:", insertError)
      return NextResponse.json({ error: "Failed to save bid" }, { status: 500 })
    }

    // Notify borrower via email
    if (borrower_email) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "offer_sent",
          borrowerEmail: borrower_email,
          borrowerName: borrower_name,
          propertyAddress: property_address,
          profitRate: profit_rate,
          apr,
          monthlyPayment: monthly_payment,
        }),
      }).catch((e) => console.error("Email notification failed:", e))
    }
  }

  return NextResponse.json({ received: true })
}

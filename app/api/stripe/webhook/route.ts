import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { assertStripe, creditsForCheckoutSession } from "@/lib/stripe"
import { grantStripeCredits } from "@/lib/credits"

// Stripe webhooks must read the raw request body to verify the signature.
// Force this route onto the Node runtime (Buffer / crypto) and disable any
// caching/static optimisation.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const stripe = assertStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    )
  }

  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  // The raw body is required for signature verification.
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed", err)
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${(err as Error).message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session

        // Only act on fully paid sessions.
        if (session.payment_status !== "paid") {
          return NextResponse.json({ received: true, skipped: "unpaid" })
        }

        // Determine customer email. Stripe payment links collect this on the
        // hosted checkout page, so it should always be present.
        const customerObject =
          typeof session.customer === "object" && session.customer && !session.customer.deleted
            ? session.customer
            : null

        const email =
          session.customer_details?.email ||
          session.customer_email ||
          customerObject?.email ||
          null

        if (!email) {
          console.error("[stripe/webhook] no email on session", session.id)
          return NextResponse.json(
            { error: "No customer email on session" },
            { status: 400 }
          )
        }

        const credits = await creditsForCheckoutSession(session)
        if (credits <= 0) {
          console.error(
            "[stripe/webhook] no credit mapping for session",
            session.id,
            "payment_link:",
            session.payment_link
          )
          return NextResponse.json({
            received: true,
            skipped: "unknown_payment_link",
          })
        }

        const result = await grantStripeCredits({
          email,
          amount: credits,
          stripeSessionId: session.id,
          name: session.customer_details?.name ?? null,
          metadata: {
            stripe_event_id: event.id,
            payment_link:
              typeof session.payment_link === "string"
                ? session.payment_link
                : session.payment_link?.id,
            amount_total: session.amount_total,
            currency: session.currency,
          },
        })

        if (result.alreadyProcessed) {
          return NextResponse.json({ received: true, duplicate: true })
        }

        return NextResponse.json({
          received: true,
          credits_granted: credits,
          new_balance: result.newBalance,
          email,
        })
      }

      default:
        // We deliberately ignore other event types.
        return NextResponse.json({ received: true, ignored: event.type })
    }
  } catch (err) {
    console.error("[stripe/webhook] handler error", err)
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    )
  }
}

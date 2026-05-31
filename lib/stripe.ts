import Stripe from "stripe"

const secretKey = process.env.STRIPE_SECRET_KEY

// Single shared Stripe client (server-side only).
// We don't pin an apiVersion so we use the latest version the installed
// stripe-node package was built against, which matches its TypeScript types.
export const stripe = secretKey
  ? new Stripe(secretKey, { typescript: true })
  : (null as unknown as Stripe)

export function assertStripe(): Stripe {
  if (!stripe) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local before using Stripe APIs."
    )
  }
  return stripe
}

/**
 * Mapping of Stripe Payment Link IDs -> credits granted.
 *
 * The Payment Link ID is the portion after `https://buy.stripe.com/` in the
 * link URL. When Stripe fires `checkout.session.completed` for a payment-link
 * purchase, the session's `payment_link` field contains a `plink_...` ID. We
 * also keep the short ID from the buy.stripe.com URL so we can do a quick
 * lookup in webhook code that prefers the URL-style ID (more stable to copy
 * out of the Stripe dashboard).
 */
export const PAYMENT_LINK_CREDITS: Record<string, number> = {
  // Single press release — $39
  "4gMcN5fhpaxPgBWbQzao80U": 1,
  // Bundle of 10 — $300
  "14A14n8T121j1H24o7ao80V": 10,
}

/**
 * Resolve the credit amount for a given Stripe checkout session, by inspecting
 * its associated Payment Link. Returns 0 if we can't identify the link.
 */
export async function creditsForCheckoutSession(
  session: Stripe.Checkout.Session
): Promise<number> {
  // session.payment_link can be either a string ID or an expanded object
  const paymentLink =
    typeof session.payment_link === "string"
      ? await assertStripe().paymentLinks.retrieve(session.payment_link)
      : session.payment_link

  if (!paymentLink) return 0

  // Stripe Payment Link `url` looks like https://buy.stripe.com/<shortId>
  const url: string | undefined = (paymentLink as Stripe.PaymentLink).url
  if (url) {
    const shortId = url.split("/").pop()?.split("?")[0]
    if (shortId && PAYMENT_LINK_CREDITS[shortId] !== undefined) {
      return PAYMENT_LINK_CREDITS[shortId]
    }
  }

  // Fall back to a metadata-based lookup so non-technical users can override
  // via Stripe dashboard -> Payment Link -> Metadata -> credits=<N>.
  const metaCredits = (paymentLink as Stripe.PaymentLink).metadata?.credits
  if (metaCredits) {
    const n = parseInt(metaCredits, 10)
    if (!Number.isNaN(n) && n > 0) return n
  }

  return 0
}

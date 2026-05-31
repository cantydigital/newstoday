# Stripe payments + credits — setup guide

This document walks through wiring the production environment so paid press
releases work end-to-end.

## Overview

1. A visitor opens `/pricing` and clicks **Buy 1 Release** or **Buy 10
   Releases**. They are sent to a hosted Stripe Payment Link.
2. After payment Stripe fires `checkout.session.completed` to our webhook at
   `/api/stripe/webhook`. The webhook:
   - verifies the Stripe signature,
   - identifies the Payment Link → looks up how many credits to grant,
   - upserts a row in `pr_users` keyed by the customer's email and increments
     `credits`,
   - records the event in `pr_credit_transactions` (idempotent via the
     Stripe session id so duplicate deliveries don't double-credit).
3. The user goes to `/submit` and enters their press release using **the same
   email address** they paid with. The form posts to
   `/api/press-release/submit`, which:
   - inserts the press release as a `draft`,
   - calls `pr_consume_credit` for that email. If the user has ≥1 credit, the
     draft is marked `payment_received = true`. Otherwise the draft is still
     saved but flagged unpaid.
4. The admin reviews drafts in `/admin/dashboard` and clicks **Approve &
   Publish**. The server action:
   - sets `status = 'published'`,
   - stores `published_url`,
   - sends a Resend email to the author with the live URL.

## 1. Database

Run `STRIPE_PAYMENT_SETUP.sql` in the Supabase SQL Editor (after
`COMPLETE_SUPABASE_SETUP.sql` has been applied at least once). It:

- adds `payment_received` and `published_url` columns to `press_releases`,
- creates `pr_users` and `pr_credit_transactions`,
- creates `pr_add_credits`, `pr_consume_credit`, `pr_admin_adjust_credits`
  stored procedures used by the server,
- protects the new tables with RLS that only the service-role key bypasses.

## 2. Environment variables (`.env.local`)

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # Project Settings → API → service_role

# Stripe — public payment links (used on /pricing)
NEXT_PUBLIC_STRIPE_SINGLE_PAYMENT_LINK=https://buy.stripe.com/4gMcN5fhpaxPgBWbQzao80U
NEXT_PUBLIC_STRIPE_BUNDLE_PAYMENT_LINK=https://buy.stripe.com/14A14n8T121j1H24o7ao80V

# Stripe — server only
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=News Today <noreply@newstoday.com.au>

# Used to construct live URLs in the publish email
NEXT_PUBLIC_SITE_URL=https://newstoday.com.au
```

## 3. Stripe — Payment Links + webhook

### 3a. Payment Links

The two existing payment links are already wired to credits in
`lib/stripe.ts`:

```ts
export const PAYMENT_LINK_CREDITS: Record<string, number> = {
  "4gMcN5fhpaxPgBWbQzao80U": 1,   // Single $39
  "14A14n8T121j1H24o7ao80V": 10,  // Bundle of 10, $300
}
```

To add or change links, edit this object. (Alternatively, set
`metadata.credits = "<N>"` on the Payment Link in the Stripe dashboard and the
webhook will pick it up automatically.)

**Important:** every Payment Link MUST collect the customer email
(Stripe defaults this on). The webhook needs the email to assign credits.

### 3b. Webhook endpoint

In the Stripe dashboard → **Developers → Webhooks → Add endpoint**:

- URL: `https://<your-domain>/api/stripe/webhook`
- Events to send:
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded` (covers delayed bank methods)
- Copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET`.

### 3c. Local testing

```sh
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# In another terminal:
stripe trigger checkout.session.completed
```

Or just complete a real Payment Link checkout against your live keys (Stripe
test mode is not enabled — these are live keys).

## 4. Resend

1. Create an account at https://resend.com.
2. Verify the sending domain that matches `RESEND_FROM_EMAIL`
   (`newstoday.com.au`). Until DNS is verified Resend will only allow
   sending to the verified-account email address.
3. Copy the API key into `RESEND_API_KEY`.

If `RESEND_API_KEY` is unset, publishing still works — the email send is
logged as skipped and the admin UI shows a warning banner with the live URL
so the admin can forward it manually.

## 5. Admin workflow

- **Users & Credits** (new sidebar entry): see every user, current balance,
  total purchased / used, and full transaction history. Grant or revoke
  credits manually from this screen (useful for free press releases, refunds,
  or comps).
- **Review Releases**: each draft now has a green **Paid** badge or amber
  **Unpaid** badge. The unpaid label does NOT block publishing — it is
  informational so the admin can decide whether to publish anyway (e.g.
  promotional, partnership). Clicking **Approve** publishes the release and
  sends the email automatically.

## 6. Verifying it all works

1. Run `npm run dev`.
2. Open `/pricing` → click **Buy 1 Release**.
3. Complete a real Stripe checkout with email `you@example.com`.
4. Stripe → Webhooks → your endpoint should show a `200` for the event.
5. In `/admin/dashboard` → **Users & Credits**, you should see
   `you@example.com` with `credits: 1`, `total_purchased: 1`.
6. Open `/submit`, fill out the form using the same email and submit.
7. The success page should display *"Payment applied — 1 credit used"*.
8. In `/admin/dashboard` → **Review Releases**, the draft should have a
   **Paid** badge.
9. Click **Approve**. The user should receive an email with the live URL.
10. Back in **Users & Credits**, the user's balance should now be `0` and
    `total_used` should be `1`. The history dialog should show the purchase
    and the consumption entries.

## 7. Known limitations / future work

- The webhook only listens for the two listed event types. If new payment
  flows are added (subscriptions, etc.) handlers must be expanded.
- Stripe Payment Links don't pass arbitrary metadata back on the session, so
  we identify the product by the link's short URL ID. If you create new
  links you must add them to `PAYMENT_LINK_CREDITS`.
- Credits never expire, by design.
- Refunds / chargebacks do NOT automatically revoke credits. Use the admin
  **Users & Credits** screen to revoke if needed.

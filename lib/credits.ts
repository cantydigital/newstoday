import { assertSupabaseAdmin } from "./supabase-admin"

export type PrUser = {
  id: string
  email: string
  name: string | null
  credits: number
  total_purchased: number
  total_used: number
  created_at: string
  updated_at: string
}

export type CreditTransaction = {
  id: string
  user_id: string | null
  email: string
  amount: number
  reason: "stripe_purchase" | "submission" | "admin_grant" | "admin_revoke"
  reference: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

function norm(email: string) {
  return email.trim().toLowerCase()
}

/**
 * Grant credits from a Stripe purchase. Idempotent on `reference` (stripe
 * session id) so duplicate webhook deliveries don't double-credit.
 *
 * Returns:
 *  - { ok: true, alreadyProcessed: false, newBalance }
 *  - { ok: true, alreadyProcessed: true } if this session was already credited.
 */
export async function grantStripeCredits(params: {
  email: string
  amount: number
  stripeSessionId: string
  name?: string | null
  metadata?: Record<string, unknown>
}): Promise<
  | { ok: true; alreadyProcessed: true }
  | { ok: true; alreadyProcessed: false; newBalance: number }
> {
  const supabase = assertSupabaseAdmin()

  const { data, error } = await supabase.rpc("pr_add_credits", {
    p_email: norm(params.email),
    p_amount: params.amount,
    p_reason: "stripe_purchase",
    p_reference: params.stripeSessionId,
    p_metadata: params.metadata ?? null,
    p_name: params.name ?? null,
  })

  if (error) {
    // Unique-violation on the partial index = duplicate stripe webhook delivery
    const msg = `${error.message || ""} ${error.details || ""}`.toLowerCase()
    if (
      error.code === "23505" ||
      msg.includes("duplicate key") ||
      msg.includes("uq_pr_credit_tx_stripe_reference")
    ) {
      return { ok: true, alreadyProcessed: true }
    }
    throw new Error(`grantStripeCredits failed: ${error.message}`)
  }

  return { ok: true, alreadyProcessed: false, newBalance: data as number }
}

/**
 * Try to consume 1 credit for a press release submission. The submission
 * itself is always saved as a draft -- this only determines whether
 * `payment_received` should be true.
 */
export async function consumeOneCredit(params: {
  email: string
  pressReleaseId: string
}): Promise<{ paid: boolean }> {
  const supabase = assertSupabaseAdmin()

  const { data, error } = await supabase.rpc("pr_consume_credit", {
    p_email: norm(params.email),
    p_reference: params.pressReleaseId,
    p_metadata: null,
  })

  if (error) {
    throw new Error(`consumeOneCredit failed: ${error.message}`)
  }

  return { paid: Boolean(data) }
}

/** List all known users (most recent first). */
export async function listPrUsers(): Promise<PrUser[]> {
  const supabase = assertSupabaseAdmin()
  const { data, error } = await supabase
    .from("pr_users")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(`listPrUsers failed: ${error.message}`)
  return (data ?? []) as PrUser[]
}

/** Look up credits for an email (case-insensitive). */
export async function getUserByEmail(email: string): Promise<PrUser | null> {
  const supabase = assertSupabaseAdmin()
  const { data, error } = await supabase
    .from("pr_users")
    .select("*")
    .eq("email", norm(email))
    .maybeSingle()

  if (error) throw new Error(`getUserByEmail failed: ${error.message}`)
  return (data as PrUser) ?? null
}

/** Recent credit transactions for an email. */
export async function listTransactionsForEmail(
  email: string,
  limit = 50
): Promise<CreditTransaction[]> {
  const supabase = assertSupabaseAdmin()
  const { data, error } = await supabase
    .from("pr_credit_transactions")
    .select("*")
    .eq("email", norm(email))
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw new Error(`listTransactionsForEmail failed: ${error.message}`)
  return (data ?? []) as CreditTransaction[]
}

/** Admin-driven credit adjustment (positive = grant, negative = revoke). */
export async function adminAdjustCredits(params: {
  email: string
  delta: number
  note?: string
}): Promise<{ newBalance: number }> {
  const supabase = assertSupabaseAdmin()

  const { data, error } = await supabase.rpc("pr_admin_adjust_credits", {
    p_email: norm(params.email),
    p_delta: params.delta,
    p_note: params.note ?? null,
  })

  if (error) throw new Error(`adminAdjustCredits failed: ${error.message}`)
  return { newBalance: data as number }
}

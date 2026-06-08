import { assertSupabaseAdmin } from "./supabase-admin"

/**
 * Server-side admin session store.
 *
 * Sessions are random, high-entropy tokens persisted in the `admin_sessions`
 * table. The cookie only ever holds the opaque token -- access is granted by
 * looking the token up server-side and checking its expiry, NOT by string
 * equality to a literal value. This makes the session cookie unforgeable.
 */
const TABLE_NAME = "admin_sessions"

// 24 hours, in milliseconds.
export const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 24

/** Create a new admin session and return its opaque token. */
export async function createAdminSession(): Promise<string> {
  const supabase = assertSupabaseAdmin()

  const token = crypto.randomUUID() + crypto.randomUUID()
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_MS).toISOString()

  const { error } = await supabase
    .from(TABLE_NAME)
    .insert({ token, expires_at: expiresAt })

  if (error) {
    throw new Error(`Failed to create admin session: ${error.message}`)
  }

  return token
}

/**
 * Validate an admin session token. Returns true only if a matching,
 * non-expired session row exists. Expired rows are best-effort deleted.
 */
export async function validateAdminSession(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false

  const supabase = assertSupabaseAdmin()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("token, expires_at")
    .eq("token", token)
    .maybeSingle()

  if (error || !data) return false

  const expired = new Date(data.expires_at).getTime() <= Date.now()
  if (expired) {
    await supabase.from(TABLE_NAME).delete().eq("token", token)
    return false
  }

  return true
}

/** Delete a single admin session (logout). */
export async function deleteAdminSession(
  token: string | undefined | null
): Promise<void> {
  if (!token) return
  const supabase = assertSupabaseAdmin()
  await supabase.from(TABLE_NAME).delete().eq("token", token)
}

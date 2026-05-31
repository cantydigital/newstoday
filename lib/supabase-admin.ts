import { createClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase client that uses the service-role key. This client
 * bypasses RLS and MUST NEVER be imported into client components.
 *
 * Used by:
 *  - /api/stripe/webhook        (grant credits on purchase)
 *  - /api/press-release/submit  (consume credit, create draft, persist email)
 *  - admin server actions       (manual credit adjustments, user lookups)
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  // Defer hard failure to call sites so module import never crashes builds.
  console.warn("[supabase-admin] NEXT_PUBLIC_SUPABASE_URL is not set")
}

export const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null

export function assertSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error(
      "Supabase admin client is not configured. Set SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local."
    )
  }
  return supabaseAdmin
}

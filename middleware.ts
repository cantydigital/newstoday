import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Short-lived cache so repeated requests within the same session window don't
// each trigger a Supabase round-trip. TTL matches the server-action cache.
const SESSION_CACHE_TTL_MS = 60_000
const sessionCache = new Map<string, { valid: boolean; cachedAt: number }>()

/**
 * Validate an admin session token by looking it up server-side in the
 * `admin_sessions` table (via the Supabase REST API). Access is NEVER granted
 * by string equality to a literal value -- the token is a high-entropy random
 * string that must exist and be unexpired in the database.
 */
async function isValidAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false

  const cached = sessionCache.get(token)
  if (cached && Date.now() - cached.cachedAt < SESSION_CACHE_TTL_MS) {
    return cached.valid
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("[middleware] Supabase env not configured; denying admin access")
    return false
  }

  try {
    const url =
      `${supabaseUrl}/rest/v1/admin_sessions` +
      `?token=eq.${encodeURIComponent(token)}&select=expires_at&limit=1`

    const res = await fetch(url, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    })

    if (!res.ok) return false

    const rows = (await res.json()) as { expires_at: string }[]
    const row = rows?.[0]
    if (!row) {
      sessionCache.set(token, { valid: false, cachedAt: Date.now() })
      return false
    }

    const valid = new Date(row.expires_at).getTime() > Date.now()
    sessionCache.set(token, { valid, cachedAt: Date.now() })
    return valid
  } catch (err) {
    console.error("[middleware] session validation failed", err)
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes (except login page)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_session")?.value

    if (!(await isValidAdminSession(token))) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}

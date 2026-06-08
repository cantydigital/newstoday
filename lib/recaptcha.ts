/**
 * Server-side Google reCAPTCHA v3 verification.
 *
 * Client widgets execute `grecaptcha.execute(siteKey, { action })` and send the
 * resulting token with their request. The server then verifies that token with
 * Google here, checking the success flag, the action, and a minimum score.
 *
 * Required env vars:
 *  - NEXT_PUBLIC_RECAPTCHA_SITE_KEY (client, public)
 *  - RECAPTCHA_SECRET_KEY          (server, secret)
 *
 * If RECAPTCHA_SECRET_KEY is not configured, verification is skipped (returns
 * success) so local development without keys is not blocked. In production you
 * MUST set the secret key for protection to take effect.
 */

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"

// Minimum score (0.0 - 1.0) below which a request is treated as a bot.
const MIN_SCORE = 0.5

export type RecaptchaResult = {
  success: boolean
  score?: number
  reason?: string
}

export async function verifyRecaptcha(
  token: string | undefined | null,
  expectedAction?: string,
  remoteIp?: string
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY

  // Allow local/dev environments without keys to function.
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[recaptcha] RECAPTCHA_SECRET_KEY not set in production")
      return { success: false, reason: "captcha_not_configured" }
    }
    console.warn("[recaptcha] secret not set; skipping verification (dev only)")
    return { success: true }
  }

  if (!token) {
    return { success: false, reason: "missing_token" }
  }

  try {
    const params = new URLSearchParams({ secret, response: token })
    if (remoteIp) params.set("remoteip", remoteIp)

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    })

    const data = (await res.json()) as {
      success: boolean
      score?: number
      action?: string
      "error-codes"?: string[]
    }

    if (!data.success) {
      return {
        success: false,
        reason: (data["error-codes"] ?? []).join(",") || "verification_failed",
      }
    }

    if (expectedAction && data.action && data.action !== expectedAction) {
      return { success: false, score: data.score, reason: "action_mismatch" }
    }

    if (typeof data.score === "number" && data.score < MIN_SCORE) {
      return { success: false, score: data.score, reason: "low_score" }
    }

    return { success: true, score: data.score }
  } catch (err) {
    console.error("[recaptcha] verification request failed", err)
    return { success: false, reason: "request_error" }
  }
}

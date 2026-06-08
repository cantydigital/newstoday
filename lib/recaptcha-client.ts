"use client"

/**
 * Client-side helper for Google reCAPTCHA v3.
 *
 * Lazily injects the reCAPTCHA script (once) and returns an action-scoped
 * token to send with form submissions. The token is then verified on the
 * server via `verifyRecaptcha` in lib/recaptcha.ts.
 *
 * If NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not configured, this resolves to an
 * empty string so local development without keys is not blocked (the server
 * skips verification in non-production when the secret is also unset).
 */
declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, opts: { action: string }) => Promise<string>
    }
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

let scriptPromise: Promise<void> | null = null

function loadScript(siteKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()
  if (window.grecaptcha) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA"))
    document.head.appendChild(script)
  })

  return scriptPromise
}

export async function getRecaptchaToken(action: string): Promise<string> {
  if (!SITE_KEY) return ""

  try {
    await loadScript(SITE_KEY)
    const grecaptcha = window.grecaptcha
    if (!grecaptcha) return ""

    return await new Promise<string>((resolve) => {
      grecaptcha.ready(() => {
        grecaptcha
          .execute(SITE_KEY, { action })
          .then(resolve)
          .catch(() => resolve(""))
      })
    })
  } catch {
    return ""
  }
}

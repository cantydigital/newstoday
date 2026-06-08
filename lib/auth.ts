"use server"

import { cookies } from "next/headers"
import {
  createAdminSession,
  deleteAdminSession,
  validateAdminSession,
  ADMIN_SESSION_TTL_MS,
} from "./admin-sessions"
import { verifyRecaptcha } from "./recaptcha"

const ADMIN_SESSION_COOKIE = "admin_session"

/**
 * Authenticate an admin. On success a cryptographically random session token
 * is created server-side and stored; the cookie only holds the opaque token.
 * A reCAPTCHA token is required to throttle automated brute-force attempts.
 */
export async function login(
  username: string,
  password: string,
  recaptchaToken?: string
): Promise<{ success: boolean; error?: string }> {
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminUsername || !adminPassword) {
    return { success: false, error: "Admin credentials not configured" }
  }

  // Bot / brute-force protection.
  const captcha = await verifyRecaptcha(recaptchaToken, "admin_login")
  if (!captcha.success) {
    return { success: false, error: "Captcha verification failed. Please try again." }
  }

  if (username === adminUsername && password === adminPassword) {
    const token = await createAdminSession()
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000),
    })
    return { success: true }
  }

  return { success: false, error: "Invalid username or password" }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  await deleteAdminSession(token)
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  return validateAdminSession(token)
}

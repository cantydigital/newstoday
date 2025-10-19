"use server"

import { cookies } from "next/headers"

const ADMIN_SESSION_COOKIE = "admin_session"

export async function login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminUsername || !adminPassword) {
    return { success: false, error: "Admin credentials not configured" }
  }

  if (username === adminUsername && password === adminPassword) {
    const cookieStore = await cookies()
    // Set session cookie (expires in 24 hours)
    cookieStore.set(ADMIN_SESSION_COOKIE, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })
    return { success: true }
  }

  return { success: false, error: "Invalid username or password" }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)
  return session?.value === "authenticated"
}

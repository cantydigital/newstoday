# Security Fixes

This document summarizes the security hardening changes and the configuration
required to run them.

## Required environment variables

Add these to your `.env.local` (and your hosting provider's env settings):

```bash
# Supabase (now required — the app throws if these are missing)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # server-only, never exposed to the client

# Admin credentials
ADMIN_USERNAME=...
ADMIN_PASSWORD=...

# Google reCAPTCHA v3 (bot protection on submit, contact, and admin login)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...   # public site key
RECAPTCHA_SECRET_KEY=...             # server-only secret key
```

> In non-production environments, if `RECAPTCHA_SECRET_KEY` is unset, captcha
> verification is skipped so you can develop without keys. In production the
> secret **must** be set or all protected submissions are rejected.

## Database / storage setup

Run [`SECURITY_FIXES_SETUP.sql`](./SECURITY_FIXES_SETUP.sql) in the Supabase SQL
editor. It creates the `admin_sessions` table and locks down the `images`
storage bucket so only the server (service-role) can write to it.

## Summary of changes

| # | Severity | Fix |
|---|----------|-----|
| 1 | Critical | Admin cookie now holds a random opaque token validated server-side against `admin_sessions` (`lib/admin-sessions.ts`, `lib/auth.ts`, `middleware.ts`). |
| 2 | Critical | All user HTML is sanitized with `isomorphic-dompurify` on render and on storage (`lib/sanitize.ts`). |
| 3 | High | reCAPTCHA v3 on the public submission and contact endpoints (`lib/recaptcha.ts`, `lib/recaptcha-client.ts`). |
| 4 | High | Image uploads routed through `/api/upload` with server-side size + magic-byte MIME validation; direct anon storage writes removed. |
| 5 | High | All admin mutations moved to `use server` actions guarded by `requireAdmin()` using the service-role client. |
| 6 | Medium | Admin login is captcha-gated to throttle brute force. |
| 7 | Medium | `imageUrl` validated server-side (https + Supabase host) via `validateImageUrl`. |
| 8 | Medium | Press release `content` capped at 100,000 chars server-side. |
| 9 | Medium | `typescript.ignoreBuildErrors` removed from `next.config.mjs`. |
| 10 | Low | `lib/supabase.ts` throws on missing env instead of using placeholders. |

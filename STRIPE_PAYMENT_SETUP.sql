-- ============================================================================
-- STRIPE PAYMENT + CREDITS SETUP FOR NEWS TODAY
-- ============================================================================
-- Run this script in your Supabase SQL Editor AFTER you have already run
-- COMPLETE_SUPABASE_SETUP.sql at least once. It is idempotent and safe to
-- re-run; it only adds the new tables / columns required for Stripe-based
-- press release credits.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. press_releases: add payment tracking columns
-- ----------------------------------------------------------------------------
ALTER TABLE press_releases
  ADD COLUMN IF NOT EXISTS payment_received BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE press_releases
  ADD COLUMN IF NOT EXISTS published_url TEXT;

ALTER TABLE press_releases
  ADD COLUMN IF NOT EXISTS purchase_email TEXT;

CREATE INDEX IF NOT EXISTS idx_press_releases_payment_received
  ON press_releases(payment_received);

-- ----------------------------------------------------------------------------
-- 2. pr_users: people who have purchased credits (keyed by email)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pr_users (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  name       TEXT,
  credits    INTEGER NOT NULL DEFAULT 0,
  total_purchased INTEGER NOT NULL DEFAULT 0,
  total_used      INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pr_users_email   ON pr_users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_pr_users_created ON pr_users(created_at DESC);

-- Keep updated_at fresh
CREATE OR REPLACE FUNCTION pr_users_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_pr_users_updated_at ON pr_users;
CREATE TRIGGER trg_pr_users_updated_at
  BEFORE UPDATE ON pr_users
  FOR EACH ROW EXECUTE PROCEDURE pr_users_set_updated_at();

-- ----------------------------------------------------------------------------
-- 3. pr_credit_transactions: audit trail of credit grants / consumption
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pr_credit_transactions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES pr_users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  -- positive = credits added (purchase / admin grant)
  -- negative = credits consumed (press release submission)
  amount       INTEGER NOT NULL,
  reason       TEXT NOT NULL,                -- 'stripe_purchase' | 'submission' | 'admin_grant' | 'admin_revoke'
  reference    TEXT,                         -- stripe session id, press release id, etc.
  metadata     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent duplicate Stripe webhook deliveries from granting credits twice.
CREATE UNIQUE INDEX IF NOT EXISTS uq_pr_credit_tx_stripe_reference
  ON pr_credit_transactions(reference)
  WHERE reason = 'stripe_purchase' AND reference IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_pr_credit_tx_user    ON pr_credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_pr_credit_tx_email   ON pr_credit_transactions(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_pr_credit_tx_created ON pr_credit_transactions(created_at DESC);

-- ----------------------------------------------------------------------------
-- 4. RLS
-- ----------------------------------------------------------------------------
ALTER TABLE pr_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pr_credit_transactions ENABLE ROW LEVEL SECURITY;

-- These tables must only be written from the server (service-role key) and
-- read from the server. We therefore deny anon access entirely and let the
-- service-role key bypass RLS as it normally does.
DROP POLICY IF EXISTS pr_users_no_anon ON pr_users;
CREATE POLICY pr_users_no_anon ON pr_users
  FOR ALL USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS pr_credit_tx_no_anon ON pr_credit_transactions;
CREATE POLICY pr_credit_tx_no_anon ON pr_credit_transactions
  FOR ALL USING (false) WITH CHECK (false);

-- ----------------------------------------------------------------------------
-- 5. Atomic credit operations (avoids race conditions)
-- ----------------------------------------------------------------------------

-- Add credits to a user (creates the user if needed) and log a transaction.
-- Returns the user's new credit balance.
CREATE OR REPLACE FUNCTION pr_add_credits(
  p_email     TEXT,
  p_amount    INTEGER,
  p_reason    TEXT,
  p_reference TEXT,
  p_metadata  JSONB DEFAULT NULL,
  p_name      TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id UUID;
  v_new_balance INTEGER;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'pr_add_credits: amount must be positive (got %)', p_amount;
  END IF;

  INSERT INTO pr_users (email, name, credits, total_purchased)
  VALUES (LOWER(p_email), p_name, p_amount, p_amount)
  ON CONFLICT (email) DO UPDATE
    SET credits         = pr_users.credits + EXCLUDED.credits,
        total_purchased = pr_users.total_purchased + EXCLUDED.total_purchased,
        name            = COALESCE(pr_users.name, EXCLUDED.name)
  RETURNING id, credits INTO v_user_id, v_new_balance;

  -- Audit log. If reference already exists for stripe_purchase, the unique
  -- index will raise -- caller should catch and treat as a duplicate event.
  INSERT INTO pr_credit_transactions (user_id, email, amount, reason, reference, metadata)
  VALUES (v_user_id, LOWER(p_email), p_amount, p_reason, p_reference, p_metadata);

  RETURN v_new_balance;
END;
$$;

-- Attempts to consume 1 credit for a submission. Returns TRUE if a credit
-- was deducted (paid submission) and FALSE if the user has no credits
-- (the submission is still saved as draft, but flagged as unpaid).
CREATE OR REPLACE FUNCTION pr_consume_credit(
  p_email     TEXT,
  p_reference TEXT,
  p_metadata  JSONB DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id  UUID;
  v_credits  INTEGER;
BEGIN
  SELECT id, credits INTO v_user_id, v_credits
  FROM pr_users
  WHERE email = LOWER(p_email)
  FOR UPDATE;

  IF v_user_id IS NULL OR v_credits IS NULL OR v_credits <= 0 THEN
    RETURN FALSE;
  END IF;

  UPDATE pr_users
     SET credits    = credits - 1,
         total_used = total_used + 1
   WHERE id = v_user_id;

  INSERT INTO pr_credit_transactions (user_id, email, amount, reason, reference, metadata)
  VALUES (v_user_id, LOWER(p_email), -1, 'submission', p_reference, p_metadata);

  RETURN TRUE;
END;
$$;

-- Admin manual adjustment (positive or negative). Will not let credits go
-- below zero.
CREATE OR REPLACE FUNCTION pr_admin_adjust_credits(
  p_email   TEXT,
  p_delta   INTEGER,
  p_note    TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id     UUID;
  v_credits     INTEGER;
  v_new_balance INTEGER;
  v_reason      TEXT;
BEGIN
  IF p_delta = 0 THEN
    RAISE EXCEPTION 'pr_admin_adjust_credits: delta must be non-zero';
  END IF;

  v_reason := CASE WHEN p_delta > 0 THEN 'admin_grant' ELSE 'admin_revoke' END;

  INSERT INTO pr_users (email, credits, total_purchased)
  VALUES (LOWER(p_email), GREATEST(p_delta, 0), GREATEST(p_delta, 0))
  ON CONFLICT (email) DO NOTHING;

  SELECT id, credits INTO v_user_id, v_credits
  FROM pr_users
  WHERE email = LOWER(p_email)
  FOR UPDATE;

  v_new_balance := GREATEST(v_credits + p_delta, 0);

  UPDATE pr_users
     SET credits = v_new_balance,
         total_purchased = total_purchased + GREATEST(p_delta, 0)
   WHERE id = v_user_id;

  INSERT INTO pr_credit_transactions (user_id, email, amount, reason, reference, metadata)
  VALUES (v_user_id, LOWER(p_email), p_delta, v_reason, NULL,
          CASE WHEN p_note IS NULL THEN NULL ELSE jsonb_build_object('note', p_note) END);

  RETURN v_new_balance;
END;
$$;

-- ============================================================================
-- DONE. Required env vars (see .env.local):
--   SUPABASE_SERVICE_ROLE_KEY         (server-only)
--   STRIPE_SECRET_KEY                 (server-only)
--   STRIPE_WEBHOOK_SECRET             (server-only)
--   NEXT_PUBLIC_STRIPE_SINGLE_PAYMENT_LINK
--   NEXT_PUBLIC_STRIPE_BUNDLE_PAYMENT_LINK
--   STRIPE_SINGLE_PRICE_CREDITS=1     (configured in lib/credits.ts)
--   STRIPE_BUNDLE_PRICE_CREDITS=10    (configured in lib/credits.ts)
--   RESEND_API_KEY
--   RESEND_FROM_EMAIL=News Today <noreply@newstoday.com.au>
--   NEXT_PUBLIC_SITE_URL=https://newstoday.com.au
-- ============================================================================

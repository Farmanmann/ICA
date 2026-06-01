-- Migration: add stripe_session_id to bids table
-- Run in Supabase Dashboard → SQL Editor

ALTER TABLE bids
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Unique constraint prevents duplicate bids from webhook retries
CREATE UNIQUE INDEX IF NOT EXISTS bids_stripe_session_id_idx
  ON bids (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

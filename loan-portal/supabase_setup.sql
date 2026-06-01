-- =============================================================================
-- Noor Financing — Supabase Setup Script
-- Run this in your Supabase SQL Editor (dashboard.supabase.com → SQL Editor)
-- =============================================================================

-- ─── 1. Schema additions ──────────────────────────────────────────────────────

-- Add missing columns to loans table (run each ALTER safely)
ALTER TABLE loans ADD COLUMN IF NOT EXISTS date_of_birth        TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS credit_event         TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS property_type        TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS occupancy_type       TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS down_payment_percent NUMERIC;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS first_time_buyer     TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS has_co_borrower      TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS credit_score         INTEGER;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS documents            JSONB DEFAULT '{}';
ALTER TABLE bids  ADD COLUMN IF NOT EXISTS lender_email        TEXT;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS updated_at           TIMESTAMPTZ DEFAULT now();

-- Auto-update updated_at on every loans row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS loans_updated_at ON loans;
CREATE TRIGGER loans_updated_at
  BEFORE UPDATE ON loans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ─── 2. Row Level Security ───────────────────────────────────────────────────

-- Enable RLS
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids  ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Borrowers can read own loans"   ON loans;
DROP POLICY IF EXISTS "Borrowers can insert own loans" ON loans;
DROP POLICY IF EXISTS "Admins can read all loans"      ON loans;
DROP POLICY IF EXISTS "Admins can update all loans"    ON loans;
DROP POLICY IF EXISTS "Lenders can read pending loans" ON loans;

DROP POLICY IF EXISTS "Lenders can read own bids"       ON bids;
DROP POLICY IF EXISTS "Lenders can insert own bids"     ON bids;
DROP POLICY IF EXISTS "Lenders can update own bids"     ON bids;
DROP POLICY IF EXISTS "Borrowers can read bids on their loans" ON bids;
DROP POLICY IF EXISTS "Borrowers can update bid status" ON bids;
DROP POLICY IF EXISTS "Admins can read all bids"        ON bids;
DROP POLICY IF EXISTS "Admins can update all bids"      ON bids;

-- LOANS policies
CREATE POLICY "Borrowers can read own loans"
  ON loans FOR SELECT
  USING (borrower_id = auth.uid());

CREATE POLICY "Borrowers can insert own loans"
  ON loans FOR INSERT
  WITH CHECK (borrower_id = auth.uid());

CREATE POLICY "Lenders can read pending loans"
  ON loans FOR SELECT
  USING (
    status = 'Pending'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'lender'
  );

CREATE POLICY "Admins can read all loans"
  ON loans FOR SELECT
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update all loans"
  ON loans FOR UPDATE
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Allow borrowers to update status (for accepting offers)
CREATE POLICY "Borrowers can update own loans"
  ON loans FOR UPDATE
  USING (borrower_id = auth.uid());

-- BIDS policies
CREATE POLICY "Lenders can read own bids"
  ON bids FOR SELECT
  USING (lender_id = auth.uid());

CREATE POLICY "Lenders can insert own bids"
  ON bids FOR INSERT
  WITH CHECK (
    lender_id = auth.uid()
    AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'lender'
  );

CREATE POLICY "Lenders can update own bids"
  ON bids FOR UPDATE
  USING (lender_id = auth.uid());

CREATE POLICY "Borrowers can read bids on their loans"
  ON bids FOR SELECT
  USING (
    loan_id IN (
      SELECT id FROM loans WHERE borrower_id = auth.uid()
    )
  );

CREATE POLICY "Borrowers can update bid status"
  ON bids FOR UPDATE
  USING (
    loan_id IN (
      SELECT id FROM loans WHERE borrower_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all bids"
  ON bids FOR SELECT
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update all bids"
  ON bids FOR UPDATE
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');


-- ─── 3. Create admin user ─────────────────────────────────────────────────────
-- After you create an admin account via signup, run this to elevate their role.
-- Replace 'admin@example.com' with the actual admin email.

-- UPDATE auth.users
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'admin@example.com';


-- ─── 4. Storage bucket ────────────────────────────────────────────────────────
-- Run this to create the loan-documents storage bucket.
-- Alternatively, create it in the Supabase Dashboard under Storage → New bucket.

INSERT INTO storage.buckets (id, name, public)
VALUES ('loan-documents', 'loan-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: authenticated users can upload to their own folder
DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own documents"   ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all documents"  ON storage.objects;

CREATE POLICY "Users can upload own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'loan-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'loan-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can read all documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'loan-documents'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

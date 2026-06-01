-- ============================================================
-- RLS policies for loans, bids, and loan-documents storage
-- ============================================================
-- Roles are stored in user_metadata at signup:
--   borrower  — applicants
--   lender    — financiers who browse and bid
--   admin     — internal staff (created manually, not via signup form)
-- ============================================================

-- Helper: read role from the current user's JWT claims
create or replace function public.get_user_role()
returns text
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '')
$$;

-- Update handle_new_user trigger to skip profile insert for admin users
-- (admin users are created manually and don't go through the signup form)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if coalesce(new.raw_user_meta_data->>'role', 'borrower') in ('borrower', 'lender') then
    insert into public.profiles (id, role)
    values (new.id, coalesce(new.raw_user_meta_data->>'role', 'borrower'));
  end if;
  return new;
end;
$$;

-- ============================================================
-- loans table
-- ============================================================

alter table public.loans enable row level security;

-- Borrowers: see only their own loans
create policy "borrowers_select_own_loans"
  on public.loans for select
  using (
    borrower_id = auth.uid()
    or get_user_role() = 'lender'
    or get_user_role() = 'admin'
  );

-- Borrowers: submit new applications (must own the row)
create policy "borrowers_insert_loans"
  on public.loans for insert
  with check (
    borrower_id = auth.uid()
    and get_user_role() = 'borrower'
  );

-- Borrowers: update their own loans (e.g. status changes from their side)
create policy "borrowers_update_own_loans"
  on public.loans for update
  using (
    borrower_id = auth.uid()
    and get_user_role() = 'borrower'
  );

-- Admins: update any loan (status management from admin panel)
create policy "admins_update_loans"
  on public.loans for update
  using (get_user_role() = 'admin');

-- Admins: delete any loan
create policy "admins_delete_loans"
  on public.loans for delete
  using (get_user_role() = 'admin');

-- ============================================================
-- bids table
-- ============================================================

alter table public.bids enable row level security;

-- Lenders: see their own bids
-- Borrowers: see bids on their own loans
-- Admins: see everything
create policy "bids_select"
  on public.bids for select
  using (
    lender_id = auth.uid()
    or exists (
      select 1 from public.loans
      where loans.id = bids.loan_id
        and loans.borrower_id = auth.uid()
    )
    or get_user_role() = 'admin'
  );

-- Lenders: submit offers (must own the bid row)
create policy "lenders_insert_bids"
  on public.bids for insert
  with check (
    lender_id = auth.uid()
    and get_user_role() = 'lender'
  );

-- Lenders: update their own bids (e.g. withdraw / amend)
create policy "lenders_update_own_bids"
  on public.bids for update
  using (
    lender_id = auth.uid()
    and get_user_role() = 'lender'
  );

-- Borrowers: accept or reject bids on their own loans
create policy "borrowers_update_bids_on_own_loans"
  on public.bids for update
  using (
    exists (
      select 1 from public.loans
      where loans.id = bids.loan_id
        and loans.borrower_id = auth.uid()
    )
    and get_user_role() = 'borrower'
  );

-- Admins: full control over bids
create policy "admins_all_bids"
  on public.bids for all
  using (get_user_role() = 'admin');

-- ============================================================
-- loan-documents storage bucket
-- ============================================================
-- Files are stored at {user_id}/{docType}.{ext}.enc
-- Only the owner can upload/read their own documents.
-- Admins can read all documents.

insert into storage.buckets (id, name, public)
values ('loan-documents', 'loan-documents', false)
on conflict (id) do nothing;

-- Borrowers: upload to their own folder
create policy "owners_upload_documents"
  on storage.objects for insert
  with check (
    bucket_id = 'loan-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Owners: read their own documents
create policy "owners_read_own_documents"
  on storage.objects for select
  using (
    bucket_id = 'loan-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Owners: replace (upsert) their own documents
create policy "owners_update_own_documents"
  on storage.objects for update
  using (
    bucket_id = 'loan-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins: read all documents (for review / compliance)
create policy "admins_read_all_documents"
  on storage.objects for select
  using (
    bucket_id = 'loan-documents'
    and get_user_role() = 'admin'
  );

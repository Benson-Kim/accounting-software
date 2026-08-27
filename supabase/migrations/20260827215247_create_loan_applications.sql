/*
# Create loan_applications table

1. Purpose
   Stores loan applications submitted by members. Each row represents a single
   application with all the information collected through the multi-step form:
   personal details, loan amount & purpose, employment info, and review/consent.

2. New Tables
   - `loan_applications`
     - `id` (uuid, primary key, auto-generated)
     - `full_name` (text, not null) — applicant's full name
     - `email` (text, not null) — applicant's email address
     - `phone` (text, not null) — applicant's phone number
     - `date_of_birth` (date, not null) — applicant's date of birth
     - `address` (text, not null) — applicant's home address
     - `loan_type` (text, not null) — type of loan (personal, auto, home, business, education)
     - `loan_amount` (numeric, not null) — requested amount in dollars
     - `loan_term_months` (integer, not null) — repayment period in months
     - `loan_purpose` (text, not null) — free-text description of why the loan is needed
     - employment_status` (text, not null) — employed, self-employed, unemployed, retired
     - `monthly_income` (numeric, not null) — gross monthly income in dollars
     - `employer_name` (text, nullable) — employer name if employed
     - `consent_credit_check` (boolean, not null) — applicant consented to credit check
     - `consent_terms` (boolean, not null) — applicant agreed to terms & conditions
     - `status` (text, not null, default 'pending') — pending, under_review, approved, rejected
     - `created_at` (timestamptz, default now())

3. Security
   - Enable RLS on `loan_applications`.
   - Single-tenant (no sign-in) app: allow anon + authenticated full CRUD so the
     anon-key frontend can submit and read applications.

4. Notes
   - No user_id column because no auth flow is required for this app.
   - Status defaults to 'pending' so new applications enter the review queue.
*/

CREATE TABLE IF NOT EXISTS loan_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  date_of_birth date NOT NULL,
  address text NOT NULL,
  loan_type text NOT NULL,
  loan_amount numeric(12, 2) NOT NULL,
  loan_term_months integer NOT NULL,
  loan_purpose text NOT NULL,
  employment_status text NOT NULL,
  monthly_income numeric(12, 2) NOT NULL,
  employer_name text,
  consent_credit_check boolean NOT NULL,
  consent_terms boolean NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_loan_applications" ON loan_applications;
CREATE POLICY "anon_select_loan_applications" ON loan_applications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_loan_applications" ON loan_applications;
CREATE POLICY "anon_insert_loan_applications" ON loan_applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_loan_applications" ON loan_applications;
CREATE POLICY "anon_update_loan_applications" ON loan_applications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_loan_applications" ON loan_applications;
CREATE POLICY "anon_delete_loan_applications" ON loan_applications FOR DELETE
  TO anon, authenticated USING (true);

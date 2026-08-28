/*
# Create SACCO member profiles and transaction history

## Purpose
This migration adds two new tables to support the SACCO member app's home dashboard:
- `sacco_members` stores the member's profile and financial summary (savings, shares, loan balance).
- `sacco_transactions` stores the member's activity feed entries (contributions, loan disbursements, repayments, dividends).

This is a single-tenant app with no sign-in screen, so all policies allow anon + authenticated access.

## New Tables

### sacco_members
- `id` (uuid, primary key)
- `full_name` (text, not null) — member's display name
- `membership_number` (text, not null, unique) — SACCO membership number
- `email` (text, not null) — contact email
- `phone` (text, not null) — contact phone
- `savings_balance` (numeric, default 0) — total savings deposited
- `shares_value` (numeric, default 0) — value of shares held
- `loan_balance` (numeric, default 0) — outstanding loan principal
- `next_payment_date` (date, nullable) — next loan repayment due date
- `next_payment_amount` (numeric, nullable) — next loan repayment amount
- `savings_goal` (numeric, default 0) — yearly savings contribution goal
- `savings_contributed` (numeric, default 0) — amount contributed toward the goal so far
- `join_date` (date, not null) — date the member joined the SACCO
- `created_at` (timestamptz, default now())

### sacco_transactions
- `id` (uuid, primary key)
- `member_id` (uuid, foreign key to sacco_members.id, not null)
- `type` (text, not null) — transaction category: 'contribution', 'loan_disbursement', 'repayment', 'dividend', 'withdrawal'
- `description` (text, not null) — human-readable description
- `amount` (numeric, not null) — transaction amount (positive for credits, negative for debits)
- `date` (timestamptz, not null, default now()) — when the transaction occurred
- `created_at` (timestamptz, default now())

## Security
- RLS enabled on both tables.
- All CRUD policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)` because this is a single-tenant, no-auth app where data is intentionally shared.

## Seed Data
- One demo member: "Jane Wanjiku", membership number "SAC-2023-0142", with savings of 185,000, shares of 50,000, loan balance of 320,000, next payment due 2026-09-05, savings goal 240,000 with 145,000 contributed, joined 2023-03-15.
- Six demo transactions spanning contributions, loan disbursement, repayments, and dividend.
*/

-- Members table
CREATE TABLE IF NOT EXISTS sacco_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  membership_number text NOT NULL UNIQUE,
  email text NOT NULL,
  phone text NOT NULL,
  savings_balance numeric NOT NULL DEFAULT 0,
  shares_value numeric NOT NULL DEFAULT 0,
  loan_balance numeric NOT NULL DEFAULT 0,
  next_payment_date date,
  next_payment_amount numeric,
  savings_goal numeric NOT NULL DEFAULT 0,
  savings_contributed numeric NOT NULL DEFAULT 0,
  join_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sacco_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_members" ON sacco_members;
CREATE POLICY "anon_select_members" ON sacco_members FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_members" ON sacco_members;
CREATE POLICY "anon_insert_members" ON sacco_members FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_members" ON sacco_members;
CREATE POLICY "anon_update_members" ON sacco_members FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_members" ON sacco_members;
CREATE POLICY "anon_delete_members" ON sacco_members FOR DELETE
  TO anon, authenticated USING (true);

-- Transactions table
CREATE TABLE IF NOT EXISTS sacco_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES sacco_members(id) ON DELETE CASCADE,
  type text NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sacco_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_transactions" ON sacco_transactions;
CREATE POLICY "anon_select_transactions" ON sacco_transactions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_transactions" ON sacco_transactions;
CREATE POLICY "anon_insert_transactions" ON sacco_transactions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_transactions" ON sacco_transactions;
CREATE POLICY "anon_update_transactions" ON sacco_transactions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_transactions" ON sacco_transactions;
CREATE POLICY "anon_delete_transactions" ON sacco_transactions FOR DELETE
  TO anon, authenticated USING (true);

-- Index for querying transactions by member
CREATE INDEX IF NOT EXISTS idx_sacco_transactions_member_id ON sacco_transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_sacco_transactions_date ON sacco_transactions(date DESC);

-- Seed: demo member
INSERT INTO sacco_members (
  full_name, membership_number, email, phone,
  savings_balance, shares_value, loan_balance,
  next_payment_date, next_payment_amount,
  savings_goal, savings_contributed, join_date
) VALUES (
  'Jane Wanjiku',
  'SAC-2023-0142',
  'jane.wanjiku@example.com',
  '+254 712 345 678',
  185000,
  50000,
  320000,
  '2026-09-05',
  12500,
  240000,
  145000,
  '2023-03-15'
)
ON CONFLICT (membership_number) DO NOTHING;

-- Seed: demo transactions for the demo member
INSERT INTO sacco_transactions (member_id, type, description, amount, date)
SELECT m.id, v.type, v.description, v.amount, v.date::timestamptz
FROM sacco_members m
CROSS JOIN (
  VALUES
    ('contribution'::text, 'Monthly savings contribution'::text, 5000::numeric, '2026-08-15T10:00:00+03:00'::timestamptz),
    ('repayment'::text, 'Loan repayment — August'::text, 12500::numeric, '2026-08-05T14:30:00+03:00'::timestamptz),
    ('dividend'::text, 'Annual dividend payout'::text, 8200::numeric, '2026-07-28T09:00:00+03:00'::timestamptz),
    ('contribution'::text, 'Monthly savings contribution'::text, 5000::numeric, '2026-07-15T10:00:00+03:00'::timestamptz),
    ('loan_disbursement'::text, 'Loan disbursement — Education loan'::text, 150000::numeric, '2026-06-20T11:00:00+03:00'::timestamptz),
    ('repayment'::text, 'Loan repayment — July'::text, 12500::numeric, '2026-07-05T14:30:00+03:00'::timestamptz)
) AS v(type, description, amount, date)
WHERE m.membership_number = 'SAC-2023-0142'
ON CONFLICT DO NOTHING;

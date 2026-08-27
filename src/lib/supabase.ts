import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type LoanApplication = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  loan_type: string;
  loan_amount: number;
  loan_term_months: number;
  loan_purpose: string;
  employment_status: string;
  monthly_income: number;
  employer_name: string | null;
  consent_credit_check: boolean;
  consent_terms: boolean;
  status: string;
  created_at: string;
};

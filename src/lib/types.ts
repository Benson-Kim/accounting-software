export interface SaccoMember {
  id: string;
  full_name: string;
  membership_number: string;
  email: string;
  phone: string;
  savings_balance: number;
  shares_value: number;
  loan_balance: number;
  next_payment_date: string | null;
  next_payment_amount: number | null;
  savings_goal: number;
  savings_contributed: number;
  join_date: string;
  created_at: string;
}

export interface SaccoTransaction {
  id: string;
  member_id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

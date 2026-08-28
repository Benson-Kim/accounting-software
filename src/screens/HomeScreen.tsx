import { useEffect, useState } from 'react';
import {
  TrendingUp,
  PiggyBank,
  Landmark,
  Calculator,
  FileText,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/buttons';
import { Section } from '@/components/Section';
import { supabase } from '@/lib/supabase';
import type { SaccoMember, SaccoTransaction } from '@/lib/types';
import { formatCurrency, formatCurrencyPrecise, formatDateShort, formatDate } from '@/lib/format';

interface HomeScreenProps {
  onNavigateLoans: () => void;
  onNavigateSavings: () => void;
}

export function HomeScreen({ onNavigateLoans, onNavigateSavings }: HomeScreenProps) {
  const [member, setMember] = useState<SaccoMember | null>(null);
  const [transactions, setTransactions] = useState<SaccoTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: m } = await supabase.from('sacco_members').select('*').limit(1).maybeSingle();
      setMember(m as SaccoMember | null);

      if (m) {
        const { data: txns } = await supabase
          .from('sacco_transactions')
          .select('*')
          .eq('member_id', m.id)
          .order('date', { ascending: false })
          .limit(5);
        setTransactions((txns as SaccoTransaction[]) || []);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-brand-500">Unable to load your account. Please try again later.</p>
      </div>
    );
  }

  const savingsProgress = member.savings_goal > 0 ? Math.min((member.savings_contributed / member.savings_goal) * 100, 100) : 0;

  const quickActions = [
    { label: 'Apply for Loan', icon: Landmark, onClick: onNavigateLoans },
    { label: 'My Savings', icon: PiggyBank, onClick: onNavigateSavings },
    { label: 'Calculator', icon: Calculator, onClick: () => {} },
    { label: 'Statements', icon: FileText, onClick: () => {} },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      {/* greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-brand-400">Welcome back</p>
          <h2 className="text-lg font-bold text-brand-800">{member.full_name}</h2>
          <p className="text-xs text-brand-400">{member.membership_number}</p>
        </div>
        <button className="no-tap-highlight relative flex h-10 w-10 items-center justify-center rounded-xl border border-brand-200 bg-white text-brand-500 transition-colors hover:bg-brand-50">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-400" />
        </button>
      </div>

      {/* savings balance hero card */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-800 p-5 text-white shadow-btn">
        <div className="flex items-center gap-2">
          <PiggyBank size={18} className="text-white/70" />
          <span className="text-xs font-medium text-white/70">Total Savings</span>
        </div>
        <p className="mt-2 text-3xl font-bold">{formatCurrency(member.savings_balance)}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-white/60">
          <span>Shares: {formatCurrency(member.shares_value)}</span>
          <span>Joined: {formatDate(member.join_date)}</span>
        </div>
      </div>

      {/* savings goal progress */}
      <div className="rounded-2xl border border-brand-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-brand-600">Savings Goal — {new Date().getFullYear()}</span>
          <span className="text-xs font-medium text-brand-400">{savingsProgress.toFixed(0)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-500"
            style={{ width: `${savingsProgress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-brand-400">
          <span>{formatCurrency(member.savings_contributed)} contributed</span>
          <span>Goal: {formatCurrency(member.savings_goal)}</span>
        </div>
      </div>

      {/* loan summary card */}
      <div className="rounded-2xl border border-brand-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <Landmark size={16} className="text-brand-500" />
          <span className="text-xs font-semibold text-brand-600">Active Loan</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-brand-800">{formatCurrency(member.loan_balance)}</p>
            <p className="text-xs text-brand-400">outstanding balance</p>
          </div>
          {member.next_payment_date && (
            <div className="text-right">
              <p className="text-sm font-semibold text-brand-600">
                {member.next_payment_amount ? formatCurrencyPrecise(member.next_payment_amount) : '—'}
              </p>
              <p className="text-xs text-brand-400">due {formatDateShort(member.next_payment_date)}</p>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Button variant="primary" fullWidth onClick={onNavigateLoans}>
            <Sparkles size={16} />
            Apply for a Loan
          </Button>
        </div>
      </div>

      {/* quick actions grid */}
      <Section title="Quick Actions">
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className="no-tap-highlight flex flex-col items-start gap-3 rounded-2xl border border-brand-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  <Icon size={20} />
                </span>
                <span className="text-sm font-medium text-brand-700">{action.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* recent activity */}
      <Section title="Recent Activity" subtitle="Your latest transactions">
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="py-4 text-center text-xs text-brand-400">No recent transactions</p>
          ) : (
            transactions.map((txn) => {
              const isCredit = txn.amount > 0;
              const Icon = isCredit ? ArrowDownRight : ArrowUpRight;
              return (
                <div key={txn.id} className="flex items-center gap-3 rounded-xl border border-brand-100 bg-white p-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isCredit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-brand-700">{txn.description}</p>
                    <p className="text-[10px] text-brand-400">{formatDateShort(txn.date)}</p>
                  </div>
                  <span className={`text-xs font-semibold ${isCredit ? 'text-green-600' : 'text-red-500'}`}>
                    {isCredit ? '+' : '−'}
                    {formatCurrency(Math.abs(txn.amount))}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </Section>

      {/* market insight teaser */}
      <div className="flex items-center gap-3 rounded-2xl bg-brand-100 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600">
          <TrendingUp size={20} />
        </span>
        <div className="flex-1">
          <p className="text-xs font-semibold text-brand-700">SACCO dividends up 6.2% this year</p>
          <p className="text-[10px] text-brand-400">Your shares are earning more than last year</p>
        </div>
        <ArrowRight size={16} className="text-brand-400" />
      </div>
    </div>
  );
}

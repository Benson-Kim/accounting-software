import { useEffect, useState } from 'react';
import { PiggyBank, TrendingUp, Target } from 'lucide-react';
import { Section, StateRow } from '@/components/Section';
import { supabase } from '@/lib/supabase';
import type { SaccoMember, SaccoTransaction } from '@/lib/types';
import { formatCurrency, formatDate, formatDateShort } from '@/lib/format';

export function SavingsScreen() {
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
          .in('type', ['contribution', 'dividend', 'withdrawal'])
          .order('date', { ascending: false });
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
        <p className="text-sm text-brand-500">Unable to load your savings. Please try again later.</p>
      </div>
    );
  }

  const savingsProgress =
    member.savings_goal > 0 ? Math.min((member.savings_contributed / member.savings_goal) * 100, 100) : 0;

  return (
    <div className="animate-fade-in space-y-5">
      {/* savings hero */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-800 p-5 text-white shadow-btn">
        <div className="flex items-center gap-2">
          <PiggyBank size={18} className="text-white/70" />
          <span className="text-xs font-medium text-white/70">Total Savings</span>
        </div>
        <p className="mt-2 text-3xl font-bold">{formatCurrency(member.savings_balance)}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-white/60">
          <span>Shares: {formatCurrency(member.shares_value)}</span>
          <span>Member since {formatDate(member.join_date)}</span>
        </div>
      </div>

      {/* savings breakdown */}
      <Section title="Savings Breakdown">
        <div className="rounded-2xl border border-brand-200 bg-white p-4">
          <div className="space-y-3">
            <StateRow label="Savings">
              <span className="text-sm font-semibold text-brand-700">{formatCurrency(member.savings_balance)}</span>
            </StateRow>
            <StateRow label="Shares">
              <span className="text-sm font-semibold text-brand-700">{formatCurrency(member.shares_value)}</span>
            </StateRow>
            <StateRow label="Contributed">
              <span className="text-sm font-semibold text-brand-700">
                {formatCurrency(member.savings_contributed)}
              </span>
            </StateRow>
            <StateRow label="Goal">
              <span className="text-sm font-semibold text-brand-700">{formatCurrency(member.savings_goal)}</span>
            </StateRow>
          </div>
        </div>
      </Section>

      {/* yearly goal progress */}
      <Section title="Yearly Goal Progress">
        <div className="rounded-2xl border border-brand-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Target size={16} className="text-brand-500" />
            <span className="text-xs font-semibold text-brand-600">{new Date().getFullYear()} Savings Goal</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-brand-100">
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-500"
              style={{ width: `${savingsProgress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-brand-400">
            <span>{savingsProgress.toFixed(0)}% complete</span>
            <span>
              {formatCurrency(member.savings_goal - member.savings_contributed)} to go
            </span>
          </div>
        </div>
      </Section>

      {/* dividend insight */}
      <div className="flex items-center gap-3 rounded-2xl bg-brand-100 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600">
          <TrendingUp size={20} />
        </span>
        <div className="flex-1">
          <p className="text-xs font-semibold text-brand-700">Last dividend: KES 8,200</p>
          <p className="text-[10px] text-brand-400">Paid out on 28 Jul 2026</p>
        </div>
      </div>

      {/* contribution history */}
      <Section title="Contribution History" subtitle="All savings-related transactions">
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="py-4 text-center text-xs text-brand-400">No contributions yet</p>
          ) : (
            transactions.map((txn) => {
              const isCredit = txn.amount > 0;
              return (
                <div key={txn.id} className="flex items-center gap-3 rounded-xl border border-brand-100 bg-white p-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isCredit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                    }`}
                  >
                    <PiggyBank size={16} />
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
    </div>
  );
}

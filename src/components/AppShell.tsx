import type { ReactNode } from 'react';
import { Chrome as Home, Landmark, PiggyBank, User } from 'lucide-react';

export type TabId = 'home' | 'loans' | 'savings' | 'profile';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof Home;
}

const TABS: Tab[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'loans', label: 'Loans', icon: Landmark },
  { id: 'savings', label: 'Savings', icon: PiggyBank },
  { id: 'profile', label: 'Profile', icon: User },
];

interface AppShellProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function AppShell({ activeTab, onTabChange, header, children, footer }: AppShellProps) {
  return (
    <div className="min-h-screen bg-brand-100 py-10 px-4">
      <div className="mx-auto w-full max-w-[390px]">
        <div className="rounded-[2.5rem] bg-brand-50 shadow-phone overflow-hidden">
          {/* status bar */}
          <div className="flex items-center justify-between bg-brand-700 px-7 py-3 text-xs font-medium text-white/90">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-3 rounded-sm bg-white/80" />
              <span className="h-2 w-4 rounded-sm bg-white/80" />
              <span className="h-2 w-5 rounded-sm bg-white/80" />
            </div>
          </div>

          {/* header (varies per screen) */}
          {header}

          {/* scrollable content */}
          <div className="min-h-[520px] space-y-5 bg-brand-50 px-6 py-6">{children}</div>

          {/* optional action footer (e.g. nav buttons for loan form) */}
          {footer}

          {/* bottom tab bar */}
          <div className="flex items-center justify-around border-t border-brand-200 bg-white px-2 py-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`no-tap-highlight flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-colors ${
                    active ? 'text-brand-700' : 'text-brand-400 hover:text-brand-500'
                  }`}
                >
                  <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                  <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* home indicator */}
          <div className="flex justify-center bg-white pb-2 pt-1">
            <span className="h-1 w-32 rounded-full bg-brand-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

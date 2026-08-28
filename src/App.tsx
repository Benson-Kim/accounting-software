import { useState } from 'react';
import { PiggyBank, User, TrendingUp } from 'lucide-react';
import { AppShell, type TabId } from '@/components/AppShell';
import { HomeScreen } from '@/screens/HomeScreen';
import { SavingsScreen } from '@/screens/SavingsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { LoansScreen } from '@/screens/LoansScreen';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  const renderHeader = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="bg-brand-700 px-6 pb-5 pt-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">SACCO Member</h1>
                <p className="text-xs text-white/60">Your financial dashboard</p>
              </div>
            </div>
          </div>
        );
      case 'loans':
        return null;
      case 'savings':
        return (
          <div className="bg-brand-700 px-6 pb-5 pt-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <PiggyBank size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">My Savings</h1>
                <p className="text-xs text-white/60">Track your contributions and dividends</p>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="bg-brand-700 px-6 pb-5 pt-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <User size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">My Profile</h1>
                <p className="text-xs text-white/60">Account details and settings</p>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateLoans={() => handleTabChange('loans')}
            onNavigateSavings={() => handleTabChange('savings')}
          />
        );
      case 'loans':
        return <LoansScreen />;
      case 'savings':
        return <SavingsScreen />;
      case 'profile':
        return <ProfileScreen />;
    }
  };

  return (
    <AppShell activeTab={activeTab} onTabChange={handleTabChange} header={renderHeader()}>
      {renderContent()}
    </AppShell>
  );
}

export default App;

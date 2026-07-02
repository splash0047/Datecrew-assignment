import { useState } from 'react';
import { WelcomeScreen } from './features/gateway/WelcomeScreen';
import { Login } from './components/Login';
import { CopilotPriorities } from './features/dashboard/CopilotPriorities';
import { SaaSMetrics } from './features/dashboard/SaaSMetrics';
import { RecentDecisions } from './features/dashboard/RecentDecisions';
import { ActivityFeed } from './features/dashboard/ActivityFeed';
import { ProductivityMetrics } from './features/dashboard/ProductivityMetrics';
import { FeedbackInsights } from './features/matching/FeedbackInsights';
import { CustomerTable } from './features/profiles/CustomerTable';
import { DrawerContainer } from './features/profiles/DrawerContainer';
import { useProfileStore } from './stores/profileStore';
import { HeartHandshake, LogOut, LayoutDashboard, Users } from 'lucide-react';
import type { Profile } from './types';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients'>('dashboard');
  
  const { selectedProfileId, setSelectedProfileId } = useProfileStore();

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogin(false);
    setSelectedProfileId(null);
  };

  const handleSelectClient = (client: Profile) => {
    setSelectedProfileId(client.id);
  };

  const handleCloseDrawer = () => {
    setSelectedProfileId(null);
  };

  // Render Splash Gateway Screen
  if (!isLoggedIn && !showLogin) {
    return <WelcomeScreen onEnter={() => setShowLogin(true)} />;
  }

  // Render Login Gate Screen
  if (!isLoggedIn && showLogin) {
    return <Login onLogin={handleLogin} onBack={() => setShowLogin(false)} />;
  }

  // Render Authenticated Dashboard
  return (
    <div className="warm-paper-bg min-h-screen flex text-text-primary font-body">
      <div className="radial-glow" />
      
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-white flex flex-col justify-between p-6 z-10 no-print flex-shrink-0">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-primary" />
            <span className="font-heading font-extrabold text-base tracking-tight text-text-primary">
              The Date Crew
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-interactive text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-primary/5 text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Matchmaker HUD</span>
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-interactive text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'clients'
                  ? 'bg-primary/5 text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customer Base</span>
            </button>
          </nav>
        </div>

        {/* User Account / Footer */}
        <div className="flex flex-col gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center font-heading font-bold text-xs text-accent">
              S
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs leading-none text-text-primary">Sarah Jenkins</h4>
              <span className="text-[10px] text-text-secondary mt-1 block">Lead Matchmaker</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-text-secondary hover:text-error text-xs font-semibold transition-colors cursor-pointer border-none bg-transparent pl-1 w-fit"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Work Panel Area */}
      <main className="flex-grow p-6 sm:p-8 flex flex-col gap-8 max-w-6xl mx-auto z-10 relative overflow-x-hidden">
        {activeTab === 'dashboard' ? (
          /* Dashboard HUD Layout */
          <>
            <CopilotPriorities onSelectClient={handleSelectClient} />
            <SaaSMetrics />
            <ProductivityMetrics />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-start">
              <RecentDecisions />
              <ActivityFeed />
            </div>
            <FeedbackInsights />
            <CustomerTable onSelectClient={handleSelectClient} />
          </>
        ) : (
          /* Clients List Database View */
          <>
            <div>
              <h1 className="font-heading font-extrabold text-2xl text-text-primary tracking-tight">
                Customer Database
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Access bio-data verification checklists, relationship timelines, and matching pools.
              </p>
            </div>
            <CustomerTable onSelectClient={handleSelectClient} />
          </>
        )}
      </main>

      {/* 3. Customer Profile Slide Drawer */}
      <DrawerContainer clientId={selectedProfileId} onClose={handleCloseDrawer} />
    </div>
  );
}

export default App;

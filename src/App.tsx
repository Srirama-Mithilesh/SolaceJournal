import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AuthModal from './components/auth/AuthModal';
import WelcomePage from './components/welcome/WelcomePage';
import JournalPage from './pages/JournalPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import BirthdaySparkles from './components/birthday/BirthdaySparkles';
import MonthlyRewindModal from './components/rewind/MonthlyRewindModal';
import { getCurrentUserProfile } from './utils/supabaseAuth';
import { useBirthday } from './hooks/useBirthday';
import { useMonthlyRewind } from './hooks/useMonthlyRewind';
import { User, AuthState } from './types';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Birthday and monthly rewind hooks
  const { showSparkles, hideSparkles, birthdayData } = useBirthday();
  const { monthlyRewind, showRewindModal, hideRewindModal, checkForMonthlyRewind } = useMonthlyRewind();

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      // Check for monthly rewind when user is authenticated
      checkForMonthlyRewind();
    }
  }, [authState.isAuthenticated, checkForMonthlyRewind]);

  const checkAuthState = async () => {
    try {
      const userProfile = await getCurrentUserProfile();
      
      if (userProfile) {
        const user: User = {
          id: userProfile.id,
          name: userProfile.profile?.full_name || 'User',
          email: userProfile.email || '',
          dateOfBirth: userProfile.profile?.date_of_birth || '',
          occupation: userProfile.profile?.occupation || '',
          location: userProfile.profile?.location || '',
          interests: [],
          recoveryEmail: userProfile.profile?.recovery_email || '',
          recoveryPhone: userProfile.profile?.recovery_phone || '',
          createdAt: new Date(userProfile.created_at || Date.now()),
          preferences: {
            aiTone: userProfile.preferences?.ai_tone || 'calm',
            notifications: userProfile.preferences?.notifications_enabled ?? true,
            darkMode: userProfile.preferences?.dark_mode ?? false,
            showAllEntries: userProfile.preferences?.show_all_entries ?? false
          }
        };

        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false
        });
        setShowWelcome(true);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      });
      setShowWelcome(true);
    }
  };

  const handleAuthSuccess = (user: User) => {
    setAuthState({
      isAuthenticated: true,
      user,
      isLoading: false
    });
    setShowAuthModal(false);
    setShowWelcome(false);
  };

  const handleLogout = async () => {
    const { logoutFromSupabase } = await import('./utils/supabaseAuth');
    await logoutFromSupabase();
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
    setShowWelcome(true);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
    setShowAuthModal(true);
  };

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Solace Journal...</p>
        </div>
      </div>
    );
  }

  // Show welcome page if not authenticated
  if (showWelcome && !authState.isAuthenticated) {
    return (
      <>
        <WelcomePage onGetStarted={handleGetStarted} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return (
    <>
      <Router>
        <Layout
          user={authState.user}
          isAuthenticated={authState.isAuthenticated}
          onAuthClick={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        >
          <Routes>
            <Route path="/" element={<JournalPage user={authState.user} />} />
            <Route path="/dashboard" element={<DashboardPage user={authState.user} />} />
            <Route path="/history" element={<HistoryPage user={authState.user} />} />
            <Route 
              path="/settings" 
              element={
                <SettingsPage 
                  user={authState.user} 
                  onUserUpdate={handleUserUpdate}
                />
              } 
            />
          </Routes>
        </Layout>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            if (authState.isAuthenticated) {
              setShowAuthModal(false);
            } else {
              setShowWelcome(true);
              setShowAuthModal(false);
            }
          }}
          onAuthSuccess={handleAuthSuccess}
        />
      </Router>

      {/* Birthday Sparkles */}
      <BirthdaySparkles 
        isVisible={showSparkles} 
        onComplete={hideSparkles} 
      />

      {/* Monthly Rewind Modal */}
      {monthlyRewind && (
        <MonthlyRewindModal
          isOpen={showRewindModal}
          onClose={hideRewindModal}
          rewindData={monthlyRewind}
        />
      )}
    </>
  );
}

export default App;
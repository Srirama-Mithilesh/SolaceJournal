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
import { testSupabaseConnection } from './lib/supabase';
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
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Birthday and monthly rewind hooks
  const { showSparkles, hideSparkles, birthdayData } = useBirthday(authState.user);
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
      // Check if Supabase environment variables are available
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        setConnectionError('Database connection not configured. Please set up your Supabase environment variables.');
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false
        });
        return;
      }

      // Test Supabase connection first
      console.log('Testing Supabase connection...');
      const connectionTest = await testSupabaseConnection();
      
      if (!connectionTest.success) {
        setConnectionError(connectionTest.error || 'Failed to connect to database');
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false
        });
        return;
      }

      console.log('Supabase connection successful, checking user profile...');
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
        setConnectionError(null);
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
      
      let errorMessage = 'Failed to connect to database. Please check your internet connection.';
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Network error: Unable to reach Supabase servers. Please check your internet connection and try again.';
        } else if (error.message.includes('Invalid Supabase URL')) {
          errorMessage = 'Invalid Supabase configuration. Please check your environment variables.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setConnectionError(errorMessage);
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
    setConnectionError(null);
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

  const handleRetryConnection = () => {
    setConnectionError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));
    checkAuthState();
  };

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to Solace Journal...</p>
          <p className="text-gray-500 text-sm mt-2">Testing database connection...</p>
        </div>
      </div>
    );
  }

  // Show connection error if database is not configured
  if (connectionError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{connectionError}</p>
          <div className="space-y-3">
            <button
              onClick={handleRetryConnection}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Retry Connection
            </button>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Troubleshooting tips:</p>
              <ul className="text-left list-disc list-inside space-y-1">
                <li>Check your internet connection</li>
                <li>Verify Supabase project is active</li>
                <li>Disable VPN/proxy if using one</li>
                <li>Check firewall settings</li>
              </ul>
            </div>
          </div>
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
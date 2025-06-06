import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AuthModal from './components/auth/AuthModal';
import WelcomePage from './components/welcome/WelcomePage';
import JournalPage from './pages/JournalPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import { getAuthState } from './utils/auth';
import { User, AuthState } from './types';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const { isAuthenticated, user } = getAuthState();
    setAuthState({
      isAuthenticated,
      user,
      isLoading: false
    });

    // Show welcome page for new users
    if (!isAuthenticated) {
      setShowWelcome(true);
    }
  }, []);

  const handleAuthSuccess = (user: User) => {
    setAuthState({
      isAuthenticated: true,
      user,
      isLoading: false
    });
    setShowAuthModal(false);
    setShowWelcome(false);
  };

  const handleLogout = () => {
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
    <Router>
      <Layout
        user={authState.user}
        isAuthenticated={authState.isAuthenticated}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      >
        <Routes>
          <Route path="/" element={<JournalPage user={authState.user} />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
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
  );
}

export default App;
import React from 'react';
import Header from './Header';
import { User } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  isAuthenticated: boolean;
  onAuthClick: () => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, isAuthenticated, onAuthClick, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        user={user}
        isAuthenticated={isAuthenticated}
        onAuthClick={onAuthClick}
        onLogout={onLogout}
      />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Solace Journal. Your privacy is our priority.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
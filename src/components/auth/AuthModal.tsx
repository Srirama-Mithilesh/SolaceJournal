import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Calendar, Briefcase, MapPin, Heart, Phone } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { loginWithSupabase, signupWithSupabase } from '../../utils/supabaseAuth';
import { User as UserType } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    full_name: '',
    email: '',
    password: '',
    date_of_birth: '',
    occupation: '',
    location: '',
    recovery_email: '',
    recovery_phone: ''
  });

  // Calculate max date (13 years ago)
  const getMaxDate = () => {
    const today = new Date();
    const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    return thirteenYearsAgo.toISOString().split('T')[0];
  };

  // Validate age (must be at least 13)
  const validateAge = (dateOfBirth: string): boolean => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 13;
    }
    
    return age >= 13;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await loginWithSupabase(loginData.email, loginData.password);
      
      if (result.success && result.user) {
        const user: UserType = {
          id: result.user.id,
          name: result.user.profile?.full_name || 'User',
          email: result.user.email || '',
          dateOfBirth: result.user.profile?.date_of_birth || '',
          occupation: result.user.profile?.occupation || '',
          location: result.user.profile?.location || '',
          interests: [],
          recoveryEmail: result.user.profile?.recovery_email || '',
          recoveryPhone: result.user.profile?.recovery_phone || '',
          createdAt: new Date(result.user.created_at || Date.now()),
          preferences: {
            aiTone: result.user.preferences?.ai_tone || 'calm',
            notifications: result.user.preferences?.notifications_enabled ?? true,
            darkMode: result.user.preferences?.dark_mode ?? false,
            showAllEntries: result.user.preferences?.show_all_entries ?? false
          }
        };

        onAuthSuccess(user);
        onClose();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Validate age
    if (!validateAge(signupData.date_of_birth)) {
      setError('You must be at least 13 years old to create an account');
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await signupWithSupabase(signupData);
      
      if (result.success && result.user) {
        const user: UserType = {
          id: result.user.id,
          name: result.user.profile?.full_name || signupData.full_name,
          email: result.user.email || signupData.email,
          dateOfBirth: signupData.date_of_birth,
          occupation: signupData.occupation,
          location: signupData.location,
          interests: [],
          recoveryEmail: signupData.recovery_email,
          recoveryPhone: signupData.recovery_phone,
          createdAt: new Date(),
          preferences: {
            aiTone: 'calm',
            notifications: true,
            darkMode: false,
            showAllEntries: false
          }
        };

        onAuthSuccess(user);
        onClose();
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setLoginData({ email: '', password: '' });
    setSignupData({
      full_name: '',
      email: '',
      password: '',
      date_of_birth: '',
      occupation: '',
      location: '',
      recovery_email: '',
      recovery_phone: ''
    });
    setError(null);
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'login' ? 'Welcome Back' : 'Join Solace'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="text-indigo-600 hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSignup}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={signupData.full_name}
                      onChange={(e) => setSignupData({ ...signupData, full_name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      value={signupData.date_of_birth}
                      onChange={(e) => setSignupData({ ...signupData, date_of_birth: e.target.value })}
                      max={getMaxDate()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">You must be at least 13 years old</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={signupData.occupation}
                      onChange={(e) => setSignupData({ ...signupData, occupation: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Your occupation"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={signupData.location}
                      onChange={(e) => setSignupData({ ...signupData, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recovery Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={signupData.recovery_email}
                      onChange={(e) => setSignupData({ ...signupData, recovery_email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="recovery@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recovery Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      value={signupData.recovery_phone}
                      onChange={(e) => setSignupData({ ...signupData, recovery_phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-indigo-600 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthModal;
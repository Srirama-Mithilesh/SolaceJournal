import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Bell, Moon, Trash, Mail, Calendar, Briefcase, MapPin, Phone, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { databaseService } from '../services/databaseService';
import { User as UserType } from '../types';

interface SettingsPageProps {
  user: UserType | null;
  onUserUpdate: (user: UserType) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user: currentUser, onUserUpdate }) => {
  const [user, setUser] = useState<UserType>({
    id: '',
    name: '',
    email: '',
    dateOfBirth: '',
    occupation: '',
    location: '',
    interests: [],
    recoveryEmail: '',
    recoveryPhone: '',
    createdAt: new Date(),
    preferences: {
      aiTone: 'calm',
      notifications: true,
      darkMode: false,
      showAllEntries: false
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);
  
  const handleProfileChange = (field: keyof UserType, value: any) => {
    // Prevent changing date of birth
    if (field === 'dateOfBirth') {
      return;
    }
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: keyof UserType['preferences'], value: any) => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };
  
  const handleToneChange = (tone: 'calm' | 'cheerful' | 'thoughtful') => {
    handlePreferenceChange('aiTone', tone);
  };
  
  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update profile in database
      await databaseService.updateProfile(user.id, {
        full_name: user.name,
        email: user.email,
        occupation: user.occupation,
        location: user.location,
        recovery_email: user.recoveryEmail,
        recovery_phone: user.recoveryPhone
      });

      // Update preferences in database
      await databaseService.updateUserPreferences(user.id, {
        ai_tone: user.preferences.aiTone,
        notifications_enabled: user.preferences.notifications,
        dark_mode: user.preferences.darkMode,
        show_all_entries: user.preferences.showAllEntries
      });

      onUserUpdate(user);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearData = async () => {
    if (!confirm('Are you sure you want to clear all your journal data? This cannot be undone.')) {
      return;
    }

    if (!user) return;

    try {
      // Get all entries and delete them
      const entries = await databaseService.getJournalEntries(user.id);
      for (const entry of entries) {
        await databaseService.deleteJournalEntry(entry.id);
      }

      alert('All journal data has been cleared.');
      window.location.reload();
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear data. Please try again.');
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <Card className="p-6 mb-6">
        <div className="flex items-center mb-6">
          <User className="text-indigo-500 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={user.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                id="email"
                value={user.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                id="dateOfBirth"
                value={user.dateOfBirth}
                disabled
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="flex items-center mt-1">
              <AlertTriangle className="text-red-500 mr-1" size={14} />
              <p className="text-xs text-red-500">Date of birth cannot be changed after account creation</p>
            </div>
          </div>

          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
              Occupation
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                id="occupation"
                value={user.occupation}
                onChange={(e) => handleProfileChange('occupation', e.target.value)}
                placeholder="Your occupation"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                id="location"
                value={user.location || ''}
                onChange={(e) => handleProfileChange('location', e.target.value)}
                placeholder="City, Country"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="recoveryEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Recovery Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                id="recoveryEmail"
                value={user.recoveryEmail || ''}
                onChange={(e) => handleProfileChange('recoveryEmail', e.target.value)}
                placeholder="recovery@email.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="recoveryPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Recovery Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                id="recoveryPhone"
                value={user.recoveryPhone || ''}
                onChange={(e) => handleProfileChange('recoveryPhone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 mb-6">
        <div className="flex items-center mb-6">
          <Bell className="text-indigo-500 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Preferences</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">AI Conversation Tone</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <motion.button
                className={`p-3 rounded-lg border text-center ${
                  user.preferences.aiTone === 'calm'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToneChange('calm')}
              >
                <div className="font-medium">Calm</div>
                <div className="text-sm mt-1">Soothing, gentle responses</div>
              </motion.button>
              
              <motion.button
                className={`p-3 rounded-lg border text-center ${
                  user.preferences.aiTone === 'cheerful'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToneChange('cheerful')}
              >
                <div className="font-medium">Cheerful</div>
                <div className="text-sm mt-1">Upbeat, positive vibes</div>
              </motion.button>
              
              <motion.button
                className={`p-3 rounded-lg border text-center ${
                  user.preferences.aiTone === 'thoughtful'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToneChange('thoughtful')}
              >
                <div className="font-medium">Thoughtful</div>
                <div className="text-sm mt-1">Reflective, insightful</div>
              </motion.button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-700">Show All Entries by Default</h3>
              <p className="text-sm text-gray-500">Display all journal entries instead of just recent ones</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.preferences.showAllEntries}
                onChange={(e) => handlePreferenceChange('showAllEntries', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-700">Notifications</h3>
              <p className="text-sm text-gray-500">Get reminders to journal daily</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.preferences.notifications}
                onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-700">Dark Mode</h3>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.preferences.darkMode}
                onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                className="sr-only peer"
                disabled
              />
              <div className="w-11 h-6 bg-gray-200 opacity-50 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 mb-6">
        <div className="flex items-center mb-6">
          <Moon className="text-indigo-500 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Privacy & Data</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-700">
            Your journal entries are stored securely in our database with end-to-end encryption.
            We take your privacy seriously and do not share your personal data with anyone.
          </p>
          
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <h3 className="text-md font-medium text-red-700 mb-2 flex items-center">
              <Trash size={18} className="mr-2" />
              Clear All Data
            </h3>
            <p className="text-sm text-red-600 mb-3">
              This will permanently delete all your journal entries and associated data.
              This action cannot be undone.
            </p>
            <Button 
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={handleClearData}
            >
              Clear All Data
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={isLoading}
          icon={<Save size={18} />}
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
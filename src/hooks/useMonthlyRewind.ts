import { useState, useEffect } from 'react';
import { databaseService } from '../services/databaseService';
import { getCurrentUser } from '../lib/supabase';

export const useMonthlyRewind = () => {
  const [monthlyRewind, setMonthlyRewind] = useState<any>(null);
  const [showRewindModal, setShowRewindModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkForMonthlyRewind = async () => {
    try {
      setIsLoading(true);
      const user = await getCurrentUser();
      if (!user) return;

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      // Check if it's the first few days of the month
      const dayOfMonth = now.getDate();
      if (dayOfMonth > 5) return; // Only show rewind in first 5 days

      // Check if rewind already exists for previous month
      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

      let rewind = await databaseService.getMonthlyRewind(user.id, prevMonth, prevYear);

      if (!rewind) {
        // Generate rewind for previous month
        rewind = await databaseService.generateMonthlyRewind(user.id, prevMonth, prevYear);
      }

      if (rewind && rewind.total_entries > 0) {
        // Check if rewind has been shown this month
        const rewindShownKey = `rewind_shown_${prevYear}_${prevMonth}`;
        const rewindShown = localStorage.getItem(rewindShownKey);

        if (!rewindShown) {
          setMonthlyRewind(rewind);
          setShowRewindModal(true);
          localStorage.setItem(rewindShownKey, 'true');
        }
      }
    } catch (error) {
      console.error('Error checking monthly rewind:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hideRewindModal = () => {
    setShowRewindModal(false);
  };

  const generateRewindForMonth = async (month: number, year: number) => {
    try {
      setIsLoading(true);
      const user = await getCurrentUser();
      if (!user) return null;

      const rewind = await databaseService.generateMonthlyRewind(user.id, month, year);
      return rewind;
    } catch (error) {
      console.error('Error generating monthly rewind:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    monthlyRewind,
    showRewindModal,
    hideRewindModal,
    checkForMonthlyRewind,
    generateRewindForMonth,
    isLoading
  };
};
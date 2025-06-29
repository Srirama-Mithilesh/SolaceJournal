import { useState, useEffect } from 'react';
import { databaseService } from '../services/databaseService';
import { User } from '../types';

export const useBirthday = (user: User | null) => {
  const [isBirthday, setIsBirthday] = useState(false);
  const [birthdayData, setBirthdayData] = useState<any>(null);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkBirthday();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const checkBirthday = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const celebration = await databaseService.checkBirthdayToday(user.id);
      
      if (celebration) {
        setIsBirthday(true);
        setBirthdayData(celebration);
        
        // Check if sparkles have been shown today
        const sparklesShownKey = `sparkles_shown_${celebration.celebration_year}`;
        const sparklesShown = localStorage.getItem(sparklesShownKey);
        
        if (!sparklesShown) {
          setShowSparkles(true);
          localStorage.setItem(sparklesShownKey, 'true');
        }
      }
    } catch (error) {
      console.error('Error checking birthday:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hideSparkles = () => {
    setShowSparkles(false);
  };

  return {
    isBirthday,
    birthdayData,
    showSparkles,
    hideSparkles,
    isLoading
  };
};
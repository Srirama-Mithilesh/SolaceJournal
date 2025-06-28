import { supabase, signInWithEmail, signUpWithEmail, signOut } from '../lib/supabase';
import { databaseService } from '../services/databaseService';

export interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
}

export const loginWithSupabase = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const { user } = await signInWithEmail(email, password);
    
    if (user) {
      // Get or create profile
      let profile = await databaseService.getProfile(user.id);
      
      if (!profile) {
        // Create profile if it doesn't exist
        profile = await databaseService.createProfile(user.id, {
          full_name: user.user_metadata?.full_name || 'User',
          email: user.email || '',
          date_of_birth: user.user_metadata?.date_of_birth || '2000-01-01',
          occupation: user.user_metadata?.occupation || ''
        });
      }

      return { success: true, user: { ...user, profile } };
    }

    return { success: false, error: 'Login failed' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signupWithSupabase = async (userData: {
  email: string;
  password: string;
  full_name: string;
  date_of_birth: string;
  occupation: string;
  location?: string;
  recovery_email?: string;
  recovery_phone?: string;
}): Promise<AuthResult> => {
  try {
    const { user } = await signUpWithEmail(userData.email, userData.password, {
      full_name: userData.full_name,
      date_of_birth: userData.date_of_birth,
      occupation: userData.occupation,
      location: userData.location,
      recovery_email: userData.recovery_email,
      recovery_phone: userData.recovery_phone
    });

    if (user) {
      // Create profile
      const profile = await databaseService.createProfile(user.id, {
        full_name: userData.full_name,
        email: userData.email,
        date_of_birth: userData.date_of_birth,
        occupation: userData.occupation,
        location: userData.location,
        recovery_email: userData.recovery_email,
        recovery_phone: userData.recovery_phone
      });

      // Create default preferences
      await databaseService.updateUserPreferences(user.id, {
        ai_tone: 'calm',
        notifications_enabled: true,
        dark_mode: false,
        show_all_entries: false
      });

      return { success: true, user: { ...user, profile } };
    }

    return { success: false, error: 'Signup failed' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const logoutFromSupabase = async (): Promise<void> => {
  await signOut();
};

export const getCurrentUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const profile = await databaseService.getProfile(user.id);
      const preferences = await databaseService.getUserPreferences(user.id);
      
      return {
        ...user,
        profile,
        preferences
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current user profile:', error);
    return null;
  }
};
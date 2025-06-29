import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Check if environment variables are still placeholder values
if (supabaseUrl.includes('your_supabase_project_url_here') || 
    supabaseAnonKey.includes('your_supabase_anon_key_here')) {
  throw new Error(
    'Supabase environment variables are not configured. Please:\n' +
    '1. Go to your Supabase project dashboard\n' +
    '2. Navigate to Settings > API\n' +
    '3. Copy your Project URL and anon/public key\n' +
    '4. Replace the placeholder values in your .env file\n' +
    '5. Restart the development server'
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`);
}

// Create Supabase client with enhanced configuration for better connectivity
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'solace-journal@1.0.0',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});

// Test connection function
export const testSupabaseConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Testing Supabase connection...');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Anon Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');
    
    // Simple test query to check connectivity
    const { data, error } = await supabase
      .from('daily_prompts')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { 
        success: false, 
        error: `Database query failed: ${error.message}` 
      };
    }
    
    console.log('Supabase connection test successful');
    return { success: true };
  } catch (error) {
    console.error('Supabase connection test error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { 
        success: false, 
        error: 'Network error: Unable to reach Supabase servers. Check your internet connection and firewall settings.' 
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown connection error' 
    };
  }
};

// Helper functions for common operations
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  if (error) throw error;
  return data;
};
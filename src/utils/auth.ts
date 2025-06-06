import { User } from '../types';

const AUTH_KEY = 'solace_auth_state';
const USERS_KEY = 'solace_users';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  occupation: string;
  location?: string;
  interests?: string[];
  recoveryEmail?: string;
  recoveryPhone?: string;
}

// Get all users (for demo purposes - in production this would be server-side)
const getUsers = (): Array<User & { password: string }> => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save user to storage
const saveUser = (user: User & { password: string }): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get current auth state
export const getAuthState = (): { isAuthenticated: boolean; user: User | null } => {
  const authData = localStorage.getItem(AUTH_KEY);
  if (!authData) {
    return { isAuthenticated: false, user: null };
  }
  
  try {
    const { userId } = JSON.parse(authData);
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
      // Remove password from user object
      const { password, ...userWithoutPassword } = user;
      return { isAuthenticated: true, user: userWithoutPassword };
    }
  } catch (error) {
    console.error('Error parsing auth state:', error);
  }
  
  return { isAuthenticated: false, user: null };
};

// Login user
export const login = async (credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> => {
  const users = getUsers();
  const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
  
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }
  
  // Save auth state
  localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: user.id }));
  
  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return { success: true, user: userWithoutPassword };
};

// Signup user
export const signup = async (signupData: SignupData): Promise<{ success: boolean; user?: User; error?: string }> => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.find(u => u.email === signupData.email)) {
    return { success: false, error: 'Email already exists' };
  }
  
  // Create new user
  const newUser: User & { password: string } = {
    id: Date.now().toString(),
    name: signupData.name,
    email: signupData.email,
    password: signupData.password,
    dateOfBirth: signupData.dateOfBirth,
    occupation: signupData.occupation,
    location: signupData.location,
    interests: signupData.interests || [],
    recoveryEmail: signupData.recoveryEmail,
    recoveryPhone: signupData.recoveryPhone,
    createdAt: new Date(),
    preferences: {
      aiTone: 'calm',
      notifications: true,
      darkMode: false,
      showAllEntries: false
    }
  };
  
  // Save user
  saveUser(newUser);
  
  // Save auth state
  localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: newUser.id }));
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return { success: true, user: userWithoutPassword };
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

// Update user profile
export const updateUserProfile = (updatedUser: User): void => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === updatedUser.id);
  
  if (userIndex >= 0) {
    // Keep the existing password
    const existingPassword = users[userIndex].password;
    users[userIndex] = { ...updatedUser, password: existingPassword };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};
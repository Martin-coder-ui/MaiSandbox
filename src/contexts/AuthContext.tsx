import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'provider';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  switchUser: (userId: string) => void;
  getTestUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test users for development
const TEST_USERS: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'user'
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'user'
  },
  {
    id: '3',
    email: 'provider@example.com',
    name: 'Dr. Sarah Wilson',
    avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'provider'
  }
];

const TEST_CREDENTIALS: Record<string, string> = {
  'john@example.com': 'password123',
  'jane@example.com': 'password123',
  'provider@example.com': 'password123'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('mai_current_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('mai_current_user');
      }
    }

    // Listen for Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Fetch user profile from Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const supabaseUser: User = {
            id: profile.id,
            email: profile.email,
            name: profile.full_name || profile.email,
            avatar: profile.avatar_url,
            role: profile.role || 'user'
          };
          setUser(supabaseUser);
          setIsAuthenticated(true);
          localStorage.setItem('mai_current_user', JSON.stringify(supabaseUser));
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('mai_current_user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // First try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Supabase auth error:', error);
        
        // Fall back to test credentials for development
        if (TEST_CREDENTIALS[email] === password) {
          const foundUser = TEST_USERS.find(u => u.email === email);
          if (foundUser) {
            setUser(foundUser);
            setIsAuthenticated(true);
            localStorage.setItem('mai_current_user', JSON.stringify(foundUser));
            return true;
          }
        }
        
        return false;
      }
      
      // Successful Supabase login
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    supabase.auth.signOut().then(() => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('mai_current_user');
    }).catch(error => {
      console.error('Error signing out:', error);
    });
  };

  const switchUser = (userId: string) => {
    const foundUser = TEST_USERS.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('mai_current_user', JSON.stringify(foundUser));
    }
  };

  const getTestUsers = () => TEST_USERS;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      switchUser,
      getTestUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
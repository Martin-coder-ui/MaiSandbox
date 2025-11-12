import { supabase } from "../lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'provider';
  // Add any other profile fields you expect from your 'profiles' table
  profileData?: {
    age?: number;
    gender?: string;
    location?: string;
    socialEngagement?: string;
    financeData?: {
      monthlyIncome?: number;
      currentSavings?: number;
      debt?: number;
      riskTolerance?: 'low' | 'medium' | 'high';
      financialGoals?: string[];
      spendingCategories?: string[];
      existingBankAccounts?: string[];
      existingInsurancePolicies?: string;
    };
    healthData?: {
      medicalConditions?: string[];
      medications?: string[];
      allergies?: string[];
      sleepPatterns?: 'poor' | 'fair' | 'good';
      stressLevels?: 'low' | 'moderate' | 'high' | 'chronic';
      exerciseFrequency?: 'never' | 'rarely' | 'moderately' | 'regularly';
      alcoholConsumption?: 'none' | 'light' | 'moderate' | 'heavy' | 'excessive';
      smokingHabits?: 'none' | 'social' | 'regular' | 'heavy';
      mentalHealthHistory?: string[];
      currentSymptoms?: string[];
      vaccinationStatus?: string[];
      familyMedicalHistory?: string[];
    };
    styleData?: {
      stylePreference?: string;
      colorPalette?: string;
      bodyType?: string;
      hairType?: string;
      skinTone?: string;
      budget?: string;
      lifestyle?: string;
    };
    cvData?: {
      fileName?: string;
      fileSize?: number;
      fileType?: string;
      uploadDate?: string;
      extractedData?: {
        currentPosition?: string;
        employer?: string;
        yearsExperience?: number;
        skills?: string[];
        education?: string[];
        employmentHistory?: any[];
        certifications?: string[];
        currentSalary?: number;
        careerLevel?: 'entry' | 'mid' | 'senior' | 'executive';
      };
    };
    preferredSuppliers?: string[];
  };
  serviceAreas?: string[];
  specialization?: string;
  providerData?: {
    yearsExperience?: number;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log('[AuthContext] Initializing AuthProvider');

  const fetchUserProfile = async (supabaseUser: any): Promise<UserProfile | null> => {
    if (!supabaseUser) {
      console.log('[AuthContext] No supabase user provided');
      return null;
    }

    console.log('[AuthContext] Fetching profile for user:', supabaseUser.id);

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('[AuthContext] Error fetching user profile:', error.message, error);
        return null;
      }

      if (profile) {
        console.log('[AuthContext] Profile found:', profile.email);
        const userProfile = {
          id: profile.id,
          email: profile.email || supabaseUser.email,
          name: profile.full_name || supabaseUser.email,
          avatar: profile.avatar_url || supabaseUser.user_metadata?.avatar_url,
          role: 'user' as const,
          profileData: {
            location: profile.location
          }
        };
        console.log('[AuthContext] Returning profile object');
        return userProfile;
      }

      console.log('[AuthContext] No profile found for user:', supabaseUser.id);
      return null;
    } catch (err) {
      console.error('[AuthContext] Exception fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    console.log('[AuthContext] Running auth initialization useEffect');

    const getSession = async () => {
      try {
        console.log('[AuthContext] Getting current session...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[AuthContext] Error getting session:', error);
          return;
        }

        console.log('[AuthContext] Session:', session ? 'exists' : 'none');

        if (session) {
          const profile = await fetchUserProfile(session.user);
          setUser(profile);
          setIsAuthenticated(!!profile);
        }
      } catch (err) {
        console.error('[AuthContext] Exception in getSession:', err);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state changed:', event, session ? 'has session' : 'no session');

      if (event === 'SIGNED_IN' && session) {
        console.log('[AuthContext] Auth listener fetching profile for:', session.user.email);
        const profile = await fetchUserProfile(session.user);

        if (profile) {
          console.log('[AuthContext] Profile fetched, updating state');
          setUser(profile);
          setIsAuthenticated(true);
        } else {
          console.error('[AuthContext] Failed to fetch profile');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('[AuthContext] User signed out');
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('[AuthContext] Starting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('[AuthContext] Login error:', error.message);
        return false;
      }

      if (data.user && data.session) {
        console.log('[AuthContext] Authentication successful');
        return true;
      }

      return false;
    } catch (err) {
      console.error('[AuthContext] Exception in login:', err);
      return false;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      console.log('[AuthContext] Starting signup for:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.error('[AuthContext] Sign up error:', error.message, error);
        return false;
      }

      console.log('[AuthContext] Signup response:', {
        hasUser: !!data.user,
        hasSession: !!data.session,
        userId: data.user?.id
      });

      if (!data.user) {
        console.error('[AuthContext] No user returned from signup');
        return false;
      }

      console.log('[AuthContext] Creating profile for user:', data.user.id);

      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: data.user.email,
          full_name: name
        },
      ]);

      if (profileError) {
        console.error('[AuthContext] Error creating user profile:', profileError.message, profileError);
        return false;
      }

      console.log('[AuthContext] Profile created successfully');

      const profile = await fetchUserProfile(data.user);
      setUser(profile);
      setIsAuthenticated(!!profile);
      return true;
    } catch (err) {
      console.error('[AuthContext] Exception during signup:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      signUp,
      isAuthenticated
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
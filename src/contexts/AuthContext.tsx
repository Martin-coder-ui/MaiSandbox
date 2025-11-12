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
    if (!supabaseUser) return null;

    console.log('[AuthContext] Fetching profile for user:', supabaseUser.id);

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    if (profile) {
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name || supabaseUser.email,
        avatar: profile.avatar_url || supabaseUser.user_metadata?.avatar_url,
        role: profile.type || 'user',
        profileData: {
          age: profile.age,
          gender: profile.gender,
          location: profile.location,
          socialEngagement: profile.social_engagement,
          financeData: profile.finance_data,
          healthData: profile.health_data,
          styleData: profile.style_data,
          cvData: profile.cv_data,
          preferredSuppliers: profile.preferred_suppliers
        },
        serviceAreas: profile.service_areas,
        specialization: profile.specialization,
        providerData: profile.provider_data
      };
    }
    return null;
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
      console.log('[AuthContext] Auth state changed:', event);

      if (event === 'SIGNED_IN' && session) {
        const profile = await fetchUserProfile(session.user);
        setUser(profile);
        setIsAuthenticated(!!profile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error.message);
      return false;
    }
    if (data.user) {
      const profile = await fetchUserProfile(data.user);
      setUser(profile);
      setIsAuthenticated(!!profile);
      return true;
    }
    return false;
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
      console.error('Sign up error:', error.message);
      return false;
    }

    if (data.user) {
      // Create a corresponding profile entry in your 'profiles' table
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: data.user.email,
          name: name,
          type: 'client', // Default type for new sign-ups
          social_engagement: 'moderate', // Default value
          service_areas: ['MaiHealth', 'MaiMoney', 'MaiStyle', 'MaiHome'] // Default service areas
        },
      ]);

      if (profileError) {
        console.error('Error creating user profile:', profileError.message);
        // Optionally, you might want to roll back the auth.signUp here
        return false;
      }

      const profile = await fetchUserProfile(data.user);
      setUser(profile);
      setIsAuthenticated(!!profile);
      return true;
    }
    return false;
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
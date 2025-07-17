```typescript
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
  switchUser: (userId: string) => void; // Keep for test users if needed
  getTestUsers: () => UserProfile[]; // Keep for test users if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test users for development (can be removed once Supabase is fully populated)
const TEST_USERS: UserProfile[] = [
  {
    id: 'client1',
    email: 'emma.health@test.com',
    name: 'Emma Thompson',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'user',
    serviceAreas: ['MaiHealth'],
    profileData: {
      age: 63,
      gender: 'female',
      location: 'London, UK',
      socialEngagement: 'isolated',
      healthData: {
        medicalConditions: ['high blood pressure', 'arthritis'],
        familyMedicalHistory: ['diabetes', 'heart disease'],
        sleepPatterns: 'poor',
        stressLevels: 'moderate',
        exerciseFrequency: 'rarely',
        alcoholConsumption: 'light',
        smokingHabits: 'none',
        currentSymptoms: ['joint pain', 'fatigue'],
        vaccinationStatus: ['Annual flu vaccine']
      }
    }
  },
  {
    id: 'client2',
    email: 'james.finance@test.com',
    name: 'James Wilson',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'user',
    serviceAreas: ['MaiMoney'],
    profileData: {
      age: 35,
      gender: 'male',
      location: 'Manchester, UK',
      socialEngagement: 'moderate',
      financeData: {
        monthlyIncome: 3500,
        currentSavings: 8000,
        debt: 2500,
        riskTolerance: 'medium',
        financialGoals: ['emergency-fund', 'house-deposit', 'investment-portfolio'],
        spendingCategories: ['Groceries', 'Transport', 'Entertainment'],
        existingBankAccounts: ['Current Account', 'Savings Account'],
        existingInsurancePolicies: 'life, home'
      },
      cvData: {
        fileName: 'james_wilson_cv.pdf',
        fileSize: 1024 * 500,
        fileType: 'application/pdf',
        uploadDate: new Date().toISOString(),
        extractedData: {
          currentPosition: 'Software Engineer',
          employer: 'Tech Solutions Ltd',
          yearsExperience: 7,
          skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Cloud Computing'],
          education: ['BSc Computer Science'],
          employmentHistory: [],
          certifications: ['AWS Certified Developer'],
          currentSalary: 55000,
          careerLevel: 'mid'
        }
      }
    }
  },
  {
    id: 'client3',
    email: 'sophie.style@test.com',
    name: 'Sophie Chen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'user',
    serviceAreas: ['MaiStyle'],
    profileData: {
      age: 28,
      gender: 'female',
      location: 'Birmingham, UK',
      socialEngagement: 'connected',
      styleData: {
        stylePreference: 'minimalist',
        colorPalette: 'cool-tones',
        bodyType: 'hourglass',
        hairType: 'fine-straight',
        skinTone: 'cool-undertones',
        budget: '500-1000',
        lifestyle: 'professional-casual'
      },
      preferredSuppliers: ['COS', 'Arket', 'Uniqlo']
    }
  },
  {
    id: 'client4',
    email: 'david.home@test.com',
    name: 'David Parker',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'user',
    serviceAreas: ['MaiHome'],
    profileData: {
      age: 45,
      gender: 'male',
      location: 'Edinburgh, UK',
      socialEngagement: 'moderate',
      financeData: {
        monthlyIncome: 4000,
        currentSavings: 15000,
        debt: 0,
        riskTolerance: 'low',
        financialGoals: ['home-improvement', 'energy-efficiency'],
        spendingCategories: ['Utilities', 'Home Maintenance'],
        existingBankAccounts: ['Current Account'],
        existingInsurancePolicies: 'home'
      }
    }
  },
  {
    id: 'provider1',
    email: 'dr.sarah@test.com',
    name: 'Dr. Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'provider',
    serviceAreas: ['MaiHealth'],
    specialization: 'physiotherapy',
    providerData: {
      yearsExperience: 8
    }
  },
  {
    id: 'provider2',
    email: 'advisor.lisa@test.com',
    name: 'Lisa Rodriguez',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'provider',
    serviceAreas: ['MaiMoney'],
    specialization: 'financial-planning',
    providerData: {
      yearsExperience: 10
    }
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUserProfile = async (supabaseUser: any): Promise<UserProfile | null> => {
    if (!supabaseUser) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

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
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const profile = await fetchUserProfile(session.user);
        setUser(profile);
        setIsAuthenticated(!!profile);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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

  // This function is primarily for development/testing with mock users
  const switchUser = (userId: string) => {
    const foundUser = TEST_USERS.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      // In a real scenario, you might also want to sign them in via Supabase
      // or clear any existing Supabase session. For mock users, this is fine.
    }
  };

  // This function is primarily for development/testing with mock users
  const getTestUsers = () => TEST_USERS;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      signUp,
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
```
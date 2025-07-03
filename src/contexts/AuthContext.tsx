import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'client' | 'provider';
  serviceAreas: string[];
  specialization?: string;
  socialEngagement?: 'connected' | 'moderate' | 'isolated';
  profileData?: {
    age?: number;
    gender?: string;
    location?: string;
    preferences?: string[];
    goals?: string[];
    preferredSuppliers?: string[];
    cvData?: {
      fileName?: string;
      fileSize?: number;
      fileType?: string;
      uploadDate?: string;
      status?: 'uploaded' | 'processing' | 'analyzed';
      // This would contain the structured data extracted from the CV
      extractedData?: {
        currentPosition?: string;
        employer?: string;
        yearsExperience?: number;
        skills?: string[];
        education?: {
          degree?: string;
          institution?: string;
          year?: number;
        }[];
        employmentHistory?: {
          company?: string;
          position?: string;
          startDate?: string;
          endDate?: string;
          responsibilities?: string[];
        }[];
        certifications?: string[];
        languages?: string[];
        currentSalary?: number;
        careerLevel?: 'entry' | 'mid' | 'senior' | 'executive';
      };
    };
    healthData?: {
      currentWeight?: number;
      targetWeight?: number;
      height?: number;
      activityLevel?: string;
      medicalConditions?: string[];
      allergies?: string[];
      currentMedications?: string[];
      lastCheckup?: string;
      fitnessGoals?: string[];
      dietaryRestrictions?: string[];
      // Enhanced health data
      bloodType?: string;
      bloodPressure?: string;
      cholesterolLevels?: string;
      familyMedicalHistory?: string[];
      vaccinationStatus?: string[];
      sleepPatterns?: string;
      stressLevels?: string;
      exerciseFrequency?: string;
      alcoholConsumption?: string;
      smokingHabits?: string;
      mentalHealthHistory?: string[];
      currentSymptoms?: string[];
    };
    financeData?: any;
    styleData?: any;
    homeData?: {
      homeType?: string;
      ownership?: 'own' | 'rent';
      bedrooms?: number;
      bathrooms?: number;
      squareFootage?: number;
      yearBuilt?: number;
      hasGarden?: boolean;
      hasGarage?: boolean;
      smartDevices?: string[];
      energyEfficiency?: string;
      renovationHistory?: {
        area?: string;
        year?: number;
        description?: string;
        cost?: number;
      }[];
      maintenanceSchedule?: {
        task?: string;
        frequency?: string;
        lastCompleted?: string;
        nextDue?: string;
      }[];
      projectWishlist?: string[];
    };
  };
  providerData?: {
    licenseNumber?: string;
    yearsExperience?: string;
    practiceType?: string;
    practiceName?: string;
    address?: string;
    verified?: boolean;
  };
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

// Test user data
const TEST_USERS: User[] = [
  // Client Users
  {
    id: 'client-health-1',
    email: 'emma.health@test.com',
    name: 'Emma Thompson',
    type: 'client',
    serviceAreas: ['MaiHealth'],
    socialEngagement: 'connected',
    profileData: {
      age: 32,
      gender: 'female',
      location: 'London, UK',
      preferences: ['yoga', 'running', 'healthy-eating'],
      goals: ['lose-weight', 'improve-fitness', 'better-sleep'],
      preferredSuppliers: ['Lululemon', 'Nike', 'Adidas', 'Sweaty Betty'],
      healthData: {
        currentWeight: 68,
        targetWeight: 63,
        height: 165,
        activityLevel: 'moderate',
        medicalConditions: [],
        allergies: ['peanuts'],
        currentMedications: [],
        lastCheckup: '2024-01-15',
        fitnessGoals: ['cardio-improvement', 'strength-building'],
        dietaryRestrictions: ['vegetarian'],
        // Enhanced health data
        bloodType: 'A+',
        bloodPressure: '118/75',
        cholesterolLevels: 'Total: 175, HDL: 65, LDL: 95',
        familyMedicalHistory: ['high blood pressure', 'diabetes'],
        vaccinationStatus: ['COVID-19 (up to date)', 'Annual flu vaccine', 'MMR (Measles, Mumps, Rubella)'],
        sleepPatterns: 'good',
        stressLevels: 'moderate',
        exerciseFrequency: 'frequent',
        alcoholConsumption: 'occasional',
        smokingHabits: 'never',
        mentalHealthHistory: ['anxiety disorders'],
        currentSymptoms: ['occasional headaches']
      },
      financeData: {
        monthlyIncome: 3500,
        monthlyExpenses: 2200,
        currentSavings: 8500,
        debt: 2500,
        creditScore: 680,
        existingBankAccounts: 'Current Account with Barclays, Savings Account with HSBC',
        existingInsurancePolicies: 'Health Insurance with Bupa, Home Insurance with Direct Line',
        riskTolerance: 'moderate',
        spendingCategories: 'Rent, Groceries, Fitness, Transport, Healthcare',
        financialGoals: ['emergency-fund', 'house-deposit']
      }
    }
  },
  {
    id: 'client-money-1',
    email: 'james.finance@test.com',
    name: 'James Wilson',
    type: 'client',
    serviceAreas: ['MaiMoney'],
    socialEngagement: 'moderate',
    profileData: {
      age: 28,
      gender: 'male',
      location: 'Manchester, UK',
      preferences: ['investing', 'saving', 'budgeting'],
      goals: ['buy-house', 'emergency-fund', 'retirement-planning'],
      preferredSuppliers: ['John Lewis', 'M&S', 'Next', 'ASOS'],
      cvData: {
        fileName: 'james_wilson_cv.pdf',
        fileSize: 2500000,
        fileType: 'application/pdf',
        uploadDate: '2024-05-15T10:30:00Z',
        status: 'analyzed',
        extractedData: {
          currentPosition: 'Financial Analyst',
          employer: 'Manchester Investment Group',
          yearsExperience: 4,
          skills: ['Financial modeling', 'Data analysis', 'Investment research', 'Excel', 'PowerBI'],
          education: [
            {
              degree: 'BSc Finance',
              institution: 'University of Manchester',
              year: 2020
            }
          ],
          employmentHistory: [
            {
              company: 'Manchester Investment Group',
              position: 'Financial Analyst',
              startDate: '2022-03',
              endDate: 'Present',
              responsibilities: ['Investment analysis', 'Client portfolio management', 'Financial reporting']
            },
            {
              company: 'Northern Bank',
              position: 'Junior Analyst',
              startDate: '2020-06',
              endDate: '2022-02',
              responsibilities: ['Data analysis', 'Report generation', 'Client support']
            }
          ],
          certifications: ['CFA Level 1', 'Financial Modeling Certificate'],
          languages: ['English', 'French (Basic)'],
          currentSalary: 45000,
          careerLevel: 'mid'
        }
      },
      financeData: {
        monthlyIncome: 4500,
        monthlyExpenses: 2800,
        currentSavings: 15000,
        debt: 8500,
        creditScore: 720,
        savingsGoal: 25000,
        riskTolerance: 'moderate',
        investmentExperience: 'beginner',
        existingBankAccounts: 'Current Account with Barclays, Savings Account with HSBC, ISA with Nationwide',
        existingInsurancePolicies: 'Life Insurance with Aviva, Home Insurance with Direct Line, Car Insurance with Admiral',
        spendingCategories: 'Rent, Groceries, Transport, Entertainment, Utilities, Dining Out',
        financialGoals: ['house-deposit', 'emergency-fund', 'pension'],
        bankAccounts: [
          { bank: 'Barclays', type: 'current', balance: 3240 },
          { bank: 'HSBC', type: 'savings', balance: 9210, interestRate: 2.1 }
        ],
        insurance: [
          { type: 'health', provider: 'Bupa', premium: 89, status: 'active' },
          { type: 'home', provider: 'Direct Line', premium: 45, status: 'active' },
          { type: 'life', provider: 'Aviva', premium: 32, status: 'review-due' }
        ]
      },
      healthData: {
        bloodType: 'O+',
        bloodPressure: '125/82',
        familyMedicalHistory: ['heart disease'],
        vaccinationStatus: ['COVID-19 (up to date)', 'Annual flu vaccine'],
        sleepPatterns: 'fair',
        stressLevels: 'high',
        exerciseFrequency: 'occasional',
        alcoholConsumption: 'moderate',
        smokingHabits: 'never',
        mentalHealthHistory: ['no mental health concerns'],
        currentSymptoms: ['fatigue', 'stress-related tension']
      }
    }
  },
  {
    id: 'client-style-1',
    email: 'sophie.style@test.com',
    name: 'Sophie Chen',
    type: 'client',
    serviceAreas: ['MaiStyle'],
    socialEngagement: 'connected',
    profileData: {
      age: 26,
      gender: 'female',
      location: 'Birmingham, UK',
      preferences: ['fashion', 'makeup', 'hair-styling'],
      goals: ['wardrobe-refresh', 'professional-look', 'confidence-boost'],
      preferredSuppliers: ['Zara', 'COS', 'Arket', 'Sephora', 'Charlotte Tilbury', 'Glossier'],
      cvData: {
        fileName: 'sophie_chen_cv.pdf',
        fileSize: 1800000,
        fileType: 'application/pdf',
        uploadDate: '2024-05-10T14:45:00Z',
        status: 'analyzed',
        extractedData: {
          currentPosition: 'Marketing Coordinator',
          employer: 'Fashion Forward Ltd',
          yearsExperience: 3,
          skills: ['Social media marketing', 'Content creation', 'Brand strategy', 'Adobe Creative Suite', 'Event planning'],
          education: [
            {
              degree: 'BA Fashion Marketing',
              institution: 'University of the Arts London',
              year: 2021
            }
          ],
          employmentHistory: [
            {
              company: 'Fashion Forward Ltd',
              position: 'Marketing Coordinator',
              startDate: '2022-01',
              endDate: 'Present',
              responsibilities: ['Social media management', 'Campaign coordination', 'Influencer partnerships']
            },
            {
              company: 'Style Magazine',
              position: 'Marketing Assistant',
              startDate: '2021-03',
              endDate: '2021-12',
              responsibilities: ['Content creation', 'Event support', 'Administrative tasks']
            }
          ],
          certifications: ['Digital Marketing Certificate', 'Fashion Styling Course'],
          languages: ['English', 'Mandarin', 'French (Basic)'],
          currentSalary: 32000,
          careerLevel: 'mid'
        }
      },
      styleData: {
        bodyType: 'pear',
        colorPalette: 'cool-tones',
        stylePreference: 'classic-modern',
        budget: 'mid-range',
        lifestyle: 'professional-casual',
        skinTone: 'cool-undertones',
        hairType: 'fine-straight',
        currentHairLength: 'medium',
        wardrobeSize: 127,
        favoriteColors: ['navy', 'emerald', 'burgundy'],
        avoidColors: ['orange', 'yellow'],
        bodyMeasurements: {
          bust: 34,
          waist: 28,
          hips: 38,
          height: 162
        },
        styleGoals: ['professional-wardrobe', 'date-night-looks', 'casual-chic']
      },
      financeData: {
        monthlyIncome: 3200,
        monthlyExpenses: 2100,
        currentSavings: 5500,
        debt: 1200,
        creditScore: 650,
        existingBankAccounts: 'Current Account with Santander, Savings Account with Marcus',
        existingInsurancePolicies: 'Health Insurance with Vitality, Contents Insurance with John Lewis',
        riskTolerance: 'low',
        spendingCategories: 'Rent, Groceries, Fashion, Beauty, Transport, Subscriptions',
        financialGoals: ['emergency-fund', 'travel-fund']
      },
      healthData: {
        bloodType: 'B+',
        bloodPressure: '110/70',
        familyMedicalHistory: ['none known'],
        vaccinationStatus: ['COVID-19 (up to date)', 'Annual flu vaccine', 'HPV (Human Papillomavirus)'],
        sleepPatterns: 'excellent',
        stressLevels: 'low',
        exerciseFrequency: 'regular',
        alcoholConsumption: 'occasional',
        smokingHabits: 'never',
        mentalHealthHistory: ['no mental health concerns'],
        currentSymptoms: ['none']
      }
    }
  },
  {
    id: 'client-home-1',
    email: 'david.home@test.com',
    name: 'David Parker',
    type: 'client',
    serviceAreas: ['MaiHome'],
    socialEngagement: 'moderate',
    profileData: {
      age: 34,
      gender: 'male',
      location: 'Bristol, UK',
      preferences: ['home-automation', 'diy', 'smart-home'],
      goals: ['home-improvement', 'energy-efficiency', 'security'],
      preferredSuppliers: ['Philips Hue', 'Nest', 'Ring', 'Google Home', 'Samsung SmartThings'],
      homeData: {
        homeType: 'semi-detached',
        ownership: 'own',
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 1450,
        yearBuilt: 2005,
        hasGarden: true,
        hasGarage: true,
        smartDevices: ['Smart Thermostat', 'Smart Lighting', 'Video Doorbell', 'Smart Speakers'],
        energyEfficiency: 'B',
        renovationHistory: [
          {
            area: 'Kitchen',
            year: 2020,
            description: 'Full renovation with new appliances',
            cost: 15000
          }
        ],
        maintenanceSchedule: [
          {
            task: 'HVAC Service',
            frequency: 'Annual',
            lastCompleted: '2023-09-15',
            nextDue: '2024-09-15'
          },
          {
            task: 'Gutter Cleaning',
            frequency: 'Bi-annual',
            lastCompleted: '2024-03-10',
            nextDue: '2024-09-10'
          }
        ],
        projectWishlist: ['Bathroom Remodel', 'Garden Landscaping', 'Loft Conversion']
      },
      financeData: {
        monthlyIncome: 4200,
        monthlyExpenses: 2600,
        currentSavings: 18000,
        debt: 180000, // Mortgage
        creditScore: 740,
        existingBankAccounts: 'Current Account with Nationwide, Savings Account with Marcus',
        existingInsurancePolicies: 'Home Insurance with Aviva, Life Insurance with Legal & General',
        riskTolerance: 'moderate',
        spendingCategories: 'Mortgage, Utilities, Groceries, Home Improvement, Entertainment',
        financialGoals: ['home-improvement-fund', 'emergency-fund']
      }
    }
  },
  {
    id: 'client-all-1',
    email: 'alex.complete@test.com',
    name: 'Alex Rodriguez',
    type: 'client',
    serviceAreas: ['MaiHealth', 'MaiMoney', 'MaiStyle', 'MaiHome'],
    socialEngagement: 'isolated',
    profileData: {
      age: 35,
      gender: 'non-binary',
      location: 'Edinburgh, UK',
      preferences: ['holistic-wellness', 'financial-planning', 'personal-styling', 'home-automation'],
      goals: ['complete-transformation', 'life-balance', 'confidence'],
      preferredSuppliers: ['Selfridges', 'Liberty', 'Space NK', 'Reiss', 'Whistles', 'Ganni', 'Philips Hue', 'Nest'],
      cvData: {
        fileName: 'alex_rodriguez_cv.pdf',
        fileSize: 3200000,
        fileType: 'application/pdf',
        uploadDate: '2024-05-12T09:15:00Z',
        status: 'analyzed',
        extractedData: {
          currentPosition: 'Senior Project Manager',
          employer: 'Global Tech Solutions',
          yearsExperience: 10,
          skills: ['Project management', 'Team leadership', 'Budget management', 'Agile methodologies', 'Stakeholder management', 'Risk assessment'],
          education: [
            {
              degree: 'MBA',
              institution: 'University of Edinburgh',
              year: 2015
            },
            {
              degree: 'BSc Computer Science',
              institution: 'University of Glasgow',
              year: 2010
            }
          ],
          employmentHistory: [
            {
              company: 'Global Tech Solutions',
              position: 'Senior Project Manager',
              startDate: '2019-06',
              endDate: 'Present',
              responsibilities: ['Managing cross-functional teams', 'Overseeing £2M+ projects', 'Client relationship management']
            },
            {
              company: 'Tech Innovations Ltd',
              position: 'Project Manager',
              startDate: '2015-03',
              endDate: '2019-05',
              responsibilities: ['Project planning and execution', 'Team coordination', 'Budget tracking']
            },
            {
              company: 'Digital Systems Inc',
              position: 'Junior Developer',
              startDate: '2010-09',
              endDate: '2015-02',
              responsibilities: ['Software development', 'Testing', 'Documentation']
            }
          ],
          certifications: ['PMP (Project Management Professional)', 'Scrum Master', 'PRINCE2 Practitioner'],
          languages: ['English', 'Spanish', 'Portuguese'],
          currentSalary: 75000,
          careerLevel: 'senior'
        }
      },
      healthData: {
        currentWeight: 75,
        targetWeight: 70,
        height: 175,
        activityLevel: 'active',
        fitnessGoals: ['marathon-training', 'muscle-building'],
        // Enhanced health data
        bloodType: 'AB+',
        bloodPressure: '122/78',
        cholesterolLevels: 'Total: 190, HDL: 55, LDL: 115',
        familyMedicalHistory: ['mental health conditions', 'autoimmune diseases'],
        vaccinationStatus: ['COVID-19 (up to date)', 'Annual flu vaccine', 'Hepatitis B'],
        sleepPatterns: 'poor',
        stressLevels: 'high',
        exerciseFrequency: 'daily',
        alcoholConsumption: 'none',
        smokingHabits: 'former',
        mentalHealthHistory: ['depression', 'anxiety disorders', 'currently in therapy/counseling'],
        currentSymptoms: ['fatigue', 'mood changes', 'sleep problems']
      },
      financeData: {
        monthlyIncome: 6200,
        currentSavings: 32000,
        investmentPortfolio: 45000,
        existingBankAccounts: 'Premium Account with HSBC, Savings Account with Marcus, Investment ISA with Vanguard',
        existingInsurancePolicies: 'Life Insurance with Legal & General, Income Protection with Aviva, Private Health with Bupa',
        riskTolerance: 'high',
        spendingCategories: 'Mortgage, Groceries, Investments, Travel, Fitness, Dining, Professional Development',
        financialGoals: ['property-investment', 'early-retirement']
      },
      styleData: {
        stylePreference: 'smart-casual',
        budget: 'premium',
        lifestyle: 'executive-active',
        colorPalette: 'warm-tones',
        skinTone: 'warm-undertones',
        hairType: 'thick-wavy'
      },
      homeData: {
        homeType: 'apartment',
        ownership: 'own',
        bedrooms: 2,
        bathrooms: 2,
        squareFootage: 1200,
        yearBuilt: 2015,
        hasGarden: false,
        hasGarage: true,
        smartDevices: ['Smart Lighting', 'Smart Thermostat', 'Smart Speakers', 'Smart TV', 'Smart Locks'],
        energyEfficiency: 'A',
        renovationHistory: [],
        maintenanceSchedule: [
          {
            task: 'HVAC Filter Replacement',
            frequency: 'Quarterly',
            lastCompleted: '2024-04-01',
            nextDue: '2024-07-01'
          }
        ],
        projectWishlist: ['Home Office Setup', 'Smart Kitchen Upgrade', 'Bathroom Renovation']
      }
    }
  },

  // Service Provider Users
  {
    id: 'provider-health-1',
    email: 'dr.sarah@test.com',
    name: 'Dr. Sarah Johnson',
    type: 'provider',
    serviceAreas: ['MaiHealth'],
    specialization: 'physiotherapy',
    socialEngagement: 'connected',
    providerData: {
      licenseNumber: 'PT-12345-UK',
      yearsExperience: '8',
      practiceType: 'private',
      practiceName: 'Johnson Physiotherapy Clinic',
      address: '123 Health Street, London, UK',
      verified: true
    }
  },
  {
    id: 'provider-health-2',
    email: 'dr.michael@test.com',
    name: 'Dr. Michael Chen',
    type: 'provider',
    serviceAreas: ['MaiHealth'],
    specialization: 'dentistry',
    socialEngagement: 'connected',
    providerData: {
      licenseNumber: 'DT-67890-UK',
      yearsExperience: '12',
      practiceType: 'clinic',
      practiceName: 'Chen Dental Care',
      address: '456 Smile Avenue, Manchester, UK',
      verified: true
    }
  },
  {
    id: 'provider-money-1',
    email: 'advisor.lisa@test.com',
    name: 'Lisa Rodriguez',
    type: 'provider',
    serviceAreas: ['MaiMoney'],
    specialization: 'financial-planning',
    socialEngagement: 'connected',
    providerData: {
      licenseNumber: 'FCA-54321-UK',
      yearsExperience: '10',
      practiceType: 'consultancy',
      practiceName: 'Rodriguez Financial Advisory',
      address: '789 Money Lane, Bristol, UK',
      verified: true
    }
  },
  {
    id: 'provider-style-1',
    email: 'stylist.maria@test.com',
    name: 'Maria Santos',
    type: 'provider',
    serviceAreas: ['MaiStyle'],
    specialization: 'personal-styling',
    socialEngagement: 'connected',
    providerData: {
      licenseNumber: 'PS-98765-UK',
      yearsExperience: '6',
      practiceType: 'freelance',
      practiceName: 'Santos Style Studio',
      address: '321 Fashion Street, Brighton, UK',
      verified: true
    }
  },
  {
    id: 'provider-home-1',
    email: 'tech.james@test.com',
    name: 'James Anderson',
    type: 'provider',
    serviceAreas: ['MaiHome'],
    specialization: 'home-automation',
    socialEngagement: 'connected',
    providerData: {
      licenseNumber: 'HA-12345-UK',
      yearsExperience: '7',
      practiceType: 'consultancy',
      practiceName: 'Smart Home Solutions',
      address: '42 Tech Avenue, Leeds, UK',
      verified: true
    }
  },
  {
    id: 'provider-multi-1',
    email: 'expert.david@test.com',
    name: 'David Park',
    type: 'provider',
    serviceAreas: ['MaiHealth', 'MaiStyle'],
    specialization: 'nutrition',
    socialEngagement: 'connected',
    providerData: {
      licenseNumber: 'RD-11111-UK',
      yearsExperience: '15',
      practiceType: 'clinic',
      practiceName: 'Park Wellness Center',
      address: '654 Wellness Way, Leeds, UK',
      verified: true
    }
  }
];

// Test credentials (email -> password)
const TEST_CREDENTIALS: Record<string, string> = {
  'emma.health@test.com': 'health123',
  'james.finance@test.com': 'finance123',
  'sophie.style@test.com': 'style123',
  'david.home@test.com': 'home123',
  'alex.complete@test.com': 'complete123',
  'dr.sarah@test.com': 'provider123',
  'dr.michael@test.com': 'provider123',
  'advisor.lisa@test.com': 'provider123',
  'stylist.maria@test.com': 'provider123',
  'tech.james@test.com': 'provider123',
  'expert.david@test.com': 'provider123'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('mai_current_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('mai_current_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check test credentials
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
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('mai_current_user');
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
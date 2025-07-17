import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../lib/supabase';
import { User, MapPin, Heart, Briefcase, Palette, DollarSign, Save, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const ProfileSettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    age: '',
    gender: '',
    location: '',
    relationshipStatus: '',
    socialEngagement: '',
    
    // Health Data
    healthData: {
      medicalConditions: [] as string[],
      medications: [] as string[],
      allergies: [] as string[],
      sleepPatterns: '',
      stressLevels: '',
      exerciseFrequency: '',
      alcoholConsumption: '',
      smokingHabits: '',
      mentalHealthHistory: [] as string[],
      familyMedicalHistory: [] as string[]
    },
    
    // Style Data
    styleData: {
      stylePreference: '',
      colorPalette: '',
      bodyType: '',
      hairType: '',
      skinTone: '',
      budget: '',
      lifestyle: ''
    },
    
    // Finance Data
    financeData: {
      monthlyIncome: '',
      currentSavings: '',
      debt: '',
      riskTolerance: '',
      financialGoals: [] as string[],
      spendingCategories: [] as string[],
      existingBankAccounts: [] as string[],
      existingInsurancePolicies: ''
    },
    
    // Provider-specific data
    specialization: '',
    serviceAreas: [] as string[],
    yearsExperience: '',
    
    // Preferences
    preferredSuppliers: [] as string[]
  });

  // Load profile data into form when profile is fetched
  useEffect(() => {
    if (profile && user) {
      setFormData({
        name: profile.name || user.name || '',
        email: profile.email || user.email || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        location: profile.location || '',
        relationshipStatus: profile.relationship_status || '',
        socialEngagement: profile.social_engagement || '',
        healthData: profile.health_data || {
          medicalConditions: [],
          medications: [],
          allergies: [],
          sleepPatterns: '',
          stressLevels: '',
          exerciseFrequency: '',
          alcoholConsumption: '',
          smokingHabits: '',
          mentalHealthHistory: [],
          familyMedicalHistory: []
        },
        styleData: profile.style_data || {
          stylePreference: '',
          colorPalette: '',
          bodyType: '',
          hairType: '',
          skinTone: '',
          budget: '',
          lifestyle: ''
        },
        financeData: profile.finance_data || {
          monthlyIncome: '',
          currentSavings: '',
          debt: '',
          riskTolerance: '',
          financialGoals: [],
          spendingCategories: [],
          existingBankAccounts: [],
          existingInsurancePolicies: ''
        },
        specialization: profile.specialization || '',
        serviceAreas: profile.service_areas || [],
        yearsExperience: profile.years_experience?.toString() || '',
        preferredSuppliers: profile.preferred_suppliers || []
      });
    }
  }, [profile, user]);

  const handleInputChange = (field: string, value: string, section?: string) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field: string, value: string, checked: boolean, section?: string) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: checked 
            ? [...(prev[section as keyof typeof prev][field as keyof any] as string[]), value]
            : (prev[section as keyof typeof prev][field as keyof any] as string[]).filter(item => item !== value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: checked 
          ? [...(prev[field as keyof typeof prev] as string[]), value]
          : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
      }));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      const updateData = {
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender,
        location: formData.location,
        relationship_status: formData.relationshipStatus,
        social_engagement: formData.socialEngagement,
        health_data: formData.healthData,
        style_data: formData.styleData,
        finance_data: {
          ...formData.financeData,
          monthlyIncome: formData.financeData.monthlyIncome ? parseFloat(formData.financeData.monthlyIncome) : null,
          currentSavings: formData.financeData.currentSavings ? parseFloat(formData.financeData.currentSavings) : null,
          debt: formData.financeData.debt ? parseFloat(formData.financeData.debt) : null
        },
        specialization: formData.specialization,
        service_areas: formData.serviceAreas,
        years_experience: formData.yearsExperience ? parseInt(formData.yearsExperience) : null,
        preferred_suppliers: formData.preferredSuppliers
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Refresh the profile data
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isProvider = profile?.type === 'provider';

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    ...(isProvider ? [{ id: 'provider', label: 'Provider Info', icon: Briefcase }] : []),
    { id: 'preferences', label: 'Preferences', icon: Eye }
  ];

  if (profileLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-4 text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your personal information and preferences to get better recommendations.
        </p>
        
        {/* Role indicator */}
        {profile && (
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
            {isProvider ? <Briefcase className="w-4 h-4 mr-1.5" /> : <User className="w-4 h-4 mr-1.5" />}
            {isProvider ? 'Provider Account' : 'Client Account'}
          </div>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="input opacity-50 cursor-not-allowed"
                      placeholder="Email cannot be changed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="input"
                      placeholder="Enter your age"
                      min="13"
                      max="120"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="input"
                    >
                      <option value="">Select gender</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="input pl-10"
                        placeholder="e.g., London, UK"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Relationship Status
                    </label>
                    <select
                      value={formData.relationshipStatus}
                      onChange={(e) => handleInputChange('relationshipStatus', e.target.value)}
                      className="input"
                    >
                      <option value="">Select status</option>
                      <option value="single">Single</option>
                      <option value="in-relationship">In a relationship</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Social Engagement
                    </label>
                    <select
                      value={formData.socialEngagement}
                      onChange={(e) => handleInputChange('socialEngagement', e.target.value)}
                      className="input"
                    >
                      <option value="">Select level</option>
                      <option value="connected">Very connected</option>
                      <option value="moderate">Moderately connected</option>
                      <option value="isolated">Somewhat isolated</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Health Tab */}
            {activeTab === 'health' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Health Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Current Health Conditions
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'None',
                        'Diabetes (Type 1)',
                        'Diabetes (Type 2)',
                        'High blood pressure',
                        'High cholesterol',
                        'Heart disease',
                        'Asthma',
                        'Arthritis',
                        'Depression',
                        'Anxiety'
                      ].map((condition) => (
                        <label key={condition} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                          <input
                            type="checkbox"
                            checked={formData.healthData.medicalConditions.includes(condition)}
                            onChange={(e) => handleArrayChange('medicalConditions', condition, e.target.checked, 'healthData')}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{condition}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sleep Patterns
                      </label>
                      <select
                        value={formData.healthData.sleepPatterns}
                        onChange={(e) => handleInputChange('sleepPatterns', e.target.value, 'healthData')}
                        className="input"
                      >
                        <option value="">Select sleep quality</option>
                        <option value="poor">Poor</option>
                        <option value="fair">Fair</option>
                        <option value="good">Good</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Stress Levels
                      </label>
                      <select
                        value={formData.healthData.stressLevels}
                        onChange={(e) => handleInputChange('stressLevels', e.target.value, 'healthData')}
                        className="input"
                      >
                        <option value="">Select stress level</option>
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                        <option value="chronic">Chronic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Exercise Frequency
                      </label>
                      <select
                        value={formData.healthData.exerciseFrequency}
                        onChange={(e) => handleInputChange('exerciseFrequency', e.target.value, 'healthData')}
                        className="input"
                      >
                        <option value="">Select frequency</option>
                        <option value="never">Never</option>
                        <option value="rarely">Rarely</option>
                        <option value="moderately">Moderately</option>
                        <option value="regularly">Regularly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Smoking Habits
                      </label>
                      <select
                        value={formData.healthData.smokingHabits}
                        onChange={(e) => handleInputChange('smokingHabits', e.target.value, 'healthData')}
                        className="input"
                      >
                        <option value="">Select smoking status</option>
                        <option value="none">Non-smoker</option>
                        <option value="social">Social smoker</option>
                        <option value="regular">Regular smoker</option>
                        <option value="heavy">Heavy smoker</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Style Tab */}
            {activeTab === 'style' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Style Preferences</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Style Preference
                    </label>
                    <select
                      value={formData.styleData.stylePreference}
                      onChange={(e) => handleInputChange('stylePreference', e.target.value, 'styleData')}
                      className="input"
                    >
                      <option value="">Select style</option>
                      <option value="classic">Classic/Traditional</option>
                      <option value="modern">Modern/Contemporary</option>
                      <option value="bohemian">Bohemian/Free-spirited</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="edgy">Edgy/Alternative</option>
                      <option value="romantic">Romantic/Feminine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color Palette
                    </label>
                    <select
                      value={formData.styleData.colorPalette}
                      onChange={(e) => handleInputChange('colorPalette', e.target.value, 'styleData')}
                      className="input"
                    >
                      <option value="">Select palette</option>
                      <option value="cool-tones">Cool tones</option>
                      <option value="warm-tones">Warm tones</option>
                      <option value="neutral">Neutral</option>
                      <option value="bold-bright">Bold & bright</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hair Type
                    </label>
                    <select
                      value={formData.styleData.hairType}
                      onChange={(e) => handleInputChange('hairType', e.target.value, 'styleData')}
                      className="input"
                    >
                      <option value="">Select hair type</option>
                      <option value="fine-straight">Fine & straight</option>
                      <option value="thick-straight">Thick & straight</option>
                      <option value="fine-wavy">Fine & wavy</option>
                      <option value="thick-wavy">Thick & wavy</option>
                      <option value="fine-curly">Fine & curly</option>
                      <option value="thick-curly">Thick & curly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skin Tone
                    </label>
                    <select
                      value={formData.styleData.skinTone}
                      onChange={(e) => handleInputChange('skinTone', e.target.value, 'styleData')}
                      className="input"
                    >
                      <option value="">Select skin tone</option>
                      <option value="cool-undertones">Cool undertones</option>
                      <option value="warm-undertones">Warm undertones</option>
                      <option value="neutral-undertones">Neutral undertones</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Budget Range
                    </label>
                    <select
                      value={formData.styleData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value, 'styleData')}
                      className="input"
                    >
                      <option value="">Select budget</option>
                      <option value="under-500">Under £500/month</option>
                      <option value="500-1000">£500 - £1,000/month</option>
                      <option value="1000-2000">£1,000 - £2,000/month</option>
                      <option value="over-2000">Over £2,000/month</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Lifestyle
                    </label>
                    <select
                      value={formData.styleData.lifestyle}
                      onChange={(e) => handleInputChange('lifestyle', e.target.value, 'styleData')}
                      className="input"
                    >
                      <option value="">Select lifestyle</option>
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="professional-casual">Professional & casual</option>
                      <option value="creative">Creative</option>
                      <option value="active">Active/sporty</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Finance Tab */}
            {activeTab === 'finance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Financial Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Monthly Income (£)
                    </label>
                    <input
                      type="number"
                      value={formData.financeData.monthlyIncome}
                      onChange={(e) => handleInputChange('monthlyIncome', e.target.value, 'financeData')}
                      className="input"
                      placeholder="Enter monthly income"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Savings (£)
                    </label>
                    <input
                      type="number"
                      value={formData.financeData.currentSavings}
                      onChange={(e) => handleInputChange('currentSavings', e.target.value, 'financeData')}
                      className="input"
                      placeholder="Enter current savings"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Outstanding Debt (£)
                    </label>
                    <input
                      type="number"
                      value={formData.financeData.debt}
                      onChange={(e) => handleInputChange('debt', e.target.value, 'financeData')}
                      className="input"
                      placeholder="Enter total debt"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Risk Tolerance
                    </label>
                    <select
                      value={formData.financeData.riskTolerance}
                      onChange={(e) => handleInputChange('riskTolerance', e.target.value, 'financeData')}
                      className="input"
                    >
                      <option value="">Select risk tolerance</option>
                      <option value="low">Low - Prefer safe investments</option>
                      <option value="medium">Medium - Balanced approach</option>
                      <option value="high">High - Comfortable with risk</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Financial Goals
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Build emergency fund',
                      'Pay off debt',
                      'Save for house deposit',
                      'Retirement planning',
                      'Investment portfolio',
                      'Travel fund'
                    ].map((goal) => (
                      <label key={goal} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="checkbox"
                          checked={formData.financeData.financialGoals.includes(goal)}
                          onChange={(e) => handleArrayChange('financialGoals', goal, e.target.checked, 'financeData')}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Provider Tab */}
            {activeTab === 'provider' && isProvider && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Provider Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Specialization
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      className="input"
                    >
                      <option value="">Select specialization</option>
                      <option value="physiotherapy">Physiotherapy</option>
                      <option value="dentistry">Dentistry</option>
                      <option value="nutrition">Nutrition & Dietetics</option>
                      <option value="mental-health">Mental Health</option>
                      <option value="financial-planning">Financial Planning</option>
                      <option value="personal-styling">Personal Styling</option>
                      <option value="home-automation">Home Automation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={formData.yearsExperience}
                      onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                      className="input"
                      placeholder="Enter years of experience"
                      min="0"
                      max="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Service Areas
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['MaiHealth', 'MaiMoney', 'MaiStyle', 'MaiHome'].map((area) => (
                      <label key={area} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="checkbox"
                          checked={formData.serviceAreas.includes(area)}
                          onChange={(e) => handleArrayChange('serviceAreas', area, e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Preferred Suppliers/Brands
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      'Zara', 'H&M', 'COS', 'Arket', 'Uniqlo', 'ASOS',
                      'John Lewis', 'Marks & Spencer', 'Next', 'Whistles',
                      'Reiss', 'Ted Baker', 'Anthropologie', 'Free People'
                    ].map((supplier) => (
                      <label key={supplier} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="checkbox"
                          checked={formData.preferredSuppliers.includes(supplier)}
                          onChange={(e) => handleArrayChange('preferredSuppliers', supplier, e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{supplier}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsScreen;
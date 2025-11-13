import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, MapPin, Heart, Users, Target, Activity, Palette, FileText, ChevronRight, ChevronLeft, CheckCircle, Shield } from 'lucide-react';
import CVUploadForm from './CVUploadForm';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const PersonalDetailsForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState({
    // Basic Information
    age: '',
    gender: '',
    sexualOrientation: '',
    pronouns: '',
    location: '',
    
    // Lifestyle & Preferences
    relationshipStatus: '',
    socialEngagement: '',
    fitnessLevel: '',
    dietaryPreferences: '',
    
    // Goals & Interests
    primaryGoals: [] as string[],
    interests: [] as string[],
    
    // Health Information
    healthConditions: [] as string[],
    medications: [] as string[],
    allergies: [] as string[],
    
    // Style Preferences
    stylePreference: '',
    budgetRange: '',
    
    // Financial Information
    incomeRange: '',
    financialGoals: [] as string[],
    
    // CV Upload
    cvFile: null as File | null
  });

  const totalSteps = 5; // Increased from 4 to 5

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleCVFileSelect = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      cvFile: file
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setSaveError('You must be logged in to save your profile.');
      return;
    }

    setIsSaving(true);
    setSaveError('');

    try {
      // Prepare profile data
      const profileData = {
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        sexual_orientation: formData.sexualOrientation || null,
        pronouns: formData.pronouns || null,
        location: formData.location || null,
        relationship_status: formData.relationshipStatus || null,
        social_engagement: formData.socialEngagement || null,
        fitness_level: formData.fitnessLevel || null,
        dietary_preferences: formData.dietaryPreferences || null,
        primary_goals: formData.primaryGoals,
        interests: formData.interests,
        health_conditions: formData.healthConditions,
        medications: formData.medications,
        allergies: formData.allergies,
        style_preference: formData.stylePreference || null,
        budget_range: formData.budgetRange || null,
        income_range: formData.incomeRange || null,
        financial_goals: formData.financialGoals,
        cv_data: formData.cvFile ? {
          fileName: formData.cvFile.name,
          fileSize: formData.cvFile.size,
          fileType: formData.cvFile.type,
          uploadDate: new Date().toISOString(),
          status: 'uploaded'
        } : null
      };

      // Update the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: profileData,
          location: formData.location || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving profile:', error);
        setSaveError('Failed to save profile. Please try again.');
        setIsSaving(false);
        return;
      }

      console.log('Profile saved successfully');

      // Also save to localStorage as backup
      const { cvFile, ...dataToStore } = { ...formData, ...profileData };
      localStorage.setItem('mai_user_profile', JSON.stringify(dataToStore));

      setIsSaving(false);
      navigate('/maihome');
    } catch (err) {
      console.error('Exception saving profile:', err);
      setSaveError('An error occurred while saving your profile.');
      setIsSaving(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center relative">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              step <= currentStep
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => step < currentStep && setCurrentStep(step)}
          >
            {step < currentStep ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <span className="text-base">{step}</span>
            )}
          </div>
          {step <= currentStep && (
            <span className="absolute -bottom-6 text-xs font-medium text-primary-600 dark:text-primary-400 whitespace-nowrap">
              {step === 1 && "Basic Info"}
              {step === 2 && "Lifestyle"}
              {step === 3 && "Goals"}
              {step === 4 && "Health"}
              {step === 5 && "Career"}
            </span>
          )}
          {step < totalSteps && (
            <div
              className={`w-16 h-1 mx-2 transition-all duration-300 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Tell Us About Yourself</h2>
        <p className="text-gray-600 dark:text-gray-300">
          This information helps us personalize your Mai experience across health, finance, and style.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Age *
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
            Gender Identity *
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="input"
          >
            <option value="">Select gender identity</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="non-binary">Non-binary</option>
            <option value="genderfluid">Genderfluid</option>
            <option value="agender">Agender</option>
            <option value="transgender-female">Transgender Female</option>
            <option value="transgender-male">Transgender Male</option>
            <option value="two-spirit">Two-Spirit</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sexual Orientation
          </label>
          <select
            value={formData.sexualOrientation}
            onChange={(e) => handleInputChange('sexualOrientation', e.target.value)}
            className="input"
          >
            <option value="">Select sexual orientation</option>
            <option value="heterosexual">Heterosexual/Straight</option>
            <option value="gay">Gay</option>
            <option value="lesbian">Lesbian</option>
            <option value="bisexual">Bisexual</option>
            <option value="pansexual">Pansexual</option>
            <option value="asexual">Asexual</option>
            <option value="demisexual">Demisexual</option>
            <option value="queer">Queer</option>
            <option value="questioning">Questioning</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pronouns
          </label>
          <select
            value={formData.pronouns}
            onChange={(e) => handleInputChange('pronouns', e.target.value)}
            className="input"
          >
            <option value="">Select pronouns</option>
            <option value="she/her">She/Her</option>
            <option value="he/him">He/Him</option>
            <option value="they/them">They/Them</option>
            <option value="she/they">She/They</option>
            <option value="he/they">He/They</option>
            <option value="xe/xir">Xe/Xir</option>
            <option value="ze/zir">Ze/Zir</option>
            <option value="fae/faer">Fae/Faer</option>
            <option value="it/its">It/Its</option>
            <option value="any-pronouns">Any pronouns</option>
            <option value="ask-me">Ask me my pronouns</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location *
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
            <option value="">Select relationship status</option>
            <option value="single">Single</option>
            <option value="in-relationship">In a relationship</option>
            <option value="married">Married</option>
            <option value="civil-partnership">Civil partnership</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
            <option value="separated">Separated</option>
            <option value="its-complicated">It's complicated</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Social Engagement Level
          </label>
          <select
            value={formData.socialEngagement}
            onChange={(e) => handleInputChange('socialEngagement', e.target.value)}
            className="input"
          >
            <option value="">How socially connected do you feel?</option>
            <option value="connected">Very connected - I have strong social networks</option>
            <option value="moderate">Moderately connected - I have some close relationships</option>
            <option value="isolated">Somewhat isolated - I'd like more social connections</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start animate-fade-in">
          <Heart className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-1">
              Why we ask about identity and orientation
            </h4>
            <p className="text-sm text-primary-800 dark:text-primary-200">
              This information helps us provide more inclusive and relevant recommendations for healthcare providers, 
              financial services, and style choices. Your data is private and secure, and you can update these preferences anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLifestylePreferences = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-10 h-10 text-secondary-600 dark:text-secondary-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Your Lifestyle</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Help us understand your current lifestyle and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Fitness Level
          </label>
          <select
            value={formData.fitnessLevel}
            onChange={(e) => handleInputChange('fitnessLevel', e.target.value)}
            className="input"
          >
            <option value="">Select fitness level</option>
            <option value="sedentary">Sedentary (little to no exercise)</option>
            <option value="lightly-active">Lightly active (light exercise 1-3 days/week)</option>
            <option value="moderately-active">Moderately active (moderate exercise 3-5 days/week)</option>
            <option value="very-active">Very active (hard exercise 6-7 days/week)</option>
            <option value="extremely-active">Extremely active (very hard exercise, physical job)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dietary Preferences
          </label>
          <select
            value={formData.dietaryPreferences}
            onChange={(e) => handleInputChange('dietaryPreferences', e.target.value)}
            className="input"
          >
            <option value="">Select dietary preference</option>
            <option value="omnivore">Omnivore (no restrictions)</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="pescatarian">Pescatarian</option>
            <option value="keto">Ketogenic</option>
            <option value="paleo">Paleo</option>
            <option value="mediterranean">Mediterranean</option>
            <option value="gluten-free">Gluten-free</option>
            <option value="dairy-free">Dairy-free</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Style Preference
          </label>
          <select
            value={formData.stylePreference}
            onChange={(e) => handleInputChange('stylePreference', e.target.value)}
            className="input"
          >
            <option value="">Select style preference</option>
            <option value="classic">Classic/Traditional</option>
            <option value="modern">Modern/Contemporary</option>
            <option value="bohemian">Bohemian/Free-spirited</option>
            <option value="minimalist">Minimalist</option>
            <option value="edgy">Edgy/Alternative</option>
            <option value="romantic">Romantic/Feminine</option>
            <option value="sporty">Sporty/Athletic</option>
            <option value="professional">Professional/Business</option>
            <option value="eclectic">Eclectic/Mixed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Budget Range (Monthly)
          </label>
          <select
            value={formData.budgetRange}
            onChange={(e) => handleInputChange('budgetRange', e.target.value)}
            className="input"
          >
            <option value="">Select budget range</option>
            <option value="under-500">Under £500</option>
            <option value="500-1000">£500 - £1,000</option>
            <option value="1000-2000">£1,000 - £2,000</option>
            <option value="2000-3000">£2,000 - £3,000</option>
            <option value="3000-5000">£3,000 - £5,000</option>
            <option value="over-5000">Over £5,000</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Income Range (Annual)
          </label>
          <select
            value={formData.incomeRange}
            onChange={(e) => handleInputChange('incomeRange', e.target.value)}
            className="input"
          >
            <option value="">Select income range</option>
            <option value="under-20k">Under £20,000</option>
            <option value="20k-30k">£20,000 - £30,000</option>
            <option value="30k-50k">£30,000 - £50,000</option>
            <option value="50k-75k">£50,000 - £75,000</option>
            <option value="75k-100k">£75,000 - £100,000</option>
            <option value="100k-150k">£100,000 - £150,000</option>
            <option value="over-150k">Over £150,000</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderGoalsAndInterests = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-10 h-10 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Your Goals & Interests</h2>
        <p className="text-gray-600 dark:text-gray-300">
          What would you like to achieve with Mai's help?
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Primary Goals (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Improve overall health',
              'Lose weight',
              'Gain muscle',
              'Better mental health',
              'Save money',
              'Invest for the future',
              'Buy a home',
              'Plan for retirement',
              'Improve my style',
              'Build confidence',
              'Find better healthcare',
              'Manage chronic conditions',
              'Reduce debt',
              'Emergency fund',
              'Career advancement',
              'Better work-life balance'
            ].map((goal) => (
              <label key={goal} className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.primaryGoals.includes(goal) 
                  ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.primaryGoals.includes(goal)}
                  onChange={(e) => handleArrayChange('primaryGoals', goal, e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{goal}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Financial Goals (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Build emergency fund',
              'Pay off debt',
              'Save for house deposit',
              'Retirement planning',
              'Investment portfolio',
              'Children\'s education fund',
              'Travel fund',
              'Start a business',
              'Insurance review',
              'Tax optimization',
              'Pension planning',
              'Wealth building'
            ].map((goal) => (
              <label key={goal} className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.financialGoals.includes(goal) 
                  ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.financialGoals.includes(goal)}
                  onChange={(e) => handleArrayChange('financialGoals', goal, e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{goal}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Interests & Hobbies (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              'Fitness & Exercise',
              'Yoga & Meditation',
              'Cooking & Nutrition',
              'Fashion & Style',
              'Travel',
              'Reading',
              'Music',
              'Art & Creativity',
              'Technology',
              'Gardening',
              'Photography',
              'Sports',
              'Dancing',
              'Volunteering',
              'Learning new skills',
              'Socializing',
              'Nature & Outdoors',
              'Gaming'
            ].map((interest) => (
              <label key={interest} className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.interests.includes(interest) 
                  ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.interests.includes(interest)}
                  onChange={(e) => handleArrayChange('interests', interest, e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{interest}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHealthInformation = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Health Information</h2>
        <p className="text-gray-600 dark:text-gray-300">
          This helps us provide better health recommendations and connect you with appropriate healthcare providers.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Current Health Conditions (Select all that apply)
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
              'Anxiety',
              'Thyroid disorders',
              'Chronic pain',
              'Migraines',
              'Sleep disorders',
              'ADHD',
              'Other'
            ].map((condition) => (
              <label key={condition} className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.healthConditions.includes(condition) 
                  ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.healthConditions.includes(condition)}
                  onChange={(e) => handleArrayChange('healthConditions', condition, e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Current Medications (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'None',
              'Blood pressure medication',
              'Cholesterol medication',
              'Diabetes medication',
              'Antidepressants',
              'Anti-anxiety medication',
              'Pain medication',
              'Thyroid medication',
              'Birth control',
              'Hormone therapy',
              'Vitamins/Supplements',
              'Other prescription medication'
            ].map((medication) => (
              <label key={medication} className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.medications.includes(medication) 
                  ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.medications.includes(medication)}
                  onChange={(e) => handleArrayChange('medications', medication, e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{medication}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Allergies (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              'None',
              'Peanuts',
              'Tree nuts',
              'Shellfish',
              'Fish',
              'Eggs',
              'Milk/Dairy',
              'Soy',
              'Wheat/Gluten',
              'Sesame',
              'Penicillin',
              'Aspirin',
              'Latex',
              'Pollen',
              'Pet dander',
              'Dust mites',
              'Other'
            ].map((allergy) => (
              <label key={allergy} className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.allergies.includes(allergy) 
                  ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.allergies.includes(allergy)}
                  onChange={(e) => handleArrayChange('allergies', allergy, e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{allergy}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start animate-fade-in">
          <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              Your health data is secure
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              All health information is encrypted and only used to provide personalized recommendations. 
              You can update or remove this information at any time in your profile settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCVUpload = () => (
    <CVUploadForm 
      onFileSelect={handleCVFileSelect}
      selectedFile={formData.cvFile}
    />
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <div className="animate-fade-in">{renderBasicInformation()}</div>;
      case 2:
        return <div className="animate-fade-in">{renderLifestylePreferences()}</div>;
      case 3:
        return <div className="animate-fade-in">{renderGoalsAndInterests()}</div>;
      case 4:
        return <div className="animate-fade-in">{renderHealthInformation()}</div>;
      case 5:
        return <div className="animate-fade-in">{renderCVUpload()}</div>;
      default:
        return renderBasicInformation();
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.age && formData.gender && formData.location;
      case 2:
        return true; // All fields are optional
      case 3:
        return formData.primaryGoals.length > 0;
      case 4:
        return true; // All fields are optional
      case 5:
        return true; // CV upload is optional
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Basic Information';
      case 2:
        return 'Lifestyle & Preferences';
      case 3:
        return 'Goals & Interests';
      case 4:
        return 'Health Information';
      case 5:
        return 'Career & Employment';
      default:
        return 'Profile Setup';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Complete Your Mai Profile</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Step {currentStep} of {totalSteps}: {getStepTitle()}
          </p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300">
          {saveError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{saveError}</p>
            </div>
          )}

          {renderCurrentStep()}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center ${
                currentStep === 1
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-sm'
              }`}
            >
              <ChevronLeft className={`w-4 h-4 mr-1 ${currentStep === 1 ? 'opacity-50' : ''}`} />
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center ${
                  isStepValid()
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                Next Step
                <ChevronRight className={`w-4 h-4 ml-1 ${!isStepValid() ? 'opacity-50' : ''}`} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className={`px-6 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center ${
                  isSaving
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-secondary-600 text-white hover:bg-secondary-700'
                }`}
              >
                {isSaving ? 'Saving...' : 'Complete Profile'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
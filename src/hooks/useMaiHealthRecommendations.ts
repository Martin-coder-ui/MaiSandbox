import { useState, useEffect } from 'react';
import { User } from '../contexts/AuthContext';

interface GeolocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  region: string;
  timezone: string;
  weather?: {
    temperature: number;
    condition: string;
    humidity: number;
    uvIndex: number;
  };
}

interface PreventiveCareRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  reason: string;
  matchScore: number; // Percentage
  provider: string;
  category: 'screening' | 'vaccination' | 'checkup' | 'monitoring';
  urgency: 'low' | 'medium' | 'high';
  frequency: string;
  ageRelevant: boolean;
  personalizedReason: string;
  localAvailability?: string;
}

interface LifestyleRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  reason: string;
  matchScore: number; // Percentage
  category: 'exercise' | 'nutrition' | 'sleep' | 'stress' | 'habits';
  difficulty: 'easy' | 'medium' | 'hard';
  timeCommitment: string;
  benefits: string[];
  personalizedReason: string;
  localAvailability?: string;
}

interface ConditionManagementRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  reason: string;
  matchScore: number; // Percentage
  provider: string;
  category: 'treatment' | 'monitoring' | 'support' | 'medication';
  condition: string;
  evidenceBased: boolean;
  personalizedReason: string;
  localAvailability?: string;
}

interface MentalWellbeingRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  reason: string;
  matchScore: number; // Percentage
  provider: string;
  category: 'therapy' | 'support-group' | 'self-care' | 'medication' | 'lifestyle';
  approach: string;
  personalizedReason: string;
  localAvailability?: string;
}

interface SeasonalHealthRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  reason: string;
  matchScore: number; // Percentage
  category: 'seasonal-prep' | 'weather-protection' | 'immune-support' | 'mood-support';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  personalizedReason: string;
  localAvailability?: string;
}

interface MaiHealthRecommendations {
  preventiveCare: PreventiveCareRecommendation[];
  lifestyle: LifestyleRecommendation[];
  conditionManagement: ConditionManagementRecommendation[];
  mentalWellbeing: MentalWellbeingRecommendation[];
  seasonalHealth: SeasonalHealthRecommendation[];
}

// Helper function to generate preventive care recommendations based on age and health data
const generatePreventiveCare = (
  userProfile: User['profileData'],
  location?: GeolocationData
): PreventiveCareRecommendation[] => {
  const recommendations: PreventiveCareRecommendation[] = [];
  
  if (!userProfile) return recommendations;

  const { age, gender, healthData } = userProfile;
  const familyHistory = healthData?.familyMedicalHistory || [];
  const currentConditions = healthData?.medicalConditions || [];
  const vaccinationStatus = healthData?.vaccinationStatus || [];

  // Age-based screenings
  if (age && age >= 40) {
    recommendations.push({
      id: 'preventive_1',
      name: 'Annual Heart Health Screening',
      description: 'Comprehensive cardiovascular assessment including ECG and stress test.',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Heart disease risk increases with age, especially after 40.',
      matchScore: 90,
      provider: 'Cardiology Specialists',
      category: 'screening',
      urgency: 'medium',
      frequency: 'Annually',
      ageRelevant: true,
      personalizedReason: `At age ${age}, regular heart screenings can detect early signs of cardiovascular disease.`,
      localAvailability: location ? `Available at hospitals in ${location.city}` : 'Available at local hospitals'
    });
  }

  if (age && age >= 50) {
    recommendations.push({
      id: 'preventive_2',
      name: 'Colonoscopy Screening',
      description: 'Early detection screening for colorectal cancer.',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Colorectal cancer screening is recommended starting at age 50.',
      matchScore: 95,
      provider: 'Gastroenterology Department',
      category: 'screening',
      urgency: 'high',
      frequency: 'Every 10 years',
      ageRelevant: true,
      personalizedReason: 'Early detection of colorectal cancer significantly improves treatment outcomes.',
      localAvailability: location ? `NHS and private options in ${location.city}` : 'NHS and private options available'
    });
  }

  // Gender-specific screenings
  if (gender === 'female' && age && age >= 25) {
    recommendations.push({
      id: 'preventive_3',
      name: 'Cervical Cancer Screening',
      description: 'Regular smear test to detect early changes in cervical cells.',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Essential for early detection and prevention of cervical cancer.',
      matchScore: 98,
      provider: 'GP Surgery or Sexual Health Clinic',
      category: 'screening',
      urgency: 'high',
      frequency: 'Every 3-5 years',
      ageRelevant: true,
      personalizedReason: 'Regular cervical screening can prevent up to 75% of cervical cancers.',
      localAvailability: location ? `GP surgeries and clinics in ${location.city}` : 'Available at GP surgeries'
    });
  }

  if (gender === 'female' && age && age >= 50) {
    recommendations.push({
      id: 'preventive_4',
      name: 'Mammography Screening',
      description: 'Breast cancer screening using low-dose X-rays.',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Breast cancer risk increases with age, screening saves lives.',
      matchScore: 92,
      provider: 'NHS Breast Screening Programme',
      category: 'screening',
      urgency: 'high',
      frequency: 'Every 3 years',
      ageRelevant: true,
      personalizedReason: 'Regular mammograms can detect breast cancer up to 2 years before you or your doctor can feel a lump.',
      localAvailability: location ? `NHS screening units in ${location.city}` : 'NHS screening units'
    });
  }

  // Family history-based recommendations
  if (familyHistory.includes('diabetes')) {
    recommendations.push({
      id: 'preventive_5',
      name: 'Diabetes Screening',
      description: 'HbA1c test to check for diabetes or pre-diabetes.',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Family history of diabetes increases your risk significantly.',
      matchScore: 88,
      provider: 'GP Surgery',
      category: 'screening',
      urgency: 'medium',
      frequency: 'Every 2 years',
      ageRelevant: false,
      personalizedReason: 'With family history of diabetes, early detection allows for lifestyle interventions that can prevent or delay onset.',
      localAvailability: location ? `GP surgeries in ${location.city}` : 'Available at GP surgeries'
    });
  }

  // Vaccination recommendations
  if (!vaccinationStatus.includes('Annual flu vaccine')) {
    recommendations.push({
      id: 'preventive_6',
      name: 'Annual Flu Vaccination',
      description: 'Yearly influenza vaccine to protect against seasonal flu.',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Annual flu vaccination reduces risk of influenza and complications.',
      matchScore: 85,
      provider: 'GP Surgery or Pharmacy',
      category: 'vaccination',
      urgency: 'medium',
      frequency: 'Annually',
      ageRelevant: false,
      personalizedReason: 'Flu vaccination is especially important for maintaining good health and preventing serious complications.',
      localAvailability: location ? `GP surgeries and pharmacies in ${location.city}` : 'Available at GP surgeries and pharmacies'
    });
  }

  return recommendations;
};

// Helper function to generate lifestyle recommendations
const generateLifestyleAdvice = (
  userProfile: User['profileData'],
  location?: GeolocationData
): LifestyleRecommendation[] => {
  const recommendations: LifestyleRecommendation[] = [];
  
  if (!userProfile?.healthData) return recommendations;

  const { 
    sleepPatterns, 
    stressLevels, 
    exerciseFrequency, 
    alcoholConsumption, 
    smokingHabits,
    currentSymptoms 
  } = userProfile.healthData;

  // Sleep recommendations
  if (sleepPatterns === 'poor' || sleepPatterns === 'fair') {
    recommendations.push({
      id: 'lifestyle_1',
      name: 'Sleep Hygiene Program',
      description: 'Comprehensive approach to improving sleep quality and duration.',
      imageUrl: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Poor sleep affects immune function, mental health, and overall wellbeing.',
      matchScore: 94,
      category: 'sleep',
      difficulty: 'easy',
      timeCommitment: '30 minutes daily',
      benefits: ['Better mood', 'Improved concentration', 'Stronger immune system', 'Better weight management'],
      personalizedReason: 'Your current sleep patterns indicate room for improvement that could significantly impact your health.',
      localAvailability: location ? `Sleep clinics available in ${location.city}` : 'Sleep clinics and online resources available'
    });
  }

  // Stress management
  if (stressLevels === 'high' || stressLevels === 'chronic') {
    recommendations.push({
      id: 'lifestyle_2',
      name: 'Mindfulness-Based Stress Reduction',
      description: 'Evidence-based program combining meditation, yoga, and mindfulness.',
      imageUrl: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Chronic stress contributes to numerous health problems including heart disease.',
      matchScore: 91,
      category: 'stress',
      difficulty: 'medium',
      timeCommitment: '20-30 minutes daily',
      benefits: ['Reduced anxiety', 'Lower blood pressure', 'Better sleep', 'Improved focus'],
      personalizedReason: 'Your high stress levels could be impacting your physical and mental health significantly.',
      localAvailability: location ? `MBSR classes available in ${location.city}` : 'MBSR classes and apps available'
    });
  }

  // Exercise recommendations
  if (exerciseFrequency === 'rarely' || exerciseFrequency === 'never') {
    recommendations.push({
      id: 'lifestyle_3',
      name: 'Beginner Fitness Program',
      description: 'Gentle introduction to regular physical activity with progressive goals.',
      imageUrl: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Regular exercise is one of the most effective ways to improve overall health.',
      matchScore: 89,
      category: 'exercise',
      difficulty: 'easy',
      timeCommitment: '30 minutes, 3x per week',
      benefits: ['Improved cardiovascular health', 'Better mood', 'Stronger bones', 'Weight management'],
      personalizedReason: 'Starting a gentle exercise routine could provide significant health benefits with minimal time investment.',
      localAvailability: location ? `Gyms and fitness centers in ${location.city}` : 'Local gyms and online programs available'
    });
  }

  // Smoking cessation
  if (smokingHabits === 'regular' || smokingHabits === 'heavy') {
    recommendations.push({
      id: 'lifestyle_4',
      name: 'Smoking Cessation Program',
      description: 'Comprehensive support including counseling and nicotine replacement therapy.',
      imageUrl: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Quitting smoking is the single most important thing you can do for your health.',
      matchScore: 98,
      category: 'habits',
      difficulty: 'hard',
      timeCommitment: 'Ongoing support',
      benefits: ['Reduced cancer risk', 'Better lung function', 'Improved circulation', 'Save money'],
      personalizedReason: 'Quitting smoking will dramatically reduce your risk of cancer, heart disease, and numerous other conditions.',
      localAvailability: location ? `NHS stop smoking services in ${location.city}` : 'NHS stop smoking services available'
    });
  }

  // Alcohol moderation
  if (alcoholConsumption === 'heavy' || alcoholConsumption === 'excessive') {
    recommendations.push({
      id: 'lifestyle_5',
      name: 'Alcohol Reduction Program',
      description: 'Support and strategies for reducing alcohol consumption to healthy levels.',
      imageUrl: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Excessive alcohol consumption increases risk of liver disease, cancer, and other conditions.',
      matchScore: 87,
      category: 'habits',
      difficulty: 'medium',
      timeCommitment: 'Weekly sessions',
      benefits: ['Better liver health', 'Improved sleep', 'Weight loss', 'Better mental clarity'],
      personalizedReason: 'Reducing alcohol consumption could significantly improve your liver health and overall wellbeing.',
      localAvailability: location ? `Alcohol support services in ${location.city}` : 'Alcohol support services available'
    });
  }

  return recommendations;
};

// Helper function to generate condition management recommendations
const generateConditionManagement = (
  userProfile: User['profileData'],
  location?: GeolocationData
): ConditionManagementRecommendation[] => {
  const recommendations: ConditionManagementRecommendation[] = [];
  
  if (!userProfile?.healthData?.medicalConditions) return recommendations;

  const conditions = userProfile.healthData.medicalConditions;
  const currentSymptoms = userProfile.healthData.currentSymptoms || [];

  conditions.forEach(condition => {
    switch (condition.toLowerCase()) {
      case 'diabetes (type 1)':
      case 'diabetes (type 2)':
        recommendations.push({
          id: `condition_diabetes_${Date.now()}`,
          name: 'Diabetes Management Program',
          description: 'Comprehensive diabetes care including monitoring, education, and support.',
          imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
          reason: 'Proper diabetes management prevents serious complications.',
          matchScore: 96,
          provider: 'Diabetes Specialist Nurse',
          category: 'monitoring',
          condition: condition,
          evidenceBased: true,
          personalizedReason: 'Regular monitoring and education can help you maintain better blood sugar control and prevent complications.',
          localAvailability: location ? `Diabetes clinics in ${location.city}` : 'Diabetes clinics available'
        });
        break;

      case 'high blood pressure':
        recommendations.push({
          id: `condition_bp_${Date.now()}`,
          name: 'Blood Pressure Management',
          description: 'Regular monitoring and lifestyle modifications to control blood pressure.',
          imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
          reason: 'Uncontrolled blood pressure increases risk of heart attack and stroke.',
          matchScore: 93,
          provider: 'GP or Practice Nurse',
          category: 'monitoring',
          condition: condition,
          evidenceBased: true,
          personalizedReason: 'Regular blood pressure monitoring and lifestyle changes can significantly reduce your cardiovascular risk.',
          localAvailability: location ? `GP surgeries in ${location.city}` : 'Available at GP surgeries'
        });
        break;

      case 'asthma':
        recommendations.push({
          id: `condition_asthma_${Date.now()}`,
          name: 'Asthma Action Plan',
          description: 'Personalized asthma management plan with trigger identification and medication optimization.',
          imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
          reason: 'Proper asthma management prevents attacks and improves quality of life.',
          matchScore: 91,
          provider: 'Asthma Nurse Specialist',
          category: 'treatment',
          condition: condition,
          evidenceBased: true,
          personalizedReason: 'A personalized asthma action plan can help you better control your symptoms and prevent severe attacks.',
          localAvailability: location ? `Respiratory clinics in ${location.city}` : 'Respiratory clinics available'
        });
        break;

      case 'arthritis':
        recommendations.push({
          id: `condition_arthritis_${Date.now()}`,
          name: 'Arthritis Management Program',
          description: 'Comprehensive approach including exercise therapy, pain management, and joint protection.',
          imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
          reason: 'Active management can slow progression and maintain mobility.',
          matchScore: 88,
          provider: 'Rheumatology Team',
          category: 'treatment',
          condition: condition,
          evidenceBased: true,
          personalizedReason: 'Proper arthritis management can help maintain your mobility and reduce pain significantly.',
          localAvailability: location ? `Rheumatology services in ${location.city}` : 'Rheumatology services available'
        });
        break;
    }
  });

  return recommendations;
};

// Helper function to generate mental wellbeing recommendations
const generateMentalWellbeing = (
  userProfile: User['profileData'],
  location?: GeolocationData
): MentalWellbeingRecommendation[] => {
  const recommendations: MentalWellbeingRecommendation[] = [];
  
  if (!userProfile?.healthData) return recommendations;

  const { 
    mentalHealthHistory, 
    stressLevels, 
    currentSymptoms,
    sleepPatterns 
  } = userProfile.healthData;

  const socialEngagement = userProfile.socialEngagement;

  // Depression support
  if (mentalHealthHistory?.includes('depression') || currentSymptoms?.includes('mood changes')) {
    recommendations.push({
      id: 'mental_1',
      name: 'Cognitive Behavioral Therapy (CBT)',
      description: 'Evidence-based therapy to help manage depression and negative thought patterns.',
      imageUrl: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'CBT is highly effective for treating depression and preventing relapse.',
      matchScore: 94,
      provider: 'Clinical Psychologist',
      category: 'therapy',
      approach: 'Individual therapy sessions',
      personalizedReason: 'CBT can help you develop coping strategies and change negative thought patterns that contribute to depression.',
      localAvailability: location ? `Mental health services in ${location.city}` : 'NHS and private mental health services available'
    });
  }

  // Anxiety support
  if (mentalHealthHistory?.includes('anxiety disorders') || stressLevels === 'high') {
    recommendations.push({
      id: 'mental_2',
      name: 'Anxiety Management Program',
      description: 'Combination of therapy, relaxation techniques, and coping strategies.',
      imageUrl: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Anxiety can be effectively managed with the right support and techniques.',
      matchScore: 90,
      provider: 'Mental Health Team',
      category: 'therapy',
      approach: 'Group and individual sessions',
      personalizedReason: 'Learning anxiety management techniques can significantly improve your quality of life and reduce physical symptoms.',
      localAvailability: location ? `Anxiety support groups in ${location.city}` : 'Anxiety support services available'
    });
  }

  // Social isolation support
  if (socialEngagement === 'isolated') {
    recommendations.push({
      id: 'mental_3',
      name: 'Social Connection Program',
      description: 'Structured activities and support groups to build social connections.',
      imageUrl: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Social isolation significantly impacts mental and physical health.',
      matchScore: 87,
      provider: 'Community Mental Health Team',
      category: 'support-group',
      approach: 'Group activities and peer support',
      personalizedReason: 'Building social connections can improve your mental health and provide valuable support networks.',
      localAvailability: location ? `Community centers in ${location.city}` : 'Community centers and support groups available'
    });
  }

  // Sleep and mental health
  if (sleepPatterns === 'poor' && (mentalHealthHistory?.includes('depression') || mentalHealthHistory?.includes('anxiety disorders'))) {
    recommendations.push({
      id: 'mental_4',
      name: 'Sleep and Mental Health Program',
      description: 'Integrated approach addressing the connection between sleep and mental health.',
      imageUrl: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Poor sleep and mental health issues often reinforce each other.',
      matchScore: 92,
      provider: 'Sleep and Mental Health Specialist',
      category: 'lifestyle',
      approach: 'Combined sleep hygiene and mental health support',
      personalizedReason: 'Addressing both sleep and mental health together can provide better outcomes than treating them separately.',
      localAvailability: location ? `Specialized clinics in ${location.city}` : 'Specialized sleep and mental health services available'
    });
  }

  return recommendations;
};

// Helper function to generate seasonal health recommendations
const generateSeasonalHealth = (
  userProfile: User['profileData'],
  currentSeason: string,
  location?: GeolocationData
): SeasonalHealthRecommendation[] => {
  const recommendations: SeasonalHealthRecommendation[] = [];
  
  if (!userProfile) return recommendations;

  const { healthData } = userProfile;
  const mentalHealthHistory = healthData?.mentalHealthHistory || [];

  switch (currentSeason) {
    case 'winter':
      recommendations.push({
        id: 'seasonal_winter_1',
        name: 'Vitamin D Supplementation',
        description: 'Combat winter vitamin D deficiency with appropriate supplementation.',
        imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
        reason: 'Limited sunlight in winter leads to vitamin D deficiency in most UK residents.',
        matchScore: 88,
        category: 'immune-support',
        season: 'winter',
        personalizedReason: 'Winter vitamin D supplementation is especially important in the UK due to limited sunlight exposure.',
        localAvailability: location ? `Pharmacies in ${location.city}` : 'Available at pharmacies'
      });

      if (mentalHealthHistory.includes('seasonal depression (SAD)') || mentalHealthHistory.includes('depression')) {
        recommendations.push({
          id: 'seasonal_winter_2',
          name: 'Light Therapy for SAD',
          description: 'Light therapy to combat seasonal affective disorder and winter blues.',
          imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
          reason: 'Light therapy is an effective treatment for seasonal affective disorder.',
          matchScore: 93,
          category: 'mood-support',
          season: 'winter',
          personalizedReason: 'Your mental health history suggests you may benefit significantly from light therapy during winter months.',
          localAvailability: location ? `Mental health services in ${location.city}` : 'Mental health services and light therapy devices available'
        });
      }
      break;

    case 'spring':
      recommendations.push({
        id: 'seasonal_spring_1',
        name: 'Allergy Preparation',
        description: 'Prepare for spring allergies with preventive measures and treatments.',
        imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
        reason: 'Spring brings increased pollen levels that can trigger allergic reactions.',
        matchScore: 75,
        category: 'seasonal-prep',
        season: 'spring',
        personalizedReason: 'Preparing for spring allergies can help you enjoy the season without discomfort.',
        localAvailability: location ? `Pharmacies and GP surgeries in ${location.city}` : 'Available at pharmacies and GP surgeries'
      });
      break;

    case 'summer':
      recommendations.push({
        id: 'seasonal_summer_1',
        name: 'Sun Protection Plan',
        description: 'Comprehensive sun protection to prevent skin damage and heat-related illness.',
        imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
        reason: 'UV exposure increases skin cancer risk and can cause heat-related health problems.',
        matchScore: 85,
        category: 'weather-protection',
        season: 'summer',
        personalizedReason: 'Proper sun protection is essential for preventing skin cancer and maintaining healthy skin.',
        localAvailability: location ? `Pharmacies and shops in ${location.city}` : 'Widely available at pharmacies and shops'
      });
      break;

    case 'autumn':
      recommendations.push({
        id: 'seasonal_autumn_1',
        name: 'Immune System Boost',
        description: 'Strengthen your immune system before winter cold and flu season.',
        imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
        reason: 'Autumn is the ideal time to prepare your immune system for winter illnesses.',
        matchScore: 82,
        category: 'immune-support',
        season: 'autumn',
        personalizedReason: 'Boosting your immune system now can help prevent winter illnesses.',
        localAvailability: location ? `Health stores and pharmacies in ${location.city}` : 'Available at health stores and pharmacies'
      });
      break;
  }

  return recommendations;
};

const defaultRecommendations: MaiHealthRecommendations = {
  preventiveCare: [
    {
      id: 'default_preventive_1',
      name: 'Annual Health Check',
      description: 'Comprehensive health assessment including vital signs and basic screenings.',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Regular health checks can detect problems early when they\'re easier to treat.',
      matchScore: 80,
      provider: 'GP Surgery',
      category: 'checkup',
      urgency: 'medium',
      frequency: 'Annually',
      ageRelevant: true,
      personalizedReason: 'Annual health checks are important for maintaining good health at any age.'
    }
  ],
  lifestyle: [
    {
      id: 'default_lifestyle_1',
      name: 'Daily Walking Program',
      description: 'Simple walking routine to improve cardiovascular health and mood.',
      imageUrl: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Walking is one of the best exercises for overall health and wellbeing.',
      matchScore: 85,
      category: 'exercise',
      difficulty: 'easy',
      timeCommitment: '30 minutes daily',
      benefits: ['Improved heart health', 'Better mood', 'Weight management', 'Stronger bones'],
      personalizedReason: 'A daily walking routine is an excellent foundation for a healthy lifestyle.'
    }
  ],
  conditionManagement: [],
  mentalWellbeing: [
    {
      id: 'default_mental_1',
      name: 'Stress Management Techniques',
      description: 'Learn practical techniques to manage daily stress and improve wellbeing.',
      imageUrl: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Everyone can benefit from better stress management skills.',
      matchScore: 75,
      provider: 'Wellbeing Coach',
      category: 'self-care',
      approach: 'Self-guided techniques',
      personalizedReason: 'Learning stress management techniques can improve your overall quality of life.'
    }
  ],
  seasonalHealth: []
};

export const useMaiHealthRecommendations = (
  userProfile: User['profileData'] | undefined,
  location?: GeolocationData | null,
  currentSeason?: string
) => {
  const [recommendations, setRecommendations] = useState<MaiHealthRecommendations>(defaultRecommendations);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile && userProfile.healthData) {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const newRecommendations: MaiHealthRecommendations = {
          preventiveCare: generatePreventiveCare(userProfile, location || undefined),
          lifestyle: generateLifestyleAdvice(userProfile, location || undefined),
          conditionManagement: generateConditionManagement(userProfile, location || undefined),
          mentalWellbeing: generateMentalWellbeing(userProfile, location || undefined),
          seasonalHealth: currentSeason ? generateSeasonalHealth(userProfile, currentSeason, location || undefined) : []
        };

        // Add location-specific information to all recommendations
        if (location) {
          const addLocationInfo = (items: any[]) => {
            return items.map(item => ({
              ...item,
              localAvailability: item.localAvailability || `Available in ${location.city} and throughout ${location.region}`
            }));
          };

          newRecommendations.preventiveCare = addLocationInfo(newRecommendations.preventiveCare);
          newRecommendations.lifestyle = addLocationInfo(newRecommendations.lifestyle);
          newRecommendations.conditionManagement = addLocationInfo(newRecommendations.conditionManagement);
          newRecommendations.mentalWellbeing = addLocationInfo(newRecommendations.mentalWellbeing);
          newRecommendations.seasonalHealth = addLocationInfo(newRecommendations.seasonalHealth);
        }

        setRecommendations(newRecommendations);
        setLoading(false);
      }, 1000);
    } else {
      setRecommendations(defaultRecommendations);
    }
  }, [userProfile, location, currentSeason]);

  return { recommendations, loading };
};
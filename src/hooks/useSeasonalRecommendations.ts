import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGeolocation } from './useGeolocation';
import { usePublicHealthData } from './usePublicHealthData';
import { useDetailedWeather } from './useDetailedWeather';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: 'health' | 'style' | 'home';
  subcategory: string;
  imageUrl: string;
  brand: string;
  rating: number;
  inStock: boolean;
  deliveryTime: string;
  personalizedReason: string;
  urgency: 'low' | 'medium' | 'high';
  seasonalRelevance: number; // 1-10 scale
}

interface SeasonalNotification {
  id: string;
  type: 'seasonal' | 'weather' | 'health' | 'location' | 'clothing' | 'emergency' | 'weather-extreme' | 'preventive-care' | 'social-wellbeing';
  title: string;
  message: string;
  products: Product[];
  priority: 'low' | 'medium' | 'high';
  expiresAt: Date;
  dismissed: boolean;
  actionRequired: boolean;
  healthCondition?: string;
  weatherAlert?: boolean;
}

interface HealthCheckGuideline {
  name: string;
  description: string;
  minAge: number;
  maxAge: number;
  type: 'essential' | 'recommended' | 'advanced';
  frequency: string;
  action: string;
  importance: 'low' | 'medium' | 'high';
  riskFactors?: string[];
  genderSpecific?: 'male' | 'female' | 'both';
  yearlyPriority?: number; // 1-3, with 1 being highest priority for that year
}

// Simplified, focused health check guidelines
const HEALTH_CHECK_GUIDELINES: HealthCheckGuideline[] = [
  // Essential checks - the absolute minimum everyone should have
  {
    name: 'Blood Pressure Check',
    description: 'Monitor for high blood pressure - the "silent killer"',
    minAge: 18,
    maxAge: 100,
    type: 'essential',
    frequency: 'Annually',
    action: 'Home monitor or GP check',
    importance: 'high',
    genderSpecific: 'both',
    yearlyPriority: 1
  },
  {
    name: 'Cholesterol Check',
    description: 'Heart disease prevention - check every 5 years if normal',
    minAge: 20,
    maxAge: 100,
    type: 'essential',
    frequency: 'Every 5 years',
    action: 'Blood test at GP',
    importance: 'high',
    genderSpecific: 'both',
    yearlyPriority: 2
  },
  {
    name: 'Diabetes Screening',
    description: 'Early detection of type 2 diabetes',
    minAge: 35,
    maxAge: 100,
    type: 'essential',
    frequency: 'Every 3 years',
    action: 'Blood test at GP',
    importance: 'high',
    genderSpecific: 'both',
    yearlyPriority: 1
  },
  {
    name: 'Dental Check-up',
    description: 'Prevent tooth loss and gum disease',
    minAge: 18,
    maxAge: 100,
    type: 'essential',
    frequency: 'Annually',
    action: 'Book dental appointment',
    importance: 'medium',
    genderSpecific: 'both',
    yearlyPriority: 3
  },
  {
    name: 'Eye Test',
    description: 'Detect vision problems and eye diseases',
    minAge: 18,
    maxAge: 100,
    type: 'essential',
    frequency: 'Every 2 years',
    action: 'Visit optometrist',
    importance: 'medium',
    genderSpecific: 'both',
    yearlyPriority: 3
  },

  // Recommended checks - important for most people
  {
    name: 'Bowel Cancer Screening',
    description: 'NHS offers this at 60, but consider earlier if family history',
    minAge: 50,
    maxAge: 75,
    type: 'recommended',
    frequency: 'Every 2 years',
    action: 'NHS screening or private test',
    importance: 'high',
    genderSpecific: 'both',
    yearlyPriority: 1
  },
  {
    name: 'Breast Screening',
    description: 'NHS mammograms start at 50, consider earlier if high risk',
    minAge: 40,
    maxAge: 70,
    type: 'recommended',
    frequency: 'Every 3 years',
    action: 'NHS screening programme',
    importance: 'high',
    genderSpecific: 'female',
    yearlyPriority: 1
  },
  {
    name: 'Cervical Screening',
    description: 'Prevent cervical cancer - don\'t skip this',
    minAge: 25,
    maxAge: 64,
    type: 'recommended',
    frequency: 'Every 3-5 years',
    action: 'GP or sexual health clinic',
    importance: 'high',
    genderSpecific: 'female',
    yearlyPriority: 1
  },
  {
    name: 'Prostate Check',
    description: 'Discuss PSA testing with GP, especially if family history',
    minAge: 50,
    maxAge: 75,
    type: 'recommended',
    frequency: 'Discuss annually',
    action: 'GP consultation',
    importance: 'high',
    genderSpecific: 'male',
    yearlyPriority: 1
  },
  {
    name: 'Bone Density Scan',
    description: 'Check for osteoporosis, especially important for women',
    minAge: 65,
    maxAge: 100,
    type: 'recommended',
    frequency: 'Once, then as advised',
    action: 'GP referral',
    importance: 'medium',
    genderSpecific: 'both',
    yearlyPriority: 2
  },

  // Advanced checks - for those who want comprehensive screening
  {
    name: 'Heart Scan',
    description: 'Advanced cardiac screening if high risk',
    minAge: 40,
    maxAge: 100,
    type: 'advanced',
    frequency: 'If high risk',
    action: 'Private health check or cardiology referral',
    importance: 'medium',
    riskFactors: ['family history', 'diabetes', 'high cholesterol'],
    genderSpecific: 'both',
    yearlyPriority: 1
  },
  {
    name: 'Full Body Health MOT',
    description: 'Comprehensive private health screening',
    minAge: 40,
    maxAge: 100,
    type: 'advanced',
    frequency: 'Every 2-3 years',
    action: 'Private health clinic',
    importance: 'low',
    genderSpecific: 'both',
    yearlyPriority: 2
  }
];

export const useSeasonalRecommendations = () => {
  const { user } = useAuth();
  const { location } = useGeolocation();
  const { healthData, getHighRiskConditions, getIncreasingConditions } = usePublicHealthData();
  const { weatherData, getClothingAlert, getHealthAlerts } = useDetailedWeather();
  const [notifications, setNotifications] = useState<SeasonalNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const getCurrentSeason = (): string => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  };

  const generateHealthProducts = (condition: string, userProfile: any): Product[] => {
    const products: Product[] = [];

    switch (condition.toLowerCase()) {
      case 'influenza':
        products.push({
          id: 'flu-relief-kit',
          name: 'Complete Flu Relief Kit',
          description: 'Paracetamol, throat lozenges, vitamin C, and immune support',
          price: 19.99,
          currency: 'GBP',
          category: 'health',
          subcategory: 'medication',
          imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
          brand: 'HealthFirst',
          rating: 4.6,
          inStock: true,
          deliveryTime: 'Same day delivery',
          personalizedReason: 'Flu cases are increasing in your area. Be prepared with essential relief items.',
          urgency: 'high',
          seasonalRelevance: 10
        });

        if (userProfile?.age > 65 || userProfile?.healthData?.medicalConditions?.length > 0) {
          products.push({
            id: 'immune-booster-senior',
            name: 'Senior Immune Support Supplement',
            description: 'Zinc, Vitamin D3, and elderberry for enhanced immune function',
            price: 24.99,
            currency: 'GBP',
            category: 'health',
            subcategory: 'supplements',
            imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
            brand: 'SeniorCare',
            rating: 4.8,
            inStock: true,
            deliveryTime: 'Next day delivery',
            personalizedReason: 'Recommended for your age group during flu season for additional protection.',
            urgency: 'high',
            seasonalRelevance: 9
          });
        }
        break;

      case 'covid-19':
        products.push({
          id: 'covid-test-kit',
          name: 'COVID-19 Rapid Test Kit (5 pack)',
          description: 'NHS approved lateral flow tests for home use',
          price: 12.99,
          currency: 'GBP',
          category: 'health',
          subcategory: 'testing',
          imageUrl: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=400',
          brand: 'TestSafe',
          rating: 4.7,
          inStock: true,
          deliveryTime: 'Same day delivery',
          personalizedReason: 'COVID cases are stable but present in your area. Keep tests handy for peace of mind.',
          urgency: 'medium',
          seasonalRelevance: 7
        });
        break;

      case 'pertussis':
      case 'pertussis (whooping cough)':
        products.push({
          id: 'cough-suppressant',
          name: 'Natural Cough Relief Syrup',
          description: 'Honey and herbal formula for persistent cough relief',
          price: 8.99,
          currency: 'GBP',
          category: 'health',
          subcategory: 'medication',
          imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
          brand: 'NaturalCare',
          rating: 4.4,
          inStock: true,
          deliveryTime: 'Next day delivery',
          personalizedReason: 'Whooping cough cases are increasing. This can help with persistent cough symptoms.',
          urgency: 'medium',
          seasonalRelevance: 8
        });
        break;

      case 'norovirus':
        products.push({
          id: 'rehydration-salts',
          name: 'Oral Rehydration Salts (10 sachets)',
          description: 'WHO formula for rapid rehydration during illness',
          price: 6.99,
          currency: 'GBP',
          category: 'health',
          subcategory: 'medication',
          imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
          brand: 'Hydrate+',
          rating: 4.5,
          inStock: true,
          deliveryTime: 'Same day delivery',
          personalizedReason: 'Norovirus is circulating. Stay prepared for rapid rehydration if needed.',
          urgency: 'medium',
          seasonalRelevance: 7
        });
        break;
    }

    return products;
  };

  const generateWeatherProducts = (weatherAlert: any, userProfile: any): Product[] => {
    const products: Product[] = [];

    if (weatherAlert?.type === 'clothing-change') {
      const tempDrop = weatherAlert.message.includes('to') && 
        parseFloat(weatherAlert.message.split('to ')[1]) < parseFloat(weatherAlert.message.split('from ')[1]);

      if (tempDrop) {
        products.push({
          id: 'thermal-layers',
          name: 'Thermal Base Layer Set',
          description: 'Moisture-wicking thermal underwear for sudden temperature drops',
          price: 34.99,
          currency: 'GBP',
          category: 'style',
          subcategory: 'clothing',
          imageUrl: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=400',
          brand: 'WarmTech',
          rating: 4.6,
          inStock: true,
          deliveryTime: 'Same day delivery',
          personalizedReason: `Temperature dropping significantly tomorrow. ${weatherAlert.recommendation}`,
          urgency: 'high',
          seasonalRelevance: 9
        });

        products.push({
          id: 'waterproof-jacket',
          name: 'Lightweight Waterproof Jacket',
          description: 'Packable rain jacket perfect for unpredictable weather',
          price: 49.99,
          currency: 'GBP',
          category: 'style',
          subcategory: 'outerwear',
          imageUrl: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=400',
          brand: 'WeatherShield',
          rating: 4.7,
          inStock: true,
          deliveryTime: 'Next day delivery',
          personalizedReason: 'Weather is changing rapidly. Stay dry and comfortable with this versatile jacket.',
          urgency: 'medium',
          seasonalRelevance: 8
        });
      }
    }

    return products;
  };

  const getYearlyHealthPriorities = (age: number, gender?: string): HealthCheckGuideline[] => {
    // Filter guidelines based on user's age and gender
    const relevantGuidelines = HEALTH_CHECK_GUIDELINES.filter(guideline => {
      const ageMatch = age >= guideline.minAge && age <= guideline.maxAge;
      const genderMatch = guideline.genderSpecific === 'both' || guideline.genderSpecific === gender;
      return ageMatch && genderMatch;
    });

    // Sort by priority (1 = highest priority)
    return relevantGuidelines.sort((a, b) => (a.yearlyPriority || 3) - (b.yearlyPriority || 3));
  };

  const generatePreventiveCareNotifications = (userProfile: any): SeasonalNotification[] => {
    if (!userProfile?.age) return [];

    const notifications: SeasonalNotification[] = [];
    const userAge = userProfile.age;
    const userGender = userProfile.gender || 'both';

    // Get this year's health priorities
    const yearlyPriorities = getYearlyHealthPriorities(userAge, userGender);

    // Focus on top 3 priorities for the year
    const thisYearChecks = (yearlyPriorities || []).slice(0, 3);

    // Skip if no health checks available
    if (thisYearChecks.length === 0) {
      return notifications;
    }
    
    // Generate excellent health monitoring products
    const products: Product[] = [];

    // Essential monitoring products based on age
    if (userAge >= 18) {
      products.push({
        id: 'blood-pressure-monitor',
        name: 'Digital Blood Pressure Monitor',
        description: 'Clinically validated home blood pressure monitoring device with smartphone app',
        price: 39.99,
        currency: 'GBP',
        category: 'health',
        subcategory: 'monitoring',
        imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
        brand: 'HealthCheck Pro',
        rating: 4.5,
        inStock: true,
        deliveryTime: 'Next day delivery',
        personalizedReason: 'High blood pressure is the leading cause of heart disease and stroke. Home monitoring can detect issues early and save lives.',
        urgency: 'medium',
        seasonalRelevance: 8
      });
    }

    // Vitamin D test - crucial in UK
    products.push({
      id: 'vitamin-d-test',
      name: 'Vitamin D Home Test Kit',
      description: 'Simple finger-prick test with lab analysis and personalized recommendations',
      price: 29.99,
      currency: 'GBP',
      category: 'health',
      subcategory: 'testing',
      imageUrl: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=400',
      brand: 'TestWell',
      rating: 4.3,
      inStock: true,
      deliveryTime: 'Same day delivery',
      personalizedReason: '80% of UK adults are vitamin D deficient. This affects bone health, immune function, and mood.',
      urgency: 'low',
      seasonalRelevance: 6
    });

    // Age-specific test kits
    if (userAge >= 20) {
      products.push({
        id: 'cholesterol-test-kit',
        name: 'Complete Cholesterol & Heart Health Test',
        description: 'Full lipid profile plus inflammation markers - results in 48 hours',
        price: 34.99,
        currency: 'GBP',
        category: 'health',
        subcategory: 'testing',
        imageUrl: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=400',
        brand: 'CardioCheck',
        rating: 4.4,
        inStock: true,
        deliveryTime: 'Next day delivery',
        personalizedReason: 'Heart disease is the UK\'s biggest killer. Regular cholesterol monitoring from age 20 can prevent heart attacks.',
        urgency: 'medium',
        seasonalRelevance: 7
      });
    }

    if (userAge >= 35) {
      products.push({
        id: 'diabetes-test-kit',
        name: 'HbA1c Diabetes Screening Test',
        description: '3-month average blood sugar test - gold standard for diabetes detection',
        price: 24.99,
        currency: 'GBP',
        category: 'health',
        subcategory: 'testing',
        imageUrl: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=400',
        brand: 'DiabetesCheck',
        rating: 4.6,
        inStock: true,
        deliveryTime: 'Same day delivery',
        personalizedReason: '1 in 15 UK adults has diabetes, many undiagnosed. Early detection prevents serious complications.',
        urgency: 'medium',
        seasonalRelevance: 8
      });
    }

    if (userAge >= 50) {
      products.push({
        id: 'bowel-cancer-test',
        name: 'Bowel Cancer Screening Kit',
        description: 'NHS-equivalent FIT test for early bowel cancer detection',
        price: 19.99,
        currency: 'GBP',
        category: 'health',
        subcategory: 'testing',
        imageUrl: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=400',
        brand: 'CancerScreen',
        rating: 4.7,
        inStock: true,
        deliveryTime: 'Next day delivery',
        personalizedReason: 'Bowel cancer is highly treatable when caught early. NHS only offers screening from 60, but earlier detection saves lives.',
        urgency: 'high',
        seasonalRelevance: 9
      });
    }

    // Create simplified, focused message
    let message = `**Your Health Priorities This Year (Age ${userAge}):**\n\n`;
    
    message += '**Essential Checks:**\n';
    thisYearChecks.filter(check => check.type === 'essential').forEach((check, index) => {
      message += `${index + 1}. **${check.name}**: ${check.description} - ${check.frequency}\n`;
    });

    const recommendedChecks = thisYearChecks.filter(check => check.type === 'recommended');
    if (recommendedChecks.length > 0) {
      message += '\n**Important for Your Age Group:**\n';
      recommendedChecks.forEach((check, index) => {
        message += `${index + 1}. **${check.name}**: ${check.description} - ${check.frequency}\n`;
      });
    }

    const advancedChecks = thisYearChecks.filter(check => check.type === 'advanced');
    if (advancedChecks.length > 0) {
      message += '\n**Consider If High Risk:**\n';
      advancedChecks.forEach((check, index) => {
        message += `${index + 1}. **${check.name}**: ${check.description} - ${check.frequency}\n`;
      });
    }

    message += '\n**⚠️ UK Healthcare Reality Check:**\n';
    message += `At age 63, the NHS only offers bowel cancer screening. Most other vital checks require you to be proactive and request them from your GP.\n\n`;
    message += `**💡 Pro Tip:** Use home test kits for initial screening, then discuss results with your GP. This saves NHS time and gives you peace of mind.`;

    // Create focused notification
    const hasHighPriorityChecks = thisYearChecks.some(check => check.importance === 'high');
    
    notifications.push({
      id: `health-priorities-${userAge}-${Date.now()}`,
      type: 'preventive-care',
      title: `Your ${new Date().getFullYear()} Health Check Plan`,
      message,
      products,
      priority: hasHighPriorityChecks ? 'high' : 'medium',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      dismissed: false,
      actionRequired: hasHighPriorityChecks,
      weatherAlert: false
    });

    return notifications;
  };

  const generateSocialWellbeingProducts = (userProfile: any): Product[] => {
    const products: Product[] = [];

    if (userProfile?.socialEngagement === 'isolated') {
      products.push({
        id: 'community-membership',
        name: 'Local Community Center Membership',
        description: 'Annual membership with access to classes, events, and social activities',
        price: 120.00,
        currency: 'GBP',
        category: 'health',
        subcategory: 'wellness',
        imageUrl: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=400',
        brand: 'CommunityConnect',
        rating: 4.8,
        inStock: true,
        deliveryTime: 'Immediate access',
        personalizedReason: 'Social isolation increases death risk by 50% - equivalent to smoking 15 cigarettes daily. Building connections is vital for health.',
        urgency: 'high',
        seasonalRelevance: 9
      });

      products.push({
        id: 'group-fitness-pass',
        name: 'Group Fitness Class Pass (10 sessions)',
        description: 'Access to yoga, pilates, and fitness classes with social interaction',
        price: 85.00,
        currency: 'GBP',
        category: 'health',
        subcategory: 'fitness',
        imageUrl: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=400',
        brand: 'FitTogether',
        rating: 4.6,
        inStock: true,
        deliveryTime: 'Book immediately',
        personalizedReason: 'Combine fitness goals with social connection. Research shows group exercise improves both physical and mental health.',
        urgency: 'medium',
        seasonalRelevance: 8
      });
    }

    return products;
  };

  const generateNotifications = (): SeasonalNotification[] => {
    if (!user || !location) return [];

    const notifications: SeasonalNotification[] = [];

    // Health-based notifications
    if (healthData) {
      const highRiskConditions = getHighRiskConditions();
      const increasingConditions = getIncreasingConditions();

      // High-risk health conditions
      highRiskConditions.forEach(condition => {
        if (user.serviceAreas && user.serviceAreas.includes('MaiHealth')) {
          const products = generateHealthProducts(condition.condition, user.profileData);
          
          notifications.push({
            id: `health-alert-${condition.condition}-${Date.now()}`,
            type: 'health',
            title: `${condition.condition} Alert - High Risk`,
            message: `${condition.description} in ${location.city}. ${condition.cases} cases reported. Take preventive action.`,
            products,
            priority: 'high',
            expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            dismissed: false,
            actionRequired: true,
            healthCondition: condition.condition,
            weatherAlert: false
          });
        }
      });

      // Increasing health conditions
      increasingConditions.forEach(condition => {
        if (user.serviceAreas && user.serviceAreas.includes('MaiHealth') && condition.status !== 'high') {
          const products = generateHealthProducts(condition.condition, user.profileData);
          
          notifications.push({
            id: `health-trend-${condition.condition}-${Date.now()}`,
            type: 'health',
            title: `${condition.condition} Cases Increasing`,
            message: `${condition.condition} cases are ${condition.trend} in ${location.city}. Stay vigilant and prepared.`,
            products,
            priority: 'medium',
            expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
            dismissed: false,
            actionRequired: false,
            healthCondition: condition.condition,
            weatherAlert: false
          });
        }
      });

      // Social wellbeing notifications
      if (healthData.socialWellbeingRecommendations.length > 0 && user.socialEngagement === 'isolated') {
        const products = generateSocialWellbeingProducts(user.profileData);
        
        notifications.push({
          id: `social-wellbeing-${Date.now()}`,
          type: 'social-wellbeing',
          title: 'Social Connection Recommendations',
          message: 'Building strong social connections is crucial for your overall wellbeing. We\'ve found some opportunities that might interest you.',
          products,
          priority: 'high',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          dismissed: false,
          actionRequired: true,
          weatherAlert: false
        });
      }

      // Simplified preventive care notifications
      if (user.serviceAreas && user.serviceAreas.includes('MaiHealth') && user.profileData?.age) {
        const preventiveCareNotifications = generatePreventiveCareNotifications(user.profileData);
        notifications.push(...preventiveCareNotifications);
      }
    }

    // Weather-based notifications
    if (weatherData) {
      const clothingAlert = getClothingAlert();
      const healthAlerts = getHealthAlerts();

      // Clothing change alert
      if (clothingAlert && user.serviceAreas && user.serviceAreas.includes('MaiStyle')) {
        const products = generateWeatherProducts(clothingAlert, user.profileData);
        
        notifications.push({
          id: `weather-clothing-${Date.now()}`,
          type: 'clothing',
          title: 'Weather Change Alert',
          message: `${clothingAlert.message}. Adjust your wardrobe accordingly.`,
          products,
          priority: 'high',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          dismissed: false,
          actionRequired: true,
          weatherAlert: true
        });
      }

      // Weather health alerts
      if (healthAlerts.length > 0 && user.serviceAreas && user.serviceAreas.includes('MaiHealth')) {
        notifications.push({
          id: `weather-health-${Date.now()}`,
          type: 'weather',
          title: 'Weather Health Advisory',
          message: `Weather conditions in ${location.city} may affect your health: ${healthAlerts.join(', ')}`,
          products: [],
          priority: 'medium',
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
          dismissed: false,
          actionRequired: false,
          weatherAlert: true
        });
      }

      // Emergency weather alerts
      if (weatherData.alerts.length > 0) {
        weatherData.alerts.forEach(alert => {
          notifications.push({
            id: `weather-emergency-${Date.now()}-${Math.random()}`,
            type: 'weather-extreme',
            title: 'Extreme Weather Alert',
            message: alert,
            products: [],
            priority: 'high',
            expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
            dismissed: false,
            actionRequired: true,
            weatherAlert: true
          });
        });
      }
    }

    return notifications;
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, dismissed: true }
          : notification
      )
    );
  };

  const purchaseProduct = async (productId: string, notificationId?: string) => {
    setLoading(true);
    
    try {
      // Simulate purchase process with delivery to saved address
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (notificationId) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, actionRequired: false }
              : notification
          )
        );
      }
      
      return { success: true, orderId: `ORDER-${Date.now()}` };
    } catch (error) {
      return { success: false, error: 'Purchase failed' };
    } finally {
      setLoading(false);
    }
  };

  const getHealthCheckRecommendations = (age: number, gender?: string): HealthCheckGuideline[] => {
    return getYearlyHealthPriorities(age, gender);
  };

  useEffect(() => {
    if (user && location && (healthData || weatherData)) {
      const newNotifications = generateNotifications();
      setNotifications(prev => {
        const existingIds = prev.map(n => n.id);
        const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
        return [...prev, ...uniqueNew];
      });
    }
  }, [user, location, healthData, weatherData]);

  return {
    notifications: notifications.filter(n => !n.dismissed && new Date() < n.expiresAt),
    dismissNotification,
    purchaseProduct,
    loading,
    getCurrentSeason,
    healthData,
    weatherData,
    getHealthCheckRecommendations,
    getYearlyHealthPriorities,
    HEALTH_CHECK_GUIDELINES
  };
};
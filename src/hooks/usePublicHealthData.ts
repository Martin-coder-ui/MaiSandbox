import { useState, useEffect } from 'react';
import { useGeolocation } from './useGeolocation';
import { useAuth } from '../contexts/AuthContext';

interface HealthCondition {
  condition: string;
  status: 'low' | 'moderate' | 'high' | 'very-high';
  cases: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  description: string;
  recommendations: string[];
  lastUpdated: Date;
  source: string;
}

interface PublicHealthData {
  region: string;
  conditions: HealthCondition[];
  weatherHealthAlerts: string[];
  seasonalRisks: string[];
  socialWellbeingRecommendations: string[];
  lastUpdated: Date;
}

export const usePublicHealthData = () => {
  const { location } = useGeolocation();
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<PublicHealthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSocialWellbeingRecommendations = (socialEngagement?: string): string[] => {
    const recommendations: string[] = [];

    switch (socialEngagement) {
      case 'isolated':
        recommendations.push(
          'Consider joining local community groups or clubs based on your interests',
          'Look into volunteering opportunities in your area - helping others builds connections',
          'Try group fitness classes or walking groups for health and social benefits',
          'Explore local meetup groups or hobby clubs to meet like-minded people',
          'Consider joining a community garden or local environmental group',
          'Look into local religious or spiritual communities if that aligns with your values',
          'Try co-working spaces or community centers for regular social interaction',
          'Consider getting a pet - they provide companionship and opportunities to meet other pet owners'
        );
        break;
      case 'moderate':
        recommendations.push(
          'Strengthen existing relationships by scheduling regular catch-ups',
          'Consider expanding your social circle through shared activities',
          'Look into community events or local festivals to meet neighbors',
          'Try organizing small gatherings or dinner parties with friends'
        );
        break;
      case 'connected':
        recommendations.push(
          'Continue nurturing your strong social connections',
          'Consider mentoring others or helping those who might be more isolated',
          'Organize community events or activities to bring people together'
        );
        break;
      default:
        recommendations.push(
          'Building strong social connections is important for overall wellbeing',
          'Consider joining activities that align with your interests'
        );
    }

    return recommendations;
  };

  const getSimulatedHealthData = (region: string): PublicHealthData => {
    // Simulate real-time health data based on your scenario
    const baseConditions: HealthCondition[] = [
      {
        condition: 'Influenza',
        status: 'high',
        cases: 1247,
        trend: 'increasing',
        description: 'Flu B is currently the dominant strain with elevated hospital admissions',
        recommendations: [
          'Get flu vaccination if not already done',
          'Practice good hand hygiene',
          'Avoid crowded places if feeling unwell',
          'Consider antiviral medication if symptoms develop'
        ],
        lastUpdated: new Date(),
        source: 'Public Health Wales'
      },
      {
        condition: 'COVID-19',
        status: 'low',
        cases: 89,
        trend: 'stable',
        description: 'Remains at low levels with slight uptick in community episodes',
        recommendations: [
          'Continue basic hygiene measures',
          'Consider mask wearing in healthcare settings',
          'Stay home if symptomatic'
        ],
        lastUpdated: new Date(),
        source: 'NHS Digital'
      },
      {
        condition: 'Measles',
        status: 'low',
        cases: 3,
        trend: 'stable',
        description: 'Very low but present - three confirmed cases since January',
        recommendations: [
          'Ensure MMR vaccination is up to date',
          'Be aware of symptoms: fever, rash, cough',
          'Contact GP if concerned about exposure'
        ],
        lastUpdated: new Date(),
        source: 'UK Health Security Agency'
      },
      {
        condition: 'Pertussis (Whooping Cough)',
        status: 'moderate',
        cases: 35,
        trend: 'increasing',
        description: 'Active circulation with 35 confirmed cases in February',
        recommendations: [
          'Ensure vaccination is current',
          'Pregnant women should get Tdap vaccine',
          'Seek medical attention for persistent cough'
        ],
        lastUpdated: new Date(),
        source: 'Public Health Agency NI'
      },
      {
        condition: 'Norovirus',
        status: 'moderate',
        cases: 156,
        trend: 'stable',
        description: 'Seasonal increase typical for this time of year',
        recommendations: [
          'Wash hands frequently with soap and water',
          'Avoid preparing food if symptomatic',
          'Stay hydrated if affected'
        ],
        lastUpdated: new Date(),
        source: 'NHS England'
      }
    ];

    // Adjust based on region
    let conditions = [...baseConditions];
    let weatherHealthAlerts: string[] = [];
    let seasonalRisks: string[] = [];

    // Regional variations
    if (region.includes('Wales')) {
      conditions[0].cases += 50; // Higher flu cases in Wales
      weatherHealthAlerts.push('Cold weather alert: Increased risk of respiratory infections');
    } else if (region.includes('Scotland')) {
      conditions[0].cases += 30;
      weatherHealthAlerts.push('Temperature fluctuation warning: Dress appropriately for changing conditions');
      seasonalRisks.push('Vitamin D deficiency risk due to limited sunlight');
    } else if (region.includes('Northern Ireland')) {
      conditions[3].cases += 10; // Higher pertussis in NI
    }

    // Weather-related health risks
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 10 || currentMonth <= 2) { // Winter months
      seasonalRisks.push(
        'Seasonal Affective Disorder (SAD) risk',
        'Increased risk of slips and falls',
        'Cold and flu season peak'
      );
      weatherHealthAlerts.push('Cold weather health warning: Protect against hypothermia');
    } else if (currentMonth >= 5 && currentMonth <= 7) { // Summer months
      seasonalRisks.push(
        'Heat exhaustion risk during hot days',
        'Increased UV exposure',
        'Hay fever and allergies'
      );
      weatherHealthAlerts.push('UV warning: High sun exposure risk');
    }

    // Generate social wellbeing recommendations
    const socialWellbeingRecommendations = generateSocialWellbeingRecommendations(user?.socialEngagement);

    return {
      region,
      conditions,
      weatherHealthAlerts,
      seasonalRisks,
      socialWellbeingRecommendations,
      lastUpdated: new Date()
    };
  };

  const fetchHealthData = async () => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = getSimulatedHealthData(`${location.city}, ${location.region}`);
      setHealthData(data);
      
      // Cache the data
      localStorage.setItem('mai_health_data', JSON.stringify(data));
    } catch (err) {
      setError('Failed to fetch health data');
      
      // Try to load cached data
      const cached = localStorage.getItem('mai_health_data');
      if (cached) {
        try {
          setHealthData(JSON.parse(cached));
        } catch (e) {
          console.error('Failed to parse cached health data');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getHighRiskConditions = () => {
    if (!healthData) return [];
    return healthData.conditions.filter(c => c.status === 'high' || c.status === 'very-high');
  };

  const getIncreasingConditions = () => {
    if (!healthData) return [];
    return healthData.conditions.filter(c => c.trend === 'increasing');
  };

  useEffect(() => {
    if (location) {
      fetchHealthData();
    }
  }, [location, user]);

  // Refresh data every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (location) {
        fetchHealthData();
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [location]);

  return {
    healthData,
    loading,
    error,
    refreshData: fetchHealthData,
    getHighRiskConditions,
    getIncreasingConditions
  };
};
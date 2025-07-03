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

interface BankingRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  reason: string;
  matchScore: number; // Percentage
  provider: string;
  productType: 'current-account' | 'savings-account' | 'isa' | 'premium-account' | 'business-account';
  interestRate?: number;
  fees?: string;
  benefits: string[];
  personalizedReason: string;
  localAvailability?: string;
}

interface PersonalFinanceRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  reason: string;
  matchScore: number; // Percentage
  provider: string;
  productType: 'budgeting-tool' | 'investment-platform' | 'debt-management' | 'financial-planning' | 'pension';
  cost?: string;
  features: string[];
  personalizedReason: string;
  riskLevel?: 'low' | 'medium' | 'high';
  localAvailability?: string;
}

interface InsuranceRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  reason: string;
  matchScore: number; // Percentage
  provider: string;
  productType: 'life' | 'health' | 'home' | 'car' | 'travel' | 'income-protection' | 'critical-illness';
  coverage: string;
  premium?: string;
  benefits: string[];
  personalizedReason: string;
  localAvailability?: string;
}

interface CareerRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  reason: string;
  matchScore: number; // Percentage
  category: 'skill-development' | 'job-opportunity' | 'career-path' | 'salary-negotiation' | 'networking';
  timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  potentialImpact: string;
  steps: string[];
  personalizedReason: string;
  localAvailability?: string;
}

interface MaiMoneyRecommendations {
  banking: BankingRecommendation[];
  personalFinance: PersonalFinanceRecommendation[];
  insurance: InsuranceRecommendation[];
  career: CareerRecommendation[];
}

// Helper function to generate banking recommendations based on user profile
const generateBankingRecommendations = (
  userProfile: User['profileData'],
  location?: GeolocationData
): BankingRecommendation[] => {
  const recommendations: BankingRecommendation[] = [];
  
  if (!userProfile?.financeData) return recommendations;

  const { 
    monthlyIncome, 
    currentSavings, 
    existingBankAccounts, 
    riskTolerance, 
    financialGoals 
  } = userProfile.financeData;

  // High-yield savings account for users with savings goals
  if (financialGoals?.includes('emergency-fund') || currentSavings > 5000) {
    recommendations.push({
      id: 'banking_1',
      name: 'Marcus High-Yield Savings Account',
      description: 'Competitive interest rates with no minimum balance requirements.',
      imageUrl: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Perfect for building emergency funds with competitive rates.',
      matchScore: 92,
      provider: 'Marcus by Goldman Sachs',
      productType: 'savings-account',
      interestRate: 4.2,
      fees: 'No fees',
      benefits: ['4.2% AER', 'No minimum balance', 'Easy access', 'FSCS protected'],
      personalizedReason: `With your savings goal of ${currentSavings > 10000 ? 'building wealth' : 'emergency fund'}, this high-yield account could earn you significantly more than traditional savings accounts.`,
      localAvailability: location ? `Available online throughout ${location.region}` : 'Available online nationwide'
    });
  }

  // Premium current account for higher earners
  if (monthlyIncome && monthlyIncome > 4000) {
    recommendations.push({
      id: 'banking_2',
      name: 'HSBC Premier Current Account',
      description: 'Premium banking with global benefits and dedicated relationship manager.',
      imageUrl: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Designed for higher earners with comprehensive benefits.',
      matchScore: 88,
      provider: 'HSBC',
      productType: 'premium-account',
      fees: '£25/month (waived with £75k+ balance)',
      benefits: ['Dedicated relationship manager', 'Global ATM access', 'Travel insurance', 'Investment advice'],
      personalizedReason: `Your income level of £${monthlyIncome}/month qualifies you for premium banking benefits including travel insurance and investment guidance.`,
      localAvailability: location ? `HSBC branches available in ${location.city}` : 'Nationwide branch network'
    });
  }

  // Ethical banking for environmentally conscious users
  if (userProfile.interests?.includes('Nature & Outdoors') || userProfile.preferences?.includes('sustainability')) {
    recommendations.push({
      id: 'banking_3',
      name: 'Triodos Bank Current Account',
      description: 'Ethical banking that only finances sustainable projects.',
      imageUrl: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Aligns with your values by supporting sustainable initiatives.',
      matchScore: 85,
      provider: 'Triodos Bank',
      productType: 'current-account',
      fees: '£3/month',
      benefits: ['100% sustainable financing', 'Transparent impact reporting', 'Ethical investment options', 'Carbon-neutral operations'],
      personalizedReason: 'Based on your interest in environmental causes, this ethical bank ensures your money supports positive environmental and social impact.',
      localAvailability: 'Online banking with sustainable ATM network'
    });
  }

  // ISA recommendations for tax-efficient savings
  if (financialGoals?.includes('house-deposit') || financialGoals?.includes('investment-portfolio')) {
    recommendations.push({
      id: 'banking_4',
      name: 'Stocks & Shares ISA',
      description: 'Tax-efficient investing for long-term growth.',
      imageUrl: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Maximize tax-free growth for your long-term financial goals.',
      matchScore: 90,
      provider: 'Vanguard',
      productType: 'isa',
      fees: '0.15% annual charge',
      benefits: ['£20,000 annual allowance', 'Tax-free growth', 'Low-cost index funds', 'Flexible contributions'],
      personalizedReason: `Perfect for your ${financialGoals.includes('house-deposit') ? 'house deposit' : 'investment'} goals with tax-free growth potential.`,
      localAvailability: 'Online platform with comprehensive support'
    });
  }

  return recommendations;
};

// Helper function to generate personal finance recommendations
const generatePersonalFinanceRecommendations = (
  userProfile: User['profileData'],
  location?: GeolocationData
): PersonalFinanceRecommendation[] => {
  const recommendations: PersonalFinanceRecommendation[] = [];
  
  if (!userProfile?.financeData) return recommendations;

  const { 
    monthlyIncome, 
    debt, 
    riskTolerance, 
    financialGoals, 
    spendingCategories 
  } = userProfile.financeData;

  // Budgeting app for expense management
  if (spendingCategories && spendingCategories.includes('Entertainment')) {
    recommendations.push({
      id: 'finance_1',
      name: 'YNAB (You Need A Budget)',
      description: 'Comprehensive budgeting software that helps you take control of your money.',
      imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Perfect for tracking and optimizing your spending across multiple categories.',
      matchScore: 94,
      provider: 'YNAB',
      productType: 'budgeting-tool',
      cost: '£11.99/month',
      features: ['Real-time expense tracking', 'Goal setting', 'Debt payoff planning', 'Mobile app sync'],
      personalizedReason: `With your diverse spending categories including ${spendingCategories}, YNAB can help you optimize your budget and reach your financial goals faster.`,
      localAvailability: 'Available worldwide with UK bank integration'
    });
  }

  // Investment platform for wealth building
  if (financialGoals?.includes('investment-portfolio') && riskTolerance !== 'low') {
    recommendations.push({
      id: 'finance_2',
      name: 'Nutmeg Investment Platform',
      description: 'Automated investing with professionally managed portfolios.',
      imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Hands-off investing approach perfect for building long-term wealth.',
      matchScore: 89,
      provider: 'Nutmeg',
      productType: 'investment-platform',
      cost: '0.45% - 0.95% annual fee',
      features: ['Automated rebalancing', 'Tax-loss harvesting', 'ISA and SIPP options', 'Socially responsible investing'],
      personalizedReason: `Your ${riskTolerance} risk tolerance makes you ideal for diversified portfolio investing with professional management.`,
      riskLevel: riskTolerance as 'low' | 'medium' | 'high',
      localAvailability: location ? `UK-regulated platform serving ${location.region}` : 'UK-regulated platform'
    });
  }

  // Debt management for users with debt
  if (debt && debt > 1000) {
    recommendations.push({
      id: 'finance_3',
      name: 'StepChange Debt Advice',
      description: 'Free debt advice and management plans from the UK\'s leading debt charity.',
      imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Professional help to create a sustainable debt repayment strategy.',
      matchScore: 96,
      provider: 'StepChange',
      productType: 'debt-management',
      cost: 'Free service',
      features: ['Debt management plans', 'Budgeting advice', 'Creditor negotiation', 'Online debt tool'],
      personalizedReason: `With £${debt} in debt, StepChange can help you create a structured repayment plan and potentially reduce your monthly payments.`,
      localAvailability: location ? `Local advisors available in ${location.city}` : 'Nationwide service with local advisors'
    });
  }

  // Pension planning for retirement goals
  if (financialGoals?.includes('retirement-planning') || userProfile.age && userProfile.age > 25) {
    recommendations.push({
      id: 'finance_4',
      name: 'PensionBee SIPP',
      description: 'Simple pension management with low fees and easy transfers.',
      imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Consolidate old pensions and boost your retirement savings.',
      matchScore: 87,
      provider: 'PensionBee',
      productType: 'pension',
      cost: '0.50% - 0.95% annual fee',
      features: ['Pension consolidation', 'Investment choice', 'Retirement projections', 'Easy online management'],
      personalizedReason: `At age ${userProfile.age}, starting or optimizing your pension now could significantly impact your retirement comfort.`,
      localAvailability: 'UK-wide service with online management'
    });
  }

  return recommendations;
};

// Helper function to generate insurance recommendations
const generateInsuranceRecommendations = (
  userProfile: User['profileData'],
  location?: GeolocationData
): InsuranceRecommendation[] => {
  const recommendations: InsuranceRecommendation[] = [];
  
  if (!userProfile) return recommendations;

  const { 
    age, 
    relationshipStatus, 
    financeData 
  } = userProfile;

  const existingInsurance = financeData?.existingInsurancePolicies?.toLowerCase() || '';

  // Life insurance for those without it
  if (!existingInsurance.includes('life') && age && age > 25) {
    recommendations.push({
      id: 'insurance_1',
      name: 'Term Life Insurance',
      description: 'Affordable life cover to protect your loved ones financially.',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Essential financial protection for your family\'s future security.',
      matchScore: 91,
      provider: 'Legal & General',
      productType: 'life',
      coverage: '£250,000 - £500,000',
      premium: 'From £15/month',
      benefits: ['Level term cover', 'Terminal illness benefit', 'Online application', 'No medical required (up to limits)'],
      personalizedReason: `At age ${age}${relationshipStatus === 'married' ? ' and married' : ''}, life insurance ensures financial security for your dependents.`,
      localAvailability: location ? `Available throughout ${location.region}` : 'UK-wide coverage'
    });
  }

  // Income protection for working professionals
  if (financeData?.monthlyIncome && financeData.monthlyIncome > 2000 && !existingInsurance.includes('income')) {
    recommendations.push({
      id: 'insurance_2',
      name: 'Income Protection Insurance',
      description: 'Protects your income if you can\'t work due to illness or injury.',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Safeguard your lifestyle and financial commitments.',
      matchScore: 88,
      provider: 'Aviva',
      productType: 'income-protection',
      coverage: `Up to £${Math.floor(financeData.monthlyIncome * 0.7)}/month`,
      premium: 'From £25/month',
      benefits: ['Up to 70% income replacement', 'Rehabilitation support', 'Flexible benefit period', 'Partial benefit options'],
      personalizedReason: `With a monthly income of £${financeData.monthlyIncome}, income protection ensures you can maintain your lifestyle if unable to work.`,
      localAvailability: 'UK-wide coverage with local claim support'
    });
  }

  // Travel insurance for frequent travelers
  if (userProfile.interests?.includes('Travel') || financeData?.spendingCategories?.includes('Travel')) {
    recommendations.push({
      id: 'insurance_3',
      name: 'Annual Multi-Trip Travel Insurance',
      description: 'Comprehensive cover for unlimited trips throughout the year.',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Cost-effective protection for your travel adventures.',
      matchScore: 85,
      provider: 'Direct Line',
      productType: 'travel',
      coverage: 'Worldwide including USA',
      premium: 'From £45/year',
      benefits: ['Medical expenses up to £10m', 'Cancellation cover', 'Baggage protection', 'Winter sports included'],
      personalizedReason: 'Your interest in travel makes annual cover more economical than single-trip policies.',
      localAvailability: 'UK residents with worldwide coverage'
    });
  }

  // Critical illness cover for comprehensive protection
  if (age && age > 30 && !existingInsurance.includes('critical')) {
    recommendations.push({
      id: 'insurance_4',
      name: 'Critical Illness Cover',
      description: 'Lump sum payment if diagnosed with a serious illness.',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Financial support when you need it most for medical treatment and recovery.',
      matchScore: 82,
      provider: 'AIG',
      productType: 'critical-illness',
      coverage: '£100,000 - £300,000',
      premium: 'From £30/month',
      benefits: ['Covers 40+ conditions', 'Partial payments available', 'Children\'s cover included', 'Inflation protection'],
      personalizedReason: `At age ${age}, critical illness cover provides crucial financial support for serious health conditions.`,
      localAvailability: location ? `Claims support available in ${location.city}` : 'UK-wide claims support'
    });
  }

  return recommendations;
};

// Helper function to generate career recommendations based on CV data
const generateCareerRecommendations = (
  userProfile: User['profileData'],
  location?: GeolocationData
): CareerRecommendation[] => {
  const recommendations: CareerRecommendation[] = [];
  
  if (!userProfile?.cvData?.extractedData) return recommendations;

  const { 
    currentPosition, 
    employer, 
    yearsExperience, 
    skills, 
    education, 
    employmentHistory, 
    certifications, 
    currentSalary, 
    careerLevel 
  } = userProfile.cvData.extractedData;

  // Skill development recommendations
  if (skills && skills.length > 0) {
    // Identify skill gaps based on career level and current skills
    const skillGaps: string[] = [];
    
    if (careerLevel === 'entry' || careerLevel === 'mid') {
      // Check for common professional skills that might be missing
      const commonProfessionalSkills = ['project management', 'leadership', 'public speaking', 'negotiation'];
      
      commonProfessionalSkills.forEach(skill => {
        if (!skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
          skillGaps.push(skill);
        }
      });
    }
    
    if (careerLevel === 'mid' || careerLevel === 'senior') {
      // Check for advanced skills that might be missing
      const advancedSkills = ['strategic planning', 'team leadership', 'budget management', 'stakeholder management'];
      
      advancedSkills.forEach(skill => {
        if (!skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
          skillGaps.push(skill);
        }
      });
    }
    
    // If we identified skill gaps, recommend skill development
    if (skillGaps.length > 0) {
      recommendations.push({
        id: 'career_1',
        name: 'Professional Skills Development',
        description: `Targeted courses to develop ${skillGaps.slice(0, 2).join(' and ')} skills.`,
        imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
        reason: 'Addressing skill gaps can accelerate career progression and increase earning potential.',
        matchScore: 92,
        category: 'skill-development',
        timeframe: 'short-term',
        potentialImpact: 'Potential 10-15% salary increase with new skills',
        steps: [
          'Enroll in targeted online courses',
          'Apply new skills in current role',
          'Update CV to highlight new competencies',
          'Seek projects that showcase these skills'
        ],
        personalizedReason: `Based on your CV, developing ${skillGaps.slice(0, 2).join(' and ')} skills would complement your existing expertise in ${skills.slice(0, 2).join(' and ')} and make you more competitive for senior roles.`,
        localAvailability: location ? `Training providers available in ${location.city}` : 'Online and in-person training available'
      });
    }
  }

  // Salary negotiation for those who might be underpaid
  if (currentSalary && currentPosition && yearsExperience) {
    // Simple logic to determine if someone might be underpaid based on experience
    const isLikelyUnderpaid = (
      (yearsExperience > 5 && currentSalary < 45000) || 
      (yearsExperience > 10 && currentSalary < 65000)
    );
    
    if (isLikelyUnderpaid) {
      recommendations.push({
        id: 'career_2',
        name: 'Salary Negotiation Strategy',
        description: 'Personalized approach to negotiate a salary increase in your current role.',
        imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
        reason: 'Your experience level suggests you may be earning below market rate.',
        matchScore: 94,
        category: 'salary-negotiation',
        timeframe: 'immediate',
        potentialImpact: `Potential £${Math.round(currentSalary * 0.15).toLocaleString()}-${Math.round(currentSalary * 0.25).toLocaleString()} annual increase`,
        steps: [
          'Research current market rates for your role and experience',
          'Document your achievements and value added',
          'Prepare negotiation talking points',
          'Schedule a compensation review meeting',
          'Practice your negotiation approach'
        ],
        personalizedReason: `With ${yearsExperience} years of experience as a ${currentPosition}, our analysis suggests you could be earning 15-25% more. We can help you prepare for a successful negotiation.`,
        localAvailability: 'Online coaching and resources available'
      });
    }
  }

  // Career advancement opportunities
  if (currentPosition && careerLevel && yearsExperience) {
    // Suggest next career steps based on current position and experience
    let nextCareerStep = '';
    let potentialSalaryIncrease = '';
    
    if (careerLevel === 'entry' && yearsExperience >= 2) {
      nextCareerStep = currentPosition.includes('Junior') 
        ? currentPosition.replace('Junior', 'Mid-level') 
        : `Senior ${currentPosition}`;
      potentialSalaryIncrease = '20-30%';
    } else if (careerLevel === 'mid' && yearsExperience >= 5) {
      nextCareerStep = currentPosition.includes('Senior') 
        ? `Lead ${currentPosition.replace('Senior', '')}` 
        : `Senior ${currentPosition}`;
      potentialSalaryIncrease = '15-25%';
    } else if (careerLevel === 'senior' && yearsExperience >= 8) {
      nextCareerStep = `${currentPosition.includes('Manager') ? 'Director' : 'Manager'} of ${currentPosition.split(' ').pop()}`;
      potentialSalaryIncrease = '25-40%';
    }
    
    if (nextCareerStep) {
      recommendations.push({
        id: 'career_3',
        name: 'Career Advancement Plan',
        description: `Strategic roadmap to progress from ${currentPosition} to ${nextCareerStep}.`,
        imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
        reason: 'Your experience qualifies you for the next level in your career path.',
        matchScore: 90,
        category: 'career-path',
        timeframe: 'medium-term',
        potentialImpact: `Potential ${potentialSalaryIncrease} salary increase with promotion`,
        steps: [
          'Identify specific requirements for target role',
          'Develop missing skills through targeted training',
          'Take on projects that demonstrate readiness for promotion',
          'Build relationships with decision-makers',
          'Update CV and LinkedIn to highlight relevant achievements'
        ],
        personalizedReason: `With your ${yearsExperience} years of experience as a ${currentPosition}, you're well-positioned to advance to a ${nextCareerStep} role, which typically offers a ${potentialSalaryIncrease} salary increase.`,
        localAvailability: location ? `Career coaching available in ${location.city}` : 'Career coaching available online and in-person'
      });
    }
  }

  // Networking opportunities
  if (currentPosition && location) {
    recommendations.push({
      id: 'career_4',
      name: 'Strategic Networking Opportunities',
      description: 'Curated professional networking events and groups relevant to your career.',
      imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Expanding your professional network can lead to new opportunities and insights.',
      matchScore: 85,
      category: 'networking',
      timeframe: 'ongoing',
      potentialImpact: '70% of jobs are found through networking',
      steps: [
        'Join industry-specific professional groups',
        'Attend monthly networking events',
        'Connect with peers on LinkedIn',
        'Participate in relevant online forums and discussions',
        'Consider mentorship opportunities'
      ],
      personalizedReason: `As a ${currentPosition}, strategic networking can open doors to unadvertised opportunities, industry insights, and potential mentors who can accelerate your career growth.`,
      localAvailability: `Professional networking groups in ${location.city} include local chambers of commerce and industry-specific meetups`
    });
  }

  return recommendations;
};

const defaultRecommendations: MaiMoneyRecommendations = {
  banking: [
    {
      id: 'default_banking_1',
      name: 'High-Interest Savings Account',
      description: 'Competitive rates for your emergency fund and savings goals.',
      imageUrl: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Build your savings with better interest rates than traditional accounts.',
      matchScore: 80,
      provider: 'Marcus by Goldman Sachs',
      productType: 'savings-account',
      interestRate: 4.2,
      fees: 'No fees',
      benefits: ['Competitive rates', 'No minimum balance', 'Easy access', 'FSCS protected'],
      personalizedReason: 'A solid foundation for any savings strategy with competitive returns.'
    }
  ],
  personalFinance: [
    {
      id: 'default_finance_1',
      name: 'Budgeting App',
      description: 'Take control of your spending with smart budgeting tools.',
      imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Essential tool for financial awareness and goal achievement.',
      matchScore: 85,
      provider: 'YNAB',
      productType: 'budgeting-tool',
      cost: '£11.99/month',
      features: ['Expense tracking', 'Goal setting', 'Debt planning', 'Mobile sync'],
      personalizedReason: 'Start your financial journey with better spending awareness and control.'
    }
  ],
  insurance: [
    {
      id: 'default_insurance_1',
      name: 'Life Insurance',
      description: 'Protect your loved ones with affordable life cover.',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Essential financial protection for peace of mind.',
      matchScore: 75,
      provider: 'Legal & General',
      productType: 'life',
      coverage: '£250,000',
      premium: 'From £15/month',
      benefits: ['Level term cover', 'Terminal illness benefit', 'Online application', 'Quick setup'],
      personalizedReason: 'Basic financial protection that everyone should consider.'
    }
  ],
  career: [
    {
      id: 'default_career_1',
      name: 'CV Review & Optimization',
      description: 'Professional analysis and improvement of your CV to maximize job opportunities.',
      imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'A well-crafted CV significantly increases interview chances.',
      matchScore: 85,
      category: 'skill-development',
      timeframe: 'immediate',
      potentialImpact: 'Up to 40% higher response rate from employers',
      steps: [
        'Upload your current CV',
        'Receive professional analysis',
        'Implement recommended improvements',
        'Test with application tracking systems'
      ],
      personalizedReason: 'Everyone can benefit from expert CV optimization to stand out in competitive job markets.'
    }
  ]
};

export const useMaiMoneyRecommendations = (
  userProfile: User['profileData'] | undefined,
  location?: GeolocationData | null,
  currentSeason?: string
) => {
  const [recommendations, setRecommendations] = useState<MaiMoneyRecommendations>(defaultRecommendations);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile && userProfile.financeData) {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const newRecommendations: MaiMoneyRecommendations = {
          banking: generateBankingRecommendations(userProfile, location || undefined),
          personalFinance: generatePersonalFinanceRecommendations(userProfile, location || undefined),
          insurance: generateInsuranceRecommendations(userProfile, location || undefined),
          career: generateCareerRecommendations(userProfile, location || undefined)
        };

        // Add location-specific information to all recommendations
        if (location) {
          const addLocationInfo = (items: any[]) => {
            return items.map(item => ({
              ...item,
              localAvailability: item.localAvailability || `Available in ${location.city} and throughout ${location.region}`
            }));
          };

          newRecommendations.banking = addLocationInfo(newRecommendations.banking);
          newRecommendations.personalFinance = addLocationInfo(newRecommendations.personalFinance);
          newRecommendations.insurance = addLocationInfo(newRecommendations.insurance);
          newRecommendations.career = addLocationInfo(newRecommendations.career);
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
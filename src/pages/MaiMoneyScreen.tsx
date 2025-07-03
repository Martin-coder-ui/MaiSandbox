import React from "react";
import VoiceAgent from "../components/VoiceAgent";
import SeasonalNotifications from "../components/SeasonalNotifications";
import { CreditCard, PiggyBank, Shield, TrendingUp, DollarSign, FileText, Calculator, Target, Building, Briefcase, Users, FileUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useMaiMoneyRecommendations } from "../hooks/useMaiMoneyRecommendations";
import { useGeolocation } from "../hooks/useGeolocation";
import { useSeasonalRecommendations } from "../hooks/useSeasonalRecommendations";

export default function MaiMoneyScreen() {
  const { user } = useAuth();
  const { location } = useGeolocation();
  const { getCurrentSeason } = useSeasonalRecommendations();
  const currentSeason = getCurrentSeason();
  
  const { recommendations: moneyRecommendations, loading } = useMaiMoneyRecommendations(
    user?.profileData,
    location,
    currentSeason
  );

  const renderRecommendationCard = (item: any, colorClass: string) => (
    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200">
      <img 
        src={item.imageUrl} 
        alt={item.name} 
        className="w-full h-32 object-cover rounded-lg mb-3"
        loading="lazy"
      />
      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{item.name}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.description}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{item.reason}</p>
      
      {/* Provider information */}
      {item.provider && (
        <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
          Provider: {item.provider}
        </p>
      )}
      
      {/* Location-specific availability */}
      {item.localAvailability && (
        <p className="text-xs text-green-600 dark:text-green-400 mb-2">
          📍 {item.localAvailability}
        </p>
      )}
      
      {/* Product-specific details */}
      {item.interestRate && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Interest Rate: {item.interestRate}% AER
        </p>
      )}
      {item.fees && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Fees: {item.fees}
        </p>
      )}
      {item.cost && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Cost: {item.cost}
        </p>
      )}
      {item.premium && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Premium: {item.premium}
        </p>
      )}
      {item.coverage && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Coverage: {item.coverage}
        </p>
      )}
      {item.riskLevel && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Risk Level: {item.riskLevel}
        </p>
      )}
      {item.timeframe && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Timeframe: {item.timeframe} • Impact: {item.potentialImpact}
        </p>
      )}
      
      {/* Benefits/Features */}
      {(item.benefits || item.features || item.steps) && (
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            {item.benefits ? 'Benefits:' : item.features ? 'Features:' : 'Steps:'}
          </p>
          <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside">
            {(item.benefits || item.features || item.steps).slice(0, 3).map((benefit: string, index: number) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Personalized reason */}
      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>Why this suits you:</strong> {item.personalizedReason}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs px-2 py-1 rounded ${colorClass}`}>
          {item.matchScore}% Match
        </span>
        <button className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
          Learn More
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Generating your personalized financial recommendations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Your MaiMoney Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your banking, personal finance, and insurance with AI-powered insights and voice assistance.
        </p>
        
        {/* Context Information */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.profileData?.financeData && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Risk Profile:</strong> {user.profileData.financeData.riskTolerance || 'Not specified'} • 
                Income: £{user.profileData.financeData.monthlyIncome || 'Not specified'}/month
              </p>
            </div>
          )}
          
          {location && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Location:</strong> {location.city}, {location.region}
              </p>
            </div>
          )}
          
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-purple-800 dark:text-purple-200">
              <strong>Goals:</strong> {user?.profileData?.financeData?.financialGoals?.slice(0, 2).join(', ') || 'Building wealth'}
            </p>
          </div>
        </div>

        {/* CV Status */}
        {user?.profileData?.cvData && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start">
              <FileUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  CV Analysis Complete
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  We've analyzed your CV and identified career advancement opportunities. Check the Career Recommendations section below.
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Uploaded: {new Date(user.profileData.cvData.uploadDate || '').toLocaleDateString()} • 
                  File: {user.profileData.cvData.fileName}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Voice Agent - Featured prominently */}
        <div className="lg:col-span-1">
          <VoiceAgent />
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Balance</h3>
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              £{user?.profileData?.financeData?.currentSavings?.toLocaleString() || '12,450'}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">+5.2% this month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Spending</h3>
              <CreditCard className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              £{user?.profileData?.financeData?.monthlyExpenses?.toLocaleString() || '2,340'}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Within budget</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommendations</h3>
              <Target className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {moneyRecommendations.banking.length + 
               moneyRecommendations.personalFinance.length + 
               moneyRecommendations.insurance.length + 
               moneyRecommendations.career.length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Personalized for you</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Investment Growth</h3>
              <TrendingUp className="w-6 h-6 text-teal-500" />
            </div>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">+12.5%</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">This year</p>
          </div>
        </div>
      </div>

      {/* Seasonal Notifications */}
      <div className="mb-8">
        <SeasonalNotifications />
      </div>

      {/* Career Recommendations - Show only if CV data exists */}
      {moneyRecommendations.career.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Career Recommendations</h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {moneyRecommendations.career.length} opportunities
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moneyRecommendations.career.map((item) => 
              renderRecommendationCard(item, 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200')
            )}
          </div>
        </div>
      )}

      {/* Dynamic Financial Recommendations */}
      <div className="space-y-8">
        {/* Banking Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Building className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Banking Recommendations</h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {moneyRecommendations.banking.length} suggestions
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moneyRecommendations.banking.map((item) => 
              renderRecommendationCard(item, 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200')
            )}
          </div>
        </div>

        {/* Personal Finance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Calculator className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Finance</h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {moneyRecommendations.personalFinance.length} suggestions
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moneyRecommendations.personalFinance.map((item) => 
              renderRecommendationCard(item, 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200')
            )}
          </div>
        </div>

        {/* Insurance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Insurance</h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {moneyRecommendations.insurance.length} suggestions
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moneyRecommendations.insurance.map((item) => 
              renderRecommendationCard(item, 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200')
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-8">
        {/* Banking Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Banking & Accounts</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Current Account</h4>
                <span className="text-lg font-bold text-gray-900 dark:text-white">£3,240</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Barclays Bank • ****1234</p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Savings Account</h4>
                <span className="text-lg font-bold text-gray-900 dark:text-white">£9,210</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">HSBC • ****5678 • 2.1% APR</p>
            </div>
            
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              View All Accounts
            </button>
          </div>
        </div>

        {/* Personal Finance Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <Calculator className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Finance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Monthly Budget</h4>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">£2,340 of £3,120 spent</p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Top Categories</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Groceries</span>
                  <span className="font-medium text-gray-900 dark:text-white">£450</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Transport</span>
                  <span className="font-medium text-gray-900 dark:text-white">£320</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Entertainment</span>
                  <span className="font-medium text-gray-900 dark:text-white">£180</span>
                </div>
              </div>
            </div>
            
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
              View Budget Details
            </button>
          </div>
        </div>
      </div>

      {/* Insurance Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Insurance Coverage</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Health Insurance</h4>
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Bupa Health Plus</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Renewal: March 2025</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">£89/month</p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Home Insurance</h4>
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Direct Line Home</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Renewal: July 2025</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">£45/month</p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Life Insurance</h4>
              <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                Review Due
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Aviva Life Cover</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Coverage: £250,000</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">£32/month</p>
          </div>
        </div>
      </div>

      {/* AI Financial Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Financial Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Savings Opportunity</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              {user?.profileData?.financeData?.riskTolerance === 'high' 
                ? 'Your high risk tolerance suggests you could benefit from growth-focused investments.'
                : 'You could save £120/month by switching to a high-yield savings account with 4.2% APR.'
              }
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
              Explore Options
            </button>
          </div>
          
          <div className="p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Budget Optimization</h4>
            <p className="text-sm text-green-800 dark:text-green-200 mb-3">
              {user?.profileData?.financeData?.spendingCategories?.includes('Entertainment')
                ? 'Consider reducing entertainment spending by 15% to reach your savings goal 2 months earlier.'
                : 'Your spending patterns show good financial discipline. Consider increasing your savings rate.'
              }
            </p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
              View Plan
            </button>
          </div>
        </div>
      </div>

      {/* Career Insights - Only show if CV data exists */}
      {user?.profileData?.cvData && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Career Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">Salary Potential</h4>
              <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-3">
                {user.profileData.cvData.extractedData?.currentPosition && 
                 user.profileData.cvData.extractedData?.yearsExperience && 
                 user.profileData.cvData.extractedData?.currentSalary
                  ? `Based on your ${user.profileData.cvData.extractedData.yearsExperience} years of experience as a ${user.profileData.cvData.extractedData.currentPosition}, our analysis suggests you could potentially earn up to £${Math.round(user.profileData.cvData.extractedData.currentSalary * 1.2).toLocaleString()} with the right negotiation strategy.`
                  : 'Upload your CV to get personalized salary insights based on your experience and skills.'
                }
              </p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm">
                Salary Insights
              </button>
            </div>
            
            <div className="p-4 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Skill Development</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
                {user.profileData.cvData.extractedData?.skills
                  ? `Enhancing your ${user.profileData.cvData.extractedData.skills.slice(0, 2).join(' and ')} skills could increase your market value by 15-20%. Consider targeted professional development in these areas.`
                  : 'Complete your profile to receive personalized skill development recommendations.'
                }
              </p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm">
                Skill Recommendations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
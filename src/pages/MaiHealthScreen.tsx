import React from "react";
import VoiceAgent from "../components/VoiceAgent";
import SeasonalNotifications from "../components/SeasonalNotifications";
import { Calendar, Activity, Heart, Users, Stethoscope, Shield, TrendingUp, Brain, Apple, ChevronRight, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { useMaiHealthRecommendations } from "../hooks/useMaiHealthRecommendations";
import { useGeolocation } from "../hooks/useGeolocation";
import { useSeasonalRecommendations } from "../hooks/useSeasonalRecommendations";

export default function MaiHealthScreen() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const isProvider = profile?.user_type === 'provider';
  const { location } = useGeolocation();
  const { getCurrentSeason } = useSeasonalRecommendations();
  const currentSeason = getCurrentSeason();
  
  const { recommendations: healthRecommendations, loading } = useMaiHealthRecommendations(
    user?.profileData,
    location,
    currentSeason
  );

  const renderRecommendationCard = (item: any, colorClass: string) => (
    <div key={item.id} className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300 group">
      <img 
        src={item.imageUrl} 
        alt={item.name}
        className="w-full h-36 object-cover rounded-lg mb-4 shadow-sm group-hover:shadow group-hover:scale-[1.02] transition-all duration-300"
        loading="lazy"
      />
      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">{item.name}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{item.description}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{item.reason}</p>
      
      {/* Provider information */}
      {item.provider && (
        <p className="text-xs text-primary-600 dark:text-primary-400 mb-2 font-medium flex items-center">
          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {item.provider}
        </p>
      )}
      
      {/* Location-specific availability */}
      {item.localAvailability && (
        <p className="text-xs text-secondary-600 dark:text-secondary-400 mb-2 font-medium flex items-center">
          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          📍 {item.localAvailability}
        </p>
      )}
      
      {/* Category-specific details */}
      {item.urgency && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Urgency: {item.urgency} • Frequency: {item.frequency}
        </p>
      )}
      {item.difficulty && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Difficulty: {item.difficulty} • Time: {item.timeCommitment}
        </p>
      )}
      {item.condition && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          For: {item.condition}
        </p>
      )}
      {item.approach && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Approach: {item.approach}
        </p>
      )}
      {item.season && (
        <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">
          🌟 {item.season.charAt(0).toUpperCase() + item.season.slice(1)} recommendation
        </p>
      )}
      
      {/* Benefits/Evidence */}
      {(item.benefits || item.evidenceBased) && (
        <div className="mb-2">
          {item.benefits && (
            <>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Benefits:</p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside">
                {item.benefits.slice(0, 3).map((benefit: string, index: number) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </>
          )}
          {item.evidenceBased && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Evidence-based treatment</p>
          )}
        </div>
      )}
      
      {/* Personalized reason */}
      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
        <p className="text-xs text-primary-800 dark:text-primary-200 leading-relaxed">
          <strong className="font-semibold">Why this suits you:</strong> {item.personalizedReason}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <span className={`text-xs px-2 py-1 rounded ${colorClass}`}>
          {item.matchScore}% Match
        </span>
        <button className="text-xs px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow flex items-center">
          Learn More
          <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:ml-2 transition-all duration-200" />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 dark:border-t-primary-500 mb-4"></div>
          <span className="text-gray-600 dark:text-gray-300 text-lg">Generating your personalized health recommendations...</span>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">This may take a moment as we analyze your profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-4 text-gray-900 dark:text-white">
          Your MaiHealth Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Welcome back! Explore your personalized health journey with AI-powered insights and voice assistance.
        </p>
        
        {/* Context Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.profileData?.healthData && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 shadow-sm">
              <p className="text-sm text-red-800 dark:text-red-200 flex items-center">
                <Heart className="w-4 h-4 mr-1.5 text-red-500" />
                <strong className="font-semibold">Health Profile:</strong> {user.profileData.age} years • 
                {user.profileData.healthData.medicalConditions?.length ? 
                  ` ${user.profileData.healthData.medicalConditions.length} conditions` : 
                  ' No major conditions'
                }
              </p>
            </div>
          )}
          
          {location && (
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 shadow-sm">
              <p className="text-sm text-primary-800 dark:text-primary-200 flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <strong className="font-semibold">Location:</strong> {location.city}, {location.region}
              </p>
            </div>
          )}
          
          <div className="p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg border border-secondary-200 dark:border-secondary-800 shadow-sm">
            <p className="text-sm text-secondary-800 dark:text-secondary-200 flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 text-secondary-500" />
              <strong className="font-semibold">Recommendations:</strong> {
                healthRecommendations.preventiveCare.length + 
                healthRecommendations.lifestyle.length + 
                healthRecommendations.conditionManagement.length + 
                healthRecommendations.mentalWellbeing.length + 
                healthRecommendations.seasonalHealth.length
              } personalized
            </p>
          </div>
        </div>

        {/* Health Risk Factors */}
        {user?.profileData?.healthData?.familyMedicalHistory && user.profileData.healthData.familyMedicalHistory.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-sm">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <strong className="font-semibold">Family History Risk Factors:</strong> {user.profileData.healthData.familyMedicalHistory.slice(0, 3).join(', ')}
              {user.profileData.healthData.familyMedicalHistory.length > 3 && ` and ${user.profileData.healthData.familyMedicalHistory.length - 3} more`}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Voice Agent - Featured prominently with enhanced styling */}
        <div className="lg:col-span-1 transform hover:scale-[1.02] transition-all duration-300">
          <VoiceAgent />
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Heart className="w-5 h-5 text-red-500 mr-2" />
                Health Score
              </h3>
              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
                Excellent
              </span>
            </div>
            <div className="flex items-center">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-gray-200 dark:text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                  <circle className="text-green-500 dark:text-green-400 progress-ring" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="37.68" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isProvider ? '94%' : '85%'}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  {isProvider ? 'Patient satisfaction rate' : 'Great progress this week!'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isProvider ? 'Above industry average' : '+5% from last month'}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="w-5 h-5 text-primary-500 mr-2" />
                {isProvider ? 'AI Insights' : 'Recommendations'}
              </h3>
              <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full">
                {isProvider ? 'Clinical' : 'Personalized'}
              </span>
            </div>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {isProvider ? '15' : (healthRecommendations.preventiveCare.length + 
                                   healthRecommendations.lifestyle.length + 
                                   healthRecommendations.conditionManagement.length + 
                                   healthRecommendations.mentalWellbeing.length + 
                                   healthRecommendations.seasonalHealth.length)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isProvider ? 'Pending review' : 'Personalized for you'}
            </p>
          </div>

          <div className="card p-6 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Calendar className="w-5 h-5 text-purple-500 mr-2" />
                Appointments
              </h3>
              <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full">
                Upcoming
              </span>
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {isProvider ? '24' : '3'}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <p>{isProvider ? 'This week' : 'Upcoming this month'}</p>
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                View all
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>

          <div className="card p-6 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Users className="w-5 h-5 text-teal-500 mr-2" />
                {isProvider ? 'Patient Load' : 'Care Team'}
              </h3>
              <span className="text-xs px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded-full">
                Active
              </span>
            </div>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              {isProvider ? '127' : '5'}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <p>{isProvider ? 'Active patients' : 'Active providers'}</p>
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                {isProvider ? 'Manage patients' : 'View team'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Notifications */}
      <div className="mb-8">
        <SeasonalNotifications />
      </div>

      {/* Dynamic Health Recommendations */}
      <div className="space-y-8">
        {/* Preventive Care */}
        {healthRecommendations.preventiveCare.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white">Preventive Care</h3>
              </div>
              <span className="text-sm font-medium px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 rounded-full">
                {healthRecommendations.preventiveCare.length} recommendations
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthRecommendations.preventiveCare.map((item) => 
                renderRecommendationCard(item, 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200')
              )}
            </div>
          </div>
        )}

        {/* Lifestyle Recommendations */}
        {healthRecommendations.lifestyle.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center mr-3">
                  <Activity className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white">Lifestyle Improvements</h3>
              </div>
              <span className="text-sm font-medium px-3 py-1 bg-secondary-100 dark:bg-secondary-900/20 text-secondary-800 dark:text-secondary-200 rounded-full">
                {healthRecommendations.lifestyle.length} suggestions
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthRecommendations.lifestyle.map((item) => 
                renderRecommendationCard(item, 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200')
              )}
            </div>
          </div>
        )}

        {/* Condition Management */}
        {healthRecommendations.conditionManagement.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-3">
                  <Stethoscope className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white">Condition Management</h3>
              </div>
              <span className="text-sm font-medium px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-full">
                {healthRecommendations.conditionManagement.length} programs
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthRecommendations.conditionManagement.map((item) => 
                renderRecommendationCard(item, 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200')
              )}
            </div>
          </div>
        )}

        {/* Mental Wellbeing */}
        {healthRecommendations.mentalWellbeing.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                  <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white">Mental Wellbeing</h3>
              </div>
              <span className="text-sm font-medium px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 rounded-full">
                {healthRecommendations.mentalWellbeing.length} resources
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthRecommendations.mentalWellbeing.map((item) => 
                renderRecommendationCard(item, 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200')
              )}
            </div>
          </div>
        )}

        {/* Seasonal Health */}
        {healthRecommendations.seasonalHealth.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center mr-3">
                  <Apple className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white">
                  {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Health
                </h3>
              </div>
              <span className="text-sm font-medium px-3 py-1 bg-accent-100 dark:bg-accent-900/20 text-accent-800 dark:text-accent-200 rounded-full">
                {healthRecommendations.seasonalHealth.length} seasonal tips
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthRecommendations.seasonalHealth.map((item) => 
                renderRecommendationCard(item, 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200')
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white flex items-center">
            <Activity className="w-5 h-5 text-primary-500 mr-2" />
            Recent Activity
          </h3>
          <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center">
            View all
            <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer">
            <div>
              <p className="font-medium text-gray-900 dark:text-white flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Consultation with Dr. Smith
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Reviewed your latest health metrics</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer">
            <div>
              <p className="font-medium text-gray-900 dark:text-white flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Physiotherapy Session
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Completed lower back exercises</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">1 day ago</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer">
            <div>
              <p className="font-medium text-gray-900 dark:text-white flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Nutrition Plan Updated
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">New meal recommendations available</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">3 days ago</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm flex items-center justify-center">
            Load more activities
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
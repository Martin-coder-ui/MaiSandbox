import React from "react";
import VoiceAgent from "../components/VoiceAgent";
import SeasonalNotifications from "../components/SeasonalNotifications";
import { Palette, Scissors, Sparkles, Camera, ShoppingBag, Star, TrendingUp, Heart, Gem, Paintbrush } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useMaiStyleRecommendations } from "../hooks/useMaiStyleRecommendations";
import { useGeolocation } from "../hooks/useGeolocation";
import { useSeasonalRecommendations } from "../hooks/useSeasonalRecommendations";

export default function MaiStyleScreen() {
  const { user } = useAuth();
  const { location } = useGeolocation();
  const { getCurrentSeason } = useSeasonalRecommendations();
  const currentSeason = getCurrentSeason();
  
  const { recommendations: styleRecommendations, loading } = useMaiStyleRecommendations(
    user?.profileData,
    location,
    currentSeason,
    user?.profileData?.preferredSuppliers || []
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
      
      {/* Supplier information */}
      {item.supplier && (
        <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
          Available at: {item.supplier}
        </p>
      )}
      
      {/* Location-specific availability */}
      {item.localAvailability && (
        <p className="text-xs text-green-600 dark:text-green-400 mb-2">
          📍 {item.localAvailability}
        </p>
      )}
      
      {/* Seasonal relevance */}
      {item.seasonalNote && (
        <p className="text-xs text-orange-600 dark:text-orange-400 mb-2">
          🌟 {item.seasonalNote}
        </p>
      )}
      
      {/* Additional details based on type */}
      {item.difficulty && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Difficulty: {item.difficulty} • Time: {item.timeRequired}
        </p>
      )}
      {item.occasion && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Best for: {item.occasion}
        </p>
      )}
      {item.metal && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Metal: {item.metal} • Type: {item.type}
        </p>
      )}
      {item.length && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Length: {item.length} • Finish: {item.finish} • Maintenance: {item.maintenance}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs px-2 py-1 rounded ${colorClass}`}>
          {item.styleMatch || item.matchScore}% Match
        </span>
        <button className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
          Try This
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Generating your personalized style recommendations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Your MaiStyle Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover your perfect style with AI-powered recommendations for clothes, hair, makeup, jewelry, and nails.
        </p>
        
        {/* Context Information */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.profileData?.styleData && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Your Style:</strong> {user.profileData.styleData.stylePreference} • 
                {user.profileData.styleData.colorPalette} palette
              </p>
            </div>
          )}
          
          {location && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Location:</strong> {location.city}, {location.region}
              </p>
            </div>
          )}
          
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              <strong>Season:</strong> {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} recommendations
            </p>
          </div>
        </div>

        {user?.profileData?.preferredSuppliers && user.profileData.preferredSuppliers.length > 0 && (
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-purple-800 dark:text-purple-200">
              <strong>Preferred Suppliers:</strong> {user.profileData.preferredSuppliers.slice(0, 5).join(', ')}
              {user.profileData.preferredSuppliers.length > 5 && ` and ${user.profileData.preferredSuppliers.length - 5} more`}
            </p>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Style Score</h3>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">92%</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Excellent style match</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommendations</h3>
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {styleRecommendations.clothing.length + styleRecommendations.hair.length + 
               styleRecommendations.makeup.length + styleRecommendations.jewelry.length + 
               styleRecommendations.nails.length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Personalized for you</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wardrobe Items</h3>
              <ShoppingBag className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">127</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Catalogued pieces</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trend Match</h3>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">88%</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Current trends</p>
          </div>
        </div>
      </div>

      {/* Seasonal Notifications */}
      <div className="mb-8">
        <SeasonalNotifications />
      </div>

      {/* Dynamic Style Recommendations */}
      <div className="space-y-8">
        {/* Clothing Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Clothing Recommendations</h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {styleRecommendations.clothing.length} suggestions
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {styleRecommendations.clothing.map((item) => 
              renderRecommendationCard(item, 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200')
            )}
          </div>
        </div>

        {/* Hair Styling */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Scissors className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hair Styling</h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {styleRecommendations.hair.length} suggestions
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {styleRecommendations.hair.map((item) => 
              renderRecommendationCard(item, 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200')
            )}
          </div>
        </div>

        {/* Makeup */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Palette className="w-6 h-6 text-pink-600 dark:text-pink-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Makeup</h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {styleRecommendations.makeup.length} suggestions
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {styleRecommendations.makeup.map((item) => 
              renderRecommendationCard(item, 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200')
            )}
          </div>
        </div>

        {/* Jewelry */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Gem className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Jewelry</h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {styleRecommendations.jewelry.length} suggestions
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {styleRecommendations.jewelry.map((item) => 
              renderRecommendationCard(item, 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200')
            )}
          </div>
        </div>

        {/* Nails */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Paintbrush className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nails</h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {styleRecommendations.nails.length} suggestions
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {styleRecommendations.nails.map((item) => 
              renderRecommendationCard(item, 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200')
            )}
          </div>
        </div>
      </div>

      {/* AI Style Insights */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <Heart className="w-6 h-6 text-red-600 dark:text-red-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Style Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Style Evolution</h4>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
              Your style preferences show a strong lean towards {user?.profileData?.styleData?.stylePreference || 'classic'} aesthetics. 
              Consider experimenting with complementary styles to expand your fashion horizons.
            </p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm">
              Explore New Styles
            </button>
          </div>
          
          <div className="p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
              {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Update
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200 mb-3">
              {currentSeason === 'spring' && "Spring is here! Time to incorporate lighter fabrics and fresh colors."}
              {currentSeason === 'summer' && "Summer vibes! Focus on breathable fabrics and sun protection."}
              {currentSeason === 'autumn' && "Autumn calls for layering and rich, warm tones."}
              {currentSeason === 'winter' && "Winter essentials: cozy layers and statement accessories."}
              {location && ` Perfect for ${location.city}'s climate.`}
            </p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
              View {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
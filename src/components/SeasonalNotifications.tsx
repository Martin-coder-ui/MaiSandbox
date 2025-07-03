import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSeasonalRecommendations } from '../hooks/useSeasonalRecommendations';
import { useGeolocation } from '../hooks/useGeolocation';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bell, 
  X, 
  ShoppingCart, 
  Star, 
  MapPin, 
  Thermometer, 
  Sun, 
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Activity,
  Cloud,
  Droplets,
  Wind,
  Shield,
  TrendingUp,
  Calendar,
  Users,
  MessageSquare,
  Snowflake,
  HeartPulse,
  Pill
} from 'lucide-react';

const SeasonalNotifications: React.FC = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { location, loading: locationLoading, requestLocation } = useGeolocation();
  const { notifications, dismissNotification, purchaseProduct, loading, healthData, weatherData } = useSeasonalRecommendations();
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null);
  const [purchasingProduct, setPurchasingProduct] = useState<string | null>(null);

  if (!user) return null;

  // Filter notifications based on current page context
  const getFilteredNotifications = () => {
    let allowedTypes: string[] = [];
    
    if (pathname.includes('/maihealth')) {
      allowedTypes = ['health', 'preventive-care', 'social-wellbeing', 'weather', 'weather-extreme'];
    } else if (pathname.includes('/maihome')) {
      allowedTypes = ['weather', 'weather-extreme'];
    } else if (pathname.includes('/maistyle')) {
      allowedTypes = ['clothing', 'weather', 'weather-extreme'];
    } else {
      // For all other pages (welcome, dashboard, etc.)
      allowedTypes = ['weather', 'weather-extreme', 'preventive-care'];
    }

    // Filter by allowed types and limit to maximum 3 notifications
    return notifications
      .filter(notification => allowedTypes.includes(notification.type))
      .slice(0, 3);
  };

  const filteredNotifications = getFilteredNotifications();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      default: return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
    }
  };

  const getPriorityIcon = (type: string, priority: string) => {
    if (type === 'health') return <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />;
    if (type === 'weather' || type === 'clothing') return <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    if (type === 'emergency' || type === 'weather-extreme') return <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />;
    if (type === 'social-wellbeing') return <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    if (type === 'preventive-care') return <HeartPulse className="w-5 h-5 text-green-600 dark:text-green-400" />;
    
    switch (priority) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'medium': return <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      default: return <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const handlePurchase = async (productId: string, notificationId: string) => {
    setPurchasingProduct(productId);
    const result = await purchaseProduct(productId, notificationId);
    
    if (result.success) {
      alert(`Purchase successful! Order ID: ${result.orderId}\nDelivery to your saved address.`);
    } else {
      alert('Purchase failed. Please try again.');
    }
    
    setPurchasingProduct(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (filteredNotifications.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Smart Health & Weather Alerts
          </h3>
          {!location && (
            <button
              onClick={requestLocation}
              disabled={locationLoading}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {locationLoading ? 'Getting Location...' : 'Enable Location'}
            </button>
          )}
        </div>
        
        {location ? (
          <div className="text-center py-8">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              No urgent alerts at the moment.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              We're monitoring health conditions and weather in {location.city} for you.
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Enable location access to receive personalized health and weather alerts.
            </p>
            <button
              onClick={requestLocation}
              disabled={locationLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {locationLoading ? 'Getting Location...' : 'Enable Location Services'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Location & Health Status */}
      {location && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {location.city}, {location.region}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Real-time health & weather monitoring
                </p>
              </div>
            </div>
            {location.weather && (
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Thermometer className="w-4 h-4" />
                  <span>{location.weather.temperature}°C</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sun className="w-4 h-4" />
                  <span>UV {location.weather.uvIndex}</span>
                </div>
              </div>
            )}
          </div>

          {/* Health Conditions Summary - only show on MaiHealth pages */}
          {pathname.includes('/maihealth') && healthData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              {healthData.conditions.slice(0, 3).map((condition) => (
                <div key={condition.condition} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{condition.condition}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{condition.cases} cases</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`w-3 h-3 ${
                      condition.trend === 'increasing' ? 'text-red-500' : 
                      condition.trend === 'decreasing' ? 'text-green-500' : 'text-gray-500'
                    }`} />
                    <span className={`px-1 py-0.5 text-xs rounded ${
                      condition.status === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      condition.status === 'moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {condition.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Weather Forecast Summary - show on all pages except MaiHome */}
          {!pathname.includes('/maihome') && weatherData && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cloud className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">7-Day Forecast</span>
                </div>
                <div className="flex space-x-3 text-xs text-blue-800 dark:text-blue-200">
                  {weatherData.forecast.slice(0, 4).map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="font-medium">{index === 0 ? 'Today' : formatDate(day.date)}</div>
                      <div>{Math.round(day.temperature.feelsLike)}°C</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notifications - Limited to 3 and filtered by page context */}
      {filteredNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-xl shadow-lg border p-6 ${getPriorityColor(notification.priority)}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              {getPriorityIcon(notification.type, notification.priority)}
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {notification.title}
                  </h3>
                  {notification.type === 'health' && (
                    <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
                      Health Alert
                    </span>
                  )}
                  {notification.type === 'social-wellbeing' && (
                    <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                      Social Wellbeing
                    </span>
                  )}
                  {notification.type === 'preventive-care' && (
                    <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                      Preventive Care
                    </span>
                  )}
                  {notification.type === 'weather-extreme' && (
                    <span className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full">
                      Extreme Weather
                    </span>
                  )}
                  {notification.weatherAlert && (
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      Weather Alert
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {notification.message}
                </p>
                {notification.actionRequired && (
                  <div className="flex items-center space-x-1 mt-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                      Immediate Action Recommended
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>Expires: {notification.expiresAt.toLocaleDateString()}</span>
                  {notification.healthCondition && (
                    <>
                      <span>•</span>
                      <span>Related to: {notification.healthCondition}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Products */}
          {notification.products.length > 0 && (
            <div className="space-y-4">
              {notification.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {product.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {product.rating}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {product.brand}
                            </span>
                            <span className="text-sm text-green-600 dark:text-green-400">
                              {product.deliveryTime}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            £{product.price}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {product.currency}
                          </p>
                        </div>
                      </div>

                      {/* Personalized Reason */}
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Personalized for you:</strong> {product.personalizedReason}
                        </p>
                      </div>

                      {/* Purchase Button */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.urgency === 'high' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : product.urgency === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {product.urgency} priority
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Relevance: {product.seasonalRelevance}/10
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handlePurchase(product.id, notification.id)}
                          disabled={!product.inStock || purchasingProduct === product.id || loading}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            product.inStock
                              ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {purchasingProduct === product.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4" />
                              <span>
                                {product.inStock ? 'Buy Now - One Click' : 'Out of Stock'}
                              </span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Delivery Info */}
                      {product.inStock && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <p>
                            ✓ Delivery to your saved address • ✓ Secure payment • ✓ Easy returns
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SeasonalNotifications;
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Heart, Shield, Sparkles, Zap } from "lucide-react";
import SeasonalNotifications from "../components/SeasonalNotifications";

export default function WelcomeScreen() {
  const { t } = useTranslation();

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 py-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-gray-900 dark:text-white leading-tight">
            {t('welcome.title')}
          </h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('welcome.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link 
              to="/signin" 
              className="btn-primary text-lg px-8 py-3 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              {t('welcome.signIn')}
            </Link>
            <Link 
              to="/signup" 
              className="btn-outline text-lg px-8 py-3 shadow-sm hover:shadow transform hover:-translate-y-1"
            >
              {t('welcome.signUp')}
            </Link>
          </div>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <span className="badge-primary py-1.5 px-4 flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5" />
              AI-Powered
            </span>
            <span className="badge-secondary py-1.5 px-4 flex items-center">
              <Shield className="w-4 h-4 mr-1.5" />
              Secure
            </span>
            <span className="badge bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 py-1.5 px-4 flex items-center">
              <Zap className="w-4 h-4 mr-1.5" />
              Personalized
            </span>
          </div>
        </div>
        
        {/* Weather Alerts Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-display font-semibold mb-6 text-gray-900 dark:text-white text-center">
            Real-Time Insights
          </h2>
          <SeasonalNotifications />
        </div>
        
        {/* Service Areas Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-display font-semibold mb-8 text-gray-900 dark:text-white text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 hover:border-primary-300 dark:hover:border-primary-700 group">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors duration-300">
                <Heart className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">MaiHealth</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Personalized health insights, preventive care recommendations, and wellness tracking.</p>
              <Link to="/maihealth" className="text-primary-600 dark:text-primary-400 font-medium inline-flex items-center hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
                Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all duration-200" />
              </Link>
            </div>
            
            <div className="card p-6 hover:border-primary-300 dark:hover:border-primary-700 group">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors duration-300">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">MaiHome</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Smart home automation, energy optimization, and home management solutions.</p>
              <Link to="/maihome" className="text-primary-600 dark:text-primary-400 font-medium inline-flex items-center hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
                Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all duration-200" />
              </Link>
            </div>
            
            <div className="card p-6 hover:border-primary-300 dark:hover:border-primary-700 group">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors duration-300">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">MaiMoney</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Financial planning, investment guidance, and personalized money management.</p>
              <Link to="/maimoney" className="text-primary-600 dark:text-primary-400 font-medium inline-flex items-center hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
                Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all duration-200" />
              </Link>
            </div>
            
            <div className="card p-6 hover:border-primary-300 dark:hover:border-primary-700 group">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors duration-300">
                <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">MaiStyle</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Fashion advice, personal styling, and beauty recommendations tailored to you.</p>
              <Link to="/maistyle" className="text-primary-600 dark:text-primary-400 font-medium inline-flex items-center hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
                Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all duration-200" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Provider Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-16 mt-16">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl p-8 md:p-12 shadow-md">
            <div className="md:flex items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 text-gray-900 dark:text-white">
                  {t('welcome.serviceProvidersTitle')}
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 md:pr-12">
                  {t('welcome.serviceProvidersDescription')}
                </p>
                <Link 
                  to="/provider-register" 
                  className="inline-flex items-center px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  {t('welcome.joinAsProvider')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center">
                  <svg className="w-20 h-20 md:w-24 md:h-24 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
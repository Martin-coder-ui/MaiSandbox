import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SeasonalNotifications from "../components/SeasonalNotifications";

export default function WelcomeScreen() {
  const { t } = useTranslation();

  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        {t('welcome.title')}
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        {t('welcome.subtitle')}
      </p>
      <div className="space-x-4 mb-8">
        <Link 
          to="/signin" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          {t('welcome.signIn')}
        </Link>
        <Link 
          to="/signup" 
          className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          {t('welcome.signUp')}
        </Link>
      </div>
      
      {/* Weather Alerts Section */}
      <div className="mb-8">
        <SeasonalNotifications />
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          {t('welcome.serviceProvidersTitle')}
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          {t('welcome.serviceProvidersDescription')}
        </p>
        <Link 
          to="/provider-register" 
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
        >
          {t('welcome.joinAsProvider')}
        </Link>
      </div>
    </div>
  );
}
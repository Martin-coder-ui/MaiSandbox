import React from "react";
import { Link } from "react-router-dom";

const ScanOrAvatarScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Choose Your Profile Setup Method</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-10 text-center max-w-xl">
        Now that we have your personal details, let's set up your visual profile. Choose to either scan your body for personalized sizing and fit, or start with a style avatar based on your favorite looks or celebrities.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        <Link
          to="/scan"
          className="flex flex-col items-center justify-center p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
        >
          <div className="w-24 h-24 mb-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="Body Scan" className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Start Body Scan</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            Upload a full-body photo to generate a custom fit model of you for precise sizing and personalized recommendations.
          </p>
          <div className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            Get Started
          </div>
        </Link>

        <Link
          to="/avatar"
          className="flex flex-col items-center justify-center p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
        >
          <div className="w-24 h-24 mb-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/4479/4479754.png" alt="Choose Avatar" className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Choose Style Avatar</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            Pick a digital or celebrity guide to begin your makeover journey with inspiration from your favorite styles.
          </p>
          <div className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
            Browse Avatars
          </div>
        </Link>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          You can always change or add the other option later in your profile settings.
        </p>
        <Link 
          to="/home" 
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
        >
          Skip for now and go to dashboard →
        </Link>
      </div>
    </div>
  );
};

export default ScanOrAvatarScreen;
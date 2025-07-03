import React from "react";

const ScanScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Start Your Body Scan</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-xl">
        Upload or take a full-body photo to allow MaiMe to create a personal fit model for style, wellness, and product suggestions.
      </p>

      <div className="w-full max-w-md border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 text-center bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Photo upload coming soon.</p>
        <button
          disabled
          className="bg-blue-500 text-white px-6 py-2 rounded-lg opacity-50 cursor-not-allowed"
        >
          Upload Photo
        </button>
      </div>
    </div>
  );
};

export default ScanScreen;

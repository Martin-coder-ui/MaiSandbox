import React from "react";

const AvatarScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose Your Style Avatar</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-xl">
        Select a digital persona or celebrity guide to help inspire your transformation. More options coming soon!
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Placeholder avatars */}
        <div className="flex flex-col items-center">
          <img src="https://cdn-icons-png.flaticon.com/512/2202/2202112.png" alt="Avatar 1" className="w-20 h-20 rounded-full" />
          <span className="mt-2 text-sm text-gray-600 dark:text-gray-300">Alex</span>
        </div>
        <div className="flex flex-col items-center">
          <img src="https://cdn-icons-png.flaticon.com/512/2202/2202164.png" alt="Avatar 2" className="w-20 h-20 rounded-full" />
          <span className="mt-2 text-sm text-gray-600 dark:text-gray-300">Jamie</span>
        </div>
        <div className="flex flex-col items-center">
          <img src="https://cdn-icons-png.flaticon.com/512/2202/2202115.png" alt="Avatar 3" className="w-20 h-20 rounded-full" />
          <span className="mt-2 text-sm text-gray-600 dark:text-gray-300">Riley</span>
        </div>
        <div className="flex flex-col items-center">
          <img src="https://cdn-icons-png.flaticon.com/512/2202/2202128.png" alt="Avatar 4" className="w-20 h-20 rounded-full" />
          <span className="mt-2 text-sm text-gray-600 dark:text-gray-300">Taylor</span>
        </div>
      </div>
    </div>
  );
};

export default AvatarScreen;

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, ChevronDown, LogIn, User, Briefcase } from 'lucide-react';

const TestUserSwitcher: React.FC = () => {
  const { user, switchUser, getTestUsers, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const testUsers = getTestUsers();

  const clientUsers = testUsers.filter(u => u.type === 'client');
  const providerUsers = testUsers.filter(u => u.type === 'provider');

  const getServiceAreaBadges = (serviceAreas: string[]) => {
    const colors = {
      'MaiHealth': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'MaiMoney': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'MaiStyle': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'MaiHome': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };

    return serviceAreas.map(area => (
      <span
        key={area}
        className={`px-2 py-1 text-xs rounded-full ${colors[area as keyof typeof colors]}`}
      >
        {area}
      </span>
    ));
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <Users className="w-4 h-4" />
        <span className="text-sm font-medium">{user.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Test User Accounts</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Switch between different user types to test functionality
            </p>
          </div>

          {/* Client Users */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-3">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Client Accounts</h4>
            </div>
            <div className="space-y-2">
              {clientUsers.map((testUser) => (
                <button
                  key={testUser.id}
                  onClick={() => {
                    switchUser(testUser.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    user.id === testUser.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {testUser.name}
                    </span>
                    {user.id === testUser.id && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Current</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {testUser.email}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {getServiceAreaBadges(testUser.serviceAreas)}
                  </div>
                  {testUser.profileData?.age && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Age: {testUser.profileData.age} • {testUser.profileData.location}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Provider Users */}
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Briefcase className="w-4 h-4 text-green-600 dark:text-green-400" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Provider Accounts</h4>
            </div>
            <div className="space-y-2">
              {providerUsers.map((testUser) => (
                <button
                  key={testUser.id}
                  onClick={() => {
                    switchUser(testUser.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    user.id === testUser.id
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {testUser.name}
                    </span>
                    {user.id === testUser.id && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Current</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {testUser.email}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {getServiceAreaBadges(testUser.serviceAreas)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {testUser.specialization?.replace('-', ' ')} • {testUser.providerData?.yearsExperience} years
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestUserSwitcher;
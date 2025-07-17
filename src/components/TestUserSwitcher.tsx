import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { Users, ChevronDown, LogIn, User, Briefcase } from 'lucide-react';

const TestUserSwitcher: React.FC = () => {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);

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
        <span className="text-sm font-medium">{user.name} {profile?.type === 'provider' && '(Provider)'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Current User</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Logged in as {profile?.type || 'user'}
            </p>
          </div>

          {/* Current User Info */}
          <div className="p-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  {profile?.type === 'provider' ? (
                    <Briefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  ) : (
                    <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              {user.serviceAreas && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {getServiceAreaBadges(user.serviceAreas)}
                </div>
              )}
              {profile?.specialization && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {profile.specialization.replace('-', ' ')}
                </p>
              )}
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
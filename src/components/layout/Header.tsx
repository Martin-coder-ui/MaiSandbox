import React, { useState } from 'react';
import { Menu, X, Moon, Sun, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import TestUserSwitcher from '../TestUserSwitcher';
import LanguageSelector from '../LanguageSelector';
import CurrencySelector from '../CurrencySelector';

type HeaderProps = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="py-4 px-6 md:px-8 bg-white dark:bg-gray-900 shadow-md transition-colors duration-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between pr-32">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-display font-bold text-primary-600 dark:text-primary-400 tracking-tight hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
            Mai
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {t('navigation.welcome')}
          </Link>
          <Link 
            to="/start" 
            className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {t('navigation.getStarted')}
          </Link>
          <Link 
            to="/maihome" 
            className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {t('navigation.maiHome')}
          </Link>
          <Link 
            to="/maimoney" 
            className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            MaiMoney
          </Link>
          <Link 
            to="/maihealth" 
            className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {t('navigation.maiHealth')}
          </Link>
          <Link 
            to="/maistyle" 
            className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {t('navigation.maiStyle')}
          </Link>
          <Link 
            to="/maisocial" 
            className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="relative">
              MaiSocial
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
          </Link>
          <Link 
            to="/provider-register" 
            className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors duration-200 shadow-sm hover:shadow"
          >
            {t('navigation.joinAsProvider')}
          </Link>
          <Link 
            to="/provider-dashboard" 
            className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {t('navigation.providerPortal')}
          </Link>
          
          {/* Test User Switcher - only show when authenticated */}
          {isAuthenticated && <TestUserSwitcher />}
          
          {/* Language and Currency Selectors */}
          <LanguageSelector />
          <CurrencySelector />
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden space-x-4">
          {isAuthenticated && <TestUserSwitcher />}
          <LanguageSelector />
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 py-4 px-6 bg-white dark:bg-gray-900 border-t dark:border-gray-800 animate-fade-in">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.welcome')}
            </Link>
            <Link 
              to="/start" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.getStarted')}
            </Link>
            <Link 
              to="/maihome" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.maiHome')}
            </Link>
            <Link 
              to="/maimoney" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              MaiMoney
            </Link>
            <Link 
              to="/maihealth" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.maiHealth')}
            </Link>
            <Link 
              to="/maistyle" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.maiStyle')}
            </Link>
            <Link 
              to="/maisocial" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              MaiSocial
            </Link>
            <Link 
              to="/provider-register" 
              className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors duration-200 text-center shadow-sm hover:shadow font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.joinAsProvider')}
            </Link>
            <Link 
              to="/provider-dashboard" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.providerPortal')}
            </Link>
            
            {/* Mobile Currency Selector */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <CurrencySelector />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
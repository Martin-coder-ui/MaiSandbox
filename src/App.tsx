import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MainContent from './components/layout/MainContent';
import WelcomeScreen from './pages/WelcomeScreen';
import SignInScreen from './pages/SignInScreen';
import SignUpScreen from './pages/SignUpScreen';
import MaiMoneyScreen from './pages/MaiMoneyScreen';
import MaiHomeScreen from './pages/MaiHomeScreen';
import MaiHealthScreen from './pages/MaiHealthScreen';
import MaiStyleScreen from './pages/MaiStyleScreen';
import MaiSocialScreen from './pages/MaiSocialScreen';
import SeasonalCarousel from './pages/SeasonalCarousel';
import PersonalDetailsForm from './components/user/PersonalDetailsForm';
import ScanOrAvatarScreen from './pages/ScanOrAvatarScreen';
import ScanScreen from './pages/ScanScreen';
import AvatarScreen from './pages/AvatarScreen';
import ProviderDashboardScreen from './pages/ProviderDashboardScreen';
import ProviderRegistrationScreen from './pages/ProviderRegistrationScreen';
import ProfileSettingsScreen from './pages/ProfileSettingsScreen';
import useDarkMode from './hooks/useDarkMode';
import ToastContainer from './components/ui/ToastContainer';

const App: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  console.log('[App] Rendering App component');

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <MainContent>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/signin" element={<SignInScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />
            <Route path="/start" element={<PersonalDetailsForm />} />
            <Route path="/profile-setup-options" element={<ScanOrAvatarScreen />} />
            <Route path="/maimoney" element={<MaiMoneyScreen />} />
            <Route path="/maihome" element={<MaiHomeScreen />} />
            <Route path="/maihealth" element={<MaiHealthScreen />} />
            <Route path="/maistyle" element={<MaiStyleScreen />} />
            <Route path="/maisocial" element={<MaiSocialScreen />} />
            <Route path="/seasons" element={<SeasonalCarousel />} />
            <Route path="/scan" element={<ScanScreen />} />
            <Route path="/avatar" element={<AvatarScreen />} />
            <Route path="/provider-dashboard" element={<ProviderDashboardScreen />} />
            <Route path="/provider-register" element={<ProviderRegistrationScreen />} />
            <Route path="/profile-settings" element={<ProfileSettingsScreen />} />
            <Route path="*" element={<WelcomeScreen />} />
          </Routes>
        </MainContent>
        <Footer />
        <ToastContainer />
      </div>
    </AuthProvider>
  );
};

export default App;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, LogIn, User, Users, Briefcase } from "lucide-react";

export default function SignInScreen() {
  const navigate = useNavigate();
  const { login, getTestUsers } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  const testUsers = getTestUsers();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(email, password);
      
      if (!success) {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }
      
      // The user object from useAuth will now be populated after successful login
      // Use the user object from AuthContext directly for navigation logic
      if (authUser) { // 'authUser' here is the state from AuthContext
        const userType = authUser.role; // Assuming 'role' is available on the user object from AuthContext
        const serviceAreas = authUser.serviceAreas; // Assuming 'serviceAreas' is available
        
        if (userType === 'provider') {
          navigate('/provider-dashboard');
        } else {
          // Navigate to the first service area for clients
          const firstService = serviceAreas?.[0];
          if (firstService === 'MaiHealth') {
            navigate('/maihealth');
          } else if (firstService === 'MaiHome') {
            navigate('/maihome');
          } else if (firstService === 'MaiStyle') {
            navigate('/maistyle');
          } else if (firstService === 'MaiMoney') {
            navigate('/maimoney');
          } else {
            navigate('/maihome'); // Default
          }
        }
      } else {
        setError('User not found. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  return (
    <div className="p-8 max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
          <LogIn className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-2 text-gray-900 dark:text-white">Sign In</h1>
        <p className="text-gray-600 dark:text-gray-300">Access your personalized assistant.</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSignIn} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com" 
              className="input pl-10" 
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input 
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password" 
              className="input pl-10 pr-10" 
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium">
              Forgot password?
            </a>
          </div>
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </>
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium">
            Sign up here
          </Link>
        </p>
      </div>

      {/* Test Accounts Section */}
      <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6">
        <button
          onClick={() => setShowTestAccounts(!showTestAccounts)}
          className="w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center"
        >
          <span className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-2">
            <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </span>
          Test Accounts 
          <ChevronDown className={`ml-auto w-4 h-4 transition-transform duration-200 ${showTestAccounts ? 'rotate-180' : ''}`} />
        </button>
        
        {showTestAccounts && (
          <div className="mt-4 space-y-3 animate-fade-in">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Click any account below to auto-fill credentials:
            </p>
            
            {/* Client Accounts */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <User className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
                Client Accounts:
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => quickLogin('emma.health@test.com', 'health123')}
                  className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center mr-3 text-xs font-medium text-green-800 dark:text-green-200">ET</div>
                    <div>
                      <div className="text-sm font-medium text-green-800 dark:text-green-200">Emma Thompson (MaiHealth)</div>
                      <div className="text-xs text-green-600 dark:text-green-400">emma.health@test.com</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => quickLogin('james.finance@test.com', 'finance123')}
                  className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center mr-3 text-xs font-medium text-blue-800 dark:text-blue-200">JW</div>
                    <div>
                      <div className="text-sm font-medium text-blue-800 dark:text-blue-200">James Wilson (MaiHome)</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">james.finance@test.com</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => quickLogin('sophie.style@test.com', 'style123')}
                  className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mr-3 text-xs font-medium text-purple-800 dark:text-purple-200">SC</div>
                    <div>
                      <div className="text-sm font-medium text-purple-800 dark:text-purple-200">Sophie Chen (MaiStyle)</div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">sophie.style@test.com</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Provider Accounts */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-1.5 text-accent-500" />
                Provider Accounts:
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => quickLogin('dr.sarah@test.com', 'provider123')}
                  className="w-full text-left p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center mr-3 text-xs font-medium text-orange-800 dark:text-orange-200">SJ</div>
                    <div>
                      <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Dr. Sarah Johnson (Physiotherapy)</div>
                      <div className="text-xs text-orange-600 dark:text-orange-400">dr.sarah@test.com</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => quickLogin('advisor.lisa@test.com', 'provider123')}
                  className="w-full text-left p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-teal-200 dark:bg-teal-800 rounded-full flex items-center justify-center mr-3 text-xs font-medium text-teal-800 dark:text-teal-200">LR</div>
                    <div>
                      <div className="text-sm font-medium text-teal-800 dark:text-teal-200">Lisa Rodriguez (Financial Planning)</div>
                      <div className="text-xs text-teal-600 dark:text-teal-400">advisor.lisa@test.com</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-1">
                <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <strong>All passwords:</strong>
              </div>
              <div className="pl-6">health123, finance123, style123, complete123, or provider123</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
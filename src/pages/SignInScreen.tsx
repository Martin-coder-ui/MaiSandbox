import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

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
      if (success) {
        // Navigate based on user type
        const user = testUsers.find(u => u.email === email);
        if (user?.type === 'provider') {
          navigate('/provider-dashboard');
        } else {
          // Navigate to the first service area for clients
          const firstService = user?.serviceAreas[0];
          if (firstService === 'MaiHealth') {
            navigate('/maihealth');
          } else if (firstService === 'MaiHome') {
            navigate('/maihome');
          } else if (firstService === 'MaiStyle') {
            navigate('/maistyle');
          } else {
            navigate('/maihome'); // Default
          }
        }
      } else {
        setError('Invalid email or password. Please try again.');
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
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Sign In</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">Access your personalized assistant.</p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <input 
            id="email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com" 
            className="block w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input 
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password" 
              className="block w-full p-3 pr-10 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
          Forgot your password?
        </a>
      </div>

      {/* Test Accounts Section */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <button
          onClick={() => setShowTestAccounts(!showTestAccounts)}
          className="w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
        >
          🧪 Test Accounts {showTestAccounts ? '▼' : '▶'}
        </button>
        
        {showTestAccounts && (
          <div className="mt-4 space-y-3">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Click any account below to auto-fill credentials:
            </p>
            
            {/* Client Accounts */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Client Accounts:</h4>
              <div className="space-y-2">
                <button
                  onClick={() => quickLogin('emma.health@test.com', 'health123')}
                  className="w-full text-left p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                >
                  <div className="text-xs font-medium text-green-800 dark:text-green-200">Emma Thompson (MaiHealth)</div>
                  <div className="text-xs text-green-600 dark:text-green-400">emma.health@test.com</div>
                </button>
                
                <button
                  onClick={() => quickLogin('james.finance@test.com', 'finance123')}
                  className="w-full text-left p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                >
                  <div className="text-xs font-medium text-blue-800 dark:text-blue-200">James Wilson (MaiHome)</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">james.finance@test.com</div>
                </button>
                
                <button
                  onClick={() => quickLogin('sophie.style@test.com', 'style123')}
                  className="w-full text-left p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
                >
                  <div className="text-xs font-medium text-purple-800 dark:text-purple-200">Sophie Chen (MaiStyle)</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">sophie.style@test.com</div>
                </button>
              </div>
            </div>
            
            {/* Provider Accounts */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Provider Accounts:</h4>
              <div className="space-y-2">
                <button
                  onClick={() => quickLogin('dr.sarah@test.com', 'provider123')}
                  className="w-full text-left p-2 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-200"
                >
                  <div className="text-xs font-medium text-orange-800 dark:text-orange-200">Dr. Sarah Johnson (Physiotherapy)</div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">dr.sarah@test.com</div>
                </button>
                
                <button
                  onClick={() => quickLogin('advisor.lisa@test.com', 'provider123')}
                  className="w-full text-left p-2 bg-teal-50 dark:bg-teal-900/20 rounded border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors duration-200"
                >
                  <div className="text-xs font-medium text-teal-800 dark:text-teal-200">Lisa Rodriguez (Financial Planning)</div>
                  <div className="text-xs text-teal-600 dark:text-teal-400">advisor.lisa@test.com</div>
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <strong>All passwords:</strong> health123, finance123, style123, complete123, or provider123
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
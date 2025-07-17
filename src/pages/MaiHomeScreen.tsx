import React from "react";
import VoiceAgent from "../components/VoiceAgent";
import SeasonalNotifications from "../components/SeasonalNotifications";
import { Home, Lightbulb, Shield, Thermometer, Camera, Wrench, Calendar, Settings, Zap, Lock, Wifi, Speaker } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { useGeolocation } from "../hooks/useGeolocation";

export default function MaiHomeScreen() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { location } = useGeolocation();

  // Role-aware content
  const isProvider = profile?.type === 'provider';
  const isClient = profile?.type === 'client';

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🔹</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            MaiHome
          </h1>
        </div>
        {isProvider ? (
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            Manage your smart home installation projects and client automation systems.
          </p>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            Simplify everyday living with smart automation and home-focused planning.
          </p>
        )}
        
        {/* Context Information */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {user && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Welcome:</strong> {user.name} {isProvider && '(Provider)'} • 
                {isProvider ? 'Managing Client Projects' : user.serviceAreas?.includes('MaiHome') ? 'MaiHome Active' : 'Getting Started'}
              </p>
            </div>
          )}
          
          {location && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Location:</strong> {location.city}, {location.region}
              </p>
            </div>
          )}
          
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-purple-800 dark:text-purple-200">
              <strong>Status:</strong> {isProvider ? 'Active installations: 3' : 'Smart home ready for setup'}
            </p>
          </div>
        </div>
      </div>

      {/* Provider-specific dashboard */}
      {isProvider && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Provider Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Active Projects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">£45k</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">98%</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Client Satisfaction</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Voice Agent - Featured prominently */}
        <div className="lg:col-span-1">
          <VoiceAgent />
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connected Devices</h3>
              <Wifi className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {isProvider ? '156' : '12'}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isProvider ? 'Client devices managed' : 'Smart devices online'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Energy Savings</h3>
              <Zap className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {isProvider ? '£12.5k' : '£127'}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isProvider ? 'Client savings generated' : 'Saved this month'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isProvider ? 'Installations' : 'Security Status'}
              </h3>
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {isProvider ? '8' : 'All Clear'}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isProvider ? 'This month' : 'Home secured'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isProvider ? 'Client Projects' : 'Active Projects'}
              </h3>
              <Wrench className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {isProvider ? '24' : '3'}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isProvider ? 'Active client projects' : 'In progress'}
            </p>
          </div>
        </div>
      </div>

      {/* Seasonal Notifications */}
      <div className="mb-8">
        <SeasonalNotifications />
      </div>

      {/* Main Features */}
      <div className="space-y-8">
        {/* Home Automation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Home className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Home Automation</h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Smart control for your home
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lighting Control */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Smart Lighting</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Control all lights remotely, set schedules, and create mood lighting scenes.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Living Room</span>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">On • 75%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Kitchen</span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Off</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Bedroom</span>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">On • 30%</span>
                </div>
              </div>
              <button className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                Manage Lighting
              </button>
            </div>

            {/* Heating Control */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-3">
                <Thermometer className="w-5 h-5 text-red-500 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Climate Control</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Smart thermostat control with energy-saving schedules and remote access.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Current Temp</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">21°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Target</span>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">22°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Mode</span>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Auto</span>
                </div>
              </div>
              <button className="w-full mt-3 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm">
                Adjust Temperature
              </button>
            </div>

            {/* Security System */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-3">
                <Camera className="w-5 h-5 text-purple-500 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">CCTV & Security</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Monitor your home with smart cameras, motion sensors, and security alerts.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Front Door</span>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Garden</span>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Alarm System</span>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Armed</span>
                </div>
              </div>
              <button className="w-full mt-3 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm">
                View Cameras
              </button>
            </div>
          </div>
        </div>

        {/* Home Project Planner */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Wrench className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Home Project Planner 🏗️</h3>
            </div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm">
              New Project
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Active Project 1 */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Kitchen Renovation</h4>
                <span className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded">
                  In Progress
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Complete kitchen makeover with new cabinets, countertops, and appliances.
              </p>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">65%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                  <div className="bg-orange-600 h-1.5 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs mb-3">
                <span className="text-gray-500 dark:text-gray-400">Budget: £12,000</span>
                <span className="text-gray-500 dark:text-gray-400">Spent: £7,850</span>
              </div>
              <button className="w-full px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm">
                View Project
              </button>
            </div>

            {/* Active Project 2 */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Bathroom Remodel</h4>
                <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                  Planning
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Update master bathroom with new shower, vanity, and fixtures.
              </p>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">15%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{width: '15%'}}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs mb-3">
                <span className="text-gray-500 dark:text-gray-400">Budget: £8,500</span>
                <span className="text-gray-500 dark:text-gray-400">Spent: £1,200</span>
              </div>
              <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                View Project
              </button>
            </div>

            {/* Active Project 3 */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Garden Landscaping</h4>
                <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                  Starting Soon
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Redesign garden with new patio, plants, and irrigation system.
              </p>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">5%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{width: '5%'}}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs mb-3">
                <span className="text-gray-500 dark:text-gray-400">Budget: £5,000</span>
                <span className="text-gray-500 dark:text-gray-400">Spent: £250</span>
              </div>
              <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
                View Project
              </button>
            </div>
          </div>
        </div>

        {/* Voice Assistant Integration */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <Speaker className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Voice Assistant Integration</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Voice Commands</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
                Control your entire home with simple voice commands. Adjust lighting, temperature, security, and more.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-purple-700 dark:text-purple-300">
                  <span className="font-medium mr-2">Try saying:</span>
                  "Turn off all lights downstairs"
                </div>
                <div className="flex items-center text-xs text-purple-700 dark:text-purple-300">
                  <span className="font-medium mr-2">Try saying:</span>
                  "Set temperature to 22 degrees"
                </div>
                <div className="flex items-center text-xs text-purple-700 dark:text-purple-300">
                  <span className="font-medium mr-2">Try saying:</span>
                  "Show me the front door camera"
                </div>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm">
                Setup Voice Assistant
              </button>
            </div>
            
            <div className="p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Smart Routines</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                Create automated routines that trigger multiple actions with a single command or schedule.
              </p>
              <div className="space-y-3 mb-4">
                <div className="p-2 bg-white dark:bg-gray-700 rounded border border-blue-100 dark:border-blue-800 text-xs">
                  <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">Morning Routine</div>
                  <div className="text-gray-600 dark:text-gray-300">Opens blinds, turns on lights, adjusts temperature</div>
                </div>
                <div className="p-2 bg-white dark:bg-gray-700 rounded border border-blue-100 dark:border-blue-800 text-xs">
                  <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">Leaving Home</div>
                  <div className="text-gray-600 dark:text-gray-300">Turns off all lights, sets security system</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                Manage Routines
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Home Maintenance Calendar */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <Calendar className="w-6 h-6 text-teal-600 dark:text-teal-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Home Maintenance Calendar</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">HVAC Filter Replacement</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Replace air filters for optimal air quality and efficiency</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-teal-600 dark:text-teal-400">Due in 3 days</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Recurring: Every 3 months</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Gutter Cleaning</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Clear gutters of leaves and debris</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due in 2 weeks</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Recurring: Every 6 months</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Smoke Detector Test</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Test all smoke and carbon monoxide detectors</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due in 3 weeks</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Recurring: Monthly</p>
            </div>
          </div>
        </div>
        
        <button className="mt-4 w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200">
          View Full Maintenance Schedule
        </button>
      </div>

      {/* Smart Home Settings */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Smart Home Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Connected Platforms</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                    <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Google Home</span>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                  Connected
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-3">
                    <Speaker className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Amazon Alexa</span>
                </div>
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded">
                  Not Connected
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                    <Home className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Apple HomeKit</span>
                </div>
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded">
                  Not Connected
                </span>
              </div>
            </div>
            <button className="w-full mt-4 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
              Manage Connections
            </button>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Security Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                  Enabled
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Device Encryption</span>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                  Enabled
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wifi className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Network Security</span>
                </div>
                <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                  Review Needed
                </span>
              </div>
            </div>
            <button className="w-full mt-4 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm">
              Security Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Users, Calendar, DollarSign, FileText, Settings, Bell, TrendingUp, Clock } from 'lucide-react';
import DisciplineSpecificDashboard from '../components/provider/DisciplineSpecificDashboards';

const ProviderDashboardScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [providerSpecialization] = useState('physiotherapy'); // This would come from user data

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'patients', label: 'My Clients', icon: Users },
    { id: 'recommendations', label: 'AI Recommendations', icon: FileText },
    { id: 'scheduling', label: 'Scheduling', icon: Calendar },
    { id: 'billing', label: 'Billing & Payments', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent />;
      case 'patients':
        return <PatientsContent />;
      case 'recommendations':
        return <DisciplineSpecificDashboard specialization={providerSpecialization} />;
      case 'scheduling':
        return <SchedulingContent />;
      case 'billing':
        return <BillingContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Provider Portal</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Dr. Sarah Johnson</p>
            <span className="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full mt-2">
              Verified Mai Service Provider
            </span>
          </div>
          
          <nav className="p-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 mb-2 ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {navigationItems.find(item => item.id === activeTab)?.label}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage your practice and client care
              </p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <Bell className="w-4 h-4" />
              <span>3 Notifications</span>
            </button>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Overview Content Component
const OverviewContent: React.FC = () => (
  <div className="space-y-6">
    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Active Clients</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">127</p>
          </div>
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-sm text-green-600 dark:text-green-400 mt-2">+12% this month</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">This Week's Appointments</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
          </div>
          <Calendar className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">6 today</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Revenue</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">£8,450</p>
          </div>
          <DollarSign className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-sm text-green-600 dark:text-green-400 mt-2">+8% vs last month</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">AI Recommendations</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">15</p>
          </div>
          <FileText className="w-8 h-8 text-orange-600" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Pending review</p>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">New client consultation completed</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Emma Thompson - Initial assessment</p>
            </div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">AI recommendation approved</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Service plan for John Davis</p>
            </div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">4 hours ago</span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Payment received</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">£85 - Service session</p>
            </div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">1 day ago</span>
        </div>
      </div>
    </div>
  </div>
);

// Patients Content Component (renamed to Clients)
const PatientsContent: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search clients..."
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option>All Clients</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
        Add New Client
      </button>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Session</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Service Area</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    ET
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Emma Thompson</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">emma.thompson@email.com</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Today</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">MaiHealth</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">View</button>
                <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">Message</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                    JD
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">John Davis</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">john.davis@email.com</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">2 days ago</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">MaiStyle</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">View</button>
                <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">Message</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Scheduling Content Component
const SchedulingContent: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Today
        </button>
        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
          This Week
        </button>
        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
          This Month
        </button>
      </div>
      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
        Block Time
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Schedule</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">09:00</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">45 min</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Emma Thompson</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Initial consultation</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                Start Session
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">11:00</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">30 min</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">John Davis</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Follow-up session</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                Upcoming
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">14:00</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">60 min</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Sarah Wilson</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Service session</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                Upcoming
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Availability Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Working Hours</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Monday - Friday</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Saturday</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">9:00 AM - 2:00 PM</span>
                </div>
              </div>
            </div>
            <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              Edit Availability
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Today's Appointments</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Cancellations</span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Billing Content Component
const BillingContent: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">This Month's Revenue</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">£8,450</p>
          </div>
          <DollarSign className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-sm text-green-600 dark:text-green-400 mt-2">+12% vs last month</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Pending Payments</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">£1,240</p>
          </div>
          <Clock className="w-8 h-8 text-orange-600" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">5 invoices</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Average Session Fee</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">£85</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">Industry standard</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Models</h3>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Pay-as-you-go</h4>
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">Active</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">£85 per session</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Most popular with clients</p>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Monthly Subscription</h4>
              <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">Available</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">£200/month (unlimited sessions)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">For regular clients</p>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Insurance Billing</h4>
              <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">Setup Required</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Direct billing to insurance providers</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Requires provider verification</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Emma Thompson</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Initial consultation</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-600 dark:text-green-400">+£85</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">John Davis</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Follow-up session</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-600 dark:text-green-400">+£65</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Sarah Wilson</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Monthly subscription</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-600 dark:text-green-400">+£200</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Settings Content Component
const SettingsContent: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue="Dr. Sarah Johnson"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Areas</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">MaiHealth</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">MaiHome</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">MaiStyle</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Specialization</label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>Physiotherapy</option>
              <option>Dentistry</option>
              <option>Nutrition</option>
              <option>Mental Health</option>
              <option>General Practice</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">License Number</label>
            <input
              type="text"
              defaultValue="PT-12345-UK"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Years of Experience</label>
            <input
              type="number"
              defaultValue="8"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Practice Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Practice Name</label>
            <input
              type="text"
              defaultValue="Johnson Physiotherapy Clinic"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
            <textarea
              defaultValue="123 Health Street, London, UK"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="+44 20 1234 5678"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">New Client Registrations</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Get notified when new clients book appointments</p>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">AI Recommendation Alerts</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Receive alerts for new AI-generated recommendations</p>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Payment Notifications</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Get notified about successful payments and invoices</p>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
        </div>
      </div>
    </div>

    <div className="flex justify-end space-x-4">
      <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
        Cancel
      </button>
      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
        Save Changes
      </button>
    </div>
  </div>
);

export default ProviderDashboardScreen;
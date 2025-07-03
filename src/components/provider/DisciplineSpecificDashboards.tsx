import React from 'react';
import { Heart, Zap, Apple, Brain, Stethoscope, DollarSign, CreditCard, Shield, Palette, Scissors, ShoppingBag, Home, Lightbulb, Camera, Wrench } from 'lucide-react';

interface DisciplineDashboardProps {
  specialization: string;
}

const DisciplineSpecificDashboard: React.FC<DisciplineDashboardProps> = ({ specialization }) => {
  const renderDentistDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center mb-4">
          <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dental Health Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">23</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Cleanings This Week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">8</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Preventive Plans</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">5</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Treatment Plans</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Oral Health Assessments</h4>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Sarah Mitchell</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Routine checkup analysis</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                Low Risk
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>AI Recommendations:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Continue current oral hygiene routine</li>
                <li>Consider fluoride treatment for cavity prevention</li>
                <li>Schedule next cleaning in 6 months</li>
              </ul>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Approve Plan
              </button>
              <button className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
                Modify
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: James Wilson</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Gum health assessment</p>
              </div>
              <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                Moderate Risk
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>AI Recommendations:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Deep cleaning recommended</li>
                <li>Improve flossing technique - demonstrate proper method</li>
                <li>Consider antimicrobial mouthwash</li>
                <li>Follow-up in 3 months</li>
              </ul>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Approve Plan
              </button>
              <button className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
                Modify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPhysiotherapistDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-center mb-4">
          <Zap className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Movement & Recovery Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">18</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Active Treatment Plans</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Exercise Programs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">85%</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Client Compliance</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Exercise Plan Recommendations</h4>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Emma Thompson</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Lower back pain rehabilitation</p>
              </div>
              <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                Week 3 Progress
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Recommended Progression:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Increase core strengthening exercises to 15 reps</li>
                <li>Add resistance band exercises for glutes</li>
                <li>Progress walking program to 20 minutes daily</li>
                <li>Introduce gentle yoga stretches</li>
              </ul>
              <p className="mt-2"><strong>AI Confidence:</strong> 94% based on recovery patterns</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                Approve Progression
              </button>
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Modify Plan
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Michael Chen</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Post-surgery knee rehabilitation</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                Ahead of Schedule
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Advanced Protocol Suggested:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Begin weight-bearing exercises</li>
                <li>Introduce balance training</li>
                <li>Start sport-specific movements</li>
                <li>Consider return-to-activity assessment</li>
              </ul>
              <p className="mt-2"><strong>Recovery Rate:</strong> 15% faster than average</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                Approve Advanced Plan
              </button>
              <button className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700">
                Schedule Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNutritionistDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
        <div className="flex items-center mb-4">
          <Apple className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nutrition & Wellness Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">32</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Active Meal Plans</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">78%</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Goal Achievement Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">15</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Weight Loss Success</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Nutrition Plan Recommendations</h4>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Lisa Rodriguez</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Weight management program</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                On Track
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Personalized Meal Adjustments:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Increase protein intake to 1.2g per kg body weight</li>
                <li>Add Mediterranean-style lunch options</li>
                <li>Include omega-3 rich snacks (walnuts, chia seeds)</li>
                <li>Adjust portion sizes based on activity level</li>
              </ul>
              <p className="mt-2"><strong>Predicted Outcome:</strong> 0.5kg loss this week</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                Approve Plan
              </button>
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Customize Further
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: David Park</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Diabetes management nutrition</p>
              </div>
              <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                Blood Sugar Stable
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Glycemic Control Optimization:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Maintain current carbohydrate distribution</li>
                <li>Add fiber-rich vegetables to each meal</li>
                <li>Consider chromium supplementation</li>
                <li>Schedule HbA1c follow-up in 3 months</li>
              </ul>
              <p className="mt-2"><strong>Risk Assessment:</strong> Low risk for complications</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                Continue Plan
              </button>
              <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700">
                Schedule Check-in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMentalHealthDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center mb-4">
          <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mental Health & Wellness Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">24</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Active Therapy Plans</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">89%</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Session Attendance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">7.2</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Avg. Wellness Score</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Therapy Recommendations</h4>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Anonymous Client A</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Anxiety management therapy</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                Improving
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Suggested Interventions:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Continue CBT techniques for thought restructuring</li>
                <li>Introduce progressive muscle relaxation</li>
                <li>Assign mindfulness homework exercises</li>
                <li>Consider group therapy for social anxiety</li>
              </ul>
              <p className="mt-2"><strong>Progress Indicators:</strong> 40% reduction in anxiety scores</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                Approve Plan
              </button>
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Adjust Approach
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Anonymous Client B</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Depression treatment program</p>
              </div>
              <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                Needs Attention
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Recommended Adjustments:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Increase session frequency to twice weekly</li>
                <li>Incorporate behavioral activation techniques</li>
                <li>Assess medication compliance with psychiatrist</li>
                <li>Add family therapy component</li>
              </ul>
              <p className="mt-2"><strong>Risk Assessment:</strong> Moderate - requires close monitoring</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700">
                Urgent Review
              </button>
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Modify Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeneralPracticeDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-teal-200 dark:border-teal-800">
        <div className="flex items-center mb-4">
          <Stethoscope className="w-6 h-6 text-teal-600 dark:text-teal-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Practice Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">45</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Consultations This Week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Preventive Care Plans</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">8</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Chronic Care Management</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Clinical Decision Support</h4>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Margaret Thompson</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Hypertension management</p>
              </div>
              <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                Medication Review Due
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>AI Recommendations:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Consider ACE inhibitor dose adjustment</li>
                <li>Order lipid panel and HbA1c</li>
                <li>Lifestyle counseling for sodium reduction</li>
                <li>Schedule cardiology referral if BP remains elevated</li>
              </ul>
              <p className="mt-2"><strong>Risk Stratification:</strong> Moderate cardiovascular risk</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Review & Approve
              </button>
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                Order Tests
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Robert Kim</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Annual health screening</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                Preventive Care
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Screening Recommendations:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Colonoscopy due (age 52, family history)</li>
                <li>Prostate screening discussion</li>
                <li>Update vaccinations (flu, COVID-19 booster)</li>
                <li>Skin cancer screening referral</li>
              </ul>
              <p className="mt-2"><strong>Health Maintenance:</strong> All routine screenings up to date</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                Schedule Screenings
              </button>
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Client Education
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaiMoneyDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-center mb-4">
          <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">MaiMoney Financial Services Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">42</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Active Financial Plans</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">£2.4M</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Assets Under Management</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">94%</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Client Satisfaction</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Financial Recommendations</h4>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Sarah Mitchell</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Investment portfolio optimization</p>
              </div>
              <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                High Potential
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>AI Investment Suggestions:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Rebalance portfolio: 60% equities, 30% bonds, 10% alternatives</li>
                <li>Consider ESG-focused index funds for long-term growth</li>
                <li>Increase pension contributions to maximize tax relief</li>
                <li>Review emergency fund - currently 3 months, recommend 6 months</li>
              </ul>
              <p className="mt-2"><strong>Projected Annual Return:</strong> 7.2% (vs current 5.8%)</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                Approve Strategy
              </button>
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Customize Plan
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: James Wilson</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Mortgage refinancing opportunity</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                Savings Opportunity
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Refinancing Analysis:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Current rate: 4.2% → Recommended rate: 3.1%</li>
                <li>Monthly savings: £340 (£4,080 annually)</li>
                <li>Break-even point: 18 months including fees</li>
                <li>Consider 5-year fixed rate for stability</li>
              </ul>
              <p className="mt-2"><strong>Total Savings Over 5 Years:</strong> £18,400</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                Proceed with Application
              </button>
              <button className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700">
                Schedule Consultation
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Emma Davis</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Insurance coverage review</p>
              </div>
              <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                Coverage Gap
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Insurance Recommendations:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Life insurance: Increase coverage from £200k to £350k</li>
                <li>Income protection: Add policy covering 70% of salary</li>
                <li>Home insurance: Review contents value (last updated 2019)</li>
                <li>Consider umbrella policy for additional liability protection</li>
              </ul>
              <p className="mt-2"><strong>Risk Assessment:</strong> Moderate exposure, family protection priority</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Get Quotes
              </button>
              <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700">
                Schedule Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaiStyleDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-pink-200 dark:border-pink-800">
        <div className="flex items-center mb-4">
          <Palette className="w-6 h-6 text-pink-600 dark:text-pink-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">MaiStyle Services Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">38</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Active Style Plans</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">156</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Styling Sessions This Month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">96%</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Client Satisfaction</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Style Recommendations</h4>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Sophie Chen</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Complete wardrobe transformation</p>
              </div>
              <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                Style Evolution
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>AI Style Analysis:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Body type: Pear shape - emphasize upper body with structured blazers</li>
                <li>Color palette: Cool undertones - jewel tones and navy work best</li>
                <li>Lifestyle: Professional + weekend casual - need versatile pieces</li>
                <li>Budget optimization: 20 key pieces for 50+ outfit combinations</li>
              </ul>
              <p className="mt-2"><strong>Style Confidence Score:</strong> Projected increase from 6/10 to 9/10</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700">
                Approve Wardrobe Plan
              </button>
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Schedule Shopping
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Maria Rodriguez</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Hair transformation consultation</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                Perfect Match
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Hair Styling Recommendations:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Face shape: Oval - can carry most styles, recommend long bob</li>
                <li>Hair texture: Fine, straight - add layers for volume and movement</li>
                <li>Maintenance level: Low - suggest wash-and-go styles</li>
                <li>Color suggestion: Subtle highlights to add dimension</li>
              </ul>
              <p className="mt-2"><strong>Maintenance Schedule:</strong> Cut every 8 weeks, color every 12 weeks</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                Book Appointment
              </button>
              <button className="px-3 py-1 text-xs bg-pink-600 text-white rounded hover:bg-pink-700">
                Virtual Try-On
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Jessica Taylor</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Makeup artistry for special event</p>
              </div>
              <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                Event Ready
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Makeup Recommendations:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Event: Evening wedding - glamorous but not overpowering</li>
                <li>Skin tone: Warm undertones - gold and bronze accents</li>
                <li>Eye shape: Hooded eyes - focus on lower lash line definition</li>
                <li>Longevity: 8+ hours - use primer and setting spray</li>
              </ul>
              <p className="mt-2"><strong>Look Duration:</strong> 10-12 hours with touch-up kit provided</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700">
                Confirm Look
              </button>
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Trial Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaiHomeDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center mb-4">
          <Home className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">MaiHome Services Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">28</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Active Smart Home Setups</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">£12.5k</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Average Project Value</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">92%</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Client Satisfaction</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Home Automation Recommendations</h4>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: David Parker</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Smart lighting installation</p>
              </div>
              <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                In Progress
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>AI System Recommendations:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Philips Hue for main living areas - color changing capability</li>
                <li>Motion sensors for hallways and bathrooms</li>
                <li>Smart switches for existing fixtures in bedrooms</li>
                <li>Google Home integration for voice control</li>
              </ul>
              <p className="mt-2"><strong>Energy Savings Estimate:</strong> 15-20% on lighting costs</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                Approve Plan
              </button>
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Modify Setup
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Alex Rodriguez</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Home security system</p>
              </div>
              <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                Planning Phase
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Security System Design:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>4K doorbell camera with person detection</li>
                <li>Outdoor cameras at entry points (3 total)</li>
                <li>Window and door sensors on ground floor</li>
                <li>Smart alarm with mobile notifications</li>
                <li>Integrated with existing smart home system</li>
              </ul>
              <p className="mt-2"><strong>Installation Timeline:</strong> 2-day professional setup</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700">
                Finalize Quote
              </button>
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Schedule Consultation
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Client: Emma Johnson</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">Smart thermostat installation</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                Completed
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>System Performance:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Nest Learning Thermostat installed and calibrated</li>
                <li>AI learning period: 2 weeks completed</li>
                <li>Current energy savings: 18% vs. previous month</li>
                <li>Smart scheduling optimized for occupancy patterns</li>
              </ul>
              <p className="mt-2"><strong>Client Feedback:</strong> "Very satisfied with the comfort and savings"</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                View Performance Data
              </button>
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                Schedule Follow-up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    switch (specialization.toLowerCase()) {
      case 'dentistry':
        return renderDentistDashboard();
      case 'physiotherapy':
        return renderPhysiotherapistDashboard();
      case 'nutrition':
      case 'nutrition & dietetics':
        return renderNutritionistDashboard();
      case 'mental health':
      case 'mental-health':
        return renderMentalHealthDashboard();
      case 'general practice':
      case 'general-practice':
        return renderGeneralPracticeDashboard();
      
      // MaiMoney specializations
      case 'financial-planning':
      case 'financial planning':
      case 'banking':
      case 'insurance':
      case 'investment-advisory':
      case 'investment advisory':
      case 'mortgage-advisory':
      case 'mortgage advisory':
      case 'tax-advisory':
      case 'tax advisory':
        return renderMaiMoneyDashboard();
      
      // MaiStyle specializations
      case 'personal-styling':
      case 'personal styling':
      case 'hair-styling':
      case 'hair styling':
      case 'makeup-artistry':
      case 'makeup artistry':
      case 'fashion-consulting':
      case 'fashion consulting':
      case 'image-consulting':
      case 'image consulting':
      case 'wardrobe-consulting':
      case 'wardrobe consulting':
        return renderMaiStyleDashboard();
      
      // MaiHome specializations
      case 'home-automation':
      case 'smart-home':
      case 'home-security':
      case 'energy-management':
      case 'home-renovation':
      case 'interior-design':
        return renderMaiHomeDashboard();
        
      default:
        return renderGeneralPracticeDashboard();
    }
  };

  return (
    <div className="space-y-6">
      {renderDashboard()}
    </div>
  );
};

export default DisciplineSpecificDashboard;
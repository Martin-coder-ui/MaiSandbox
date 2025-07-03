import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const ProviderRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
    },
    professionalInfo: {
      serviceAreas: [] as string[],
      specialization: '',
      licenseNumber: '',
      yearsOfExperience: '',
      qualifications: '',
      practiceType: '',
    },
    practiceDetails: {
      practiceName: '',
      address: '',
      city: '',
      postcode: '',
      website: '',
    },
    verification: {
      licenseDocument: null,
      qualificationCertificates: null,
      insuranceDocument: null,
    },
  });

  const totalSteps = 4;

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleServiceAreaChange = (serviceArea: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        serviceAreas: checked 
          ? [...prev.professionalInfo.serviceAreas, serviceArea]
          : prev.professionalInfo.serviceAreas.filter(area => area !== serviceArea)
      }
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      verification: {
        ...prev.verification,
        [field]: file,
      },
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please provide your basic personal details to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.personalInfo.firstName}
            onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.personalInfo.lastName}
            onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+44 20 1234 5678"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Professional Information</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Tell us about your professional background and the Mai services you'd like to provide.
        </p>
      </div>

      <div className="space-y-6">
        {/* Service Areas Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Mai Service Areas *
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select the Mai service areas you'd like to provide services for (you can select multiple):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.professionalInfo.serviceAreas.includes('MaiHome')}
                  onChange={(e) => handleServiceAreaChange('MaiHome', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">MaiHome</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Banking, personal finance, insurance services
                  </div>
                </div>
              </label>
            </div>

            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.professionalInfo.serviceAreas.includes('MaiHealth')}
                  onChange={(e) => handleServiceAreaChange('MaiHealth', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">MaiHealth</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Healthcare, wellness, fitness services
                  </div>
                </div>
              </label>
            </div>

            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.professionalInfo.serviceAreas.includes('MaiStyle')}
                  onChange={(e) => handleServiceAreaChange('MaiStyle', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">MaiStyle</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Fashion, beauty, styling services
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Primary Specialization *
            </label>
            <select
              value={formData.professionalInfo.specialization}
              onChange={(e) => handleInputChange('professionalInfo', 'specialization', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your primary specialization</option>
              
              {/* MaiHealth Options */}
              <optgroup label="MaiHealth Specializations">
                <option value="physiotherapy">Physiotherapy</option>
                <option value="dentistry">Dentistry</option>
                <option value="nutrition">Nutrition & Dietetics</option>
                <option value="mental-health">Mental Health</option>
                <option value="general-practice">General Practice</option>
                <option value="cardiology">Cardiology</option>
                <option value="dermatology">Dermatology</option>
                <option value="orthopedics">Orthopedics</option>
              </optgroup>
              
              {/* MaiHome Options */}
              <optgroup label="MaiHome Specializations">
                <option value="financial-planning">Financial Planning</option>
                <option value="banking">Banking Services</option>
                <option value="insurance">Insurance</option>
                <option value="investment-advisory">Investment Advisory</option>
                <option value="mortgage-advisory">Mortgage Advisory</option>
                <option value="tax-advisory">Tax Advisory</option>
              </optgroup>
              
              {/* MaiStyle Options */}
              <optgroup label="MaiStyle Specializations">
                <option value="personal-styling">Personal Styling</option>
                <option value="hair-styling">Hair Styling</option>
                <option value="makeup-artistry">Makeup Artistry</option>
                <option value="fashion-consulting">Fashion Consulting</option>
                <option value="image-consulting">Image Consulting</option>
                <option value="wardrobe-consulting">Wardrobe Consulting</option>
              </optgroup>
              
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              License/Certification Number *
            </label>
            <input
              type="text"
              value={formData.professionalInfo.licenseNumber}
              onChange={(e) => handleInputChange('professionalInfo', 'licenseNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., PT-12345-UK, FCA-67890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Years of Experience *
            </label>
            <select
              value={formData.professionalInfo.yearsOfExperience}
              onChange={(e) => handleInputChange('professionalInfo', 'yearsOfExperience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select experience level</option>
              <option value="0-2">0-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="11-15">11-15 years</option>
              <option value="16-20">16-20 years</option>
              <option value="20+">20+ years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Practice Type *
            </label>
            <select
              value={formData.professionalInfo.practiceType}
              onChange={(e) => handleInputChange('professionalInfo', 'practiceType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select practice type</option>
              <option value="private">Private Practice</option>
              <option value="nhs">NHS (Healthcare only)</option>
              <option value="clinic">Clinic/Group Practice</option>
              <option value="hospital">Hospital (Healthcare only)</option>
              <option value="salon">Salon/Studio (Style only)</option>
              <option value="bank">Bank/Financial Institution (Finance only)</option>
              <option value="freelance">Freelance/Mobile</option>
              <option value="consultancy">Consultancy</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Qualifications & Certifications *
            </label>
            <textarea
              value={formData.professionalInfo.qualifications}
              onChange={(e) => handleInputChange('professionalInfo', 'qualifications', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="List your degrees, certifications, and relevant qualifications..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPracticeDetails = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Practice Details</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Provide information about your practice location and contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Practice/Business Name *
          </label>
          <input
            type="text"
            value={formData.practiceDetails.practiceName}
            onChange={(e) => handleInputChange('practiceDetails', 'practiceName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Johnson Physiotherapy Clinic, Smith Financial Advisory, Style Studio London"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address *
          </label>
          <input
            type="text"
            value={formData.practiceDetails.address}
            onChange={(e) => handleInputChange('practiceDetails', 'address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Street address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.practiceDetails.city}
            onChange={(e) => handleInputChange('practiceDetails', 'city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="City"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Postcode *
          </label>
          <input
            type="text"
            value={formData.practiceDetails.postcode}
            onChange={(e) => handleInputChange('practiceDetails', 'postcode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="SW1A 1AA"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Website (Optional)
          </label>
          <input
            type="url"
            value={formData.practiceDetails.website}
            onChange={(e) => handleInputChange('practiceDetails', 'website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://www.yourpractice.com"
          />
        </div>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Document Verification</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Upload the required documents to verify your credentials. All documents will be securely stored and reviewed by our team.
        </p>
      </div>

      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Professional License/Certification *</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Upload a clear copy of your professional license, certification, or registration document
            </p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('licenseDocument', e.target.files?.[0] || null)}
              className="hidden"
              id="license-upload"
            />
            <label
              htmlFor="license-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
            >
              Choose File
            </label>
            {formData.verification.licenseDocument && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                ✓ {formData.verification.licenseDocument.name}
              </p>
            )}
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Qualification Certificates *</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Upload your degree certificates and professional qualifications
            </p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={(e) => handleFileUpload('qualificationCertificates', e.target.files?.[0] || null)}
              className="hidden"
              id="qualifications-upload"
            />
            <label
              htmlFor="qualifications-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
            >
              Choose Files
            </label>
            {formData.verification.qualificationCertificates && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                ✓ {formData.verification.qualificationCertificates.name}
              </p>
            )}
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Professional Indemnity Insurance *</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Upload proof of current professional indemnity insurance
            </p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('insuranceDocument', e.target.files?.[0] || null)}
              className="hidden"
              id="insurance-upload"
            />
            <label
              htmlFor="insurance-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
            >
              Choose File
            </label>
            {formData.verification.insuranceDocument && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                ✓ {formData.verification.insuranceDocument.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Verification Process</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Your documents will be reviewed within 2-3 business days. You'll receive an email notification once your account is verified and approved for the selected Mai service areas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderProfessionalInfo();
      case 3:
        return renderPracticeDetails();
      case 4:
        return renderVerification();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mai Service Provider Registration</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Join Mai's network of verified service professionals across MaiHome, MaiHealth, and MaiStyle
          </p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          {renderCurrentStep()}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                currentStep === 1
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={() => alert('Registration submitted! You will receive a confirmation email shortly.')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Submit Registration
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegistrationForm;
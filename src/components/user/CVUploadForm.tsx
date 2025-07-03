import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

interface CVUploadFormProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const CVUploadForm: React.FC<CVUploadFormProps> = ({ onFileSelect, selectedFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Please upload a PDF, Word document, or text file.');
      setUploadStatus('error');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size must be less than 10MB.');
      setUploadStatus('error');
      return;
    }

    setErrorMessage('');
    setUploadStatus('success');
    onFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onFileSelect(null);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'txt':
        return '📃';
      default:
        return '📄';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upload Your CV</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Help us analyze your current employment situation and provide personalized career and income recommendations.
        </p>
      </div>

      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          } ${uploadStatus === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="cv-upload"
          />
          
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Drop your CV here, or click to browse
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Supports PDF, Word documents, and text files (max 10MB)
            </p>
          </div>

          {uploadStatus === 'error' && (
            <div className="mt-4 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{getFileIcon(selectedFile.name)}</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)} • Uploaded successfully
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <button
                onClick={removeFile}
                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              How we use your CV
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Analyze your current role and experience level</li>
              <li>• Identify skills and qualifications</li>
              <li>• Suggest career advancement opportunities</li>
              <li>• Recommend income improvement strategies</li>
              <li>• Match you with relevant job opportunities</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Privacy & Security
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your CV is encrypted and stored securely. We only extract relevant professional information 
              to provide personalized recommendations. You can delete your CV data at any time from your profile settings.
            </p>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                Next Steps
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                After completing your profile, our AI will analyze your CV and provide personalized 
                recommendations for career advancement and income improvement in your MaiHome dashboard.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVUploadForm;
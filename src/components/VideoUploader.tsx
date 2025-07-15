import React, { useState, useRef } from 'react';
import { Video, X, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VideoUploaderProps {
  onVideoSelect: (file: File | null) => void;
  onUploadComplete?: (videoUrl: string, thumbnailUrl: string) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ 
  onVideoSelect, 
  onUploadComplete,
  maxSizeMB = 100,
  allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      return false;
    }
    
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds the maximum allowed size (${maxSizeMB}MB)`);
      return false;
    }
    
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file: File) => {
    setError(null);
    
    if (!validateFile(file)) {
      return;
    }
    
    setSelectedFile(file);
    onVideoSelect(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Simulate upload process
    uploadVideo(file);
  };

  const uploadVideo = async (file: File) => {
    setUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('social-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          }
        });
      
      if (error) throw error;
      
      // Set status to processing
      setUploadStatus('processing');
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('social-media')
        .getPublicUrl(filePath);
      
      // In a real app, you would generate a thumbnail from the video
      // For now, we'll use a placeholder
      const thumbnailUrl = 'https://images.pexels.com/photos/3952034/pexels-photo-3952034.jpeg?auto=compress&cs=tinysrgb&w=800';
      
      // Simulate processing time
      setTimeout(() => {
        setUploadStatus('complete');
        setUploading(false);
        
        if (onUploadComplete) {
          onUploadComplete(urlData.publicUrl, thumbnailUrl);
        }
      }, 1500);
    } catch (err) {
      console.error('Error uploading video:', err);
      setUploadStatus('error');
      setError('Failed to upload video. Please try again.');
      setUploading(false);
    }
  };

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    
    onVideoSelect(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getVideoDuration = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        resolve(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
            dragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          } ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={inputRef}
            accept={allowedTypes.join(',')}
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Drop your video here, or click to browse
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Supports {allowedTypes.map(type => type.split('/')[1]).join(', ')} (max {maxSizeMB}MB)
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Video Preview */}
          <div className="relative aspect-video bg-black">
            {previewUrl && (
              <video
                ref={videoRef}
                src={previewUrl}
                className="w-full h-full object-contain"
                controls
              />
            )}
          </div>
          
          {/* File Info & Upload Status */}
          <div className="p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <Video className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Remove video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Upload Progress */}
            {uploadStatus !== 'idle' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    {uploadStatus === 'uploading' && (
                      <Upload className="w-4 h-4 text-primary-600 dark:text-primary-400 mr-1.5 animate-pulse" />
                    )}
                    {uploadStatus === 'processing' && (
                      <div className="w-4 h-4 border-2 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin mr-1.5"></div>
                    )}
                    {uploadStatus === 'complete' && (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-1.5" />
                    )}
                    {uploadStatus === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mr-1.5" />
                    )}
                    <span className="text-gray-700 dark:text-gray-300">
                      {uploadStatus === 'uploading' && 'Uploading...'}
                      {uploadStatus === 'processing' && 'Processing...'}
                      {uploadStatus === 'complete' && 'Upload complete'}
                      {uploadStatus === 'error' && 'Upload failed'}
                    </span>
                  </div>
                  {uploadStatus !== 'complete' && uploadStatus !== 'error' && (
                    <span className="text-primary-600 dark:text-primary-400 font-medium">{uploadProgress}%</span>
                  )}
                </div>
                
                {uploadStatus !== 'complete' && uploadStatus !== 'error' && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-primary-600 dark:bg-primary-500 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Usage Instructions */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Video Guidelines</h4>
            <ul className="mt-1 text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Keep videos under 5 minutes for best engagement</li>
              <li>• Supported formats: MP4, WebM, QuickTime</li>
              <li>• Maximum file size: {maxSizeMB}MB</li>
              <li>• Videos will be processed for optimal playback on all devices</li>
              <li>• Ensure you have permission to share all content in your video</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;
import React, { useState } from 'react';
import { X, Image, Video, Award, Send, Hash, TrendingUp, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import VideoUploader from './VideoUploader';
import { useAuth } from '../contexts/AuthContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    content: string;
    media?: { type: string; url: string; thumbnail?: string }[];
    tags: string[];
    vertical: string;
    achievement?: { title: string; description: string; icon: string };
  }) => Promise<{ success: boolean; error?: string }>;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'text' | 'photo' | 'video' | 'achievement'>('text');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [vertical, setVertical] = useState(user?.serviceAreas?.[0] || 'MaiHealth');
  const [media, setMedia] = useState<{ type: string; url: string; thumbnail?: string }[]>([]);
  const [achievement, setAchievement] = useState<{ title: string; description: string; icon: string } | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setUploading(true);
    
    try {
      const result = await onSubmit({
        content,
        media: media.length > 0 ? media : undefined,
        tags,
        vertical,
        achievement: achievement || undefined
      });
      
      if (result.success) {
        // Reset form
        setContent('');
        setTags([]);
        setTagInput('');
        setVertical(user?.serviceAreas?.[0] || 'MaiHealth');
        setMedia([]);
        setAchievement(null);
        setSelectedVideoFile(null);
        setSelectedImageFile(null);
        setImagePreview(null);
        setActiveTab('text');
        
        onClose();
      } else {
        console.error('Error creating post:', result.error);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      
      // Create preview for immediate display
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
          // For demo purposes, we'll use the preview URL as the media URL
          setMedia([{ type: 'image', url: event.target.result as string }]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (file: File | null) => {
    setSelectedVideoFile(file);
  };

  const handleVideoUploadComplete = (videoUrl: string, thumbnailUrl: string) => {
    setMedia([{ type: 'video', url: videoUrl, thumbnail: thumbnailUrl }]);
  };

  const handleAchievementSelect = (achievementType: string) => {
    const mockAchievements = {
      'health': { title: 'Health Milestone', description: '+15 Health Score', icon: 'heart' },
      'money': { title: 'Savings Goal Reached', description: '£10,000 Emergency Fund', icon: 'trending-up' },
      'style': { title: 'Style Transformation', description: '92% Style Score', icon: 'sparkles' },
      'home': { title: 'Energy Efficiency', description: '22% Reduction', icon: 'zap' }
    };
    
    const achievementData = mockAchievements[achievementType as keyof typeof mockAchievements];
    setAchievement(achievementData);
  };

  const removeMedia = () => {
    setMedia([]);
    setSelectedImageFile(null);
    setSelectedVideoFile(null);
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create Post</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Tab Selection */}
          <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'text'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Send className="w-4 h-4 mr-2" />
              Text
            </button>
            <button
              onClick={() => setActiveTab('photo')}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'photo'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Image className="w-4 h-4 mr-2" />
              Photo
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'video'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-4 h-4 mr-2" />
              Video
            </button>
            <button
              onClick={() => setActiveTab('achievement')}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'achievement'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 mr-2" />
              Achievement
            </button>
          </div>

          {/* Content Input */}
          <div className="mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Tab Content */}
          {activeTab === 'photo' && (
            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">Click to upload an image</p>
                </label>
              </div>
              
              {imagePreview && (
                <div className="mt-4 relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <button
                    onClick={removeMedia}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'video' && (
            <div className="mb-6">
              <VideoUploader
                onVideoSelect={handleVideoSelect}
                onUploadComplete={handleVideoUploadComplete}
                maxSizeMB={50}
              />
            </div>
          )}

          {activeTab === 'achievement' && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Select an Achievement</h4>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAchievementSelect('health')}
                  className={`p-4 border rounded-lg text-left transition-colors duration-200 ${
                    achievement?.icon === 'heart'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 dark:text-green-400">❤️</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Health Milestone</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">+15 Health Score</p>
                </button>

                <button
                  onClick={() => handleAchievementSelect('money')}
                  className={`p-4 border rounded-lg text-left transition-colors duration-200 ${
                    achievement?.icon === 'trending-up'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                      <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Savings Goal</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">£10,000 Emergency Fund</p>
                </button>

                <button
                  onClick={() => handleAchievementSelect('style')}
                  className={`p-4 border rounded-lg text-left transition-colors duration-200 ${
                    achievement?.icon === 'sparkles'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-600 dark:text-purple-400">✨</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Style Transformation</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">92% Style Score</p>
                </button>

                <button
                  onClick={() => handleAchievementSelect('home')}
                  className={`p-4 border rounded-lg text-left transition-colors duration-200 ${
                    achievement?.icon === 'zap'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-3">
                      <span className="text-orange-600 dark:text-orange-400">⚡</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Energy Efficiency</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">22% Reduction</p>
                </button>
              </div>

              {achievement && (
                <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
                    <span className="font-medium text-primary-900 dark:text-primary-100">
                      Selected: {achievement.title}
                    </span>
                  </div>
                  <p className="text-sm text-primary-800 dark:text-primary-200 mt-1">
                    {achievement.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Vertical Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={vertical}
              onChange={(e) => setVertical(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="MaiHealth">MaiHealth</option>
              <option value="MaiMoney">MaiMoney</option>
              <option value="MaiStyle">MaiStyle</option>
              <option value="MaiHome">MaiHome</option>
            </select>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add a tag"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleAddTag}
                className="ml-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {content.length}/500 characters
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || uploading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
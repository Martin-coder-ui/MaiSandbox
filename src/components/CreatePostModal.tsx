import React, { useState } from 'react';
import { X, Image, Video, Award, Send, Hash } from 'lucide-react';
import VideoUploader from './VideoUploader';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    content: string;
    media?: { type: string; url: string; thumbnail?: string }[];
    tags: string[];
    vertical: string;
    achievement?: { title: string; description: string; icon: string };
  }) => void;
  user: any;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit, user }) => {
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

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!content.trim()) return;
    
    onSubmit({
      content,
      media: media.length > 0 ? media : undefined,
      tags,
      vertical,
      achievement: achievement || undefined
    });
    
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
    
    onClose();
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
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
          
          // In a real app, you would upload the image to a server
          // For now, we'll just use the preview URL
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
    // In a real app, this would fetch achievement data from the user's profile
    // For now, we'll use mock data
    const mockAchievements = {
      'health': { title: 'Health Milestone', description: '+15 Health Score', icon: 'heart' },
      'money': { title: 'Savings Goal Reached', description: '£10,000 Emergency Fund', icon: 'trending-up' },
      'style': { title: 'Style Transformation', description: '92% Style Score', icon: 'sparkles' },
      'home': { title: 'Energy Efficiency', description: '22% Reduction', icon: 'zap' }
    };
    
    setAchievement(mockAchievements[achievementType as keyof typeof mockAchievements]);
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
        
        {/* Tabs */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex space-x-1">
          <button 
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeTab === 'text' 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Text
          </button>
          <button 
            onClick={() => setActiveTab('photo')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeTab === 'photo' 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Image className="w-4 h-4 mr-1.5" />
            Photo
          </button>
          <button 
            onClick={() => setActiveTab('video')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeTab === 'video' 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Video className="w-4 h-4 mr-1.5" />
            Video
          </button>
          <button 
            onClick={() => setActiveTab('achievement')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeTab === 'achievement' 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Award className="w-4 h-4 mr-1.5" />
            Achievement
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src={user?.type === 'provider' 
                  ? 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150' 
                  : 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'} 
                alt={user?.name || 'User'} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
              <div className="flex items-center space-x-2">
                <select
                  value={vertical}
                  onChange={(e) => setVertical(e.target.value)}
                  className="text-xs bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-gray-700 dark:text-gray-300"
                >
                  {user?.serviceAreas?.map((area: string) => (
                    <option key={area} value={area}>{area}</option>
                  )) || (
                    <>
                      <option value="MaiHealth">MaiHealth</option>
                      <option value="MaiMoney">MaiMoney</option>
                      <option value="MaiStyle">MaiStyle</option>
                      <option value="MaiHome">MaiHome</option>
                    </>
                  )}
                </select>
                <span className="text-xs text-gray-500 dark:text-gray-400">Public</span>
              </div>
            </div>
          </div>
          
          {/* Text Content */}
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What would you like to share?"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-colors duration-200"
              rows={4}
            />
          </div>
          
          {/* Media Content */}
          {activeTab === 'photo' && (
            <div className="mb-4">
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-auto"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedImageFile(null);
                      setMedia([]);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Image className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Drag and drop an image, or click to select
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 cursor-pointer"
                  >
                    Select Image
                  </label>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'video' && (
            <div className="mb-4">
              <VideoUploader 
                onVideoSelect={handleVideoSelect}
                onUploadComplete={handleVideoUploadComplete}
              />
            </div>
          )}
          
          {activeTab === 'achievement' && (
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAchievementSelect('health')}
                  className={`p-4 rounded-lg border transition-colors duration-200 text-left ${
                    achievement?.title === 'Health Milestone'
                      ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Health Milestone</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">+15 Health Score</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleAchievementSelect('money')}
                  className={`p-4 rounded-lg border transition-colors duration-200 text-left ${
                    achievement?.title === 'Savings Goal Reached'
                      ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Savings Goal Reached</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">£10,000 Emergency Fund</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleAchievementSelect('style')}
                  className={`p-4 rounded-lg border transition-colors duration-200 text-left ${
                    achievement?.title === 'Style Transformation'
                      ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Style Transformation</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">92% Style Score</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleAchievementSelect('home')}
                  className={`p-4 rounded-lg border transition-colors duration-200 text-left ${
                    achievement?.title === 'Energy Efficiency'
                      ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Energy Efficiency</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">22% Reduction</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
          
          {/* Tags */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Hash className="w-5 h-5 text-gray-500" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Tags</h4>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add tags (press Enter or comma to add)"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 mr-3"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="w-4 h-4 mr-1.5" />
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
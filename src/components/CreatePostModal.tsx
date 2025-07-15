import React, { useState } from 'react';
import { X, Image, Video, Award, Send, Hash, TrendingUp } from 'lucide-react';
import VideoUploader from './VideoUploader';
import { supabase, socialApi } from '../lib/supabase';

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
    
    try {
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
    } catch (error) {
      console.error('Error submitting post:', error);
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

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      
      try {
        // Create preview for immediate display
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImagePreview(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
        
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `images/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('social-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) throw error;
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('social-media')
          .getPublicUrl(filePath);
        
        // Update media state with the actual URL
        if (urlData) {
          setMedia([{ type: 'image', url: urlData.publicUrl }]);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleVideoSelect = (file: File | null) => {
    setSelectedVideoFile(file);
  };

  const handleVideoUploadComplete = (videoUrl: string, thumbnailUrl: string) => {
    setMedia([{ type: 'video', url: videoUrl, thumbnail: thumbnailUrl }]);
  };

  const handleAchievementSelect = async (achievementType: string) => {
    try {
      if (!user) return;
      
      // Check if the achievement already exists in the database
      const { data, error } = await supabase
        .from('social_achievements')
        .select('*')
        .eq('user_id', user.id)
        .eq('vertical', `Mai${achievementType.charAt(0).toUpperCase() + achievementType.slice(1)}`)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Use existing achievement
        setAchievement(data[0]);
      } else {
        // Create a new achievement
        const mockAchievements = {
          'health': { title: 'Health Milestone', description: '+15 Health Score', icon: 'heart' },
          'money': { title: 'Savings Goal Reached', description: '£10,000 Emergency Fund', icon: 'trending-up' },
          'style': { title: 'Style Transformation', description: '92% Style Score', icon: 'sparkles' },
          'home': { title: 'Energy Efficiency', description: '22% Reduction', icon: 'zap' }
        };
        
        const achievementData = mockAchievements[achievementType as keyof typeof mockAchievements];
        const vertical = `Mai${achievementType.charAt(0).toUpperCase() + achievementType.slice(1)}` as 'MaiHealth' | 'MaiMoney' | 'MaiStyle' | 'MaiHome';
        
        const newAchievement = await socialApi.createAchievement(
          user.id,
          achievementData.title,
          achievementData.description,
          achievementData.icon,
          vertical
        );
        
        setAchievement(newAchievement);
      }
    } catch (error) {
      console.error('Error handling achievement selection:', error);
    }
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
        
        {/* Rest of the component JSX */}
      </div>
    </div>
  );
};

export default CreatePostModal;
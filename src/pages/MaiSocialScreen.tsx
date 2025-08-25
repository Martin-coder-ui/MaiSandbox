import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { useGeolocation } from "../hooks/useGeolocation";
import { useMaiSocial } from "../hooks/useMaiSocial";
import { useToast } from "../hooks/useToast";
import CreatePostModal from "../components/CreatePostModal";
import CommentSection from "../components/CommentSection";
import UserProfile from "../components/UserProfile";
import InteractiveCard from "../components/ui/InteractiveCard";
import AnimatedButton from "../components/ui/AnimatedButton";
import AnimatedIcon from "../components/ui/AnimatedIcon";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Bookmark, 
  Camera, 
  Video, 
  Image, 
  Smile, 
  Users, 
  TrendingUp, 
  Award, 
  Filter, 
  ChevronDown, 
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  X,
  Sparkles
} from "lucide-react";

export default function MaiSocialScreen() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { location } = useGeolocation();
  const { posts, loading, createPostFromModal, likePost, savePost, addComment, sharePost } = useMaiSocial(user);
  const { success, error, info } = useToast();
  const [activeTab, setActiveTab] = useState<'feed' | 'discover' | 'saved'>('feed');
  const [activeFilter, setActiveFilter] = useState<'all' | 'health' | 'money' | 'style' | 'home'>('all');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handleCreatePost = async (postData: any) => {
    const result = await createPostFromModal(postData);
    if (result.success) {
      success('Post created!', 'Your post has been shared with the community.');
    } else {
      error('Failed to create post', result.error);
    }
    return result;
  };

  const handleVideoClick = (videoUrl: string) => {
    setCurrentVideo(videoUrl);
    setShowVideoModal(true);
    setIsPlaying(true);
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setCurrentVideo(null);
    setIsPlaying(false);
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleLike = async (postId: string) => {
    const wasLiked = likedPosts.has(postId);
    
    // Optimistic update
    if (wasLiked) {
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      setLikedPosts(prev => new Set(prev).add(postId));
      // Trigger heart animation
      const heartElement = document.querySelector(`[data-post-id="${postId}"] .heart-icon`);
      if (heartElement) {
        heartElement.classList.add('heart-animation');
        setTimeout(() => heartElement.classList.remove('heart-animation'), 600);
      }
    }
    
    const result = await likePost(postId);
    if (!result.success) {
      // Revert optimistic update on failure
      if (wasLiked) {
        setLikedPosts(prev => new Set(prev).add(postId));
      } else {
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
      error('Failed to like post', result.error);
    }
  };

  const handleShare = async (postId: string) => {
    const result = await sharePost(postId);
    if (result.success) {
      info('Post shared!', 'The post has been shared successfully.');
    } else {
      error('Failed to share post', result.error);
    }
  };

  const handleSave = async (postId: string) => {
    const wasSaved = savedPosts.has(postId);
    
    // Optimistic update
    if (wasSaved) {
      setSavedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      setSavedPosts(prev => new Set(prev).add(postId));
    }
    
    const result = await savePost(postId);
    if (result.success) {
      info(wasSaved ? 'Post unsaved' : 'Post saved!', wasSaved ? 'Removed from your saved posts.' : 'Added to your saved posts.');
    } else {
      // Revert optimistic update on failure
      if (wasSaved) {
        setSavedPosts(prev => new Set(prev).add(postId));
      } else {
        setSavedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
      error('Failed to save post', result.error);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(post => {
        if (activeFilter === 'health') return post.vertical === 'MaiHealth';
        if (activeFilter === 'money') return post.vertical === 'MaiMoney';
        if (activeFilter === 'style') return post.vertical === 'MaiStyle';
        if (activeFilter === 'home') return post.vertical === 'MaiHome';
        return true;
      });

  // Role-aware content
  const isProvider = profile?.type === 'provider';
  const isClient = profile?.type === 'client';

  // Loading skeleton for posts
  const renderPostSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <LoadingSkeleton width="w-10" height="h-10" rounded />
        <div className="space-y-2 flex-1">
          <LoadingSkeleton width="w-32" height="h-4" />
          <LoadingSkeleton width="w-24" height="h-3" />
        </div>
      </div>
      <LoadingSkeleton count={3} height="h-4" />
      <LoadingSkeleton width="w-full" height="h-48" />
      <div className="flex justify-between">
        <LoadingSkeleton width="w-16" height="h-8" />
        <LoadingSkeleton width="w-16" height="h-8" />
        <LoadingSkeleton width="w-16" height="h-8" />
        <LoadingSkeleton width="w-16" height="h-8" />
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-4 text-gray-900 dark:text-white animate-slide-in-up">
          MaiSocial
        </h1>
        {isProvider ? (
          <p className="text-gray-600 dark:text-gray-300 text-lg animate-slide-in-up stagger-1">
            Connect with clients and fellow providers, share expertise, and grow your practice.
          </p>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-lg animate-slide-in-up stagger-1">
            Connect with the Mai community, share your achievements, and learn from others.
          </p>
        )}
        
        {/* Context Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-in-up stagger-2">
          {user && (
            <InteractiveCard className="p-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800" hover={false} glow>
              <p className="text-sm text-primary-800 dark:text-primary-200 flex items-center">
                <AnimatedIcon icon={Users} size={16} animation="float" trigger="always" className="mr-1.5 text-primary-500" />
                <strong className="font-semibold">Welcome:</strong> {user.name} {isProvider && '(Provider)'}
              </p>
            </InteractiveCard>
          )}
          
          {location && (
            <InteractiveCard className="p-4 bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-800" hover={false} glow>
              <p className="text-sm text-secondary-800 dark:text-secondary-200 flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <strong className="font-semibold">Community:</strong> {location.city}, {location.region}
              </p>
            </InteractiveCard>
          )}
          
          <InteractiveCard className="p-4 bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800" hover={false} glow>
            <p className="text-sm text-accent-800 dark:text-accent-200 flex items-center">
              <AnimatedIcon icon={TrendingUp} size={16} animation="pulse" trigger="always" className="mr-1.5 text-accent-500" />
              <strong className="font-semibold">Trending:</strong> #HealthGoals #SmartSaving
            </p>
          </InteractiveCard>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6 animate-slide-in-up stagger-3">
          {/* User Profile Card */}
          {user && (
            <InteractiveCard className="overflow-hidden" hover tilt scale glow>
              <div className="h-24 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
              <div className="px-6 pb-6 relative">
                <div className="absolute -top-12 left-6">
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700 transition-transform duration-300 hover:scale-110">
                    <img 
                      src={user.type === 'provider' 
                        ? 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150' 
                        : 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-14">
                  <div className="flex items-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                    {user.type === 'provider' && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 animate-pulse">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified Provider
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {user.type === 'provider' 
                      ? 'Helping clients achieve their health goals' 
                      : 'On a journey to better health and financial wellbeing'}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 transition-all duration-200 hover:scale-105">
                      {user.serviceAreas?.[0] || 'MaiHealth'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200 transition-all duration-200 hover:scale-105">
                      {user.type === 'provider' ? user.specialization || 'Physiotherapy' : '3 Achievements'}
                    </span>
                  </div>
                </div>
              </div>
            </InteractiveCard>
          )}

          {/* Create Post Card */}
          <InteractiveCard className="p-6" hover scale glow>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {isProvider ? 'Share Expertise' : 'Share Something'}
            </h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden transition-transform duration-300 hover:scale-110">
                <img 
                  src={user?.type === 'provider' 
                    ? 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150' 
                    : 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'} 
                  alt="Your avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder={isProvider ? "Share tips, insights, or client success stories..." : "What's on your mind?"} 
                  onClick={() => setShowCreateModal(true)}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <AnimatedButton variant="ghost" size="sm" icon={Image} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                <span className="text-sm text-gray-700 dark:text-gray-300">Photo</span>
              </AnimatedButton>
              <AnimatedButton variant="ghost" size="sm" icon={Video} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                <span className="text-sm text-gray-700 dark:text-gray-300">Video</span>
              </AnimatedButton>
              {isClient && (
                <AnimatedButton variant="ghost" size="sm" icon={Award} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Achievement</span>
                </AnimatedButton>
              )}
            </div>
          </InteractiveCard>

          {/* Trending Topics */}
          <InteractiveCard className="p-6" hover scale>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trending Topics</h3>
              <AnimatedIcon icon={TrendingUp} animation="pulse" trigger="always" className="text-primary-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-all duration-200">
                <div className="flex items-center space-x-2">
                  <span className="text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">#HealthGoals</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">1.2k posts</span>
              </div>
              <div className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-all duration-200">
                <div className="flex items-center space-x-2">
                  <span className="text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">#SmartSaving</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">856 posts</span>
              </div>
              <div className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-all duration-200">
                <div className="flex items-center space-x-2">
                  <span className="text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">#SummerStyle</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">743 posts</span>
              </div>
              <div className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-all duration-200">
                <div className="flex items-center space-x-2">
                  <span className="text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">#SmartHome</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">621 posts</span>
              </div>
              <div className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-all duration-200">
                <div className="flex items-center space-x-2">
                  <span className="text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">#MindfulMonday</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">512 posts</span>
              </div>
            </div>
          </InteractiveCard>

          {/* Suggested Connections */}
          <InteractiveCard className="p-6" hover scale>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isProvider ? 'Connect with Clients' : 'Suggested Connections'}
              </h3>
              <AnimatedIcon icon={Users} animation="float" trigger="always" className="text-primary-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-110">
                    <img 
                      src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150"
                      alt="Lisa Rodriguez"
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handleUserClick('user1')}
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => handleUserClick('user1')}
                      className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group-hover:translate-x-1"
                    >
                      {isProvider ? 'Emma Thompson' : 'Lisa Rodriguez'}
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isProvider ? 'Potential Client - MaiHealth' : 'Financial Advisor'}
                    </p>
                  </div>
                </div>
                <AnimatedButton variant="ghost" size="sm" className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50">
                  Connect
                </AnimatedButton>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150"
                      alt="David Parker"
                      className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
                      onClick={() => handleUserClick('user2')}
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => handleUserClick('user2')}
                      className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      {isProvider ? 'James Wilson' : 'David Parker'}
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isProvider ? 'Potential Client - MaiMoney' : 'Smart Home Enthusiast'}
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors duration-200">
                  Connect
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
                      alt="Maria Santos"
                      className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
                      onClick={() => handleUserClick('user3')}
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => handleUserClick('user3')}
                      className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      {isProvider ? 'Sophie Chen' : 'Maria Santos'}
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isProvider ? 'Potential Client - MaiStyle' : 'Personal Stylist'}
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors duration-200">
                  Connect
                </button>
              </div>
            </div>
            <AnimatedButton variant="ghost" className="w-full mt-4 text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300">
              {isProvider ? 'View All Potential Clients' : 'View More'}
            </AnimatedButton>
          </InteractiveCard>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6 animate-slide-in-up stagger-4">
          {/* Tabs and Filters */}
          <InteractiveCard className="p-4" hover>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex space-x-1">
                <AnimatedButton
                  variant={activeTab === 'feed' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('feed')}
                >
                  My Feed
                </AnimatedButton>
                <AnimatedButton
                  variant={activeTab === 'discover' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('discover')}
                >
                  Discover
                </AnimatedButton>
                <AnimatedButton
                  variant={activeTab === 'saved' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('saved')}
                >
                  Saved
                </AnimatedButton>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
                <div className="relative">
                  <AnimatedButton variant="ghost" size="sm" icon={Filter} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                    <span>
                      {activeFilter === 'all' && 'All Posts'}
                      {activeFilter === 'health' && 'Health'}
                      {activeFilter === 'money' && 'Money'}
                      {activeFilter === 'style' && 'Style'}
                      {activeFilter === 'home' && 'Home'}
                    </span>
                  </AnimatedButton>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 hidden">
                    <div className="py-1">
                      <button 
                        onClick={() => setActiveFilter('all')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        All Posts
                      </button>
                      <button 
                        onClick={() => setActiveFilter('health')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Health
                      </button>
                      <button 
                        onClick={() => setActiveFilter('money')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Money
                      </button>
                      <button 
                        onClick={() => setActiveFilter('style')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Style
                      </button>
                      <button 
                        onClick={() => setActiveFilter('home')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Home
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </InteractiveCard>

          {/* Posts */}
          <div className="space-y-6 animate-slide-in-up stagger-5">
            {loading && (
              <>
                {renderPostSkeleton()}
                {renderPostSkeleton()}
                {renderPostSkeleton()}
              </>
            )}
            {filteredPosts.map((post) => (
              <InteractiveCard key={post.id} className="overflow-hidden" hover scale data-post-id={post.id}>
                {/* Post Header */}
                <div className="p-4 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden transition-transform duration-300 hover:scale-110">
                      <button
                        onClick={() => handleUserClick(post.userId)}
                        className="w-full h-full"
                      >
                        <img 
                          src={post.userAvatar} 
                          alt={post.userName} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleUserClick(post.userId)}
                          className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:translate-x-1"
                        >
                          {post.userName}
                        </button>
                        {post.userType === 'provider' && (
                          <svg className="w-4 h-4 ml-1 text-primary-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 transition-all duration-200 hover:scale-105">
                          {post.userBadge || post.vertical}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110 hover:rotate-90">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Achievement Badge (if present) */}
                {post.achievement && (
                  <div className="px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-y border-primary-100 dark:border-primary-800 animate-slide-in-down">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mr-3 animate-bounce-slow">
                        {post.achievement.icon === 'award' && <Award className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                        {post.achievement.icon === 'trending-up' && <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                        {post.achievement.icon === 'sparkles' && <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                        {post.achievement.icon === 'zap' && <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{post.achievement.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{post.achievement.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Post Content */}
                <div className="p-4">
                  <p className="text-gray-900 dark:text-white mb-4 whitespace-pre-line">{post.content}</p>
                  
                  {/* Post Media */}
                  {post.media && post.media.length > 0 && (
                    <div className="mb-4">
                      {post.media[0].type === 'image' ? (
                        <img 
                          src={post.media[0].url} 
                          alt="Post media" 
                          className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
                        />
                      ) : (
                        <div 
                          className="relative w-full rounded-lg overflow-hidden cursor-pointer group transition-transform duration-300 hover:scale-105"
                          onClick={() => handleVideoClick(post.media[0].url)}
                        >
                          <img 
                            src={post.media[0].thumbnail} 
                            alt="Video thumbnail" 
                            className="w-full h-auto"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all duration-200">
                            <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <AnimatedIcon icon={Play} animation="pulse" trigger="always" className="text-primary-600 ml-1" size={32} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 transition-all duration-200 hover:scale-110 hover:bg-primary-100 hover:text-primary-800 dark:hover:bg-primary-900/30 dark:hover:text-primary-200 cursor-pointer">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Post Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Heart className={`w-4 h-4 heart-icon transition-all duration-200 ${(post.liked || likedPosts.has(post.id)) ? 'text-red-500 fill-current' : ''}`} />
                      <span>{post.stats.likes}</span>
                    </div>
                    <div className="flex space-x-4">
                      <span>{post.stats.comments} comments</span>
                      <span>{post.stats.shares} shares</span>
                    </div>
                  </div>
                </div>
                
                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    icon={Heart}
                    onClick={() => handleLike(post.id)}
                    className={`transition-all duration-200 ${
                      (post.liked || likedPosts.has(post.id))
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>Like</span>
                  </AnimatedButton>
                  
                  <CommentSection
                    postId={post.id}
                    isExpanded={expandedComments.has(post.id)}
                    onToggle={() => toggleComments(post.id)}
                    commentCount={post.stats.comments}
                  />
                  
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    icon={Share2}
                    onClick={() => handleShare(post.id)}
                  >
                    <span>Share</span>
                  </AnimatedButton>
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    icon={Bookmark}
                    onClick={() => handleSave(post.id)}
                    className={`transition-all duration-200 ${
                      (post.saved || savedPosts.has(post.id))
                        ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>Save</span>
                  </AnimatedButton>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
      />

      {/* User Profile Modal */}
      {selectedUserId && (
        <UserProfile
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}

      {/* Video Modal */}
      {showVideoModal && currentVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden animate-scale-in">
            <button 
              onClick={handleCloseVideoModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
            
            <video
              ref={videoRef}
              src={currentVideo}
              className="w-full h-auto"
              autoPlay
              controls={false}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={togglePlayPause}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-200 hover:scale-110"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <button 
                    onClick={toggleMute}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-200 hover:scale-110"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
                <button 
                  onClick={handleFullscreen}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-200 hover:scale-110"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
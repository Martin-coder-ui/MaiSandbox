import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { useGeolocation } from "../hooks/useGeolocation";
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
  const [activeTab, setActiveTab] = useState<'feed' | 'discover' | 'saved'>('feed');
  const [activeFilter, setActiveFilter] = useState<'all' | 'health' | 'money' | 'style' | 'home'>('all');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Sample posts data - in a real app, this would come from an API
  const posts = [
    {
      id: 'post1',
      user: {
        id: 'user1',
        name: 'Emma Thompson',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
        isVerified: true,
        type: 'client',
        badge: 'MaiHealth'
      },
      content: "Just completed my 30-day fitness challenge! My health score is up by 15 points and I'm feeling amazing. Thanks to Dr. Sarah for the personalized exercise plan that worked with my schedule.",
      media: [
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      ],
      stats: {
        likes: 42,
        comments: 8,
        shares: 3
      },
      timestamp: '2 hours ago',
      tags: ['fitness', 'health', 'achievement'],
      vertical: 'MaiHealth',
      achievement: {
        title: 'Fitness Milestone',
        description: '+15 Health Score',
        icon: 'award'
      },
      liked: false
    },
    {
      id: 'post2',
      user: {
        id: 'provider1',
        name: 'Dr. Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150',
        isVerified: true,
        type: 'provider',
        badge: 'Physiotherapist'
      },
      content: "Here's a quick video guide on proper stretching techniques for lower back pain. These exercises are perfect for anyone who sits at a desk all day. Remember to move slowly and never push through pain!",
      media: [
        {
          type: 'video',
          url: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f62a23f12c45a9e696a6f31faa46a38274&profile_id=139&oauth2_token_id=57447761',
          thumbnail: 'https://images.pexels.com/photos/4498404/pexels-photo-4498404.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      ],
      stats: {
        likes: 87,
        comments: 23,
        shares: 15
      },
      timestamp: '1 day ago',
      tags: ['backpain', 'stretching', 'physiotherapy'],
      vertical: 'MaiHealth',
      liked: true
    },
    {
      id: 'post3',
      user: {
        id: 'user2',
        name: 'James Wilson',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        isVerified: false,
        type: 'client',
        badge: 'MaiMoney'
      },
      content: "Just hit my emergency fund goal of £10,000! 🎉 It took 8 months of consistent saving and some smart budget adjustments suggested by MaiMoney. Now moving on to my house deposit goal!",
      media: [
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/47344/dollar-currency-money-us-dollar-47344.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      ],
      stats: {
        likes: 56,
        comments: 12,
        shares: 4
      },
      timestamp: '3 days ago',
      tags: ['savings', 'finance', 'goals'],
      vertical: 'MaiMoney',
      achievement: {
        title: 'Savings Goal Reached',
        description: '£10,000 Emergency Fund',
        icon: 'trending-up'
      },
      liked: false
    },
    {
      id: 'post4',
      user: {
        id: 'provider2',
        name: 'Lisa Rodriguez',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
        isVerified: true,
        type: 'provider',
        badge: 'Financial Advisor'
      },
      content: "I've created a video explaining the basics of index fund investing for beginners. This strategy has helped many of my clients build wealth consistently over time with minimal effort.",
      media: [
        {
          type: 'video',
          url: 'https://player.vimeo.com/external/552781899.sd.mp4?s=5af0d4d2a9f4a54d4c8d3ce3b3d4927c3e2a3f1d&profile_id=165&oauth2_token_id=57447761',
          thumbnail: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      ],
      stats: {
        likes: 124,
        comments: 31,
        shares: 42
      },
      timestamp: '1 week ago',
      tags: ['investing', 'finance', 'education'],
      vertical: 'MaiMoney',
      liked: false
    },
    {
      id: 'post5',
      user: {
        id: 'user3',
        name: 'Sophie Chen',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
        isVerified: false,
        type: 'client',
        badge: 'MaiStyle'
      },
      content: "My style score is now 92%! 🎉 The capsule wardrobe recommendations from MaiStyle have completely transformed my closet. Fewer pieces but so many more outfit combinations!",
      media: [
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/5705506/pexels-photo-5705506.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      ],
      stats: {
        likes: 78,
        comments: 14,
        shares: 6
      },
      timestamp: '2 days ago',
      tags: ['fashion', 'style', 'capsulewardrobe'],
      vertical: 'MaiStyle',
      achievement: {
        title: 'Style Transformation',
        description: '92% Style Score',
        icon: 'sparkles'
      },
      liked: true
    },
    {
      id: 'post6',
      user: {
        id: 'provider3',
        name: 'Maria Santos',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        isVerified: true,
        type: 'provider',
        badge: 'Personal Stylist'
      },
      content: "Check out this video on how to style one dress in 5 different ways! Perfect for travel or minimalist wardrobes. Which look is your favorite?",
      media: [
        {
          type: 'video',
          url: 'https://player.vimeo.com/external/517090081.sd.mp4?s=ce51c3c1b8a39b407f335568a9c93c3ad33c8336&profile_id=165&oauth2_token_id=57447761',
          thumbnail: 'https://images.pexels.com/photos/7691441/pexels-photo-7691441.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      ],
      stats: {
        likes: 103,
        comments: 27,
        shares: 19
      },
      timestamp: '5 days ago',
      tags: ['fashion', 'styling', 'minimalism'],
      vertical: 'MaiStyle',
      liked: false
    },
    {
      id: 'post7',
      user: {
        id: 'user4',
        name: 'David Parker',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
        isVerified: false,
        type: 'client',
        badge: 'MaiHome'
      },
      content: "Just finished setting up my smart home system with MaiHome's recommendations. Energy usage is down 22% and the automation routines are a game-changer! Here's a video tour of the setup.",
      media: [
        {
          type: 'video',
          url: 'https://player.vimeo.com/external/477260959.sd.mp4?s=c3c2df2c921f51783a3b84579eca9ed7e6f9208d&profile_id=165&oauth2_token_id=57447761',
          thumbnail: 'https://images.pexels.com/photos/3952034/pexels-photo-3952034.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      ],
      stats: {
        likes: 64,
        comments: 18,
        shares: 7
      },
      timestamp: '1 week ago',
      tags: ['smarthome', 'automation', 'energy'],
      vertical: 'MaiHome',
      achievement: {
        title: 'Energy Efficiency',
        description: '22% Reduction',
        icon: 'zap'
      },
      liked: false
    }
  ];

  const handleLike = (postId: string) => {
    // In a real app, this would call an API to like/unlike the post
    console.log(`Liked post ${postId}`);
  };

  const handleComment = (postId: string) => {
    // In a real app, this would open a comment modal or focus a comment input
    console.log(`Comment on post ${postId}`);
  };

  const handleShare = (postId: string) => {
    // In a real app, this would open a share modal
    console.log(`Share post ${postId}`);
  };

  const handleSave = (postId: string) => {
    // In a real app, this would call an API to save/unsave the post
    console.log(`Saved post ${postId}`);
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

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-4 text-gray-900 dark:text-white">
          MaiSocial
        </h1>
        {isProvider ? (
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Connect with clients and fellow providers, share expertise, and grow your practice.
          </p>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Connect with the Mai community, share your achievements, and learn from others.
          </p>
        )}
        
        {/* Context Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {user && (
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 shadow-sm">
              <p className="text-sm text-primary-800 dark:text-primary-200 flex items-center">
                <Users className="w-4 h-4 mr-1.5 text-primary-500" />
                <strong className="font-semibold">Welcome:</strong> {user.name} {isProvider && '(Provider)'}
              </p>
            </div>
          )}
          
          {location && (
            <div className="p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg border border-secondary-200 dark:border-secondary-800 shadow-sm">
              <p className="text-sm text-secondary-800 dark:text-secondary-200 flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <strong className="font-semibold">Community:</strong> {location.city}, {location.region}
              </p>
            </div>
          )}
          
          <div className="p-4 bg-accent-50 dark:bg-accent-900/20 rounded-lg border border-accent-200 dark:border-accent-800 shadow-sm">
            <p className="text-sm text-accent-800 dark:text-accent-200 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1.5 text-accent-500" />
              <strong className="font-semibold">Trending:</strong> #HealthGoals #SmartSaving
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Profile Card */}
          {user && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
              <div className="px-6 pb-6 relative">
                <div className="absolute -top-12 left-6">
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700">
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
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                      {user.serviceAreas?.[0] || 'MaiHealth'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200">
                      {user.type === 'provider' ? user.specialization || 'Physiotherapy' : '3 Achievements'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Create Post Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {isProvider ? 'Share Expertise' : 'Share Something'}
            </h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
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
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                <Image className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Photo</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                <Video className="w-5 h-5 text-secondary-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Video</span>
              </button>
              {isClient && (
                <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                  <Award className="w-5 h-5 text-accent-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Achievement</span>
                </button>
              )}
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trending Topics</h3>
              <TrendingUp className="w-5 h-5 text-primary-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">#HealthGoals</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">1.2k posts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">#SmartSaving</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">856 posts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">#SummerStyle</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">743 posts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">#SmartHome</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">621 posts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">#MindfulMonday</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">512 posts</span>
              </div>
            </div>
          </div>

          {/* Suggested Connections */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isProvider ? 'Connect with Clients' : 'Suggested Connections'}
              </h3>
              <Users className="w-5 h-5 text-primary-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150" 
                      alt="Lisa Rodriguez" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {isProvider ? 'Emma Thompson' : 'Lisa Rodriguez'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isProvider ? 'Potential Client - MaiHealth' : 'Financial Advisor'}
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
                      src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150" 
                      alt="David Parker" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {isProvider ? 'James Wilson' : 'David Parker'}
                    </p>
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
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {isProvider ? 'Sophie Chen' : 'Maria Santos'}
                    </p>
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
            <button className="w-full mt-4 text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300">
              {isProvider ? 'View All Potential Clients' : 'View More'}
            </button>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex space-x-1">
                <button 
                  onClick={() => setActiveTab('feed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'feed' 
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  My Feed
                </button>
                <button 
                  onClick={() => setActiveTab('discover')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'discover' 
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Discover
                </button>
                <button 
                  onClick={() => setActiveTab('saved')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'saved' 
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Saved
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
                <div className="relative">
                  <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                    <Filter className="w-4 h-4" />
                    <span>
                      {activeFilter === 'all' && 'All Posts'}
                      {activeFilter === 'health' && 'Health'}
                      {activeFilter === 'money' && 'Money'}
                      {activeFilter === 'style' && 'Style'}
                      {activeFilter === 'home' && 'Home'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
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
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Post Header */}
                <div className="p-4 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={post.user.avatar} 
                        alt={post.user.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900 dark:text-white">{post.user.name}</h4>
                        {post.user.isVerified && (
                          <svg className="w-4 h-4 ml-1 text-primary-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          {post.user.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Achievement Badge (if present) */}
                {post.achievement && (
                  <div className="px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-y border-primary-100 dark:border-primary-800">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mr-3">
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
                          className="w-full h-auto rounded-lg"
                        />
                      ) : (
                        <div 
                          className="relative w-full rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => handleVideoClick(post.media[0].url)}
                        >
                          <img 
                            src={post.media[0].thumbnail} 
                            alt="Video thumbnail" 
                            className="w-full h-auto"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all duration-200">
                            <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <Play className="w-8 h-8 text-primary-600 ml-1" />
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
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Post Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Heart className={`w-4 h-4 ${post.liked ? 'text-red-500 fill-current' : ''}`} />
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
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      post.liked 
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                    <span>Like</span>
                  </button>
                  <button 
                    onClick={() => handleComment(post.id)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Comment</span>
                  </button>
                  <button 
                    onClick={() => handleShare(post.id)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                  <button 
                    onClick={() => handleSave(post.id)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Bookmark className="w-5 h-5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && currentVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
            <button 
              onClick={handleCloseVideoModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200"
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
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-200"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <button 
                    onClick={toggleMute}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-200"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
                <button 
                  onClick={handleFullscreen}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-200"
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
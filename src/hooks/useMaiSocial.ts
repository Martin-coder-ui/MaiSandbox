import { useState, useEffect } from 'react';
import { User } from '../contexts/AuthContext';

// Types for social media functionality
export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userType: 'client' | 'provider';
  userBadge?: string;
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  timestamp: Date | string;
  tags: string[];
  vertical: 'MaiHealth' | 'MaiMoney' | 'MaiStyle' | 'MaiHome';
  achievement?: {
    title: string;
    description: string;
    icon: string;
  };
  liked: boolean;
  saved: boolean;
}

export interface SocialComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userType: 'client' | 'provider';
  content: string;
  timestamp: Date | string;
  likes: number;
  liked: boolean;
}

export interface VideoUploadProgress {
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  error?: string;
}

export const useMaiSocial = (user?: User | null) => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<{topic: string, count: number}[]>([]);
  const [suggestedConnections, setSuggestedConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<VideoUploadProgress>({
    status: 'idle',
    progress: 0
  });

  // Fetch posts
  const fetchPosts = async (filter?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated posts data
      const mockPosts: SocialPost[] = [
        // This would be populated from an API
      ];
      
      setPosts(mockPosts);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new post
  const createPost = async (content: string, media?: File[], tags?: string[], vertical?: string, achievement?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would upload media files and create a post via API
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      // In a real app, we would add the new post to the posts state
      setLoading(false);
      return { success: true, postId: 'new-post-id' };
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
      setLoading(false);
      return { success: false, error: 'Failed to create post' };
    }
  };

  // Upload a video with progress tracking
  const uploadVideo = async (videoFile: File, onProgress?: (progress: number) => void) => {
    if (!videoFile) {
      setUploadProgress({
        status: 'error',
        progress: 0,
        error: 'No video file provided'
      });
      return { success: false, error: 'No video file provided' };
    }
    
    // Check file type
    if (!videoFile.type.startsWith('video/')) {
      setUploadProgress({
        status: 'error',
        progress: 0,
        error: 'File is not a video'
      });
      return { success: false, error: 'File is not a video' };
    }
    
    // Check file size (limit to 100MB for example)
    if (videoFile.size > 100 * 1024 * 1024) {
      setUploadProgress({
        status: 'error',
        progress: 0,
        error: 'Video file is too large (max 100MB)'
      });
      return { success: false, error: 'Video file is too large (max 100MB)' };
    }
    
    setUploadProgress({
      status: 'uploading',
      progress: 0
    });
    
    try {
      // In a real app, this would be an API call to upload the video
      // For now, we'll simulate progress updates
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setUploadProgress({
          status: 'uploading',
          progress: i
        });
        if (onProgress) onProgress(i);
      }
      
      // Simulate processing time
      setUploadProgress({
        status: 'processing',
        progress: 100
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate completion
      setUploadProgress({
        status: 'complete',
        progress: 100
      });
      
      // In a real app, this would return the URL of the uploaded video
      return { 
        success: true, 
        videoUrl: 'https://example.com/video.mp4',
        thumbnailUrl: 'https://example.com/thumbnail.jpg'
      };
    } catch (err) {
      setUploadProgress({
        status: 'error',
        progress: 0,
        error: 'Failed to upload video'
      });
      console.error('Error uploading video:', err);
      return { success: false, error: 'Failed to upload video' };
    }
  };

  // Like/unlike a post
  const likePost = async (postId: string) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll update the state directly
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const newLiked = !post.liked;
            return {
              ...post,
              liked: newLiked,
              stats: {
                ...post.stats,
                likes: newLiked ? post.stats.likes + 1 : post.stats.likes - 1
              }
            };
          }
          return post;
        })
      );
      return { success: true };
    } catch (err) {
      console.error('Error liking post:', err);
      return { success: false, error: 'Failed to like post' };
    }
  };

  // Save/unsave a post
  const savePost = async (postId: string) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll update the state directly
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              saved: !post.saved
            };
          }
          return post;
        })
      );
      return { success: true };
    } catch (err) {
      console.error('Error saving post:', err);
      return { success: false, error: 'Failed to save post' };
    }
  };

  // Add a comment to a post
  const addComment = async (postId: string, content: string) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll update the state directly
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              stats: {
                ...post.stats,
                comments: post.stats.comments + 1
              }
            };
          }
          return post;
        })
      );
      return { success: true, commentId: 'new-comment-id' };
    } catch (err) {
      console.error('Error adding comment:', err);
      return { success: false, error: 'Failed to add comment' };
    }
  };

  // Share a post
  const sharePost = async (postId: string) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll update the state directly
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              stats: {
                ...post.stats,
                shares: post.stats.shares + 1
              }
            };
          }
          return post;
        })
      );
      return { success: true };
    } catch (err) {
      console.error('Error sharing post:', err);
      return { success: false, error: 'Failed to share post' };
    }
  };

  // Fetch trending topics
  const fetchTrendingTopics = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulated trending topics
      const mockTrendingTopics = [
        { topic: 'HealthGoals', count: 1243 },
        { topic: 'SmartSaving', count: 856 },
        { topic: 'SummerStyle', count: 743 },
        { topic: 'SmartHome', count: 621 },
        { topic: 'MindfulMonday', count: 512 }
      ];
      
      setTrendingTopics(mockTrendingTopics);
      return { success: true, topics: mockTrendingTopics };
    } catch (err) {
      console.error('Error fetching trending topics:', err);
      return { success: false, error: 'Failed to fetch trending topics' };
    }
  };

  // Fetch suggested connections
  const fetchSuggestedConnections = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulated suggested connections
      const mockConnections = [
        {
          id: 'user1',
          name: 'Lisa Rodriguez',
          avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
          type: 'provider',
          specialization: 'Financial Advisor'
        },
        {
          id: 'user2',
          name: 'David Parker',
          avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
          type: 'client',
          interests: ['Smart Home', 'Technology']
        },
        {
          id: 'user3',
          name: 'Maria Santos',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
          type: 'provider',
          specialization: 'Personal Stylist'
        }
      ];
      
      setSuggestedConnections(mockConnections);
      return { success: true, connections: mockConnections };
    } catch (err) {
      console.error('Error fetching suggested connections:', err);
      return { success: false, error: 'Failed to fetch suggested connections' };
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchTrendingTopics();
      fetchSuggestedConnections();
    }
  }, [user]);

  return {
    posts,
    trendingTopics,
    suggestedConnections,
    loading,
    error,
    uploadProgress,
    fetchPosts,
    createPost,
    uploadVideo,
    likePost,
    savePost,
    addComment,
    sharePost,
    fetchTrendingTopics,
    fetchSuggestedConnections
  };
};
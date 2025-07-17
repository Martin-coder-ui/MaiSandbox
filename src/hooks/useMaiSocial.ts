import { useState, useEffect } from 'react';
import { User } from '../contexts/AuthContext';
import { supabase, socialApi } from '../lib/supabase';

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
  const [realTimeSubscriptions, setRealTimeSubscriptions] = useState<any[]>([]);

  // Fetch posts
  const fetchPosts = async (filter?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const postsData = await socialApi.getPosts(filter);
      
      // Transform the data to match our SocialPost interface
      const formattedPosts: SocialPost[] = postsData.map((post: any) => {
        // Extract media from the post
        const media = post.media ? post.media.map((m: any) => ({
          type: m.media_type,
          url: m.url,
          thumbnail: m.thumbnail_url
        })) : undefined;
        
        // Get like status from separate query for better performance
        const userLiked = false; // Will be updated by separate query
        
        // Get save status from separate query for better performance
        const userSaved = false; // Will be updated by separate query
        
        // Extract tags
        const tags = post.tags ? post.tags.map((t: any) => t.tag.name) : [];
        
        return {
          id: post.id,
          userId: post.user_id,
          userName: post.user?.name || 'Unknown User',
          userAvatar: post.user?.avatar_url || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
          userType: post.user?.type || 'client',
          userBadge: post.user?.badge,
          content: post.content,
          media,
          stats: {
            likes: post.likes_count?.[0]?.count || 0,
            comments: post.comments_count?.[0]?.count || 0,
            shares: 0 // We don't track shares in the database yet
          },
          timestamp: post.created_at,
          tags,
          vertical: post.vertical,
          achievement: post.achievement_id ? {
            title: post.achievement?.title || '',
            description: post.achievement?.description || '',
            icon: post.achievement?.icon || ''
          } : undefined,
          liked: userLiked,
          saved: userSaved
        };
      });
      
      setPosts(formattedPosts);
      
      // Update like and save status for current user
      if (user) {
        await updateUserInteractionStatus(formattedPosts.map(p => p.id));
      }
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update user interaction status (likes, saves) for posts
  const updateUserInteractionStatus = async (postIds: string[]) => {
    if (!user || postIds.length === 0) return;
    
    try {
      // Get user's likes for these posts
      const { data: likes } = await supabase
        .from('social_likes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postIds);
      
      // Get user's saves for these posts
      const { data: saves } = await supabase
        .from('social_saves')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postIds);
      
      const likedPostIds = new Set(likes?.map(l => l.post_id) || []);
      const savedPostIds = new Set(saves?.map(s => s.post_id) || []);
      
      // Update posts with user interaction status
      setPosts(prevPosts =>
        prevPosts.map(post => ({
          ...post,
          liked: likedPostIds.has(post.id),
          saved: savedPostIds.has(post.id)
        }))
      );
    } catch (err) {
      console.error('Error updating user interaction status:', err);
    }
  };

  // Create a new post
  const createPost = async (content: string, media?: File[], tags?: string[], vertical?: string, achievement?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // 1. Upload media files first if any
      let mediaUrls: { type: string; url: string; thumbnail?: string }[] = [];
      
      if (media && media.length > 0) {
        for (const file of media) {
          const isVideo = file.type.startsWith('video/');
          const mediaType = isVideo ? 'video' : 'image';
          
          try {
            // Upload the file to Supabase Storage
            const fileUrl = await socialApi.uploadMedia(file, `${mediaType}s`);
            
            // For videos, we might want to generate a thumbnail
            let thumbnailUrl;
            if (isVideo) {
              // In a real app, you would generate a thumbnail from the video
              // For now, we'll use a placeholder
              thumbnailUrl = 'https://images.pexels.com/photos/3952034/pexels-photo-3952034.jpeg?auto=compress&cs=tinysrgb&w=800';
            }
            
            mediaUrls.push({
              type: mediaType,
              url: fileUrl,
              thumbnail: thumbnailUrl
            });
          } catch (uploadError) {
            console.error('Error uploading media:', uploadError);
            // Continue with other files if one fails
          }
        }
      }
      
      // 2. Create the post
      const post = await socialApi.createPost(
        content,
        user.id,
        vertical || 'MaiHealth',
        achievement?.id
      );
      
      // 3. Add media to the post if any were uploaded
      if (mediaUrls.length > 0 && post) {
        for (const mediaItem of mediaUrls) {
          await socialApi.addPostMedia(
            post.id, 
            mediaItem.type as 'image' | 'video', 
            mediaItem.url, 
            mediaItem.thumbnail
          );
        }
      }
      
      // 4. Add tags if any
      if (tags && tags.length > 0 && post) {
        for (const tagName of tags) {
          // Check if tag exists, create if not
          let tag;
          const { data: existingTags } = await supabase
            .from('social_tags')
            .select('*')
            .eq('name', tagName)
            .limit(1);
          
          if (existingTags && existingTags.length > 0) {
            tag = existingTags[0];
          } else {
            tag = await socialApi.createTag(tagName);
          }
          
          // Add tag to post
          if (tag) {
            await socialApi.addTagToPost(post.id, tag.id);
          }
        }
      }
      
      // 5. Refresh posts to include the new one
      await fetchPosts();
      
      return { success: true, postId: post?.id };
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
      setLoading(false);
      return { success: false, error: 'Failed to create post' };
    }
  };

  // Enhanced createPost function that accepts structured data
  const createPostFromModal = async (postData: {
    content: string;
    media?: { type: string; url: string; thumbnail?: string }[];
    tags: string[];
    vertical: string;
    achievement?: { title: string; description: string; icon: string };
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // 1. Create achievement if provided
      let achievementId;
      if (postData.achievement) {
        const newAchievement = await socialApi.createAchievement(
          user.id,
          postData.achievement.title,
          postData.achievement.description,
          postData.achievement.icon,
          postData.vertical as 'MaiHealth' | 'MaiMoney' | 'MaiStyle' | 'MaiHome'
        );
        achievementId = newAchievement.id;
      }
      
      // 2. Create the post
      const post = await socialApi.createPost(
        postData.content,
        user.id,
        postData.vertical,
        achievementId
      );
      
      // 3. Add media if any
      if (postData.media && postData.media.length > 0 && post) {
        for (const mediaItem of postData.media) {
          // For demo purposes, we'll simulate the media upload
          // In production, the media would already be uploaded to Supabase Storage
          if (mediaItem.url.startsWith('data:')) {
            // This is a base64 data URL from file preview, skip for demo
            console.log('Skipping base64 media upload in demo mode');
          } else {
            await socialApi.addPostMedia(
              post.id, 
              mediaItem.type as 'image' | 'video', 
              mediaItem.url, 
              mediaItem.thumbnail
            );
          }
        }
      }
      
      // 4. Add tags if any
      if (postData.tags && postData.tags.length > 0 && post) {
        for (const tagName of postData.tags) {
          // Check if tag exists, create if not
          let tag;
          const { data: existingTags } = await supabase
            .from('social_tags')
            .select('*')
            .eq('name', tagName)
            .limit(1);
          
          if (existingTags && existingTags.length > 0) {
            tag = existingTags[0];
          } else {
            tag = await socialApi.createTag(tagName);
          }
          
          // Add tag to post
          if (tag) {
            await socialApi.addTagToPost(post.id, tag.id);
          }
        }
      }
      
      // 5. Refresh posts to include the new one
      await fetchPosts();
      
      return { success: true, postId: post?.id };
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
      return { success: false, error: 'Failed to create post' };
    } finally {
      setLoading(false);
    }
  };

  // Upload a video with progress tracking
  const uploadVideoToStorage = async (videoFile: File, onProgress?: (progress: number) => void) => {
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
      // Upload to Supabase Storage
      const filePath = `videos/${Math.random().toString(36).substring(2, 15)}_${videoFile.name}`;
      
      // Upload the file with progress tracking
      const { data, error } = await supabase.storage
        .from('mai-social')
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) {
        throw error;
      }
      
      // Simulate processing time
      setUploadProgress({
        status: 'processing',
        progress: 100
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('mai-social')
        .getPublicUrl(filePath);
      
      // Simulate completion
      setUploadProgress({
        status: 'complete',
        progress: 100
      });
      
      // Generate thumbnail (placeholder for demo)
      const thumbnailUrl = 'https://images.pexels.com/photos/3952034/pexels-photo-3952034.jpeg?auto=compress&cs=tinysrgb&w=800';
      
      return {
        success: true,
        videoUrl: urlData.publicUrl,
        thumbnailUrl: thumbnailUrl
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
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      // Find the post to check if it's already liked
      const post = posts.find(p => p.id === postId);
      if (!post) return { success: false, error: 'Post not found' };
      
      if (post.liked) {
        // Unlike the post
        await socialApi.unlikePost(postId, user.id);
      } else {
        // Like the post
        await socialApi.likePost(postId, user.id);
      }
      
      // Update the local state
      setPosts(prevPosts =>
        prevPosts.map(p => {
          if (p.id === postId) {
            const newLiked = !p.liked;
            return {
              ...p,
              liked: newLiked,
              stats: {
                ...p.stats,
                likes: newLiked ? p.stats.likes + 1 : p.stats.likes - 1
              }
            };
          }
          return p;
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
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      // Find the post to check if it's already saved
      const post = posts.find(p => p.id === postId);
      if (!post) return { success: false, error: 'Post not found' };
      
      if (post.saved) {
        // Unsave the post
        await socialApi.unsavePost(postId, user.id);
      } else {
        // Save the post
        await socialApi.savePost(postId, user.id);
      }
      
      // Update the local state
      setPosts(prevPosts =>
        prevPosts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              saved: !p.saved
            };
          }
          return p;
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
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      // Add the comment to the database
      const comment = await socialApi.addComment(postId, user.id, content);
      
      // Update the local state
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
      
      return { success: true, commentId: comment.id };
    } catch (err) {
      console.error('Error adding comment:', err);
      return { success: false, error: 'Failed to add comment' };
    }
  };

  // Share a post
  const sharePost = async (postId: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
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
      // Use the new getTrendingTags function
      const data = await socialApi.getTrendingTags(5);
      
      const topics = data.map((tag: any) => ({
        topic: tag.name,
        count: tag.usage_count
      }));
      
      setTrendingTopics(topics);
      return { success: true, topics };
    } catch (err) {
      console.error('Error fetching trending topics:', err);
      return { success: false, error: 'Failed to fetch trending topics' };
    }
  };

  // Fetch suggested connections
  const fetchSuggestedConnections = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      // Query the database for users that the current user is not following
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          avatar_url,
          type,
          specialization
        `)
        .neq('id', user.id)
        .not('id', 'in', (subquery) => {
          return subquery
            .from('social_follows')
            .select('following_id')
            .eq('follower_id', user.id);
        })
        .limit(3);
      
      if (error) throw error;
      
      // If no data, use some defaults
      if (!data || data.length === 0) {
        const defaultConnections = [
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
        setSuggestedConnections(defaultConnections);
        return { success: true, connections: defaultConnections };
      }
      
      // Format the data
      const connections = data.map((user: any) => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar_url || 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
        type: user.type || 'client',
        specialization: user.specialization
      }));
      
      setSuggestedConnections(connections);
      return { success: true, connections };
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
      
      // Set up real-time subscriptions
      const subscriptions = [
        // Subscribe to new posts
        socialApi.subscribeToNewPosts((payload) => {
          console.log('New post created:', payload);
          fetchPosts(); // Refresh posts when new ones are created
        }),
        
        // Subscribe to user notifications
        socialApi.subscribeToUserNotifications(user.id, (payload) => {
          console.log('New notification:', payload);
          // Handle new notifications (could show toast, update notification count, etc.)
        })
      ];
      
      setRealTimeSubscriptions(subscriptions);
      
      // Cleanup subscriptions on unmount
      return () => {
        subscriptions.forEach(subscription => {
          if (subscription && typeof subscription.unsubscribe === 'function') {
            subscription.unsubscribe();
          }
        });
      };
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
    createPostFromModal,
    uploadVideo: uploadVideoToStorage,
    likePost,
    savePost,
    addComment,
    sharePost,
    fetchTrendingTopics,
    fetchSuggestedConnections
  };
};
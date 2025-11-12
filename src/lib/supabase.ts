import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ohbpbwrwmhrolwyacfqs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oYnBid3J3bWhyb2x3eWFjZnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDQzODIsImV4cCI6MjA3ODUyMDM4Mn0.oSigX3MAdoBmFuo4SNhNNXSJqRiVfiqLcJYeHkCt5jU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced types for database tables with complete schema
export type SocialPost = {
  id: string;
  user_id: string;
  content: string;
  vertical: 'MaiHealth' | 'MaiMoney' | 'MaiStyle' | 'MaiHome';
  achievement_id?: string;
  is_pinned: boolean;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type SocialPostMedia = {
  id: string;
  post_id: string;
  media_type: 'image' | 'video';
  url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  duration?: number;
  file_size?: number;
  alt_text?: string;
  created_at: string;
};

export type SocialComment = {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  is_edited: boolean;
  edited_at?: string;
  created_at: string;
  updated_at: string;
};

export type SocialLike = {
  id: string;
  user_id: string;
  post_id?: string;
  comment_id?: string;
  created_at: string;
};

export type SocialSave = {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
};

export type SocialTag = {
  id: string;
  name: string;
  description?: string;
  color: string;
  usage_count: number;
  is_trending: boolean;
  created_at: string;
};

export type SocialPostTag = {
  id: string;
  post_id: string;
  tag_id: string;
  created_at: string;
};

export type SocialAchievement = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  icon: string;
  vertical: 'MaiHealth' | 'MaiMoney' | 'MaiStyle' | 'MaiHome';
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  achieved_at: string;
  created_at: string;
};

export type SocialFollow = {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
};

export type SocialNotification = {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'achievement' | 'mention' | 'post_featured';
  actor_id?: string;
  post_id?: string;
  comment_id?: string;
  achievement_id?: string;
  message?: string;
  read: boolean;
  created_at: string;
};

// Helper functions for common operations
export const socialApi = {
  // Posts
  async getPosts(filter?: string) {
    const query = supabase
      .from('social_posts')
      .select(`
        *,
        user:profiles!social_posts_user_id_fkey(id, name, avatar_url, type),
        media:social_post_media(*),
        achievement:social_achievements(*),
        likes_count:social_likes(count),
        comments_count:social_comments(count),
        tags:social_post_tags(
          tag:social_tags(*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (filter && filter !== 'all') {
      query.eq('vertical', filter);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
    
    return data;
  },
  
  async createPost(
    content: string, 
    userId: string, 
    vertical: string, 
    achievementId?: string,
    isPinned: boolean = false,
    isFeatured: boolean = false
  ) {
    const { data, error } = await supabase
      .from('social_posts')
      .insert([
        { 
          content, 
          user_id: userId, 
          vertical,
          achievement_id: achievementId,
          is_pinned: isPinned,
          is_featured: isFeatured
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }
    
    return data[0];
  },
  
  // Media
  async uploadMedia(file: File, folder: string = 'social-media') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('mai-social')
      .upload(filePath, file);
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    const { data: urlData } = supabase.storage
      .from('mai-social')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  },
  
  async addPostMedia(
    postId: string, 
    mediaType: 'image' | 'video', 
    url: string, 
    thumbnailUrl?: string,
    width?: number,
    height?: number,
    duration?: number,
    fileSize?: number,
    altText?: string
  ) {
    const { data, error } = await supabase
      .from('social_post_media')
      .insert([
        { 
          post_id: postId, 
          media_type: mediaType, 
          url,
          thumbnail_url: thumbnailUrl,
          width,
          height,
          duration,
          file_size: fileSize,
          alt_text: altText
        }
      ]);
    
    if (error) {
      console.error('Error adding post media:', error);
      throw error;
    }
    
    return data;
  },
  
  // Likes
  async likePost(postId: string, userId: string) {
    const { data, error } = await supabase
      .from('social_likes')
      .insert([
        { post_id: postId, user_id: userId }
      ]);
    
    if (error) {
      console.error('Error liking post:', error);
      throw error;
    }
    
    return data;
  },
  
  async unlikePost(postId: string, userId: string) {
    const { data, error } = await supabase
      .from('social_likes')
      .delete()
      .match({ post_id: postId, user_id: userId });
    
    if (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
    
    return data;
  },
  
  // Comments
  async addComment(postId: string, userId: string, content: string) {
    const { data, error } = await supabase
      .from('social_comments')
      .insert([
        { post_id: postId, user_id: userId, content }
      ])
      .select();
    
    if (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
    
    return data[0];
  },
  
  async getComments(postId: string) {
    const { data, error } = await supabase
      .from('social_comments')
      .select(`
        *,
        user:profiles!social_comments_user_id_fkey(id, name, avatar_url, type),
        likes_count:social_likes(count)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
    
    return data;
  },

  // Comment likes
  async likeComment(commentId: string, userId: string) {
    const { data, error } = await supabase
      .from('social_likes')
      .insert([
        { comment_id: commentId, user_id: userId }
      ]);
    
    if (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
    
    return data;
  },
  
  async unlikeComment(commentId: string, userId: string) {
    const { data, error } = await supabase
      .from('social_likes')
      .delete()
      .match({ comment_id: commentId, user_id: userId });
    
    if (error) {
      console.error('Error unliking comment:', error);
      throw error;
    }
    
    return data;
  },
  
  // Saves
  async savePost(postId: string, userId: string) {
    const { data, error } = await supabase
      .from('social_saves')
      .insert([
        { post_id: postId, user_id: userId }
      ]);
    
    if (error) {
      console.error('Error saving post:', error);
      throw error;
    }
    
    return data;
  },
  
  async unsavePost(postId: string, userId: string) {
    const { data, error } = await supabase
      .from('social_saves')
      .delete()
      .match({ post_id: postId, user_id: userId });
    
    if (error) {
      console.error('Error unsaving post:', error);
      throw error;
    }
    
    return data;
  },
  
  async getSavedPosts(userId: string) {
    const { data, error } = await supabase
      .from('social_saves')
      .select(`
        post:social_posts(
          *,
          user:profiles!social_posts_user_id_fkey(id, name, avatar_url, type),
          media:social_post_media(*),
          achievement:social_achievements(*),
          likes_count:social_likes(count),
          comments_count:social_comments(count),
          tags:social_post_tags(
            tag:social_tags(*)
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching saved posts:', error);
      throw error;
    }
    
    return data.map(item => item.post);
  },
  
  // Tags
  async createTag(name: string, description?: string, color: string = '#3B82F6') {
    const { data, error } = await supabase
      .from('social_tags')
      .insert([{ name, description, color }])
      .select();
    
    if (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
    
    return data[0];
  },
  
  async addTagToPost(postId: string, tagId: string) {
    const { data, error } = await supabase
      .from('social_post_tags')
      .insert([{ post_id: postId, tag_id: tagId }]);
    
    if (error) {
      console.error('Error adding tag to post:', error);
      throw error;
    }
    
    return data;
  },
  
  async getTrendingTags(limit: number = 10) {
    const { data, error } = await supabase
      .from('social_tags')
      .select('*')
      .or('is_trending.eq.true,usage_count.gte.100')
      .order('usage_count', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching trending tags:', error);
      throw error;
    }
    
    return data;
  },
  
  // Achievements
  async createAchievement(
    userId: string, 
    title: string, 
    description: string, 
    icon: string, 
    vertical: 'MaiHealth' | 'MaiMoney' | 'MaiStyle' | 'MaiHome',
    points: number = 0,
    rarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common'
  ) {
    const { data, error } = await supabase
      .from('social_achievements')
      .insert([
        { 
          user_id: userId, 
          title, 
          description, 
          icon, 
          vertical,
          points,
          rarity
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating achievement:', error);
      throw error;
    }
    
    return data[0];
  },
  
  // Follows
  async followUser(followerId: string, followingId: string) {
    const { data, error } = await supabase
      .from('social_follows')
      .insert([
        { follower_id: followerId, following_id: followingId }
      ]);
    
    if (error) {
      console.error('Error following user:', error);
      throw error;
    }
    
    return data;
  },
  
  async unfollowUser(followerId: string, followingId: string) {
    const { data, error } = await supabase
      .from('social_follows')
      .delete()
      .match({ follower_id: followerId, following_id: followingId });
    
    if (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
    
    return data;
  },
  
  // Notifications
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('social_notifications')
      .select(`
        *,
        actor:profiles!social_notifications_actor_id_fkey(id, name, avatar_url, type),
        post:social_posts(*),
        comment:social_comments(*),
        achievement:social_achievements(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
    
    return data;
  },
  
  async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('social_notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
    
    return data;
  },
  
  // Real-time subscriptions
  subscribeToNewPosts(callback: (payload: any) => void) {
    return supabase
      .channel('social_posts_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'social_posts' }, 
        callback
      )
      .subscribe();
  },
  
  subscribeToPostLikes(postId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`post_${postId}_likes`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'social_likes',
          filter: `post_id=eq.${postId}`
        }, 
        callback
      )
      .subscribe();
  },
  
  subscribeToUserNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user_${userId}_notifications`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'social_notifications',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  },
  
  // Analytics and insights
  async getPostAnalytics(postId: string) {
    const { data: post, error: postError } = await supabase
      .from('social_posts')
      .select(`
        *,
        likes_count:social_likes(count),
        comments_count:social_comments(count),
        saves_count:social_saves(count)
      `)
      .eq('id', postId)
      .single();
    
    if (postError) {
      console.error('Error fetching post analytics:', postError);
      throw postError;
    }
    
    return post;
  },
  
  async getUserStats(userId: string) {
    const [postsResult, followersResult, followingResult, achievementsResult] = await Promise.all([
      supabase.from('social_posts').select('id').eq('user_id', userId),
      supabase.from('social_follows').select('id').eq('following_id', userId),
      supabase.from('social_follows').select('id').eq('follower_id', userId),
      supabase.from('social_achievements').select('id, points').eq('user_id', userId)
    ]);
    
    const totalPoints = achievementsResult.data?.reduce((sum, achievement) => sum + (achievement.points || 0), 0) || 0;
    
    return {
      posts_count: postsResult.data?.length || 0,
      followers_count: followersResult.data?.length || 0,
      following_count: followingResult.data?.length || 0,
      achievements_count: achievementsResult.data?.length || 0,
      total_points: totalPoints
    };
  }
};
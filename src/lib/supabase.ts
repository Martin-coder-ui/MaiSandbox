import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types for database tables
export type SocialPost = {
  id: string;
  user_id: string;
  content: string;
  vertical: 'MaiHealth' | 'MaiMoney' | 'MaiStyle' | 'MaiHome';
  achievement_id?: string;
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
  created_at: string;
};

export type SocialComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
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
  type: 'like' | 'comment' | 'follow' | 'achievement' | 'mention';
  actor_id?: string;
  post_id?: string;
  comment_id?: string;
  achievement_id?: string;
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
        user:user_id(*),
        media:social_post_media(*),
        likes:social_likes(count),
        comments:social_comments(count),
        tags:social_post_tags(tag:social_tags(*))
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
  
  async createPost(content: string, userId: string, vertical: string, achievementId?: string) {
    const { data, error } = await supabase
      .from('social_posts')
      .insert([
        { 
          content, 
          user_id: userId, 
          vertical,
          achievement_id: achievementId 
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
  async uploadMedia(file: File, folder: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('social-media')
      .upload(filePath, file);
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    const { data: urlData } = supabase.storage
      .from('social-media')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  },
  
  async addPostMedia(postId: string, mediaType: 'image' | 'video', url: string, thumbnailUrl?: string) {
    const { data, error } = await supabase
      .from('social_post_media')
      .insert([
        { 
          post_id: postId, 
          media_type: mediaType, 
          url,
          thumbnail_url: thumbnailUrl 
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
        user:user_id(*),
        likes:social_likes(count)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching comments:', error);
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
        post:post_id(
          *,
          user:user_id(*),
          media:social_post_media(*),
          likes:social_likes(count),
          comments:social_comments(count),
          tags:social_post_tags(tag:social_tags(*))
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
  async createTag(name: string) {
    const { data, error } = await supabase
      .from('social_tags')
      .insert([{ name }])
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
  
  // Achievements
  async createAchievement(
    userId: string, 
    title: string, 
    description: string, 
    icon: string, 
    vertical: 'MaiHealth' | 'MaiMoney' | 'MaiStyle' | 'MaiHome'
  ) {
    const { data, error } = await supabase
      .from('social_achievements')
      .insert([
        { 
          user_id: userId, 
          title, 
          description, 
          icon, 
          vertical 
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
        actor:actor_id(*),
        post:post_id(*),
        comment:comment_id(*),
        achievement:achievement_id(*)
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
  }
};
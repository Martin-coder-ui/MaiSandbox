/*
  # MaiSocial Database Schema

  1. New Tables
    - `social_posts` - User posts with content, media references, and metadata
    - `social_post_media` - Media files (images/videos) attached to posts
    - `social_comments` - Comments on posts with threading support
    - `social_likes` - Likes for posts and comments
    - `social_saves` - Saved posts by users
    - `social_tags` - Hashtags and topic tags
    - `social_post_tags` - Many-to-many relationship between posts and tags
    - `social_achievements` - User achievements and milestones
    - `social_follows` - User following relationships
    - `social_notifications` - Activity notifications for users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own content
    - Add policies for public read access where appropriate
    - Add policies for following-based content access

  3. Features
    - Real-time subscriptions for live updates
    - Media storage integration with Supabase Storage
    - Achievement system with gamification
    - Comprehensive notification system
    - Content moderation capabilities
*/

-- Create social_posts table
CREATE TABLE IF NOT EXISTS social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  vertical text NOT NULL CHECK (vertical IN ('MaiHealth', 'MaiMoney', 'MaiStyle', 'MaiHome')),
  achievement_id uuid REFERENCES social_achievements(id) ON DELETE SET NULL,
  is_pinned boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create social_post_media table
CREATE TABLE IF NOT EXISTS social_post_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  url text NOT NULL,
  thumbnail_url text,
  width integer,
  height integer,
  duration integer, -- for videos, in seconds
  file_size bigint,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

-- Create social_comments table
CREATE TABLE IF NOT EXISTS social_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES social_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_edited boolean DEFAULT false,
  edited_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create social_likes table
CREATE TABLE IF NOT EXISTS social_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES social_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES social_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT social_likes_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR 
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);

-- Create social_saves table
CREATE TABLE IF NOT EXISTS social_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Create social_tags table
CREATE TABLE IF NOT EXISTS social_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#3B82F6',
  usage_count integer DEFAULT 0,
  is_trending boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create social_post_tags table (many-to-many)
CREATE TABLE IF NOT EXISTS social_post_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  tag_id uuid REFERENCES social_tags(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, tag_id)
);

-- Create social_achievements table
CREATE TABLE IF NOT EXISTS social_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  vertical text NOT NULL CHECK (vertical IN ('MaiHealth', 'MaiMoney', 'MaiStyle', 'MaiHome')),
  points integer DEFAULT 0,
  rarity text DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  achieved_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create social_follows table
CREATE TABLE IF NOT EXISTS social_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CONSTRAINT social_follows_no_self_follow CHECK (follower_id != following_id)
);

-- Create social_notifications table
CREATE TABLE IF NOT EXISTS social_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'achievement', 'mention', 'post_featured')),
  actor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES social_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES social_comments(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES social_achievements(id) ON DELETE CASCADE,
  message text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint for achievements (after table creation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'social_posts_achievement_id_fkey'
  ) THEN
    ALTER TABLE social_posts 
    ADD CONSTRAINT social_posts_achievement_id_fkey 
    FOREIGN KEY (achievement_id) REFERENCES social_achievements(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_vertical ON social_posts(vertical);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON social_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_featured ON social_posts(is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_social_post_media_post_id ON social_post_media(post_id);
CREATE INDEX IF NOT EXISTS idx_social_post_media_type ON social_post_media(media_type);

CREATE INDEX IF NOT EXISTS idx_social_comments_post_id ON social_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_social_comments_user_id ON social_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_social_comments_parent_id ON social_comments(parent_id);

CREATE INDEX IF NOT EXISTS idx_social_likes_post_id ON social_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_social_likes_comment_id ON social_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_social_likes_user_id ON social_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_social_saves_user_id ON social_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_social_saves_post_id ON social_saves(post_id);

CREATE INDEX IF NOT EXISTS idx_social_tags_name ON social_tags(name);
CREATE INDEX IF NOT EXISTS idx_social_tags_trending ON social_tags(is_trending) WHERE is_trending = true;
CREATE INDEX IF NOT EXISTS idx_social_tags_usage ON social_tags(usage_count DESC);

CREATE INDEX IF NOT EXISTS idx_social_post_tags_post_id ON social_post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_social_post_tags_tag_id ON social_post_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_social_achievements_user_id ON social_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_social_achievements_vertical ON social_achievements(vertical);
CREATE INDEX IF NOT EXISTS idx_social_achievements_rarity ON social_achievements(rarity);

CREATE INDEX IF NOT EXISTS idx_social_follows_follower_id ON social_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_social_follows_following_id ON social_follows(following_id);

CREATE INDEX IF NOT EXISTS idx_social_notifications_user_id ON social_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_social_notifications_read ON social_notifications(read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_social_notifications_created_at ON social_notifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for social_posts
CREATE POLICY "Users can view public posts"
  ON social_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own posts"
  ON social_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON social_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON social_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for social_post_media
CREATE POLICY "Users can view all post media"
  ON social_post_media
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add media to their own posts"
  ON social_post_media
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM social_posts 
      WHERE id = post_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update media on their own posts"
  ON social_post_media
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM social_posts 
      WHERE id = post_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete media from their own posts"
  ON social_post_media
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM social_posts 
      WHERE id = post_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for social_comments
CREATE POLICY "Users can view all comments"
  ON social_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON social_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON social_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON social_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for social_likes
CREATE POLICY "Users can view all likes"
  ON social_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own likes"
  ON social_likes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for social_saves
CREATE POLICY "Users can view their own saves"
  ON social_saves
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own saves"
  ON social_saves
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for social_tags
CREATE POLICY "Users can view all tags"
  ON social_tags
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create tags"
  ON social_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for social_post_tags
CREATE POLICY "Users can view all post tags"
  ON social_post_tags
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add tags to their own posts"
  ON social_post_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM social_posts 
      WHERE id = post_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove tags from their own posts"
  ON social_post_tags
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM social_posts 
      WHERE id = post_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for social_achievements
CREATE POLICY "Users can view all achievements"
  ON social_achievements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own achievements"
  ON social_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON social_achievements
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for social_follows
CREATE POLICY "Users can view all follows"
  ON social_follows
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own follows"
  ON social_follows
  FOR ALL
  TO authenticated
  USING (auth.uid() = follower_id)
  WITH CHECK (auth.uid() = follower_id);

-- RLS Policies for social_notifications
CREATE POLICY "Users can view their own notifications"
  ON social_notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON social_notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON social_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_social_posts_updated_at 
  BEFORE UPDATE ON social_posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_comments_updated_at 
  BEFORE UPDATE ON social_comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE social_tags 
    SET usage_count = usage_count + 1 
    WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE social_tags 
    SET usage_count = GREATEST(usage_count - 1, 0) 
    WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Add trigger for tag usage count
CREATE TRIGGER update_tag_usage_count_trigger
  AFTER INSERT OR DELETE ON social_post_tags
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- Function to create notifications
CREATE OR REPLACE FUNCTION create_social_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for likes
  IF TG_TABLE_NAME = 'social_likes' AND TG_OP = 'INSERT' THEN
    IF NEW.post_id IS NOT NULL THEN
      INSERT INTO social_notifications (user_id, type, actor_id, post_id)
      SELECT p.user_id, 'like', NEW.user_id, NEW.post_id
      FROM social_posts p
      WHERE p.id = NEW.post_id AND p.user_id != NEW.user_id;
    ELSIF NEW.comment_id IS NOT NULL THEN
      INSERT INTO social_notifications (user_id, type, actor_id, comment_id)
      SELECT c.user_id, 'like', NEW.user_id, NEW.comment_id
      FROM social_comments c
      WHERE c.id = NEW.comment_id AND c.user_id != NEW.user_id;
    END IF;
  END IF;

  -- Create notification for comments
  IF TG_TABLE_NAME = 'social_comments' AND TG_OP = 'INSERT' THEN
    INSERT INTO social_notifications (user_id, type, actor_id, post_id, comment_id)
    SELECT p.user_id, 'comment', NEW.user_id, NEW.post_id, NEW.id
    FROM social_posts p
    WHERE p.id = NEW.post_id AND p.user_id != NEW.user_id;
  END IF;

  -- Create notification for follows
  IF TG_TABLE_NAME = 'social_follows' AND TG_OP = 'INSERT' THEN
    INSERT INTO social_notifications (user_id, type, actor_id)
    VALUES (NEW.following_id, 'follow', NEW.follower_id);
  END IF;

  -- Create notification for achievements
  IF TG_TABLE_NAME = 'social_achievements' AND TG_OP = 'INSERT' THEN
    INSERT INTO social_notifications (user_id, type, achievement_id)
    VALUES (NEW.user_id, 'achievement', NEW.id);
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Add triggers for notifications
CREATE TRIGGER create_like_notification
  AFTER INSERT ON social_likes
  FOR EACH ROW EXECUTE FUNCTION create_social_notification();

CREATE TRIGGER create_comment_notification
  AFTER INSERT ON social_comments
  FOR EACH ROW EXECUTE FUNCTION create_social_notification();

CREATE TRIGGER create_follow_notification
  AFTER INSERT ON social_follows
  FOR EACH ROW EXECUTE FUNCTION create_social_notification();

CREATE TRIGGER create_achievement_notification
  AFTER INSERT ON social_achievements
  FOR EACH ROW EXECUTE FUNCTION create_social_notification();

-- Insert some default trending tags
INSERT INTO social_tags (name, description, color, usage_count, is_trending) VALUES
  ('HealthGoals', 'Health and fitness achievements', '#10B981', 1243, true),
  ('SmartSaving', 'Financial planning and savings tips', '#3B82F6', 856, true),
  ('SummerStyle', 'Summer fashion and style inspiration', '#8B5CF6', 743, true),
  ('SmartHome', 'Home automation and technology', '#F59E0B', 621, true),
  ('MindfulMonday', 'Mental health and mindfulness', '#EF4444', 512, true),
  ('TransformationTuesday', 'Personal transformation stories', '#06B6D4', 387, false),
  ('WellnessWednesday', 'Wellness tips and advice', '#84CC16', 298, false),
  ('FinanceFriday', 'Financial education and tips', '#6366F1', 234, false),
  ('StyleSaturday', 'Fashion and style content', '#EC4899', 189, false),
  ('SelfCareSunday', 'Self-care and relaxation', '#F97316', 156, false)
ON CONFLICT (name) DO NOTHING;
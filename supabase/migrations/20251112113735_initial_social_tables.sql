/*
  # MaiSocial Schema

  1. New Tables
    - `social_posts` - Stores user posts with text, media, and metadata
    - `social_post_media` - Stores media files (images, videos) associated with posts
    - `social_comments` - Stores comments on posts
    - `social_likes` - Stores likes on posts and comments
    - `social_saves` - Stores saved posts by users
    - `social_tags` - Stores tags used in posts
    - `social_post_tags` - Junction table for posts and tags
    - `social_achievements` - Stores user achievements that can be shared

  2. Security
    - Enable RLS on all tables
    - Add policies for appropriate access control
*/

-- Create social_achievements table first (referenced by social_posts)
CREATE TABLE IF NOT EXISTS social_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  vertical TEXT NOT NULL CHECK (vertical IN ('MaiHealth', 'MaiMoney', 'MaiStyle', 'MaiHome')),
  achieved_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create social_posts table
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  vertical TEXT NOT NULL CHECK (vertical IN ('MaiHealth', 'MaiMoney', 'MaiStyle', 'MaiHome')),
  achievement_id UUID REFERENCES social_achievements(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create social_post_media table
CREATE TABLE IF NOT EXISTS social_post_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create social_comments table
CREATE TABLE IF NOT EXISTS social_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES social_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create social_likes table
CREATE TABLE IF NOT EXISTS social_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES social_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT like_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),
  CONSTRAINT unique_post_like UNIQUE (user_id, post_id),
  CONSTRAINT unique_comment_like UNIQUE (user_id, comment_id)
);

-- Create social_saves table
CREATE TABLE IF NOT EXISTS social_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_post_save UNIQUE (user_id, post_id)
);

-- Create social_tags table
CREATE TABLE IF NOT EXISTS social_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create social_post_tags junction table
CREATE TABLE IF NOT EXISTS social_post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES social_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_post_tag UNIQUE (post_id, tag_id)
);

-- Create social_follows table
CREATE TABLE IF NOT EXISTS social_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_follow UNIQUE (follower_id, following_id),
  CONSTRAINT prevent_self_follow CHECK (follower_id != following_id)
);

-- Create social_notifications table
CREATE TABLE IF NOT EXISTS social_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'achievement', 'mention')),
  actor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES social_comments(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES social_achievements(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

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

-- Posts: Users can read all posts, but only create/update/delete their own
CREATE POLICY "Anyone can read posts"
  ON social_posts
  FOR SELECT
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
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON social_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Post Media: Same as posts
CREATE POLICY "Anyone can view post media"
  ON social_post_media
  FOR SELECT
  USING (true);

CREATE POLICY "Users can add media to their own posts"
  ON social_post_media
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM social_posts WHERE id = post_id)
  );

CREATE POLICY "Users can update media on their own posts"
  ON social_post_media
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = (SELECT user_id FROM social_posts WHERE id = post_id)
  );

CREATE POLICY "Users can delete media from their own posts"
  ON social_post_media
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = (SELECT user_id FROM social_posts WHERE id = post_id)
  );

-- Comments: Anyone can read, users can create their own, and delete their own
CREATE POLICY "Anyone can read comments"
  ON social_comments
  FOR SELECT
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
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON social_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Likes: Anyone can read, users can create/delete their own
CREATE POLICY "Anyone can read likes"
  ON social_likes
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own likes"
  ON social_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON social_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Saves: Users can only see their own saves
CREATE POLICY "Users can see their own saves"
  ON social_saves
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saves"
  ON social_saves
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saves"
  ON social_saves
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tags: Anyone can read
CREATE POLICY "Anyone can read tags"
  ON social_tags
  FOR SELECT
  USING (true);

-- Post Tags: Anyone can read, users can add tags to their own posts
CREATE POLICY "Anyone can read post tags"
  ON social_post_tags
  FOR SELECT
  USING (true);

CREATE POLICY "Users can add tags to their own posts"
  ON social_post_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM social_posts WHERE id = post_id)
  );

CREATE POLICY "Users can remove tags from their own posts"
  ON social_post_tags
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = (SELECT user_id FROM social_posts WHERE id = post_id)
  );

-- Achievements: Anyone can read, only the user can create their own
CREATE POLICY "Anyone can read achievements"
  ON social_achievements
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own achievements"
  ON social_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Follows: Anyone can read, users can create/delete their own follows
CREATE POLICY "Anyone can read follows"
  ON social_follows
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own follows"
  ON social_follows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows"
  ON social_follows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can see their own notifications"
  ON social_notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their own notifications as read"
  ON social_notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create functions and triggers

-- Function to update post updated_at timestamp
CREATE OR REPLACE FUNCTION update_post_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update post updated_at timestamp
DROP TRIGGER IF EXISTS update_post_updated_at_trigger ON social_posts;
CREATE TRIGGER update_post_updated_at_trigger
BEFORE UPDATE ON social_posts
FOR EACH ROW
EXECUTE FUNCTION update_post_updated_at();

-- Function to update comment updated_at timestamp
CREATE OR REPLACE FUNCTION update_comment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update comment updated_at timestamp
DROP TRIGGER IF EXISTS update_comment_updated_at_trigger ON social_comments;
CREATE TRIGGER update_comment_updated_at_trigger
BEFORE UPDATE ON social_comments
FOR EACH ROW
EXECUTE FUNCTION update_comment_updated_at();

-- Function to create a notification when someone likes a post
CREATE OR REPLACE FUNCTION create_like_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.post_id IS NOT NULL THEN
    INSERT INTO social_notifications (user_id, type, actor_id, post_id)
    SELECT user_id, 'like', NEW.user_id, NEW.post_id
    FROM social_posts
    WHERE id = NEW.post_id AND user_id != NEW.user_id;
  ELSE
    INSERT INTO social_notifications (user_id, type, actor_id, comment_id)
    SELECT user_id, 'like', NEW.user_id, NEW.comment_id
    FROM social_comments
    WHERE id = NEW.comment_id AND user_id != NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create a notification when someone likes a post
DROP TRIGGER IF EXISTS create_like_notification_trigger ON social_likes;
CREATE TRIGGER create_like_notification_trigger
AFTER INSERT ON social_likes
FOR EACH ROW
EXECUTE FUNCTION create_like_notification();

-- Function to create a notification when someone comments on a post
CREATE OR REPLACE FUNCTION create_comment_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO social_notifications (user_id, type, actor_id, post_id, comment_id)
  SELECT user_id, 'comment', NEW.user_id, NEW.post_id, NEW.id
  FROM social_posts
  WHERE id = NEW.post_id AND user_id != NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create a notification when someone comments on a post
DROP TRIGGER IF EXISTS create_comment_notification_trigger ON social_comments;
CREATE TRIGGER create_comment_notification_trigger
AFTER INSERT ON social_comments
FOR EACH ROW
EXECUTE FUNCTION create_comment_notification();

-- Function to create a notification when someone follows a user
CREATE OR REPLACE FUNCTION create_follow_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO social_notifications (user_id, type, actor_id)
  VALUES (NEW.following_id, 'follow', NEW.follower_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create a notification when someone follows a user
DROP TRIGGER IF EXISTS create_follow_notification_trigger ON social_follows;
CREATE TRIGGER create_follow_notification_trigger
AFTER INSERT ON social_follows
FOR EACH ROW
EXECUTE FUNCTION create_follow_notification();

-- Function to create a notification when a user achieves something
CREATE OR REPLACE FUNCTION create_achievement_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO social_notifications (user_id, type, achievement_id)
  VALUES (NEW.user_id, 'achievement', NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create a notification when a user achieves something
DROP TRIGGER IF EXISTS create_achievement_notification_trigger ON social_achievements;
CREATE TRIGGER create_achievement_notification_trigger
AFTER INSERT ON social_achievements
FOR EACH ROW
EXECUTE FUNCTION create_achievement_notification();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS social_posts_user_id_idx ON social_posts(user_id);
CREATE INDEX IF NOT EXISTS social_posts_vertical_idx ON social_posts(vertical);
CREATE INDEX IF NOT EXISTS social_posts_created_at_idx ON social_posts(created_at);

CREATE INDEX IF NOT EXISTS social_post_media_post_id_idx ON social_post_media(post_id);
CREATE INDEX IF NOT EXISTS social_comments_post_id_idx ON social_comments(post_id);
CREATE INDEX IF NOT EXISTS social_comments_user_id_idx ON social_comments(user_id);
CREATE INDEX IF NOT EXISTS social_comments_parent_id_idx ON social_comments(parent_id);

CREATE INDEX IF NOT EXISTS social_likes_user_id_idx ON social_likes(user_id);
CREATE INDEX IF NOT EXISTS social_likes_post_id_idx ON social_likes(post_id);
CREATE INDEX IF NOT EXISTS social_likes_comment_id_idx ON social_likes(comment_id);

CREATE INDEX IF NOT EXISTS social_saves_user_id_idx ON social_saves(user_id);
CREATE INDEX IF NOT EXISTS social_saves_post_id_idx ON social_saves(post_id);

CREATE INDEX IF NOT EXISTS social_post_tags_post_id_idx ON social_post_tags(post_id);
CREATE INDEX IF NOT EXISTS social_post_tags_tag_id_idx ON social_post_tags(tag_id);

CREATE INDEX IF NOT EXISTS social_achievements_user_id_idx ON social_achievements(user_id);
CREATE INDEX IF NOT EXISTS social_achievements_vertical_idx ON social_achievements(vertical);

CREATE INDEX IF NOT EXISTS social_follows_follower_id_idx ON social_follows(follower_id);
CREATE INDEX IF NOT EXISTS social_follows_following_id_idx ON social_follows(following_id);

CREATE INDEX IF NOT EXISTS social_notifications_user_id_idx ON social_notifications(user_id);
CREATE INDEX IF NOT EXISTS social_notifications_read_idx ON social_notifications(read);
CREATE INDEX IF NOT EXISTS social_notifications_created_at_idx ON social_notifications(created_at);
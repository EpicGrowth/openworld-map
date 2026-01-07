-- =============================================
-- FLEEVIGO ROW LEVEL SECURITY POLICIES
-- Run this AFTER 002_triggers_and_functions.sql
-- =============================================

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpful_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_helpful_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS POLICIES
-- =============================================

-- Anyone can view user profiles
CREATE POLICY "Users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- USER TYPES POLICIES
-- =============================================

-- Anyone can view user types
CREATE POLICY "User types are viewable by everyone"
  ON user_types FOR SELECT
  USING (true);

-- Users can manage their own types
CREATE POLICY "Users can insert own types"
  ON user_types FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own types"
  ON user_types FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- POSTS POLICIES
-- =============================================

-- Anyone can read posts
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

-- Authenticated users can create posts
CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their posts
CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id);

-- Authors can delete their posts
CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = author_id);

-- =============================================
-- POST MEDIA POLICIES
-- =============================================

-- Anyone can view post media
CREATE POLICY "Post media is viewable by everyone"
  ON post_media FOR SELECT
  USING (true);

-- Post authors can add media
CREATE POLICY "Post authors can add media"
  ON post_media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_id AND posts.author_id = auth.uid()
    )
  );

-- Post authors can delete media
CREATE POLICY "Post authors can delete media"
  ON post_media FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_id AND posts.author_id = auth.uid()
    )
  );

-- =============================================
-- PINS POLICIES
-- =============================================

-- Anyone can view pins
CREATE POLICY "Pins are viewable by everyone"
  ON pins FOR SELECT
  USING (true);

-- Pins are created automatically with posts (service role only)
-- No direct insert policy for regular users

-- =============================================
-- COMMENTS POLICIES
-- =============================================

-- Anyone can read comments
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

-- Authenticated users can create comments
CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their comments
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = author_id);

-- Authors can delete their comments
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = author_id);

-- =============================================
-- HELPFUL VOTES POLICIES
-- =============================================

-- Anyone can see vote counts (via posts table)
CREATE POLICY "Helpful votes are viewable by everyone"
  ON helpful_votes FOR SELECT
  USING (true);

-- Authenticated users can vote
CREATE POLICY "Users can add helpful votes"
  ON helpful_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their votes
CREATE POLICY "Users can remove own helpful votes"
  ON helpful_votes FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- COMMENT HELPFUL VOTES POLICIES
-- =============================================

CREATE POLICY "Comment helpful votes are viewable by everyone"
  ON comment_helpful_votes FOR SELECT
  USING (true);

CREATE POLICY "Users can add comment helpful votes"
  ON comment_helpful_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own comment helpful votes"
  ON comment_helpful_votes FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- FOLLOWS POLICIES
-- =============================================

-- Anyone can see follows
CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT
  USING (true);

-- Users can follow others
CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can unfollow
CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- =============================================
-- BLOCKED USERS POLICIES
-- =============================================

-- Users can only see their own blocks
CREATE POLICY "Users can view own blocks"
  ON blocked_users FOR SELECT
  USING (auth.uid() = blocker_id);

-- Users can block others
CREATE POLICY "Users can block others"
  ON blocked_users FOR INSERT
  WITH CHECK (auth.uid() = blocker_id);

-- Users can unblock
CREATE POLICY "Users can unblock"
  ON blocked_users FOR DELETE
  USING (auth.uid() = blocker_id);

-- =============================================
-- KEYWORDS POLICIES
-- =============================================

-- Anyone can read keywords (for client-side detection)
CREATE POLICY "Keywords are viewable by everyone"
  ON keywords FOR SELECT
  USING (true);

-- Only service role can modify keywords (admin)
-- No INSERT/UPDATE/DELETE policies for regular users

-- =============================================
-- USER SETTINGS POLICIES
-- =============================================

-- Users can only view their own settings
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Settings are auto-created by trigger, but allow insert as backup
CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- POINT EVENTS POLICIES
-- =============================================

-- Users can view their own point history
CREATE POLICY "Users can view own point events"
  ON point_events FOR SELECT
  USING (auth.uid() = user_id);

-- Points are awarded by service role / triggers only
-- No direct INSERT policy for regular users

-- =============================================
-- NOTIFICATIONS POLICIES
-- =============================================

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update (mark as read) their notifications
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Notifications are created by service role / triggers only

COMMIT;

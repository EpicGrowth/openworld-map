-- =============================================
-- FLEEVIGO DATABASE SCHEMA
-- Phase 1 Initial Setup
-- Run this in Supabase SQL Editor
-- =============================================

-- =============================================
-- STEP 1: ENABLE EXTENSIONS
-- =============================================

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- STEP 2: CREATE ENUM TYPES
-- =============================================

-- User levels for gamification
CREATE TYPE user_level AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');

-- User types (gig worker categories)
CREATE TYPE user_type AS ENUM ('RIDER', 'DRIVER', 'CHAUFFEUR');

-- Post categories
CREATE TYPE post_category AS ENUM ('TRAFFIC', 'SAFETY', 'DEALS', 'AMENITIES', 'GENERAL');

-- Media types
CREATE TYPE media_type AS ENUM ('IMAGE', 'VIDEO');

-- Point actions for gamification
CREATE TYPE point_action AS ENUM (
  'POST_CREATED',
  'POST_HELPFUL_10',
  'POST_HELPFUL_50',
  'COMMENT_CREATED',
  'COMMENT_HELPFUL',
  'RECEIVED_HELPFUL',
  'DAILY_LOGIN',
  'STREAK_7',
  'STREAK_30',
  'SAFETY_VERIFIED',
  'NEW_CITY_POST',
  'REFERRAL'
);

-- =============================================
-- STEP 3: CREATE TABLES
-- =============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio VARCHAR(500),
  points INTEGER DEFAULT 0,
  level user_level DEFAULT 'BRONZE',
  current_city VARCHAR(100),
  last_location GEOGRAPHY(POINT, 4326),
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- User types junction table (users can have multiple types)
CREATE TABLE user_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type user_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, type)
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content VARCHAR(500) NOT NULL,
  category post_category NOT NULL DEFAULT 'GENERAL',
  category_source VARCHAR(20) DEFAULT 'AUTO',
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  helpful_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Post media (images/videos)
CREATE TABLE post_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  type media_type NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pins (map markers linked to posts)
CREATE TABLE pins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID UNIQUE NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  category post_category NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  city VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  confirmation_count INTEGER DEFAULT 0,
  last_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments (threaded)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content VARCHAR(280) NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helpful votes on posts
CREATE TABLE helpful_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(post_id, user_id)
);

-- Helpful votes on comments
CREATE TABLE comment_helpful_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(comment_id, user_id)
);

-- User follows
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

-- Blocked users
CREATE TABLE blocked_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(blocker_id, blocked_id),
  CHECK(blocker_id != blocked_id)
);

-- Keywords for auto-categorization
CREATE TABLE keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword VARCHAR(50) NOT NULL UNIQUE,
  category post_category NOT NULL,
  priority INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User settings
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Notifications
  notify_helpful BOOLEAN DEFAULT TRUE,
  notify_comments BOOLEAN DEFAULT TRUE,
  notify_follows BOOLEAN DEFAULT TRUE,
  notify_sos_nearby BOOLEAN DEFAULT TRUE,
  notify_deals BOOLEAN DEFAULT TRUE,
  notify_traffic BOOLEAN DEFAULT TRUE,
  quiet_hours_start TIME,
  quiet_hours_end TIME,

  -- Privacy
  show_in_whos_around BOOLEAN DEFAULT FALSE,
  whos_around_visibility VARCHAR(20) DEFAULT 'FOLLOWS',
  show_exact_location BOOLEAN DEFAULT FALSE,
  profile_visibility VARCHAR(20) DEFAULT 'PUBLIC',

  -- Preferences
  distance_unit VARCHAR(10) DEFAULT 'KM',
  language VARCHAR(10) DEFAULT 'en',

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Point events (gamification history)
CREATE TABLE point_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action point_action NOT NULL,
  points INTEGER NOT NULL,
  reference_id UUID,
  reference_type VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  body VARCHAR(255),
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STEP 4: CREATE INDEXES
-- =============================================

-- Users indexes
CREATE INDEX users_username_idx ON users(username);
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_phone_idx ON users(phone);
CREATE INDEX users_location_idx ON users USING GIST(last_location);
CREATE INDEX users_city_idx ON users(current_city);

-- User types indexes
CREATE INDEX user_types_user_idx ON user_types(user_id);

-- Posts indexes
CREATE INDEX posts_author_idx ON posts(author_id);
CREATE INDEX posts_city_idx ON posts(city);
CREATE INDEX posts_category_idx ON posts(category);
CREATE INDEX posts_created_idx ON posts(created_at DESC);
CREATE INDEX posts_location_idx ON posts USING GIST(location);
CREATE INDEX posts_city_created_idx ON posts(city, created_at DESC);
CREATE INDEX posts_feed_idx ON posts(city, category, created_at DESC);

-- Post media indexes
CREATE INDEX post_media_post_idx ON post_media(post_id);

-- Pins indexes
CREATE INDEX pins_location_idx ON pins USING GIST(location);
CREATE INDEX pins_city_idx ON pins(city);
CREATE INDEX pins_category_idx ON pins(category);
CREATE INDEX pins_active_idx ON pins(is_active) WHERE is_active = TRUE;
CREATE INDEX pins_city_active_idx ON pins(city, is_active, created_at DESC);

-- Comments indexes
CREATE INDEX comments_post_idx ON comments(post_id);
CREATE INDEX comments_author_idx ON comments(author_id);
CREATE INDEX comments_parent_idx ON comments(parent_id);
CREATE INDEX comments_post_created_idx ON comments(post_id, created_at);

-- Helpful votes indexes
CREATE INDEX helpful_votes_post_idx ON helpful_votes(post_id);
CREATE INDEX helpful_votes_user_idx ON helpful_votes(user_id);
CREATE INDEX comment_helpful_comment_idx ON comment_helpful_votes(comment_id);

-- Follows indexes
CREATE INDEX follows_follower_idx ON follows(follower_id);
CREATE INDEX follows_following_idx ON follows(following_id);

-- Blocked users indexes
CREATE INDEX blocked_blocker_idx ON blocked_users(blocker_id);

-- Keywords indexes
CREATE INDEX keywords_category_idx ON keywords(category);
CREATE INDEX keywords_active_idx ON keywords(is_active) WHERE is_active = TRUE;

-- User settings indexes
CREATE INDEX user_settings_user_idx ON user_settings(user_id);

-- Point events indexes
CREATE INDEX point_events_user_idx ON point_events(user_id);
CREATE INDEX point_events_created_idx ON point_events(created_at);

-- Notifications indexes
CREATE INDEX notifications_user_idx ON notifications(user_id);
CREATE INDEX notifications_unread_idx ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX notifications_created_idx ON notifications(created_at DESC);

-- =============================================
-- STEP 5: SEED KEYWORDS
-- =============================================

INSERT INTO keywords (keyword, category, priority) VALUES
-- Safety (Priority 1 - highest)
('danger', 'SAFETY', 1),
('dangerous', 'SAFETY', 1),
('unsafe', 'SAFETY', 1),
('warning', 'SAFETY', 1),
('emergency', 'SAFETY', 1),
('sos', 'SAFETY', 1),
('help', 'SAFETY', 1),
('police', 'SAFETY', 1),
('ambulance', 'SAFETY', 1),
('fire', 'SAFETY', 1),
('crime', 'SAFETY', 1),
('theft', 'SAFETY', 1),
('robbery', 'SAFETY', 1),
('avoid', 'SAFETY', 1),
('hazard', 'SAFETY', 1),
('attack', 'SAFETY', 1),

-- Traffic (Priority 2)
('traffic', 'TRAFFIC', 2),
('jam', 'TRAFFIC', 2),
('congestion', 'TRAFFIC', 2),
('accident', 'TRAFFIC', 2),
('crash', 'TRAFFIC', 2),
('collision', 'TRAFFIC', 2),
('road closed', 'TRAFFIC', 2),
('roadwork', 'TRAFFIC', 2),
('construction', 'TRAFFIC', 2),
('blocked', 'TRAFFIC', 2),
('delay', 'TRAFFIC', 2),
('standstill', 'TRAFFIC', 2),
('detour', 'TRAFFIC', 2),

-- Deals (Priority 3)
('deal', 'DEALS', 3),
('discount', 'DEALS', 3),
('offer', 'DEALS', 3),
('promotion', 'DEALS', 3),
('sale', 'DEALS', 3),
('free', 'DEALS', 3),
('cheap', 'DEALS', 3),
('bargain', 'DEALS', 3),
('coupon', 'DEALS', 3),
('promo', 'DEALS', 3),

-- Amenities (Priority 4)
('toilet', 'AMENITIES', 4),
('restroom', 'AMENITIES', 4),
('bathroom', 'AMENITIES', 4),
('restaurant', 'AMENITIES', 4),
('food', 'AMENITIES', 4),
('coffee', 'AMENITIES', 4),
('cafe', 'AMENITIES', 4),
('rest stop', 'AMENITIES', 4),
('parking', 'AMENITIES', 4),
('charging', 'AMENITIES', 4),
('fuel', 'AMENITIES', 4),
('gas', 'AMENITIES', 4),
('petrol', 'AMENITIES', 4);

COMMIT;

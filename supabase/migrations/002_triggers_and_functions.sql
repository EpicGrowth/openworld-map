-- =============================================
-- FLEEVIGO TRIGGERS AND FUNCTIONS
-- Run this AFTER 001_initial_schema.sql
-- =============================================

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- UPDATED_AT TRIGGERS
-- =============================================

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- HELPFUL COUNT TRIGGERS
-- =============================================

-- Update helpful_count on posts when votes are added/removed
CREATE OR REPLACE FUNCTION update_post_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET helpful_count = helpful_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET helpful_count = helpful_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER helpful_vote_count_trigger
  AFTER INSERT OR DELETE ON helpful_votes
  FOR EACH ROW EXECUTE FUNCTION update_post_helpful_count();

-- Update helpful_count on comments when votes are added/removed
CREATE OR REPLACE FUNCTION update_comment_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments SET helpful_count = helpful_count + 1 WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments SET helpful_count = helpful_count - 1 WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_helpful_vote_count_trigger
  AFTER INSERT OR DELETE ON comment_helpful_votes
  FOR EACH ROW EXECUTE FUNCTION update_comment_helpful_count();

-- =============================================
-- COMMENT COUNT TRIGGER
-- =============================================

CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_count_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- =============================================
-- USER POINTS TRIGGER
-- =============================================

CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET points = points + NEW.points
  WHERE id = NEW.user_id;

  -- Update user level based on points
  UPDATE users SET level =
    CASE
      WHEN points >= 10000 THEN 'PLATINUM'
      WHEN points >= 5000 THEN 'GOLD'
      WHEN points >= 1000 THEN 'SILVER'
      ELSE 'BRONZE'
    END
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER point_event_trigger
  AFTER INSERT ON point_events
  FOR EACH ROW EXECUTE FUNCTION update_user_points();

-- =============================================
-- AUTO-CREATE USER SETTINGS
-- =============================================

CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_settings_trigger
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION create_user_settings();

-- =============================================
-- PIN CONFIRMATION COUNT
-- =============================================

CREATE OR REPLACE FUNCTION update_pin_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pins
  SET
    confirmation_count = confirmation_count + 1,
    last_confirmed_at = NOW()
  WHERE id = NEW.pin_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- We'll create the pin_confirmations table and trigger if needed later

COMMIT;

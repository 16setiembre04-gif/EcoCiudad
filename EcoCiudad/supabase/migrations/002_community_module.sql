-- Community Module Database Schema
-- Migration: 002_community_module.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE community_privacy AS ENUM ('public', 'private');
CREATE TYPE community_category AS ENUM (
  'environmental', 'recycling', 'conservation', 
  'education', 'cleanup', 'gardening', 
  'sustainability', 'other'
);
CREATE TYPE member_role AS ENUM ('owner', 'admin', 'moderator', 'member');
CREATE TYPE post_type AS ENUM ('text', 'image', 'poll', 'achievement', 'tip');
CREATE TYPE reaction_type AS ENUM ('like', 'love', 'wow', 'sad', 'angry');

-- ============================================================================
-- COMMUNITIES TABLE
-- ============================================================================

CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category community_category NOT NULL,
  privacy community_privacy NOT NULL DEFAULT 'public',
  cover_image_url TEXT,
  logo_url TEXT,
  department TEXT,
  district TEXT,
  max_members INTEGER,
  rules TEXT[],
  member_count INTEGER NOT NULL DEFAULT 0,
  post_count INTEGER NOT NULL DEFAULT 0,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_communities_category ON communities(category);
CREATE INDEX idx_communities_privacy ON communities(privacy);
CREATE INDEX idx_communities_owner_id ON communities(owner_id);
CREATE INDEX idx_communities_created_at ON communities(created_at DESC);
CREATE INDEX idx_communities_member_count ON communities(member_count DESC);

-- ============================================================================
-- COMMUNITY MEMBERS TABLE
-- ============================================================================

CREATE TABLE community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

CREATE INDEX idx_community_members_community_id ON community_members(community_id);
CREATE INDEX idx_community_members_user_id ON community_members(user_id);
CREATE INDEX idx_community_members_role ON community_members(role);

-- ============================================================================
-- POSTS TABLE
-- ============================================================================

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type post_type NOT NULL DEFAULT 'text',
  content TEXT NOT NULL,
  images TEXT[],
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  like_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_community_id ON posts(community_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_is_pinned ON posts(is_pinned);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_like_count ON posts(like_count DESC);

-- ============================================================================
-- COMMENTS TABLE
-- ============================================================================

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  like_count INTEGER NOT NULL DEFAULT 0,
  reply_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_comment_id ON comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON comments(created_at ASC);

-- ============================================================================
-- REACTIONS TABLE
-- ============================================================================

CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type reaction_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_reactions_post_id ON reactions(post_id);
CREATE INDEX idx_reactions_user_id ON reactions(user_id);
CREATE INDEX idx_reactions_type ON reactions(type);

-- ============================================================================
-- BOOKMARKS TABLE
-- ============================================================================

CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_bookmarks_post_id ON bookmarks(post_id);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);

-- ============================================================================
-- POLLS TABLE
-- ============================================================================

CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_polls_post_id ON polls(post_id);
CREATE INDEX idx_polls_ends_at ON polls(ends_at);

-- ============================================================================
-- POLL OPTIONS TABLE
-- ============================================================================

CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);

-- ============================================================================
-- POLL VOTES TABLE
-- ============================================================================

CREATE TABLE poll_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

CREATE INDEX idx_poll_votes_poll_id ON poll_votes(poll_id);
CREATE INDEX idx_poll_votes_option_id ON poll_votes(option_id);
CREATE INDEX idx_poll_votes_user_id ON poll_votes(user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'communities', 'posts', 'comments'
    ])
  LOOP
    EXECUTE format('
      CREATE TRIGGER update_%s_updated_at
      BEFORE UPDATE ON public.%I
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    ', t, t);
  END LOOP;
END;
$$;

-- Update community member count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities
    SET member_count = member_count + 1
    WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE communities
    SET member_count = member_count - 1
    WHERE id = OLD.community_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_community_member_change
  AFTER INSERT OR DELETE ON community_members
  FOR EACH ROW
  EXECUTE FUNCTION update_community_member_count();

-- Update community post count
CREATE OR REPLACE FUNCTION update_community_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities
    SET post_count = post_count + 1
    WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE communities
    SET post_count = post_count - 1
    WHERE id = OLD.community_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_community_post_change
  AFTER INSERT OR DELETE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_community_post_count();

-- Update post comment count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts
    SET comment_count = comment_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_comment_change
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comment_count();

-- Update post like count
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts
    SET like_count = like_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts
    SET like_count = like_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_reaction_change
  AFTER INSERT OR DELETE ON reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_post_like_count();

-- Update poll option vote count
CREATE OR REPLACE FUNCTION update_poll_option_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE poll_options
    SET vote_count = vote_count + 1
    WHERE id = NEW.option_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE poll_options
    SET vote_count = vote_count - 1
    WHERE id = OLD.option_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_poll_vote_change
  AFTER INSERT OR DELETE ON poll_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_poll_option_vote_count();

-- Update comment reply count
CREATE OR REPLACE FUNCTION update_comment_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_comment_id IS NOT NULL THEN
    UPDATE comments
    SET reply_count = reply_count + 1
    WHERE id = NEW.parent_comment_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_comment_id IS NOT NULL THEN
    UPDATE comments
    SET reply_count = reply_count - 1
    WHERE id = OLD.parent_comment_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_reply_change
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_reply_count();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- COMMUNITIES POLICIES
-- ============================================================================

CREATE POLICY "Public communities are viewable by everyone"
  ON communities FOR SELECT
  USING (privacy = 'public' OR auth.uid() = owner_id OR 
    EXISTS (SELECT 1 FROM community_members WHERE community_id = id AND user_id = auth.uid()));

CREATE POLICY "Authenticated users can create communities"
  ON communities FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own communities"
  ON communities FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own communities"
  ON communities FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================================================
-- COMMUNITY MEMBERS POLICIES
-- ============================================================================

CREATE POLICY "Members can view community members"
  ON community_members FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM communities WHERE id = community_id AND privacy = 'public') OR
    EXISTS (SELECT 1 FROM community_members WHERE community_id = community_members.community_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can join public communities"
  ON community_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM communities WHERE id = community_id AND privacy = 'public')
  );

CREATE POLICY "Users can leave communities"
  ON community_members FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Community admins can manage members"
  ON community_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_id = community_members.community_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- POSTS POLICIES
-- ============================================================================

CREATE POLICY "Posts are viewable by community members"
  ON posts FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM communities WHERE id = community_id AND privacy = 'public') OR
    EXISTS (SELECT 1 FROM community_members WHERE community_id = posts.community_id AND user_id = auth.uid())
  );

CREATE POLICY "Community members can create posts"
  ON posts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (SELECT 1 FROM community_members WHERE community_id = posts.community_id AND user_id = auth.uid())
  );

CREATE POLICY "Authors can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = author_id);

-- ============================================================================
-- COMMENTS POLICIES
-- ============================================================================

CREATE POLICY "Comments are viewable by post viewers"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE id = comments.post_id AND (
        EXISTS (SELECT 1 FROM communities WHERE id = posts.community_id AND privacy = 'public') OR
        EXISTS (SELECT 1 FROM community_members WHERE community_id = posts.community_id AND user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Community members can create comments"
  ON comments FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_id = (SELECT community_id FROM posts WHERE id = comments.post_id)
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = author_id);

-- ============================================================================
-- REACTIONS POLICIES
-- ============================================================================

CREATE POLICY "Reactions are viewable by post viewers"
  ON reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE id = reactions.post_id AND (
        EXISTS (SELECT 1 FROM communities WHERE id = posts.community_id AND privacy = 'public') OR
        EXISTS (SELECT 1 FROM community_members WHERE community_id = posts.community_id AND user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Community members can add reactions"
  ON reactions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_id = (SELECT community_id FROM posts WHERE id = reactions.post_id)
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove own reactions"
  ON reactions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- BOOKMARKS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- POLLS POLICIES
-- ============================================================================

CREATE POLICY "Polls are viewable by post viewers"
  ON polls FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE id = polls.post_id AND (
        EXISTS (SELECT 1 FROM communities WHERE id = posts.community_id AND privacy = 'public') OR
        EXISTS (SELECT 1 FROM community_members WHERE community_id = posts.community_id AND user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Post authors can create polls"
  ON polls FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM posts WHERE id = polls.post_id AND author_id = auth.uid())
  );

CREATE POLICY "Post authors can update polls"
  ON polls FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM posts WHERE id = polls.post_id AND author_id = auth.uid())
  );

CREATE POLICY "Post authors can delete polls"
  ON polls FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM posts WHERE id = polls.post_id AND author_id = auth.uid())
  );

-- ============================================================================
-- POLL OPTIONS POLICIES
-- ============================================================================

CREATE POLICY "Poll options are viewable by poll viewers"
  ON poll_options FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM polls WHERE id = poll_options.poll_id)
  );

CREATE POLICY "Poll authors can add options"
  ON poll_options FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls
      JOIN posts ON polls.post_id = posts.id
      WHERE polls.id = poll_options.poll_id AND posts.author_id = auth.uid()
    )
  );

CREATE POLICY "Poll authors can remove options"
  ON poll_options FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM polls
      JOIN posts ON polls.post_id = posts.id
      WHERE polls.id = poll_options.poll_id AND posts.author_id = auth.uid()
    )
  );

-- ============================================================================
-- POLL VOTES POLICIES
-- ============================================================================

CREATE POLICY "Poll votes are viewable by poll viewers"
  ON poll_votes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM polls WHERE id = poll_votes.poll_id)
  );

CREATE POLICY "Community members can vote"
  ON poll_votes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_id = (
        SELECT community_id FROM posts WHERE id = (SELECT post_id FROM polls WHERE id = poll_votes.poll_id)
      )
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove own votes"
  ON poll_votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- COMPLETED
-- ============================================================================

-- ============================================================================
-- Community Module Database Schema
-- Migration: 002_community_module.sql
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE post_type AS ENUM ('text', 'image', 'poll', 'achievement', 'tip');
CREATE TYPE reaction_type AS ENUM ('like', 'love', 'wow', 'sad', 'angry');

-- ============================================================================
-- POSTS TABLE
-- ============================================================================

CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

CREATE INDEX idx_posts_community_id ON public.posts(community_id);
CREATE INDEX idx_posts_author_id ON public.posts(author_id);
CREATE INDEX idx_posts_type ON public.posts(type);
CREATE INDEX idx_posts_is_pinned ON public.posts(is_pinned);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_like_count ON public.posts(like_count DESC);

-- ============================================================================
-- COMMENTS TABLE
-- ============================================================================

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  like_count INTEGER NOT NULL DEFAULT 0,
  reply_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);
CREATE INDEX idx_comments_parent_comment_id ON public.comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at ASC);

-- ============================================================================
-- REACTIONS TABLE
-- ============================================================================

CREATE TABLE public.reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type reaction_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_reactions_post_id ON public.reactions(post_id);
CREATE INDEX idx_reactions_user_id ON public.reactions(user_id);
CREATE INDEX idx_reactions_type ON public.reactions(type);

-- ============================================================================
-- BOOKMARKS TABLE
-- ============================================================================

CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_bookmarks_post_id ON public.bookmarks(post_id);
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);

-- ============================================================================
-- POLLS TABLE
-- ============================================================================

CREATE TABLE public.polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_polls_post_id ON public.polls(post_id);
CREATE INDEX idx_polls_ends_at ON public.polls(ends_at);

-- ============================================================================
-- POLL OPTIONS TABLE
-- ============================================================================

CREATE TABLE public.poll_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_poll_options_poll_id ON public.poll_options(poll_id);

-- ============================================================================
-- POLL VOTES TABLE
-- ============================================================================

CREATE TABLE public.poll_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

CREATE INDEX idx_poll_votes_poll_id ON public.poll_votes(poll_id);
CREATE INDEX idx_poll_votes_option_id ON public.poll_votes(option_id);
CREATE INDEX idx_poll_votes_user_id ON public.poll_votes(user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Apply updated_at trigger to new tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'posts', 'comments'
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
    UPDATE public.communities
    SET member_count = member_count + 1
    WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities
    SET member_count = member_count - 1
    WHERE id = OLD.community_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_community_member_change
  AFTER INSERT OR DELETE ON public.community_members
  FOR EACH ROW
  EXECUTE FUNCTION update_community_member_count();

-- Update community post count
CREATE OR REPLACE FUNCTION update_community_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities
    SET post_count = post_count + 1
    WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities
    SET post_count = post_count - 1
    WHERE id = OLD.community_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_community_post_change
  AFTER INSERT OR DELETE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION update_community_post_count();

-- Update post comment count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts
    SET comment_count = comment_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_comment_change
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comment_count();

-- Update post like count
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts
    SET like_count = like_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts
    SET like_count = like_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_reaction_change
  AFTER INSERT OR DELETE ON public.reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_post_like_count();

-- Update poll option vote count
CREATE OR REPLACE FUNCTION update_poll_option_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.poll_options
    SET vote_count = vote_count + 1
    WHERE id = NEW.option_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.poll_options
    SET vote_count = vote_count - 1
    WHERE id = OLD.option_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_poll_vote_change
  AFTER INSERT OR DELETE ON public.poll_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_poll_option_vote_count();

-- Update comment reply count
CREATE OR REPLACE FUNCTION update_comment_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_comment_id IS NOT NULL THEN
    UPDATE public.comments
    SET reply_count = reply_count + 1
    WHERE id = NEW.parent_comment_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_comment_id IS NOT NULL THEN
    UPDATE public.comments
    SET reply_count = reply_count - 1
    WHERE id = OLD.parent_comment_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_reply_change
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_reply_count();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POSTS POLICIES
-- ============================================================================

CREATE POLICY "Posts are viewable by community members"
  ON public.posts FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.communities WHERE id = community_id AND privacy = 'public') OR
    EXISTS (SELECT 1 FROM public.community_members WHERE community_id = posts.community_id AND user_id = auth.uid())
  );

CREATE POLICY "Community members can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (SELECT 1 FROM public.community_members WHERE community_id = posts.community_id AND user_id = auth.uid())
  );

CREATE POLICY "Authors can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = author_id);

-- ============================================================================
-- COMMENTS POLICIES
-- ============================================================================

CREATE POLICY "Comments are viewable by post viewers"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = comments.post_id AND (
        EXISTS (SELECT 1 FROM public.communities WHERE id = posts.community_id AND privacy = 'public') OR
        EXISTS (SELECT 1 FROM public.community_members WHERE community_id = posts.community_id AND user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Community members can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_id = (SELECT community_id FROM public.posts WHERE id = comments.post_id)
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = author_id);

-- ============================================================================
-- REACTIONS POLICIES
-- ============================================================================

CREATE POLICY "Reactions are viewable by post viewers"
  ON public.reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = reactions.post_id AND (
        EXISTS (SELECT 1 FROM public.communities WHERE id = posts.community_id AND privacy = 'public') OR
        EXISTS (SELECT 1 FROM public.community_members WHERE community_id = posts.community_id AND user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Community members can add reactions"
  ON public.reactions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_id = (SELECT community_id FROM public.posts WHERE id = reactions.post_id)
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove own reactions"
  ON public.reactions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- BOOKMARKS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- POLLS POLICIES
-- ============================================================================

CREATE POLICY "Polls are viewable by post viewers"
  ON public.polls FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = polls.post_id AND (
        EXISTS (SELECT 1 FROM public.communities WHERE id = posts.community_id AND privacy = 'public') OR
        EXISTS (SELECT 1 FROM public.community_members WHERE community_id = posts.community_id AND user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Post authors can create polls"
  ON public.polls FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.posts WHERE id = polls.post_id AND author_id = auth.uid())
  );

CREATE POLICY "Post authors can update polls"
  ON public.polls FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.posts WHERE id = polls.post_id AND author_id = auth.uid())
  );

CREATE POLICY "Post authors can delete polls"
  ON public.polls FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.posts WHERE id = polls.post_id AND author_id = auth.uid())
  );

-- ============================================================================
-- POLL OPTIONS POLICIES
-- ============================================================================

CREATE POLICY "Poll options are viewable by poll viewers"
  ON public.poll_options FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.polls WHERE id = poll_options.poll_id)
  );

CREATE POLICY "Poll authors can add options"
  ON public.poll_options FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.polls
      JOIN public.posts ON polls.post_id = posts.id
      WHERE polls.id = poll_options.poll_id AND posts.author_id = auth.uid()
    )
  );

CREATE POLICY "Poll authors can remove options"
  ON public.poll_options FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.polls
      JOIN public.posts ON polls.post_id = posts.id
      WHERE polls.id = poll_options.poll_id AND posts.author_id = auth.uid()
    )
  );

-- ============================================================================
-- POLL VOTES POLICIES
-- ============================================================================

CREATE POLICY "Poll votes are viewable by poll viewers"
  ON public.poll_votes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.polls WHERE id = poll_votes.poll_id)
  );

CREATE POLICY "Community members can vote"
  ON public.poll_votes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_id = (
        SELECT community_id FROM public.posts WHERE id = (SELECT post_id FROM public.polls WHERE id = poll_votes.poll_id)
      )
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove own votes"
  ON public.poll_votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- COMPLETED
-- ============================================================================

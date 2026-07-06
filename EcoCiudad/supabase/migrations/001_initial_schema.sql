-- ============================================================================
-- EcoCiudad Database Schema - Initial Setup
-- Migration: 001_initial_schema.sql
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('citizen', 'operator', 'admin');
CREATE TYPE report_status AS ENUM ('pending', 'in_review', 'resolved', 'rejected');
CREATE TYPE report_category AS ENUM ('waste', 'pollution', 'green_space', 'water', 'noise', 'other');
CREATE TYPE event_category AS ENUM ('cleanup', 'planting', 'education', 'community', 'workshop');
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE notification_type AS ENUM ('report_update', 'event_reminder', 'achievement', 'points', 'system');
CREATE TYPE collection_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE community_privacy AS ENUM ('public', 'private');
CREATE TYPE community_category AS ENUM ('environmental', 'recycling', 'conservation', 'education', 'cleanup', 'gardening', 'sustainability', 'other');
CREATE TYPE member_role AS ENUM ('owner', 'admin', 'moderator', 'member');

-- ============================================================================
-- USERS (extends Supabase auth.users)
-- ============================================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'citizen',
  is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  eco_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX idx_profiles_eco_points ON public.profiles(eco_points DESC);

-- ============================================================================
-- OPERATORS
-- ============================================================================

CREATE TABLE public.operators (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  specialization TEXT,
  is_certified BOOLEAN NOT NULL DEFAULT FALSE,
  certification_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_operators_employee_id ON public.operators(employee_id);
CREATE INDEX idx_operators_department ON public.operators(department);

-- ============================================================================
-- ADMINISTRATORS
-- ============================================================================

CREATE TABLE public.administrators (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  admin_level INTEGER NOT NULL DEFAULT 1,
  permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_administrators_level ON public.administrators(admin_level);
CREATE INDEX idx_administrators_super_admin ON public.administrators(is_super_admin);

-- ============================================================================
-- REPORTS
-- ============================================================================

CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category report_category NOT NULL,
  status report_status NOT NULL DEFAULT 'pending',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES public.operators(id) ON DELETE SET NULL,
  priority INTEGER NOT NULL DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_reporter_id ON public.reports(reporter_id);
CREATE INDEX idx_reports_assignee_id ON public.reports(assignee_id);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_category ON public.reports(category);
CREATE INDEX idx_reports_priority ON public.reports(priority DESC);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_reports_location ON public.reports USING gist (
  ll_to_earth(latitude, longitude)
);

-- ============================================================================
-- COMMUNITIES
-- ============================================================================

CREATE TABLE public.communities (
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
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_communities_category ON public.communities(category);
CREATE INDEX idx_communities_privacy ON public.communities(privacy);
CREATE INDEX idx_communities_owner_id ON public.communities(owner_id);
CREATE INDEX idx_communities_created_at ON public.communities(created_at DESC);
CREATE INDEX idx_communities_member_count ON public.communities(member_count DESC);

-- ============================================================================
-- COMMUNITY MEMBERS
-- ============================================================================

CREATE TABLE public.community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

CREATE INDEX idx_community_members_community_id ON public.community_members(community_id);
CREATE INDEX idx_community_members_user_id ON public.community_members(user_id);
CREATE INDEX idx_community_members_role ON public.community_members(role);

-- ============================================================================
-- EVENTS
-- ============================================================================

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category event_category NOT NULL,
  status event_status NOT NULL DEFAULT 'upcoming',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  max_attendees INTEGER,
  current_attendees INTEGER NOT NULL DEFAULT 0,
  eco_points_reward INTEGER NOT NULL DEFAULT 10,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date > start_date)
);

CREATE INDEX idx_events_organizer_id ON public.events(organizer_id);
CREATE INDEX idx_events_community_id ON public.events(community_id);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_location ON public.events USING gist (
  ll_to_earth(latitude, longitude)
);

-- ============================================================================
-- EVENT ATTENDEES
-- ============================================================================

CREATE TABLE public.event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_attendees_event_id ON public.event_attendees(event_id);
CREATE INDEX idx_event_attendees_user_id ON public.event_attendees(user_id);
CREATE INDEX idx_event_attendees_status ON public.event_attendees(status);

-- ============================================================================
-- RECYCLING CENTERS
-- ============================================================================

CREATE TABLE public.recycling_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  opening_hours JSONB NOT NULL DEFAULT '{}'::jsonb,
  accepted_materials TEXT[] NOT NULL DEFAULT '{}',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  rating DECIMAL(2,1) CHECK (rating BETWEEN 0 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recycling_centers_location ON public.recycling_centers USING gist (
  ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_recycling_centers_is_verified ON public.recycling_centers(is_verified);
CREATE INDEX idx_recycling_centers_rating ON public.recycling_centers(rating DESC);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  fcm_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================================================
-- ACHIEVEMENTS
-- ============================================================================

CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  category TEXT NOT NULL,
  points_reward INTEGER NOT NULL DEFAULT 0,
  criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_achievements_category ON public.achievements(category);
CREATE INDEX idx_achievements_is_active ON public.achievements(is_active);

-- ============================================================================
-- USER ACHIEVEMENTS
-- ============================================================================

CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  progress INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_is_completed ON public.user_achievements(is_completed);

-- ============================================================================
-- ECO POINTS TRANSACTIONS
-- ============================================================================

CREATE TABLE public.eco_points_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn', 'spend', 'bonus', 'penalty')),
  reason TEXT NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_eco_points_transactions_user_id ON public.eco_points_transactions(user_id);
CREATE INDEX idx_eco_points_transactions_type ON public.eco_points_transactions(type);
CREATE INDEX idx_eco_points_transactions_created_at ON public.eco_points_transactions(created_at DESC);

-- ============================================================================
-- FAVORITES
-- ============================================================================

CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('report', 'event', 'community', 'recycling_center')),
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_target ON public.favorites(target_type, target_id);

-- ============================================================================
-- USER SETTINGS
-- ============================================================================

CREATE TABLE public.user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'es')),
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  location_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  fcm_token TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);

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
      'profiles', 'operators', 'administrators', 'reports', 'communities',
      'events', 'event_attendees', 'recycling_centers', 'notifications',
      'achievements', 'user_achievements', 'user_settings'
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

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'citizen')
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update eco points
CREATE OR REPLACE FUNCTION public.update_eco_points()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles
    SET eco_points = eco_points + NEW.amount
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_eco_points_transaction
  AFTER INSERT ON public.eco_points_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_eco_points();

-- Update event attendees count
CREATE OR REPLACE FUNCTION public.update_event_attendees_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.events
    SET current_attendees = current_attendees + 1
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.events
    SET current_attendees = current_attendees - 1
    WHERE id = OLD.event_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_event_attendee_change
  AFTER INSERT OR DELETE ON public.event_attendees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_event_attendees_count();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recycling_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.administrators
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.administrators
      WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- REPORTS POLICIES
-- ============================================================================

CREATE POLICY "Reports are viewable by everyone"
  ON public.reports FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can update own reports"
  ON public.reports FOR UPDATE
  USING (auth.uid() = reporter_id);

CREATE POLICY "Operators can update assigned reports"
  ON public.reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.operators
      WHERE id = auth.uid() AND id = assignee_id
    )
  );

CREATE POLICY "Admins can manage all reports"
  ON public.reports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.administrators
      WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- COMMUNITIES POLICIES
-- ============================================================================

CREATE POLICY "Public communities are viewable by everyone"
  ON public.communities FOR SELECT
  USING (privacy = 'public' OR auth.uid() = owner_id);

CREATE POLICY "Authenticated users can create communities"
  ON public.communities FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own communities"
  ON public.communities FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own communities"
  ON public.communities FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================================================
-- COMMUNITY MEMBERS POLICIES
-- ============================================================================

CREATE POLICY "Community members are viewable by community members"
  ON public.community_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = community_members.community_id
      AND cm.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.communities c
      WHERE c.id = community_members.community_id
      AND c.privacy = 'public'
    )
  );

CREATE POLICY "Users can join public communities"
  ON public.community_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.communities
      WHERE id = community_id AND privacy = 'public'
    )
  );

CREATE POLICY "Users can leave communities"
  ON public.community_members FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Community admins can manage members"
  ON public.community_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_id = community_members.community_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- EVENTS POLICIES
-- ============================================================================

CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete own events"
  ON public.events FOR DELETE
  USING (auth.uid() = organizer_id);

-- ============================================================================
-- EVENT ATTENDEES POLICIES
-- ============================================================================

CREATE POLICY "Event attendees are viewable by event participants"
  ON public.event_attendees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.event_attendees ea
      WHERE ea.event_id = event_attendees.event_id
      AND ea.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can register for events"
  ON public.event_attendees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel own registrations"
  ON public.event_attendees FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RECYCLING CENTERS POLICIES
-- ============================================================================

CREATE POLICY "Recycling centers are viewable by everyone"
  ON public.recycling_centers FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage recycling centers"
  ON public.recycling_centers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.administrators
      WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- ACHIEVEMENTS POLICIES
-- ============================================================================

CREATE POLICY "Achievements are viewable by everyone"
  ON public.achievements FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage achievements"
  ON public.achievements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.administrators
      WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- USER ACHIEVEMENTS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create user achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update user achievements"
  ON public.user_achievements FOR UPDATE
  USING (true);

-- ============================================================================
-- ECO POINTS TRANSACTIONS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own transactions"
  ON public.eco_points_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create transactions"
  ON public.eco_points_transactions FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- FAVORITES POLICIES
-- ============================================================================

CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- USER SETTINGS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- VIEWS
-- ============================================================================

CREATE OR REPLACE VIEW public.user_stats AS
SELECT
  p.id,
  p.display_name,
  p.eco_points,
  p.level,
  COUNT(DISTINCT r.id) AS reports_count,
  COUNT(DISTINCT ea.id) AS events_attended,
  COUNT(DISTINCT ua.id) AS achievements_unlocked,
  COUNT(DISTINCT cm.id) AS communities_count
FROM public.profiles p
LEFT JOIN public.reports r ON r.reporter_id = p.id
LEFT JOIN public.event_attendees ea ON ea.user_id = p.id AND ea.status = 'attended'
LEFT JOIN public.user_achievements ua ON ua.user_id = p.id AND ua.is_completed = true
LEFT JOIN public.community_members cm ON cm.user_id = p.id
GROUP BY p.id, p.display_name, p.eco_points, p.level;

CREATE OR REPLACE VIEW public.active_reports AS
SELECT
  r.*,
  p.display_name AS reporter_name,
  p.avatar_url AS reporter_avatar
FROM public.reports r
JOIN public.profiles p ON p.id = r.reporter_id
WHERE r.status IN ('pending', 'in_review')
ORDER BY r.created_at DESC;

CREATE OR REPLACE VIEW public.upcoming_events AS
SELECT
  e.*,
  p.display_name AS organizer_name,
  c.name AS community_name
FROM public.events e
JOIN public.profiles p ON p.id = e.organizer_id
LEFT JOIN public.communities c ON c.id = e.community_id
WHERE e.status = 'upcoming' AND e.start_date > NOW()
ORDER BY e.start_date ASC;

-- ============================================================================
-- SEED DATA
-- ============================================================================

INSERT INTO public.achievements (name, description, category, points_reward, criteria) VALUES
  ('First Report', 'Submit your first environmental report', 'reporting', 50, '{"type": "reports", "count": 1}'::jsonb),
  ('Eco Warrior', 'Submit 10 environmental reports', 'reporting', 200, '{"type": "reports", "count": 10}'::jsonb),
  ('Community Builder', 'Create your first community', 'community', 100, '{"type": "communities_created", "count": 1}'::jsonb),
  ('Event Organizer', 'Organize your first event', 'events', 100, '{"type": "events_organized", "count": 1}'::jsonb),
  ('Active Participant', 'Attend 5 community events', 'events', 150, '{"type": "events_attended", "count": 5}'::jsonb),
  ('Recycling Champion', 'Recycle 100kg of materials', 'recycling', 300, '{"type": "recycled_kg", "count": 100}'::jsonb),
  ('Neighborhood Hero', 'Help resolve 20 reports in your area', 'reporting', 500, '{"type": "reports_resolved", "count": 20}'::jsonb),
  ('Social Butterfly', 'Join 5 communities', 'community', 100, '{"type": "communities_joined", "count": 5}'::jsonb);

-- ============================================================================
-- COMPLETED
-- ============================================================================

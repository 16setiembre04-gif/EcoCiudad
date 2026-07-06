-- ============================================================================
-- EcoCiudad Admin Module
-- Migration: 006_admin_module.sql
-- Dashboard views, activity logs, system settings
-- ============================================================================

-- ============================================================================
-- ADMIN ACTIVITY LOGS
-- ============================================================================

CREATE TABLE public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin_id ON public.admin_activity_logs(admin_id);
CREATE INDEX idx_admin_logs_action ON public.admin_activity_logs(action);
CREATE INDEX idx_admin_logs_entity_type ON public.admin_activity_logs(entity_type);
CREATE INDEX idx_admin_logs_created_at ON public.admin_activity_logs(created_at DESC);

-- ============================================================================
-- SYSTEM SETTINGS
-- ============================================================================

CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  type TEXT NOT NULL DEFAULT 'string',
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_system_settings_key ON public.system_settings(key);

-- ============================================================================
-- VIEWS: DASHBOARD STATS
-- ============================================================================

CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM public.profiles WHERE is_active = TRUE) AS total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'citizen' AND is_active = TRUE) AS total_citizens,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'operator' AND is_active = TRUE) AS total_operators,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin' AND is_active = TRUE) AS total_admins,
  (SELECT COUNT(*) FROM public.communities) AS total_communities,
  (SELECT COUNT(*) FROM public.events) AS total_events,
  (SELECT COUNT(*) FROM public.events WHERE status = 'upcoming' AND start_date >= NOW()) AS upcoming_events,
  (SELECT COUNT(*) FROM public.reports) AS total_reports,
  (SELECT COUNT(*) FROM public.reports WHERE status = 'resolved') AS resolved_reports,
  (SELECT COUNT(*) FROM public.reports WHERE status = 'pending') AS pending_reports,
  (SELECT COUNT(*) FROM public.reports WHERE status = 'in_review') AS in_progress_reports,
  (SELECT COUNT(*) FROM public.reports WHERE status = 'rejected') AS rejected_reports,
  (SELECT COUNT(*) FROM public.recycling_centers) AS total_recycling_centers,
  (SELECT COUNT(*) FROM public.achievements WHERE is_active = TRUE) AS total_achievements,
  (SELECT COALESCE(SUM(eco_points), 0) FROM public.profiles) AS eco_points_distributed;

-- ============================================================================
-- FUNCTION: GET ACTIVITY DATA (weekly/monthly)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_admin_activity_data(
  p_start_date TIMESTAMPTZ DEFAULT (NOW() - INTERVAL '30 days'),
  p_end_date TIMESTAMPTZ DEFAULT NOW(),
  p_group_by TEXT DEFAULT 'day'
)
RETURNS TABLE (
  date TEXT,
  reports BIGINT,
  users BIGINT,
  events BIGINT,
  communities BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      p_start_date::date,
      p_end_date::date,
      CASE p_group_by
        WHEN 'day' THEN INTERVAL '1 day'
        WHEN 'week' THEN INTERVAL '1 week'
        WHEN 'month' THEN INTERVAL '1 month'
        ELSE INTERVAL '1 day'
      END
    )::date AS date
  )
  SELECT
    ds.date::text AS date,
    (SELECT COUNT(*) FROM public.reports r
     WHERE r.created_at::date >= ds.date
     AND r.created_at::date < ds.date + CASE p_group_by
       WHEN 'day' THEN INTERVAL '1 day'
       WHEN 'week' THEN INTERVAL '1 week'
       WHEN 'month' THEN INTERVAL '1 month'
       ELSE INTERVAL '1 day'
     END
    ) AS reports,
    (SELECT COUNT(*) FROM public.profiles p
     WHERE p.created_at::date >= ds.date
     AND p.created_at::date < ds.date + CASE p_group_by
       WHEN 'day' THEN INTERVAL '1 day'
       WHEN 'week' THEN INTERVAL '1 week'
       WHEN 'month' THEN INTERVAL '1 month'
       ELSE INTERVAL '1 day'
     END
    ) AS users,
    (SELECT COUNT(*) FROM public.events e
     WHERE e.created_at::date >= ds.date
     AND e.created_at::date < ds.date + CASE p_group_by
       WHEN 'day' THEN INTERVAL '1 day'
       WHEN 'week' THEN INTERVAL '1 week'
       WHEN 'month' THEN INTERVAL '1 month'
       ELSE INTERVAL '1 day'
     END
    ) AS events,
    (SELECT COUNT(*) FROM public.communities c
     WHERE c.created_at::date >= ds.date
     AND c.created_at::date < ds.date + CASE p_group_by
       WHEN 'day' THEN INTERVAL '1 day'
       WHEN 'week' THEN INTERVAL '1 week'
       WHEN 'month' THEN INTERVAL '1 month'
       ELSE INTERVAL '1 day'
     END
    ) AS communities
  FROM date_series ds
  ORDER BY ds.date;
END;
$$;

-- ============================================================================
-- FUNCTION: REPORTS BY CATEGORY
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_reports_by_category()
RETURNS TABLE (
  category TEXT,
  count BIGINT,
  percentage NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
  total_count BIGINT;
BEGIN
  SELECT COUNT(*) INTO total_count FROM public.reports;

  RETURN QUERY
  SELECT
    r.category::text AS category,
    COUNT(*) AS count,
    CASE
      WHEN total_count > 0 THEN ROUND((COUNT(*)::numeric / total_count::numeric) * 100, 1)
      ELSE 0
    END AS percentage
  FROM public.reports r
  GROUP BY r.category
  ORDER BY count DESC;
END;
$$;

-- ============================================================================
-- FUNCTION: REPORTS BY DISTRICT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_reports_by_district()
RETURNS TABLE (
  district TEXT,
  count BIGINT,
  percentage NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
  total_count BIGINT;
BEGIN
  SELECT COUNT(*) INTO total_count FROM public.reports;

  RETURN QUERY
  SELECT
    COALESCE(r.address, 'Unknown') AS district,
    COUNT(*) AS count,
    CASE
      WHEN total_count > 0 THEN ROUND((COUNT(*)::numeric / total_count::numeric) * 100, 1)
      ELSE 0
    END AS percentage
  FROM public.reports r
  GROUP BY r.address
  ORDER BY count DESC
  LIMIT 10;
END;
$$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_admin_activity_logs_updated_at
  BEFORE UPDATE ON public.admin_activity_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity logs"
  ON public.admin_activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert activity logs"
  ON public.admin_activity_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view system settings"
  ON public.system_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update system settings"
  ON public.system_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Public settings are viewable by everyone"
  ON public.system_settings FOR SELECT
  USING (is_public = TRUE);

-- ============================================================================
-- COMPLETED
-- ============================================================================

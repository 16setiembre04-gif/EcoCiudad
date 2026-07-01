-- ============================================================================
-- Operator Module Database Migration
-- ============================================================================

-- Add operator-specific columns to reports table
ALTER TABLE reports ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical'));
ALTER TABLE reports ADD COLUMN IF NOT EXISTS resolution_photos TEXT[];
ALTER TABLE reports ADD COLUMN IF NOT EXISTS estimated_completion TIMESTAMPTZ;

-- Create operator_assignments table
CREATE TABLE IF NOT EXISTS operator_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(report_id, operator_id)
);

CREATE INDEX idx_operator_assignments_report_id ON operator_assignments(report_id);
CREATE INDEX idx_operator_assignments_operator_id ON operator_assignments(operator_id);
CREATE INDEX idx_operator_assignments_status ON operator_assignments(status);

-- Create operator_activity_logs table
CREATE TABLE IF NOT EXISTS operator_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN (
    'report_assigned',
    'status_updated',
    'report_resolved',
    'report_rejected',
    'notes_added',
    'photos_uploaded',
    'route_started',
    'route_completed'
  )),
  details TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_operator_activity_logs_operator_id ON operator_activity_logs(operator_id);
CREATE INDEX idx_operator_activity_logs_report_id ON operator_activity_logs(report_id);
CREATE INDEX idx_operator_activity_logs_action ON operator_activity_logs(action);
CREATE INDEX idx_operator_activity_logs_created_at ON operator_activity_logs(created_at DESC);

-- Enable RLS on new tables
ALTER TABLE operator_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for operator_assignments
CREATE POLICY "Operators can view their own assignments"
  ON operator_assignments FOR SELECT
  USING (auth.uid() = operator_id OR auth.uid() = assigned_by);

CREATE POLICY "Admins can view all assignments"
  ON operator_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM administrators
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can create assignments"
  ON operator_assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM administrators
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Operators can update their own assignments"
  ON operator_assignments FOR UPDATE
  USING (auth.uid() = operator_id);

-- RLS Policies for operator_activity_logs
CREATE POLICY "Operators can view their own activity logs"
  ON operator_activity_logs FOR SELECT
  USING (auth.uid() = operator_id);

CREATE POLICY "Admins can view all activity logs"
  ON operator_activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM administrators
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Operators can create their own activity logs"
  ON operator_activity_logs FOR INSERT
  WITH CHECK (auth.uid() = operator_id);

-- Function to automatically log report status changes
CREATE OR REPLACE FUNCTION log_report_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO operator_activity_logs (operator_id, report_id, action, details)
    VALUES (
      COALESCE(NEW.assignee_id, auth.uid()),
      NEW.id,
      CASE
        WHEN NEW.status = 'resolved' THEN 'report_resolved'
        WHEN NEW.status = 'rejected' THEN 'report_rejected'
        ELSE 'status_updated'
      END,
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_report_status_change
  AFTER UPDATE ON reports
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION log_report_status_change();

-- Function to automatically log report assignments
CREATE OR REPLACE FUNCTION log_report_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.assignee_id IS NOT NULL AND OLD.assignee_id IS DISTINCT FROM NEW.assignee_id THEN
    INSERT INTO operator_activity_logs (operator_id, report_id, action, details)
    VALUES (
      NEW.assignee_id,
      NEW.id,
      'report_assigned',
      jsonb_build_object('assigned_by', auth.uid())
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_report_assignment
  AFTER UPDATE ON reports
  FOR EACH ROW
  WHEN (OLD.assignee_id IS DISTINCT FROM NEW.assignee_id)
  EXECUTE FUNCTION log_report_assignment();

-- Function to calculate operator statistics
CREATE OR REPLACE FUNCTION calculate_operator_stats(operator_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_assigned', COUNT(*) FILTER (WHERE oa.status = 'active'),
    'pending_reports', COUNT(*) FILTER (WHERE r.status IN ('pending', 'assigned', 'in_progress')),
    'resolved_today', COUNT(*) FILTER (WHERE r.status = 'resolved' AND r.resolved_at >= CURRENT_DATE),
    'resolved_this_week', COUNT(*) FILTER (WHERE r.status = 'resolved' AND r.resolved_at >= CURRENT_DATE - INTERVAL '7 days'),
    'resolved_this_month', COUNT(*) FILTER (WHERE r.status = 'resolved' AND r.resolved_at >= CURRENT_DATE - INTERVAL '30 days'),
    'average_resolution_time', COALESCE(AVG(EXTRACT(EPOCH FROM (r.resolved_at - r.created_at)) / 3600), 0),
    'completion_rate', CASE
      WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE r.status = 'resolved')::FLOAT / COUNT(*) * 100)
      ELSE 0
    END
  ) INTO result
  FROM operator_assignments oa
  JOIN reports r ON r.id = oa.report_id
  WHERE oa.operator_id = operator_uuid;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMPLETED
-- ============================================================================

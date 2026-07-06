-- ============================================================================
-- Events Module - Database Migration
-- Migration: 003_events_module.sql
-- ============================================================================

-- Add new columns to events table
ALTER TABLE public.events ADD COLUMN banner_url TEXT;
ALTER TABLE public.events ADD COLUMN requirements TEXT[];
ALTER TABLE public.events ADD COLUMN is_virtual BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.events ADD COLUMN meeting_link TEXT;

-- Create event_reminders table
CREATE TABLE public.event_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reminder_before INTEGER NOT NULL,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('push', 'email', 'sms')),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id, reminder_before, reminder_type)
);

-- Create indexes for event_reminders
CREATE INDEX idx_event_reminders_event_id ON public.event_reminders(event_id);
CREATE INDEX idx_event_reminders_user_id ON public.event_reminders(user_id);
CREATE INDEX idx_event_reminders_sent_at ON public.event_reminders(sent_at);

-- Add reminder_enabled column to event_attendees
ALTER TABLE public.event_attendees ADD COLUMN reminder_enabled BOOLEAN NOT NULL DEFAULT TRUE;

-- Enable RLS on event_reminders
ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_reminders
CREATE POLICY "Users can view own reminders"
  ON public.event_reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reminders"
  ON public.event_reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON public.event_reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON public.event_reminders FOR DELETE
  USING (auth.uid() = user_id);

-- Function to get nearby events
CREATE OR REPLACE FUNCTION get_nearby_events(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_km INTEGER DEFAULT 50
)
RETURNS SETOF public.events AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.events
  WHERE status = 'upcoming'
    AND start_date >= NOW()
    AND (
      6371 * acos(
        cos(radians(lat)) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(lng)) +
        sin(radians(lat)) * sin(radians(latitude))
      )
    ) <= radius_km
  ORDER BY start_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send event reminders
CREATE OR REPLACE FUNCTION send_event_reminders()
RETURNS void AS $$
DECLARE
  reminder RECORD;
  event_record public.events%ROWTYPE;
  time_until_event INTERVAL;
BEGIN
  FOR reminder IN
    SELECT er.*, e.start_date, e.title
    FROM public.event_reminders er
    JOIN public.events e ON er.event_id = e.id
    WHERE er.sent_at IS NULL
      AND e.status = 'upcoming'
      AND e.start_date > NOW()
  LOOP
    time_until_event := reminder.start_date - NOW();
    
    IF EXTRACT(EPOCH FROM time_until_event) / 60 <= reminder.reminder_before THEN
      UPDATE public.event_reminders
      SET sent_at = NOW()
      WHERE id = reminder.id;
      
      INSERT INTO public.notifications (user_id, type, title, body, data)
      VALUES (
        reminder.user_id,
        'event_reminder',
        'Event Reminder',
        format('"%s" starts in %s minutes', reminder.title, reminder.reminder_before),
        jsonb_build_object('event_id', reminder.event_id)
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule reminder job (requires pg_cron extension)
-- SELECT cron.schedule('send-event-reminders', '*/5 * * * *', 'SELECT send_event_reminders()');

-- ============================================================================
-- COMPLETED
-- ============================================================================

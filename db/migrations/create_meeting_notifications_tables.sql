-- Create meeting notifications table
CREATE TABLE IF NOT EXISTS meeting_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meeting_id TEXT NOT NULL,
  meeting_title TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  dismissed BOOLEAN NOT NULL DEFAULT FALSE,
  calendar_source TEXT,
  meeting_time TEXT,
  meeting_date DATE,
  location TEXT,
  attendees TEXT[],
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS meeting_notifications_user_id_idx ON meeting_notifications(user_id);

-- Create index on read status for faster filtering
CREATE INDEX IF NOT EXISTS meeting_notifications_read_idx ON meeting_notifications(user_id, read);

-- Create index on dismissed status for faster filtering
CREATE INDEX IF NOT EXISTS meeting_notifications_dismissed_idx ON meeting_notifications(user_id, dismissed);

-- Create meeting notification preferences table
CREATE TABLE IF NOT EXISTS meeting_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  upcoming_meetings BOOLEAN NOT NULL DEFAULT TRUE,
  upcoming_meetings_time INTEGER NOT NULL DEFAULT 15,
  meeting_changes BOOLEAN NOT NULL DEFAULT TRUE,
  meeting_cancellations BOOLEAN NOT NULL DEFAULT TRUE,
  new_invitations BOOLEAN NOT NULL DEFAULT TRUE,
  daily_agenda BOOLEAN NOT NULL DEFAULT TRUE,
  daily_agenda_time TEXT NOT NULL DEFAULT '08:00',
  sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  browser_notifications_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  email_notifications_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT meeting_notification_preferences_user_id_key UNIQUE (user_id)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_meeting_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_meeting_notification_preferences_updated_at
BEFORE UPDATE ON meeting_notification_preferences
FOR EACH ROW
EXECUTE FUNCTION update_meeting_notification_preferences_updated_at();

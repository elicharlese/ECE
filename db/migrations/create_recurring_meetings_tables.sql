-- Create recurring meetings table
CREATE TABLE IF NOT EXISTS recurring_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT NOT NULL,
  recurrence_pattern TEXT NOT NULL, -- daily, weekly, biweekly, monthly, yearly
  recurrence_interval INTEGER NOT NULL DEFAULT 1,
  days_of_week INTEGER[], -- 0-6 (Sunday-Saturday)
  day_of_month INTEGER, -- 1-31
  month_of_year INTEGER, -- 1-12
  start_date DATE NOT NULL,
  end_date DATE,
  end_after_occurrences INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create recurring meeting attendees table
CREATE TABLE IF NOT EXISTS recurring_meeting_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recurring_meeting_id UUID NOT NULL REFERENCES recurring_meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, declined, tentative
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(recurring_meeting_id, user_id)
);

-- Create recurring meeting exceptions table
CREATE TABLE IF NOT EXISTS recurring_meeting_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recurring_meeting_id UUID NOT NULL REFERENCES recurring_meetings(id) ON DELETE CASCADE,
  exception_date DATE NOT NULL,
  is_cancelled BOOLEAN NOT NULL DEFAULT TRUE,
  title TEXT,
  description TEXT,
  location TEXT,
  start_time TIME,
  end_time TIME,
  timezone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(recurring_meeting_id, exception_date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS recurring_meetings_user_id_idx ON recurring_meetings(user_id);
CREATE INDEX IF NOT EXISTS recurring_meeting_attendees_user_id_idx ON recurring_meeting_attendees(user_id);
CREATE INDEX IF NOT EXISTS recurring_meeting_attendees_meeting_id_idx ON recurring_meeting_attendees(recurring_meeting_id);
CREATE INDEX IF NOT EXISTS recurring_meeting_exceptions_meeting_id_idx ON recurring_meeting_exceptions(recurring_meeting_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_recurring_meetings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_recurring_meetings_updated_at
BEFORE UPDATE ON recurring_meetings
FOR EACH ROW
EXECUTE FUNCTION update_recurring_meetings_updated_at();

CREATE TRIGGER update_recurring_meeting_attendees_updated_at
BEFORE UPDATE ON recurring_meeting_attendees
FOR EACH ROW
EXECUTE FUNCTION update_recurring_meetings_updated_at();

CREATE TRIGGER update_recurring_meeting_exceptions_updated_at
BEFORE UPDATE ON recurring_meeting_exceptions
FOR EACH ROW
EXECUTE FUNCTION update_recurring_meetings_updated_at();

CREATE TABLE IF NOT EXISTS timezone_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_timezone TEXT NOT NULL DEFAULT 'UTC',
  show_multiple_timezones BOOLEAN NOT NULL DEFAULT FALSE,
  additional_timezones TEXT[] NOT NULL DEFAULT '{}',
  format_24_hour BOOLEAN NOT NULL DEFAULT FALSE,
  show_timezone_indicator BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timezone_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_timezone_preferences_updated_at
BEFORE UPDATE ON timezone_preferences
FOR EACH ROW
EXECUTE FUNCTION update_timezone_preferences_updated_at();

-- Create table to track deleted accounts for recovery
CREATE TABLE IF NOT EXISTS deleted_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  recovery_code TEXT NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_recovered BOOLEAN NOT NULL DEFAULT FALSE,
  recovered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_deleted_accounts_user_id ON deleted_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_deleted_accounts_recovery_code ON deleted_accounts(recovery_code);

-- Create function to permanently delete expired accounts
CREATE OR REPLACE FUNCTION permanently_delete_expired_accounts()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find expired accounts that haven't been recovered
  FOR user_record IN 
    SELECT user_id 
    FROM deleted_accounts 
    WHERE expires_at < NOW() 
    AND is_recovered = FALSE
  LOOP
    -- Permanently delete the user
    PERFORM auth.users.delete(user_record.user_id);
    
    -- Update the record to mark as permanently deleted
    UPDATE deleted_accounts 
    SET permanently_deleted_at = NOW() 
    WHERE user_id = user_record.user_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

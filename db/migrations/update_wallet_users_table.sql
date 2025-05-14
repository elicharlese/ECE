-- Add is_primary column to wallet_users table
ALTER TABLE wallet_users ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;

-- Create a function to ensure only one primary wallet per user
CREATE OR REPLACE FUNCTION ensure_single_primary_wallet()
RETURNS TRIGGER AS $$
BEGIN
  -- If the new/updated row is being set as primary
  IF NEW.is_primary THEN
    -- Set all other wallets for this user to non-primary
    UPDATE wallet_users
    SET is_primary = false
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to enforce the single primary wallet rule
DROP TRIGGER IF EXISTS ensure_single_primary_wallet_trigger ON wallet_users;
CREATE TRIGGER ensure_single_primary_wallet_trigger
BEFORE INSERT OR UPDATE OF is_primary ON wallet_users
FOR EACH ROW
WHEN (NEW.is_primary = true)
EXECUTE FUNCTION ensure_single_primary_wallet();

-- Create a function to ensure at least one primary wallet per user
CREATE OR REPLACE FUNCTION ensure_at_least_one_primary_wallet()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this user has any primary wallets
  IF NOT EXISTS (
    SELECT 1 FROM wallet_users 
    WHERE user_id = NEW.user_id AND is_primary = true
  ) THEN
    -- Set the newest wallet as primary
    UPDATE wallet_users
    SET is_primary = true
    WHERE id = (
      SELECT id FROM wallet_users
      WHERE user_id = NEW.user_id
      ORDER BY created_at DESC
      LIMIT 1
    );
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to ensure at least one primary wallet
DROP TRIGGER IF EXISTS ensure_at_least_one_primary_wallet_trigger ON wallet_users;
CREATE TRIGGER ensure_at_least_one_primary_wallet_trigger
AFTER INSERT ON wallet_users
FOR EACH STATEMENT
EXECUTE FUNCTION ensure_at_least_one_primary_wallet();

-- Create wallet_users table
CREATE TABLE IF NOT EXISTS wallet_users (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  wallet_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create index on wallet_address for faster lookups
CREATE INDEX IF NOT EXISTS wallet_users_wallet_address_idx ON wallet_users(wallet_address);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_wallet_users_updated_at
BEFORE UPDATE ON wallet_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

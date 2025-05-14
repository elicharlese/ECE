-- Add parent_id to messages table to support threading
ALTER TABLE IF EXISTS messages 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES messages(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS thread_count INTEGER DEFAULT 0;

-- Create index for faster thread queries
CREATE INDEX IF NOT EXISTS idx_messages_parent_id ON messages(parent_id);

-- Create function to update thread count on the parent message
CREATE OR REPLACE FUNCTION update_thread_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    -- Increment thread count on parent message
    UPDATE messages
    SET thread_count = thread_count + 1
    WHERE id = NEW.parent_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update thread count when a reply is added
CREATE TRIGGER update_thread_count_on_insert
AFTER INSERT ON messages
FOR EACH ROW
WHEN (NEW.parent_id IS NOT NULL)
EXECUTE FUNCTION update_thread_count();

-- Create function to update thread count when a reply is deleted
CREATE OR REPLACE FUNCTION update_thread_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.parent_id IS NOT NULL THEN
    -- Decrement thread count on parent message
    UPDATE messages
    SET thread_count = thread_count - 1
    WHERE id = OLD.parent_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update thread count when a reply is deleted
CREATE TRIGGER update_thread_count_on_delete
AFTER DELETE ON messages
FOR EACH ROW
WHEN (OLD.parent_id IS NOT NULL)
EXECUTE FUNCTION update_thread_count_on_delete();

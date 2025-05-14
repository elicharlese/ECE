CREATE OR REPLACE FUNCTION search_messages(search_query TEXT)
RETURNS TABLE (
  id UUID,
  channel_id UUID,
  user_id UUID,
  content TEXT,
  created_at TIMESTAMPTZ,
  parent_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.channel_id,
    m.user_id,
    m.content,
    m.created_at,
    m.parent_id
  FROM 
    messages m
  JOIN 
    channel_members cm ON m.channel_id = cm.channel_id
  WHERE 
    cm.user_id = auth.uid() -- Only search in channels the user is a member of
    AND (
      m.content ILIKE '%' || search_query || '%'
    )
  ORDER BY 
    m.created_at DESC
  LIMIT 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TABLE IF NOT EXISTS marketplace_bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  amount DECIMAL(18, 8) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  outbid BOOLEAN DEFAULT FALSE,
  outbid_at TIMESTAMP WITH TIME ZONE,
  outbid_by UUID REFERENCES auth.users(id),
  bid_increment DECIMAL(18, 8) DEFAULT 0,
  auto_bid_max DECIMAL(18, 8),
  auto_bid_enabled BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS marketplace_bids_product_id_idx ON marketplace_bids(product_id);
CREATE INDEX IF NOT EXISTS marketplace_bids_user_id_idx ON marketplace_bids(user_id);
CREATE INDEX IF NOT EXISTS marketplace_bids_status_idx ON marketplace_bids(status);
CREATE INDEX IF NOT EXISTS marketplace_bids_created_at_idx ON marketplace_bids(created_at);

CREATE TABLE IF NOT EXISTS marketplace_auctions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL UNIQUE,
  start_price DECIMAL(18, 8) NOT NULL,
  reserve_price DECIMAL(18, 8),
  min_bid_increment DECIMAL(18, 8) NOT NULL DEFAULT 1,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  winner_id UUID REFERENCES auth.users(id),
  winning_bid_id UUID REFERENCES marketplace_bids(id),
  featured BOOLEAN DEFAULT FALSE,
  trending_score INTEGER DEFAULT 0,
  total_bids INTEGER DEFAULT 0,
  watchers INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS marketplace_auctions_product_id_idx ON marketplace_auctions(product_id);
CREATE INDEX IF NOT EXISTS marketplace_auctions_status_idx ON marketplace_auctions(status);
CREATE INDEX IF NOT EXISTS marketplace_auctions_end_time_idx ON marketplace_auctions(end_time);
CREATE INDEX IF NOT EXISTS marketplace_auctions_trending_score_idx ON marketplace_auctions(trending_score);

CREATE TABLE IF NOT EXISTS marketplace_auction_watchers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auction_id UUID NOT NULL REFERENCES marketplace_auctions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notification_preferences JSONB DEFAULT '{"bid_outbid": true, "auction_ending": true, "auction_won": true, "price_drop": true}'::jsonb,
  UNIQUE(auction_id, user_id)
);

CREATE INDEX IF NOT EXISTS marketplace_auction_watchers_auction_id_idx ON marketplace_auction_watchers(auction_id);
CREATE INDEX IF NOT EXISTS marketplace_auction_watchers_user_id_idx ON marketplace_auction_watchers(user_id);

CREATE TABLE IF NOT EXISTS marketplace_feed_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id UUID,
  auction_id UUID REFERENCES marketplace_auctions(id) ON DELETE CASCADE,
  bid_id UUID REFERENCES marketplace_bids(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visibility VARCHAR(20) NOT NULL DEFAULT 'public'
);

CREATE INDEX IF NOT EXISTS marketplace_feed_items_type_idx ON marketplace_feed_items(type);
CREATE INDEX IF NOT EXISTS marketplace_feed_items_created_at_idx ON marketplace_feed_items(created_at);
CREATE INDEX IF NOT EXISTS marketplace_feed_items_user_id_idx ON marketplace_feed_items(user_id);
CREATE INDEX IF NOT EXISTS marketplace_feed_items_product_id_idx ON marketplace_feed_items(product_id);
CREATE INDEX IF NOT EXISTS marketplace_feed_items_auction_id_idx ON marketplace_feed_items(auction_id);

-- Function to update trending score based on bid activity
CREATE OR REPLACE FUNCTION update_auction_trending_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE marketplace_auctions
  SET 
    trending_score = trending_score + 5,
    total_bids = total_bids + 1,
    updated_at = NOW()
  WHERE id = NEW.product_id;
  
  -- Insert feed item for new bid
  INSERT INTO marketplace_feed_items (type, user_id, product_id, auction_id, bid_id, data)
  VALUES ('new_bid', NEW.user_id, NEW.product_id, 
    (SELECT id FROM marketplace_auctions WHERE product_id = NEW.product_id),
    NEW.id,
    json_build_object(
      'amount', NEW.amount,
      'product_id', NEW.product_id
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_bid_insert
AFTER INSERT ON marketplace_bids
FOR EACH ROW
EXECUTE FUNCTION update_auction_trending_score();

-- Function to update watchers count
CREATE OR REPLACE FUNCTION update_auction_watchers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE marketplace_auctions
    SET watchers = watchers + 1
    WHERE id = NEW.auction_id;
    
    -- Insert feed item for new watcher
    INSERT INTO marketplace_feed_items (type, user_id, auction_id, data)
    VALUES ('new_watcher', NEW.user_id, NEW.auction_id, 
      json_build_object(
        'auction_id', NEW.auction_id
      )
    );
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE marketplace_auctions
    SET watchers = watchers - 1
    WHERE id = OLD.auction_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_watcher_change
AFTER INSERT OR DELETE ON marketplace_auction_watchers
FOR EACH ROW
EXECUTE FUNCTION update_auction_watchers_count();

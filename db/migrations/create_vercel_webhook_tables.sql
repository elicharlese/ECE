-- This migration creates tables for Vercel webhook events
-- Run this manually when you're ready to implement the database storage

-- Table for storing raw webhook events
CREATE TABLE IF NOT EXISTS vercel_webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  read BOOLEAN DEFAULT FALSE
);

-- Table for storing processed deployment data
CREATE TABLE IF NOT EXISTS vercel_deployments (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES vercel_webhook_events(id),
  project_id TEXT,
  project_name TEXT,
  url TEXT,
  creator TEXT,
  branch TEXT,
  commit_message TEXT,
  commit_sha TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE,
  ready_at TIMESTAMP WITH TIME ZONE,
  error_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  build_time BIGINT,
  error_message TEXT,
  error_code TEXT
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vercel_webhook_events_event_type ON vercel_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_vercel_webhook_events_created_at ON vercel_webhook_events(created_at);
CREATE INDEX IF NOT EXISTS idx_vercel_webhook_events_read ON vercel_webhook_events(read);

CREATE INDEX IF NOT EXISTS idx_vercel_deployments_project_id ON vercel_deployments(project_id);
CREATE INDEX IF NOT EXISTS idx_vercel_deployments_status ON vercel_deployments(status);
CREATE INDEX IF NOT EXISTS idx_vercel_deployments_created_at ON vercel_deployments(created_at);

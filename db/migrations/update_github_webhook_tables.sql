-- Add new columns to github_webhook_events table
ALTER TABLE IF EXISTS github_webhook_events 
ADD COLUMN IF NOT EXISTS repository TEXT,
ADD COLUMN IF NOT EXISTS sender TEXT,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS error TEXT;

-- Create github_stars table if it doesn't exist
CREATE TABLE IF NOT EXISTS github_stars (
  id TEXT PRIMARY KEY,
  repository TEXT NOT NULL,
  user TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

-- Create github_forks table if it doesn't exist
CREATE TABLE IF NOT EXISTS github_forks (
  id TEXT PRIMARY KEY,
  parent_repository TEXT NOT NULL,
  forked_repository TEXT NOT NULL,
  user TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

-- Create github_releases table if it doesn't exist
CREATE TABLE IF NOT EXISTS github_releases (
  id TEXT PRIMARY KEY,
  repository TEXT NOT NULL,
  tag TEXT NOT NULL,
  name TEXT,
  action TEXT NOT NULL,
  draft BOOLEAN NOT NULL DEFAULT FALSE,
  prerelease BOOLEAN NOT NULL DEFAULT FALSE,
  url TEXT,
  author TEXT,
  created_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL
);

-- Add new columns to github_commits table
ALTER TABLE IF EXISTS github_commits
ADD COLUMN IF NOT EXISTS added_files INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS removed_files INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS modified_files INTEGER DEFAULT 0;

-- Add new columns to github_pull_requests table
ALTER TABLE IF EXISTS github_pull_requests
ADD COLUMN IF NOT EXISTS merged BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS draft BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS merged_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS additions INTEGER,
ADD COLUMN IF NOT EXISTS deletions INTEGER,
ADD COLUMN IF NOT EXISTS changed_files INTEGER;

-- Add new columns to github_issues table
ALTER TABLE IF EXISTS github_issues
ADD COLUMN IF NOT EXISTS labels TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ;

-- Add new columns to github_workflow_runs table
ALTER TABLE IF EXISTS github_workflow_runs
ADD COLUMN IF NOT EXISTS branch TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS run_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS run_attempt INTEGER,
ADD COLUMN IF NOT EXISTS run_number INTEGER;

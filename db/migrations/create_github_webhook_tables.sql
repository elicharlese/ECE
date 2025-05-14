-- This migration creates tables for GitHub webhook events
-- Run this manually when you're ready to implement the database storage

-- Table for storing raw webhook events
CREATE TABLE IF NOT EXISTS github_webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  read BOOLEAN DEFAULT FALSE
);

-- Table for storing processed commit data
CREATE TABLE IF NOT EXISTS github_commits (
  id TEXT PRIMARY KEY,
  repository TEXT NOT NULL,
  branch TEXT NOT NULL,
  message TEXT NOT NULL,
  author TEXT NOT NULL,
  author_email TEXT,
  url TEXT,
  timestamp TIMESTAMP WITH TIME ZONE
);

-- Table for storing processed pull request data
CREATE TABLE IF NOT EXISTS github_pull_requests (
  id TEXT PRIMARY KEY,
  repository TEXT NOT NULL,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  state TEXT NOT NULL,
  url TEXT,
  author TEXT NOT NULL,
  action TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Table for storing processed issue data
CREATE TABLE IF NOT EXISTS github_issues (
  id TEXT PRIMARY KEY,
  repository TEXT NOT NULL,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  state TEXT NOT NULL,
  url TEXT,
  author TEXT NOT NULL,
  action TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Table for storing processed workflow run data
CREATE TABLE IF NOT EXISTS github_workflow_runs (
  id TEXT PRIMARY KEY,
  repository TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  conclusion TEXT,
  url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON github_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON github_webhook_events(created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_events_read ON github_webhook_events(read);

CREATE INDEX IF NOT EXISTS idx_commits_repository ON github_commits(repository);
CREATE INDEX IF NOT EXISTS idx_commits_branch ON github_commits(branch);

CREATE INDEX IF NOT EXISTS idx_pull_requests_repository ON github_pull_requests(repository);
CREATE INDEX IF NOT EXISTS idx_pull_requests_state ON github_pull_requests(state);

CREATE INDEX IF NOT EXISTS idx_issues_repository ON github_issues(repository);
CREATE INDEX IF NOT EXISTS idx_issues_state ON github_issues(state);

CREATE INDEX IF NOT EXISTS idx_workflow_runs_repository ON github_workflow_runs(repository);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON github_workflow_runs(status);

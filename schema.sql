-- ============================================================================
-- D1 Database Schema for Mehkesh AI Dev (https://AI-Dev.mehkesh.com/)
-- Multi-User RBAC Architecture with Master Admin & Per-User Budgets
-- ============================================================================

-- 1. Users Table (Google OAuth Users + Master Admin Mehkesh)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  picture TEXT,
  role TEXT NOT NULL DEFAULT 'user', -- 'admin' or 'user'
  neuron_budget INTEGER NOT NULL DEFAULT 2000, -- Daily neuron allocation
  neurons_used_today INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1, -- 1=active, 0=suspended
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Seed Master Admin Account (Mehkesh)
INSERT OR IGNORE INTO users (id, email, full_name, picture, role, neuron_budget, is_active)
VALUES (
  'usr_master',
  'mehkesh@ai.mehkesh.com',
  'Mehkesh',
  '',
  'admin',
  99999999,
  1
);

-- 2. System Configuration Table (Managed by Master Admin)
CREATE TABLE IF NOT EXISTS system_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO system_config (key, value, description)
VALUES 
  ('default_user_budget', '2000', 'Default daily neuron quota for new Google users'),
  ('registration_open', 'true', 'Allow new Google users to sign up'),
  ('system_prompt_master', 'You are Mehkesh AI, a sharp, proactive, and loyal personal AI assistant for Mehkesh. Call him Mehkesh.', 'Base master persona prompt'),
  ('system_prompt_user', 'You are Mehkesh AI, a helpful, intelligent, multi-model AI assistant operating at the Cloudflare edge.', 'Standard user persona prompt');

-- 3. Profile & Preferences (Single Master Profile / Global Branding)
CREATE TABLE IF NOT EXISTS profile (
  id TEXT PRIMARY KEY DEFAULT 'me',
  display_name TEXT DEFAULT 'Mehkesh',
  bio TEXT DEFAULT 'Creator and Master of Mehkesh AI',
  preferences TEXT DEFAULT '{"theme":"dark","voice_engine":"browser","auto_router":true}',
  custom_instructions TEXT DEFAULT 'You are Mehkesh AI, my proactive, precise, and loyal personal AI assistant. Call me Mehkesh.',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO profile (id, display_name, bio, preferences, custom_instructions)
VALUES (
  'me',
  'Mehkesh',
  'Creator and Master of Mehkesh AI',
  '{"theme":"dark","voice_engine":"browser","auto_router":true}',
  'You are Mehkesh AI, my proactive, precise, and loyal personal AI assistant. Call me Mehkesh.'
);

-- 4. Sessions (Chat Threads Isolated per User)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'usr_master',
  title TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_updated ON sessions(user_id, updated_at DESC);

-- 5. Messages (Chat History Isolated per User and Session)
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT 'usr_master',
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  model_used TEXT,
  has_media INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_session_created ON messages(session_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_user_created ON messages(user_id, created_at ASC);

-- 6. Long-Term Memories (Second Brain Isolated per User)
CREATE TABLE IF NOT EXISTS memories (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'usr_master',
  fact TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  source TEXT DEFAULT 'auto', -- 'auto' or 'manual'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_memories_user_created ON memories(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memories_category ON memories(category);

-- 7. Activity Logs (Per-User Daily Quota Tracking and System Metrics)
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'usr_master',
  action_type TEXT NOT NULL,
  model_used TEXT,
  approx_neurons INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date ON activity_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- 8. Daily Briefings (Edge Cron Digest Generated at 01:30 UTC / 7:00 AM IST)
CREATE TABLE IF NOT EXISTS daily_briefings (
  id TEXT PRIMARY KEY,
  briefing_date TEXT UNIQUE NOT NULL, -- e.g. '2026-11-22'
  summary TEXT NOT NULL,
  pending_tasks TEXT,
  neurons_yesterday INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_briefings_date ON daily_briefings(briefing_date DESC);

-- 9. Guest Usage Tracking (Edge-based IP hash protection against incognito abuse)
CREATE TABLE IF NOT EXISTS guest_usage (
  ip_hash TEXT NOT NULL,
  query_date TEXT NOT NULL, -- e.g. '2026-11-22'
  query_count INTEGER DEFAULT 0,
  PRIMARY KEY(ip_hash, query_date)
);

CREATE INDEX IF NOT EXISTS idx_guest_usage_date ON guest_usage(query_date);


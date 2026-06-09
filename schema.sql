-- ==============================================================================
-- SynGov Supabase Schema
-- Run this exactly as is in your Supabase SQL Editor.
-- ==============================================================================

-- 1. Enable UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Custom Types
CREATE TYPE proposal_category AS ENUM ('finance', 'events', 'tech', 'operations', 'general');
CREATE TYPE proposal_risk AS ENUM ('low', 'medium', 'high');
CREATE TYPE proposal_status AS ENUM ('active', 'passed', 'rejected', 'closed');
CREATE TYPE vote_type AS ENUM ('for', 'against', 'abstain');

-- ==========================================
-- TABLES
-- ==========================================

-- A. Users Table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  score INTEGER DEFAULT 0 NOT NULL,
  weight NUMERIC(3,2) DEFAULT 1.00 NOT NULL,
  role TEXT DEFAULT 'Member' NOT NULL,
  expertise_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- B. Proposals Table
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category proposal_category NOT NULL,
  budget NUMERIC(10,2) DEFAULT 0.00,
  timeline TEXT,
  risk_level proposal_risk NOT NULL,
  status proposal_status DEFAULT 'active' NOT NULL,
  ai_summary JSONB,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- C. Votes Table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  vote vote_type NOT NULL,
  weight_used NUMERIC(3,2) NOT NULL,
  tx_hash TEXT, -- For Polygon Amoy logging
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(proposal_id, user_id) -- One vote per user per proposal
);

-- D. Comments Table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- E. Contribution Activity Table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL, -- e.g., 'created_proposal', 'voted', 'attended_meeting'
  points_earned INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==========================================
-- TRIGGERS & FUNCTIONS
-- ==========================================

-- Function to handle auto-updating `updated_at`
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger for proposals
CREATE TRIGGER set_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Function to create user on Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Users can read all users
CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
-- Users can only update themselves
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Proposals can be read by everyone
CREATE POLICY "Proposals are viewable by everyone" ON public.proposals FOR SELECT USING (true);
-- Authenticated users can insert proposals
CREATE POLICY "Authenticated users can create proposals" ON public.proposals FOR INSERT WITH CHECK (auth.uid() = created_by);
-- Only creator can update (if active)
CREATE POLICY "Creators can update active proposals" ON public.proposals FOR UPDATE USING (auth.uid() = created_by AND status = 'active');

-- Votes are viewable by everyone
CREATE POLICY "Votes are viewable by everyone" ON public.votes FOR SELECT USING (true);
-- Authenticated users can vote
CREATE POLICY "Authenticated users can vote" ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Comments are viewable by everyone
CREATE POLICY "Comments viewable by everyone" ON public.comments FOR SELECT USING (true);
-- Authenticated users can comment
CREATE POLICY "Authenticated users can comment" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activities are viewable by everyone
CREATE POLICY "Activities viewable by everyone" ON public.activities FOR SELECT USING (true);

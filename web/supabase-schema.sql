-- ============================================================
-- SynGov — Complete Supabase Schema
-- Run this entire file in the Supabase SQL Editor (one shot).
-- ============================================================

-- ── 1. USERS ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  avatar_url      TEXT,

  -- Governance fields
  contribution_score  INTEGER NOT NULL DEFAULT 0,
  governance_weight   NUMERIC(4,2) NOT NULL DEFAULT 1.00,
  expertise_tags      TEXT[] NOT NULL DEFAULT '{}',

  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast email lookups (login / notifications)
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);


-- ── 2. PROPOSALS ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS proposals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL DEFAULT 'general',
  budget          TEXT,
  timeline        TEXT,
  risk_level      TEXT DEFAULT 'medium',
  status          TEXT NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active','passed','rejected','closed')),
  deadline        TIMESTAMPTZ,

  -- Vote tallies (weighted)
  weighted_yes    NUMERIC(10,2) NOT NULL DEFAULT 0,
  weighted_no     NUMERIC(10,2) NOT NULL DEFAULT 0,

  -- AI summary stored as JSONB
  ai_summary      JSONB,

  -- Blockchain
  tx_hash         TEXT,

  -- Author (nullable for legacy rows)
  author_id       UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_proposals_status   ON proposals (status);
CREATE INDEX IF NOT EXISTS idx_proposals_deadline ON proposals (deadline);


-- ── 3. VOTES ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS votes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id     UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type       TEXT NOT NULL CHECK (vote_type IN ('yes','no','abstain')),

  -- Weight breakdown
  base_weight     NUMERIC(4,2) NOT NULL DEFAULT 1.00,
  expertise_bonus NUMERIC(4,2) NOT NULL DEFAULT 0.00,
  final_weight    NUMERIC(4,2) NOT NULL DEFAULT 1.00,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Each user can only vote once per proposal
  CONSTRAINT unique_vote_per_user_proposal UNIQUE (user_id, proposal_id)
);

CREATE INDEX IF NOT EXISTS idx_votes_proposal ON votes (proposal_id);
CREATE INDEX IF NOT EXISTS idx_votes_user     ON votes (user_id);


-- ── 4. CONTRIBUTION ACTIVITY ────────────────────────────────

CREATE TABLE IF NOT EXISTS contribution_activity (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- What happened
  action          TEXT NOT NULL,                -- e.g. 'proposal_created', 'vote_cast', 'manual_award'
  description     TEXT,                         -- Human-readable note
  points_change   INTEGER NOT NULL DEFAULT 0,   -- Can be negative for penalties

  -- Optional link to the triggering entity
  proposal_id     UUID REFERENCES proposals(id) ON DELETE SET NULL,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contribution_user ON contribution_activity (user_id);


-- ── 5. GOVERNANCE WEIGHT FUNCTION ───────────────────────────
-- Maps contribution_score → governance_weight clamped [0.5, 2.0]
--
-- Formula:
--   raw = 0.5 + (score / 500.0) * 1.5
--   clamped between 0.5 and 2.0
--
-- Score 0   → 0.50  (minimum influence)
-- Score 250 → 1.25  (moderate)
-- Score 500 → 2.00  (maximum influence)
-- Score 999 → 2.00  (capped)

CREATE OR REPLACE FUNCTION calculate_governance_weight(score INTEGER)
RETURNS NUMERIC(4,2)
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  raw_weight NUMERIC;
BEGIN
  raw_weight := 0.5 + (score::NUMERIC / 500.0) * 1.5;
  RETURN LEAST(GREATEST(raw_weight, 0.50), 2.00);
END;
$$;


-- ── 6. AUTO-UPDATE governance_weight TRIGGER ────────────────
-- Whenever contribution_score changes on users, recalculate weight.

CREATE OR REPLACE FUNCTION trg_recalc_governance_weight()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.governance_weight := calculate_governance_weight(NEW.contribution_score);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_user_score_change ON users;
CREATE TRIGGER on_user_score_change
  BEFORE UPDATE OF contribution_score ON users
  FOR EACH ROW
  EXECUTE FUNCTION trg_recalc_governance_weight();


-- ── 7. AUTO-UPDATE updated_at on proposals ──────────────────

CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_proposal_update ON proposals;
CREATE TRIGGER on_proposal_update
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION trg_set_updated_at();


-- ── 8. ENABLE ROW LEVEL SECURITY (recommended) ─────────────
-- You can refine these policies as needed.

ALTER TABLE users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals             ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE contribution_activity ENABLE ROW LEVEL SECURITY;

-- Allow all operations for the service role (server-side)
CREATE POLICY "Service role full access" ON users                 FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON proposals             FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON votes                 FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON contribution_activity FOR ALL USING (true) WITH CHECK (true);


-- ============================================================
-- Done! Your tables, indexes, function, and triggers are ready.
-- ============================================================

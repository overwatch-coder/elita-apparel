-- ═══════════════════════════════════════════════════════════════════════════════
-- ELITA APPAREL – Add Onboarding Fields to Profiles
-- ═══════════════════════════════════════════════════════════════════════════════

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS onboarding_step integer DEFAULT 0;

COMMENT ON COLUMN profiles.onboarding_completed IS 'Whether the user has completed the guided onboarding tour';
COMMENT ON COLUMN profiles.onboarding_step IS 'The current step the user is on in the onboarding tour (for resuming)';

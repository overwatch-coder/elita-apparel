-- ═══════════════════════════════════════════════════════════════════════════════
-- AI Integration Schema
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Brand Settings ──────────────────────────────────────────────────────────
-- Stores global brand configurations like Brand Voice
CREATE TABLE IF NOT EXISTS brand_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_voice text DEFAULT 'Luxury' CHECK (brand_voice IN ('Luxury', 'Minimal', 'Bold', 'Cultural', 'Playful')),
  ai_model_preference text DEFAULT 'openai', -- openai, gemini
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default row if not exists
INSERT INTO brand_settings (id)
SELECT uuid_generate_v4()
WHERE NOT EXISTS (SELECT 1 FROM brand_settings);

-- ─── AI Generations ──────────────────────────────────────────────────────────
-- Tracks all AI content generations for history and usage limits
CREATE TABLE IF NOT EXISTS ai_generations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL, -- product_description, email, popup, seo, rewrite
  input_data jsonb,
  output_text text,
  model_used text,
  created_at timestamptz DEFAULT now()
);

-- ─── RLS Policies ────────────────────────────────────────────────────────────
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- Admins can manage brand settings
CREATE POLICY "Admins can manage brand settings"
  ON brand_settings FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Admins can manage ai generations
CREATE POLICY "Admins can manage ai generations"
  ON ai_generations FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- ─── Updated_at Trigger ────────────────────────────────────────────────────
CREATE TRIGGER trg_brand_settings_updated_at
  BEFORE UPDATE ON brand_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

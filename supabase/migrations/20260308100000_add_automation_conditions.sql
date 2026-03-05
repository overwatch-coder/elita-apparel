-- Migration: Add trigger_conditions to automations table
ALTER TABLE public.automations 
ADD COLUMN IF NOT EXISTS trigger_conditions JSONB DEFAULT '[]'::jsonb;

-- Update RLS if needed (already managed by "Admins can manage automations" policy)
COMMENT ON COLUMN public.automations.trigger_conditions IS 'Array of conditions: { "field": "string", "operator": "eq|gt|lt|contains", "value": any }';

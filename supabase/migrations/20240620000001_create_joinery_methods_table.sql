-- Create joinery_methods table if it doesn't exist
CREATE TABLE IF NOT EXISTS joinery_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  strength_rating INTEGER DEFAULT 3,
  difficulty TEXT DEFAULT 'medium',
  compatible_materials TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE joinery_methods ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Public read access" ON joinery_methods;
CREATE POLICY "Public read access"
  ON joinery_methods FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin full access" ON joinery_methods;
CREATE POLICY "Admin full access"
  ON joinery_methods FOR ALL
  USING (auth.role() = 'authenticated');

-- Enable realtime
alter publication supabase_realtime add table joinery_methods;

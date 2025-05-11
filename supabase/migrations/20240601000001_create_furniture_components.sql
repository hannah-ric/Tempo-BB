-- Create furniture components table
CREATE TABLE IF NOT EXISTS furniture_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  component VARCHAR NOT NULL,
  subtype VARCHAR NOT NULL,
  dimensions JSONB NOT NULL,
  tolerances TEXT,
  recommended_material TEXT,
  typical_uses TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime
alter publication supabase_realtime add table furniture_components;

-- Create materials table for lumber
CREATE TABLE IF NOT EXISTS lumber_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nominal_size VARCHAR NOT NULL,
  actual_size JSONB NOT NULL,
  common_lengths JSONB NOT NULL,
  tolerances TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime
alter publication supabase_realtime add table lumber_materials;

-- Create materials table for sheet goods
CREATE TABLE IF NOT EXISTS sheet_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR NOT NULL,
  nominal_sheet_size JSONB NOT NULL,
  thickness_options JSONB NOT NULL,
  tolerances TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime
alter publication supabase_realtime add table sheet_materials;

-- Create materials table for other materials
CREATE TABLE IF NOT EXISTS other_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  density JSONB,
  modulus_elasticity JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime
alter publication supabase_realtime add table other_materials;
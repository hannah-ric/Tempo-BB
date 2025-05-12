-- Create build_plans table to store generated furniture plans
CREATE TABLE IF NOT EXISTS build_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  design_brief JSONB NOT NULL,
  plan_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE build_plans ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own plans
CREATE POLICY "Users can view their own plans"
ON build_plans
FOR SELECT
USING (auth.uid()::text = user_id);

-- Create policy for users to insert their own plans
CREATE POLICY "Users can insert their own plans"
ON build_plans
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Create policy for users to update their own plans
CREATE POLICY "Users can update their own plans"
ON build_plans
FOR UPDATE
USING (auth.uid()::text = user_id);

-- Create policy for users to delete their own plans
CREATE POLICY "Users can delete their own plans"
ON build_plans
FOR DELETE
USING (auth.uid()::text = user_id);

-- Add the table to realtime
alter publication supabase_realtime add table build_plans;

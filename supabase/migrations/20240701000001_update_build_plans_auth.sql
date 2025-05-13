-- Update build_plans table to better support user authentication

-- Add a default value for user_id to handle anonymous users
ALTER TABLE build_plans ALTER COLUMN user_id SET DEFAULT 'anonymous';

-- Update existing records with null user_id to use 'anonymous'
UPDATE build_plans SET user_id = 'anonymous' WHERE user_id IS NULL;

-- Add RLS policies for build_plans table
ALTER TABLE build_plans ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own plans and anonymous plans
DROP POLICY IF EXISTS "Users can view their own plans and anonymous plans" ON build_plans;
CREATE POLICY "Users can view their own plans and anonymous plans"
  ON build_plans FOR SELECT
  USING (user_id = auth.uid() OR user_id = 'anonymous');

-- Policy for users to insert their own plans
DROP POLICY IF EXISTS "Users can insert their own plans" ON build_plans;
CREATE POLICY "Users can insert their own plans"
  ON build_plans FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id = 'anonymous');

-- Policy for users to update their own plans and anonymous plans
DROP POLICY IF EXISTS "Users can update their own plans and anonymous plans" ON build_plans;
CREATE POLICY "Users can update their own plans and anonymous plans"
  ON build_plans FOR UPDATE
  USING (user_id = auth.uid() OR user_id = 'anonymous');

-- Policy for users to delete their own plans and anonymous plans
DROP POLICY IF EXISTS "Users can delete their own plans and anonymous plans" ON build_plans;
CREATE POLICY "Users can delete their own plans and anonymous plans"
  ON build_plans FOR DELETE
  USING (user_id = auth.uid() OR user_id = 'anonymous');

-- Add realtime support for build_plans table
alter publication supabase_realtime add table build_plans;

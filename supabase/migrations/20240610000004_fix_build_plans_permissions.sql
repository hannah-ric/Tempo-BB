-- Fix permissions for build_plans table
ALTER TABLE public.build_plans
ADD COLUMN IF NOT EXISTS userid UUID REFERENCES auth.users(id);

-- Enable row level security
ALTER TABLE public.build_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own build plans" ON public.build_plans;
CREATE POLICY "Users can view their own build plans"
ON public.build_plans FOR SELECT
USING (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can insert their own build plans" ON public.build_plans;
CREATE POLICY "Users can insert their own build plans"
ON public.build_plans FOR INSERT
WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can update their own build plans" ON public.build_plans;
CREATE POLICY "Users can update their own build plans"
ON public.build_plans FOR UPDATE
USING (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can delete their own build plans" ON public.build_plans;
CREATE POLICY "Users can delete their own build plans"
ON public.build_plans FOR DELETE
USING (auth.uid() = userid);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.build_plans;
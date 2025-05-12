-- Fix the build_plans table to use userId instead of user_id
ALTER TABLE IF EXISTS public.build_plans
RENAME COLUMN user_id TO "userId";

-- Enable row level security
ALTER TABLE public.build_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own build plans" ON public.build_plans;
CREATE POLICY "Users can view their own build plans"
ON public.build_plans FOR SELECT
USING (auth.uid() = "userId");

DROP POLICY IF EXISTS "Users can insert their own build plans" ON public.build_plans;
CREATE POLICY "Users can insert their own build plans"
ON public.build_plans FOR INSERT
WITH CHECK (auth.uid() = "userId");

DROP POLICY IF EXISTS "Users can update their own build plans" ON public.build_plans;
CREATE POLICY "Users can update their own build plans"
ON public.build_plans FOR UPDATE
USING (auth.uid() = "userId");

-- Create auth.users table if it doesn't exist (for foreign key reference)
CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY,
  email TEXT
);

-- Create public.users table if it doesn't exist (for foreign key reference)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT
);

-- Modify build_plans table to use UUID for user_id and add foreign key constraint
ALTER TABLE build_plans ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE build_plans ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id);

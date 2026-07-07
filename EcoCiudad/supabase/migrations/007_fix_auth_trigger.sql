-- ============================================================================
-- Fix: Improve handle_new_user trigger error handling
-- Migration: 007_fix_auth_trigger.sql
-- ============================================================================

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  profile_id UUID;
  display_name_value TEXT;
  role_value TEXT;
BEGIN
  -- Extract metadata with defaults
  display_name_value := COALESCE(
    NEW.raw_user_meta_data->>'display_name', 
    split_part(NEW.email, '@', 1)
  );
  
  role_value := COALESCE(
    NEW.raw_user_meta_data->>'role', 
    'citizen'
  );

  -- Insert into profiles with error handling
  BEGIN
    INSERT INTO public.profiles (id, email, display_name, role, is_email_verified)
    VALUES (
      NEW.id,
      NEW.email,
      display_name_value,
      role_value::user_role,
      NEW.email_confirmed_at IS NOT NULL
    )
    RETURNING id INTO profile_id;
    
    RAISE NOTICE '[handle_new_user] Profile created for user %', NEW.id;
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '[handle_new_user] Failed to create profile for user %: % - %', 
      NEW.id, SQLERRM, SQLSTATE;
  END;

  -- Insert into user_settings with error handling
  BEGIN
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);
    
    RAISE NOTICE '[handle_new_user] User settings created for user %', NEW.id;
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '[handle_new_user] Failed to create user_settings for user %: % - %', 
      NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- COMPLETED
-- ============================================================================

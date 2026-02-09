-- Create a trigger function to auto-create customer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Default role is 'customer'; thrifters go through the terms page which inserts separately
  INSERT INTO public.user_roles (user_id, role, terms_accepted_at)
  VALUES (NEW.id, 'customer', now())
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();

-- Also update RLS: allow the service role (used by triggers) to insert,
-- but also allow authenticated users to insert their own roles (for thrifter signup)
-- The existing policy is fine for thrifter terms page since user IS authenticated by then.
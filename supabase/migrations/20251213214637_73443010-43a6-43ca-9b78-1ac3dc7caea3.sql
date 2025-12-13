-- Create security definer function to check user role (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = _user_id
$$;

-- Create helper function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = _role
  )
$$;

-- Create helper function to check if user has any of the specified roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid, _roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = ANY(_roles)
  )
$$;

-- Drop existing policies that need updating
DROP POLICY IF EXISTS "Owners update artists" ON public.artists;
DROP POLICY IF EXISTS "Owners update places" ON public.places;
DROP POLICY IF EXISTS "Owners update rentals" ON public.rentals;

-- Add admin override to UPDATE policies for artists
CREATE POLICY "Owners and admins can update artists"
ON public.artists FOR UPDATE
USING (
  owner_id = auth.uid() 
  OR public.has_role(auth.uid(), 'admin')
);

-- Add DELETE policy for artists
CREATE POLICY "Owners and admins can delete artists"
ON public.artists FOR DELETE
USING (
  owner_id = auth.uid() 
  OR public.has_role(auth.uid(), 'admin')
);

-- Add admin override to UPDATE policies for places
CREATE POLICY "Owners and admins can update places"
ON public.places FOR UPDATE
USING (
  owner_id = auth.uid() 
  OR public.has_role(auth.uid(), 'admin')
);

-- Add DELETE policy for places
CREATE POLICY "Owners and admins can delete places"
ON public.places FOR DELETE
USING (
  owner_id = auth.uid() 
  OR public.has_role(auth.uid(), 'admin')
);

-- Add admin override to UPDATE policies for rentals
CREATE POLICY "Owners and admins can update rentals"
ON public.rentals FOR UPDATE
USING (
  owner_id = auth.uid() 
  OR public.has_role(auth.uid(), 'admin')
);

-- Add DELETE policy for rentals
CREATE POLICY "Owners and admins can delete rentals"
ON public.rentals FOR DELETE
USING (
  owner_id = auth.uid() 
  OR public.has_role(auth.uid(), 'admin')
);

-- Create secure function for changing user roles (only admins)
CREATE OR REPLACE FUNCTION public.change_user_role(
  target_user_id UUID,
  new_role TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check that current user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;

  -- Validate role value
  IF new_role NOT IN ('user', 'partner', 'admin') THEN
    RAISE EXCEPTION 'Invalid role. Must be user, partner, or admin';
  END IF;

  -- Update the role
  UPDATE public.profiles
  SET role = new_role, updated_at = now()
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;
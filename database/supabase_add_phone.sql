-- Migration: Add phone_number column to profiles table
-- Run this in Supabase SQL Editor

-- Add phone_number column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Create index for phone number lookup (for "forgot email" feature)
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number ON profiles(phone_number);

-- Function to lookup email by phone number (used for "forgot email")
-- This function uses parameterized queries internally, making it SQL injection safe
-- SECURITY DEFINER allows bypassing RLS for this specific lookup
CREATE OR REPLACE FUNCTION public.get_email_by_phone(phone TEXT)
RETURNS TABLE (email TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Input validation: only allow digits and + character
    IF phone !~ '^[+]?[0-9]+$' THEN
        RETURN;
    END IF;

    -- Parameterized query - phone is passed as a parameter, not concatenated
    -- This makes it SQL injection safe
    RETURN QUERY
    SELECT profiles.email
    FROM profiles
    WHERE profiles.phone_number = phone
    LIMIT 1;
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.get_email_by_phone(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_email_by_phone(TEXT) TO anon;

-- Revoke direct table access from anon users (security best practice)
-- This ensures anon users can only use the function, not query the table directly
REVOKE ALL ON profiles FROM anon;

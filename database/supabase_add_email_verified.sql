-- Migration: Add email_verified column to profiles table
-- Run this in Supabase SQL Editor

-- Add email_verified column to profiles
-- This syncs with auth.users.email_confirmed_at for tracking purposes
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Create index for filtering verified users
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON profiles(email_verified);

-- Function to sync email_verified from auth.users
-- This is called when user confirms their email
CREATE OR REPLACE FUNCTION public.sync_email_verified()
RETURNS TRIGGER AS $$
BEGIN
    -- When email is confirmed in auth.users, update profiles table
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public.profiles
        SET email_verified = TRUE,
            updated_at = NOW()
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-sync email verification status
DROP TRIGGER IF EXISTS on_email_verified ON auth.users;
CREATE TRIGGER on_email_verified
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_email_verified();

-- Update existing profiles to sync email_verified status
-- Run this once to backfill existing users
UPDATE public.profiles p
SET email_verified = TRUE
WHERE EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = p.id
    AND u.email_confirmed_at IS NOT NULL
);

-- View to see email verification stats (run as query, not schema change)
-- SELECT 
--     COUNT(*) as total_users,
--     SUM(CASE WHEN email_verified = TRUE THEN 1 ELSE 0 END) as verified_users,
--     SUM(CASE WHEN email_verified = FALSE OR email_verified IS NULL THEN 1 ELSE 0 END) as unverified_users
-- FROM profiles;

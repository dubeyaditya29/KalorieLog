-- Migration: Split login/signup details into a dedicated accounts table
-- Run this in Supabase SQL Editor
--
-- Moves email / phone_number / email_verified OUT of profiles so profiles
-- stays purely personal & health details. Credentials themselves remain in
-- Supabase's managed auth.users — this table only mirrors display metadata.

-- 1. Accounts table: one row per auth user
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Row Level Security (same model as profiles)
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own account"
  ON accounts FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own account"
  ON accounts FOR UPDATE
  USING (auth.uid() = id);

REVOKE ALL ON accounts FROM anon;

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_accounts_phone_number ON accounts(phone_number);
CREATE INDEX IF NOT EXISTS idx_accounts_email_verified ON accounts(email_verified);

-- 4. Backfill existing data from profiles
INSERT INTO accounts (id, email, phone_number, email_verified)
SELECT p.id, p.email, p.phone_number, COALESCE(p.email_verified, FALSE)
FROM profiles p
ON CONFLICT (id) DO NOTHING;

-- 5. Keep updated_at fresh on accounts
DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Signup trigger now creates both rows
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.accounts (id, email)
  VALUES (NEW.id, NEW.email);
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Email verification sync now writes to accounts
CREATE OR REPLACE FUNCTION public.sync_email_verified()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public.accounts
        SET email_verified = TRUE,
            updated_at = NOW()
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Forgot-email lookup now reads accounts
CREATE OR REPLACE FUNCTION public.get_email_by_phone(phone TEXT)
RETURNS TABLE (email TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF phone !~ '^[+]?[0-9]+$' THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT accounts.email
    FROM accounts
    WHERE accounts.phone_number = phone
    LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_email_by_phone(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_email_by_phone(TEXT) TO anon;

-- 9. Remove the moved columns (and their indexes) from profiles
DROP INDEX IF EXISTS idx_profiles_phone_number;
DROP INDEX IF EXISTS idx_profiles_email_verified;

ALTER TABLE profiles
  DROP COLUMN IF EXISTS phone_number,
  DROP COLUMN IF EXISTS email_verified,
  DROP COLUMN IF EXISTS email;

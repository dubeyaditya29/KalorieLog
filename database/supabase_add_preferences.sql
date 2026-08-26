-- Add nutrition preference columns to profiles
-- Run this in Supabase SQL Editor

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'male';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS activity_level TEXT DEFAULT 'moderate';

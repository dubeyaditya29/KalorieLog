-- Migration: Add pro-tier flags to accounts (future pro customers)
-- Run this in Supabase SQL Editor

ALTER TABLE accounts ADD COLUMN IF NOT EXISTS is_monthly_pro BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS is_yearly_pro BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_accounts_is_monthly_pro ON accounts(is_monthly_pro);
CREATE INDEX IF NOT EXISTS idx_accounts_is_yearly_pro ON accounts(is_yearly_pro);

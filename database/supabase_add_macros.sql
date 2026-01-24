-- Add macronutrient columns to meals table
ALTER TABLE meals 
ADD COLUMN IF NOT EXISTS protein_g DECIMAL,
ADD COLUMN IF NOT EXISTS carbs_g DECIMAL,
ADD COLUMN IF NOT EXISTS fat_g DECIMAL;

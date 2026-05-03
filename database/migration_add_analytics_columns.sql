-- Migration to add new columns to url_analytics table

ALTER TABLE url_analytics ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE url_analytics ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE url_analytics ADD COLUMN IF NOT EXISTS device_type VARCHAR(50);
ALTER TABLE url_analytics ADD COLUMN IF NOT EXISTS browser VARCHAR(100);
ALTER TABLE url_analytics ADD COLUMN IF NOT EXISTS os VARCHAR(100);

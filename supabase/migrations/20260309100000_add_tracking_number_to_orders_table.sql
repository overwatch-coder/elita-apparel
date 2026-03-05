ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(12) UNIQUE;

-- Optional: auto-generate strings for older rows if you want them to be trackable
UPDATE orders SET tracking_number = upper(substring(md5(random()::text) from 1 for 8)) WHERE tracking_number IS NULL;

-- Keep curated tour IDs attached to public booking inquiries for reconciliation.
ALTER TABLE IF EXISTS public.inquiries
  ADD COLUMN IF NOT EXISTS tour_id TEXT;

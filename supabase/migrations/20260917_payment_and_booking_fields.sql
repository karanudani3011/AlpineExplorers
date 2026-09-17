-- ==============================================================================
-- ALPINE EXPLORERS — PAYMENT & BOOKING ENHANCEMENTS MIGRATION
-- ==============================================================================
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Add payment and booking fields to public.bookings if they don't already exist
DO $$
BEGIN
  -- payment_status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN payment_status TEXT DEFAULT 'pending';
  END IF;

  -- payment_method
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN payment_method TEXT DEFAULT NULL;
  END IF;

  -- payment_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'payment_id'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN payment_id TEXT DEFAULT NULL;
  END IF;

  -- order_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'order_id'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN order_id TEXT DEFAULT NULL;
  END IF;

  -- currency
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'currency'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN currency TEXT DEFAULT 'INR';
  END IF;

  -- booking_status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'booking_status'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN booking_status TEXT DEFAULT 'pending';
  END IF;

  -- booking_details (JSONB for multi-traveler info, add-ons, notes)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'booking_details'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN booking_details JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_method ON public.bookings(payment_method);
CREATE INDEX IF NOT EXISTS idx_bookings_order_id ON public.bookings(order_id);

-- 3. RLS update: ensure authenticated users can read their own bookings and update pending payment info if needed
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
CREATE POLICY "Users can insert own bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own pending bookings" ON public.bookings;
CREATE POLICY "Users can update own pending bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

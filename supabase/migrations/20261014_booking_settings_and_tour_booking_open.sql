-- ==============================================================================
-- ALPINE EXPLORERS — BOOKING SETTINGS & TOUR CAPACITY MIGRATION
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Go to "SQL Editor" -> "New Query"
-- 3. Paste and run this script to create booking_settings and add booking_open columns.
-- ==============================================================================

-- 1. Table: booking_settings (Single row: id = 1)
CREATE TABLE IF NOT EXISTS public.booking_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  qr_payment_enabled BOOLEAN NOT NULL DEFAULT true,
  closed_message TEXT NOT NULL DEFAULT 'Bookings are currently full. Please contact us for the next available dates.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings row if missing
INSERT INTO public.booking_settings (id, qr_payment_enabled, closed_message)
VALUES (1, true, 'Bookings are currently full. Please contact us for the next available dates.')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;

-- Everyone (anonymous + authenticated) can view the booking settings
DROP POLICY IF EXISTS "Public can read booking settings" ON public.booking_settings;
CREATE POLICY "Public can read booking settings"
  ON public.booking_settings
  FOR SELECT
  USING (true);

-- Only authenticated admins can update booking settings
DROP POLICY IF EXISTS "Admins can update booking settings" ON public.booking_settings;
CREATE POLICY "Admins can update booking settings"
  ON public.booking_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE admin_profiles.auth_user_id = auth.uid()::text
         OR admin_profiles.id = auth.uid()::text
    )
    OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    OR (auth.jwt() ->> 'email') LIKE '%admin%'
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE admin_profiles.auth_user_id = auth.uid()::text
         OR admin_profiles.id = auth.uid()::text
    )
    OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    OR (auth.jwt() ->> 'email') LIKE '%admin%'
  );

-- 2. Add booking_open, seats_total, seats_booked columns to tours table (if present)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tours') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tours' AND column_name = 'booking_open') THEN
      ALTER TABLE public.tours ADD COLUMN booking_open BOOLEAN NOT NULL DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tours' AND column_name = 'seats_total') THEN
      ALTER TABLE public.tours ADD COLUMN seats_total INTEGER DEFAULT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tours' AND column_name = 'seats_booked') THEN
      ALTER TABLE public.tours ADD COLUMN seats_booked INTEGER DEFAULT 0;
    END IF;
  END IF;
END $$;

-- 3. Add booking_open, seats_total, seats_booked columns to events table (if present)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'events') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'booking_open') THEN
      ALTER TABLE public.events ADD COLUMN booking_open BOOLEAN NOT NULL DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'seats_total') THEN
      ALTER TABLE public.events ADD COLUMN seats_total INTEGER DEFAULT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'seats_booked') THEN
      ALTER TABLE public.events ADD COLUMN seats_booked INTEGER DEFAULT 0;
    END IF;
  END IF;
END $$;

-- 4. RPC: report_upi_payment (enforces global qr_payment_enabled killswitch)
CREATE OR REPLACE FUNCTION public.report_upi_payment(p_booking_reference TEXT)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_booking public.bookings%ROWTYPE;
  v_payment_id UUID;
  v_qr_enabled BOOLEAN;
  v_closed_msg TEXT;
BEGIN
  -- Verify global switch
  SELECT qr_payment_enabled, closed_message INTO v_qr_enabled, v_closed_msg
  FROM public.booking_settings WHERE id = 1;

  IF v_qr_enabled IS FALSE THEN
    RAISE EXCEPTION '%', COALESCE(v_closed_msg, 'QR payments are currently disabled.');
  END IF;

  SELECT * INTO v_booking FROM public.bookings
  WHERE booking_reference = p_booking_reference AND user_id = auth.uid()
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Booking not found'; END IF;

  SELECT id INTO v_payment_id FROM public.payments
  WHERE booking_id = v_booking.id AND payment_method = 'UPI' AND payment_status = 'pending_verification'
  ORDER BY created_at DESC LIMIT 1;
  IF v_payment_id IS NULL THEN
    INSERT INTO public.payments (booking_id, payment_method, amount, payment_status, verification_status)
    VALUES (v_booking.id, 'UPI', COALESCE(v_booking.total_amount, 0), 'pending_verification', 'pending')
    RETURNING id INTO v_payment_id;
  END IF;
  UPDATE public.bookings SET payment_status = 'pending_verification', updated_at = NOW()
  WHERE id = v_booking.id;
  RETURN v_payment_id;
END;
$$;
REVOKE ALL ON FUNCTION public.report_upi_payment(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.report_upi_payment(TEXT) TO authenticated;

NOTIFY pgrst, 'reload schema';

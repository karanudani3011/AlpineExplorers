-- Alpine Explorers booking authentication flow.
-- Safe to run after the existing base schema; it creates missing tables and
-- tightens traveler RLS while admin operations stay behind the protected API.

-- 1. Tables: keep this migration safe when the base schema is already installed.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tour_id TEXT,
  tour_name TEXT NOT NULL,
  tour_location TEXT,
  tour_date DATE,
  duration TEXT,
  price_per_person NUMERIC,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  total_travelers INTEGER,
  total_amount NUMERIC,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  whatsapp_number TEXT,
  special_requirements TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS adults INTEGER DEFAULT 1;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS children INTEGER DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS special_requirements TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_reference TEXT;

-- Existing application inserts create the reference; this sequence gives SQL inserts a safe default.
CREATE SEQUENCE IF NOT EXISTS public.booking_reference_seq;
ALTER TABLE public.bookings ALTER COLUMN booking_reference SET DEFAULT
  ('ALP-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || LPAD(nextval('public.booking_reference_seq')::TEXT, 5, '0'));

-- 2. Functions
CREATE OR REPLACE FUNCTION public.handle_booking_flow_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_booking_flow_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'phone', ''))
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = COALESCE(NULLIF(EXCLUDED.phone, ''), public.profiles.phone),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 3. Triggers
DROP TRIGGER IF EXISTS booking_flow_profile_after_signup ON auth.users;
CREATE TRIGGER booking_flow_profile_after_signup AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_booking_flow_new_user();

DROP TRIGGER IF EXISTS booking_flow_profiles_updated_at ON public.profiles;
CREATE TRIGGER booking_flow_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_booking_flow_updated_at();

DROP TRIGGER IF EXISTS booking_flow_bookings_updated_at ON public.bookings;
CREATE TRIGGER booking_flow_bookings_updated_at BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.handle_booking_flow_updated_at();

-- 4. RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 5. Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
CREATE POLICY "Users can insert own bookings" ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own pending bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete own bookings" ON public.bookings;

-- Existing RBAC admin access remains server-side through the protected admin API.
-- Do not grant table-wide admin access to browser clients in this migration.

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON public.bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_date ON public.bookings(tour_date);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_reference ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON public.bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

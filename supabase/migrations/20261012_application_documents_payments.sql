-- Private traveler applications, completed form PDFs, and UPI/card payment records.
-- Apply after 20261011_booking_auth_flow.sql and rbac_staff_management.sql.

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS order_id TEXT;

CREATE TABLE IF NOT EXISTS public.traveler_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  traveler_number INTEGER NOT NULL CHECK (traveler_number > 0),
  course_name TEXT,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  age INTEGER,
  sex TEXT,
  blood_group TEXT,
  address TEXT,
  contact_no TEXT,
  education TEXT,
  school_college TEXT,
  school_college_address TEXT,
  school_college_phone TEXT,
  hobbies TEXT,
  adventure_experience BOOLEAN DEFAULT FALSE,
  adventure_details TEXT,
  declaration_accepted BOOLEAN DEFAULT FALSE,
  declaration_place TEXT,
  declaration_date DATE,
  applicant_signature_path TEXT,
  risk_participant_name TEXT,
  risk_course_name TEXT,
  risk_accepted BOOLEAN DEFAULT FALSE,
  risk_place TEXT,
  risk_date DATE,
  parent_guardian_signature_path TEXT,
  participant_type TEXT,
  guardian_name TEXT,
  guardian_contact TEXT,
  photograph_path TEXT,
  application_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (booking_id, traveler_number)
);

CREATE TABLE IF NOT EXISTS public.application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES public.traveler_applications(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL UNIQUE,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type = 'application/pdf'),
  upload_status TEXT NOT NULL DEFAULT 'uploaded' CHECK (upload_status IN ('uploaded','failed')),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (application_id)
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  gateway_reference_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','pending_verification','paid','failed','cancelled','refunded')),
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified','pending','verified','rejected')),
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_traveler_applications_booking ON public.traveler_applications(booking_id, traveler_number);
CREATE INDEX IF NOT EXISTS idx_application_documents_booking ON public.application_documents(booking_id);
CREATE INDEX IF NOT EXISTS idx_application_documents_application ON public.application_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments(booking_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status, verification_status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_gateway_reference ON public.payments(gateway_reference_id);

ALTER TABLE public.traveler_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Travelers read own applications" ON public.traveler_applications;
CREATE POLICY "Travelers read own applications" ON public.traveler_applications
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid()
  ));
DROP POLICY IF EXISTS "Travelers add own applications" ON public.traveler_applications;
CREATE POLICY "Travelers add own applications" ON public.traveler_applications
  FOR INSERT TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid()
  ));
DROP POLICY IF EXISTS "Travelers edit own pending applications" ON public.traveler_applications;
CREATE POLICY "Travelers edit own pending applications" ON public.traveler_applications
  FOR UPDATE TO authenticated USING (EXISTS (
    SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid() AND b.payment_status = 'pending'
  )) WITH CHECK (EXISTS (
    SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid() AND b.payment_status = 'pending'
  ));

DROP POLICY IF EXISTS "Travelers read own application documents" ON public.application_documents;
CREATE POLICY "Travelers read own application documents" ON public.application_documents
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid()
  ));
DROP POLICY IF EXISTS "Travelers add own application documents" ON public.application_documents;
CREATE POLICY "Travelers add own application documents" ON public.application_documents
  FOR INSERT TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid()
  ));
DROP POLICY IF EXISTS "Travelers replace own pending application documents" ON public.application_documents;
CREATE POLICY "Travelers replace own pending application documents" ON public.application_documents
  FOR UPDATE TO authenticated USING (EXISTS (
    SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid() AND b.payment_status = 'pending'
  )) WITH CHECK (EXISTS (
    SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid() AND b.payment_status = 'pending'
  ));

DROP POLICY IF EXISTS "Travelers read own payments" ON public.payments;
CREATE POLICY "Travelers read own payments" ON public.payments
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid()
  ));

-- Only a signed-in owner may report a manual UPI payment. This never marks a booking paid.
CREATE OR REPLACE FUNCTION public.report_upi_payment(p_booking_reference TEXT)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_booking public.bookings%ROWTYPE;
  v_payment_id UUID;
BEGIN
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

-- Private bucket. Objects are scoped to the authenticated owner's UUID folder.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('booking-private-docs', 'booking-private-docs', FALSE, 10485760,
        ARRAY['application/pdf','image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET public = FALSE, file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf','image/jpeg','image/png','image/webp'];

DROP POLICY IF EXISTS "Owners upload booking files" ON storage.objects;
CREATE POLICY "Owners upload booking files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'booking-private-docs' AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );
DROP POLICY IF EXISTS "Owners read booking files" ON storage.objects;
CREATE POLICY "Owners read booking files" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'booking-private-docs' AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );
DROP POLICY IF EXISTS "Owners replace booking files" ON storage.objects;
CREATE POLICY "Owners replace booking files" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'booking-private-docs' AND (storage.foldername(name))[1] = auth.uid()::TEXT
  ) WITH CHECK (
    bucket_id = 'booking-private-docs' AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );
DROP POLICY IF EXISTS "Owners delete booking files" ON storage.objects;
CREATE POLICY "Owners delete booking files" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'booking-private-docs' AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Assigned staff can inspect relational records via the project's existing Supabase RBAC helpers.
DROP POLICY IF EXISTS "Staff view traveler applications" ON public.traveler_applications;
CREATE POLICY "Staff view traveler applications" ON public.traveler_applications
  FOR SELECT TO authenticated USING (public.has_permission('bookings.view'));
DROP POLICY IF EXISTS "Staff view application documents" ON public.application_documents;
CREATE POLICY "Staff view application documents" ON public.application_documents
  FOR SELECT TO authenticated USING (public.has_permission('bookings.view'));
DROP POLICY IF EXISTS "Staff view payments" ON public.payments;
CREATE POLICY "Staff view payments" ON public.payments
  FOR SELECT TO authenticated USING (public.has_permission('bookings.view'));

DROP POLICY IF EXISTS "Staff read booking files" ON storage.objects;
CREATE POLICY "Staff read booking files" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'booking-private-docs' AND public.has_permission('bookings.view')
  );

-- Table grants are still subject to the RLS policies above. These grants make
-- PostgREST operations available to authenticated users without granting anon
-- access or weakening row ownership checks.
GRANT SELECT, INSERT, UPDATE ON public.traveler_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.application_documents TO authenticated;
GRANT SELECT ON public.payments TO authenticated;

DROP TRIGGER IF EXISTS applications_payment_updated_at ON public.payments;
-- Keep this migration rerunnable on projects where the booking-flow base
-- migration was only partially applied or its shared trigger function is absent.
CREATE OR REPLACE FUNCTION public.handle_booking_flow_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER applications_payment_updated_at BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.handle_booking_flow_updated_at();

NOTIFY pgrst, 'reload schema';

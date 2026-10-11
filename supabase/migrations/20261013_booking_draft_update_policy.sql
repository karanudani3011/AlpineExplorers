-- Allow a customer to save and retry their own unpaid booking draft.
-- RLS remains enabled; updates are owner-scoped and stay within the unpaid
-- pending status accepted by bookings_status_check.

GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;

DROP POLICY IF EXISTS "Users can update own unpaid booking drafts" ON public.bookings;
CREATE POLICY "Users can update own unpaid booking drafts" ON public.bookings
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = user_id
    AND COALESCE(payment_status, 'pending') = 'pending'
    AND COALESCE(status, 'pending') = 'pending'
  )
  WITH CHECK (
    auth.uid() = user_id
    AND COALESCE(payment_status, 'pending') = 'pending'
    AND COALESCE(status, 'pending') = 'pending'
  );

NOTIFY pgrst, 'reload schema';

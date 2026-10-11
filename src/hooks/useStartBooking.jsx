import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from './useSupabaseAuth'

export function useStartBooking() {
  const { user, openAuthModal } = useSupabaseAuth()
  const navigate = useNavigate()

  return useCallback((tour) => {
    if (!tour?.id) return
    const path = `/booking/${encodeURIComponent(String(tour.id))}`
    if (user) {
      navigate(path, { state: { tour } })
      return
    }
    openAuthModal({
      message: 'Login or create an account to continue with your booking.',
      targetTour: tour,
      onSuccess: () => navigate(path, { state: { tour } }),
    })
  }, [navigate, openAuthModal, user])
}

import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext'
import { Loader2 } from 'lucide-react'

const NAVY = '#001a4d'

export default function RequireAuth({ children }) {
  const { user, loading, openAuthModal } = useSupabaseAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      openAuthModal({
        message: 'Login or create an account to access this page.',
        onSuccess: () => {
          // Stay on or reload current target location
          navigate(location.pathname + location.search, { replace: true })
        },
      })
    }
  }, [loading, user, location, navigate, openAuthModal])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf5ea' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin" style={{ color: NAVY }} />
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: NAVY }}>
            Verifying session...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#faf5ea' }}>
        <div className="text-center max-w-sm">
          <h2 className="text-lg font-bold mb-2" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
            Authentication Required
          </h2>
          <p className="text-xs text-gray-600 mb-5">
            Please log in or create an account to continue.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal({ message: 'Login or create an account to continue.' })}
            className="px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md cursor-pointer"
            style={{ backgroundColor: NAVY }}
          >
            Open Login / Sign Up
          </button>
        </div>
      </div>
    )
  }

  return children
}

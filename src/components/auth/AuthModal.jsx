import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Compass, ArrowRight, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext'
import { useNavigate } from 'react-router-dom'

const NAVY = '#001a4d'
const NAVY_MID = '#0d3a80'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const CREAM = '#faf5ea'
const BROWN = '#3a2a18'

export default function AuthModal() {
  const { authModalOpen, authModalConfig, closeAuthModal, signIn, signUp, resetPassword } = useSupabaseAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState('login') // 'login' | 'signup' | 'forgot'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const modalRef = useRef(null)

  useEffect(() => {
    if (authModalOpen) {
      setTab(authModalConfig.initialTab || 'login')
      setErrorMsg('')
      setSuccessMsg('')
      setFullName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setPhone('')
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [authModalOpen, authModalConfig.initialTab])

  if (!authModalOpen) return null

  const handleSuccessfulAuth = (user) => {
    closeAuthModal()
    if (typeof authModalConfig.onSuccess === 'function') {
      authModalConfig.onSuccess(user)
    } else if (authModalConfig.targetTour?.id) {
      navigate(`/booking/${authModalConfig.targetTour.id}`, {
        state: { tour: authModalConfig.targetTour },
      })
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)
    try {
      const res = await signIn({ email, password })
      handleSuccessfulAuth(res.user)
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await signUp({
        fullName,
        email,
        password,
        confirmPassword,
        phone,
      })
      setSuccessMsg('Account created successfully! Continuing to your booking...')
      window.setTimeout(() => {
        handleSuccessfulAuth(res.user)
      }, 700)
    } catch (err) {
      setErrorMsg(err.message || 'Unable to create account. Please check your information.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSuccessMsg('Password reset link has been sent to your email address.')
    } catch (err) {
      setErrorMsg(err.message || 'Unable to send password reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        style={{ backgroundColor: 'rgba(3, 9, 20, 0.72)', backdropFilter: 'blur(6px)' }}
        onClick={closeAuthModal}
      >
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl my-auto"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(212,175,55,0.4)',
            boxShadow: '0 25px 60px rgba(0,26,77,0.45)',
          }}
        >
          {/* Header Banner */}
          <div
            className="px-6 pt-6 pb-5 text-white relative"
            style={{
              background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`,
              borderBottom: '2px solid rgba(212,175,55,0.5)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(212,175,55,0.2)',
                    border: '1px solid rgba(212,175,55,0.5)',
                  }}
                >
                  <Compass size={20} style={{ color: GOLD2 }} />
                </div>
                <div>
                  <h3
                    className="font-bold text-lg tracking-wider"
                    style={{ fontFamily: 'Cinzel, serif', color: '#ffffff' }}
                  >
                    Alpine Explorers
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: GOLD2 }}>
                    Traveler Account
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeAuthModal}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white transition"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Custom message prompt */}
            <div
              className="mt-4 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed"
              style={{
                backgroundColor: 'rgba(250,245,234,0.12)',
                border: '1px solid rgba(212,175,55,0.3)',
                color: 'rgba(250,245,234,0.95)',
              }}
            >
              {authModalConfig.message || 'Login or create an account to continue with your booking.'}
              {authModalConfig.targetTour?.title && (
                <div className="mt-1 font-bold truncate text-white" style={{ color: GOLD2 }}>
                  Selected Tour: {authModalConfig.targetTour.title}
                </div>
              )}
            </div>
          </div>

          {/* Tab Selector */}
          {tab !== 'forgot' && (
            <div className="flex border-b text-xs font-bold" style={{ borderColor: 'rgba(180,160,130,0.25)' }}>
              <button
                type="button"
                onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg('') }}
                className="flex-1 py-3.5 text-center transition cursor-pointer relative"
                style={{
                  color: tab === 'login' ? NAVY : 'rgba(58,42,24,0.6)',
                  backgroundColor: tab === 'login' ? '#ffffff' : '#fafafa',
                }}
              >
                Login
                {tab === 'login' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: GOLD }} />
                )}
              </button>
              <button
                type="button"
                onClick={() => { setTab('signup'); setErrorMsg(''); setSuccessMsg('') }}
                className="flex-1 py-3.5 text-center transition cursor-pointer relative"
                style={{
                  color: tab === 'signup' ? NAVY : 'rgba(58,42,24,0.6)',
                  backgroundColor: tab === 'signup' ? '#ffffff' : '#fafafa',
                }}
              >
                Create Account / Sign Up
                {tab === 'signup' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: GOLD }} />
                )}
              </button>
            </div>
          )}

          {/* Form Content */}
          <div className="p-6">
            {/* Status alerts */}
            {errorMsg && (
              <div
                className="mb-4 rounded-xl px-3.5 py-2.5 text-xs font-semibold flex items-start gap-2"
                style={{
                  backgroundColor: 'rgba(220,38,38,0.08)',
                  border: '1px solid rgba(220,38,38,0.3)',
                  color: '#b91c1c',
                }}
              >
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div
                className="mb-4 rounded-xl px-3.5 py-2.5 text-xs font-semibold flex items-start gap-2"
                style={{
                  backgroundColor: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.35)',
                  color: '#047857',
                }}
              >
                <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-2"
                      style={{
                        borderColor: 'rgba(180,160,130,0.4)',
                        backgroundColor: '#ffffff',
                        color: BROWN,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: NAVY }}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setTab('forgot'); setErrorMsg(''); setSuccessMsg('') }}
                      className="text-xs font-semibold hover:underline"
                      style={{ color: GOLD }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-2"
                      style={{
                        borderColor: 'rgba(180,160,130,0.4)',
                        backgroundColor: '#ffffff',
                        color: BROWN,
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
                  style={{ backgroundColor: NAVY }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = NAVY_MID }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <span>Login & Continue</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center text-xs" style={{ color: 'rgba(58,42,24,0.7)' }}>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('signup'); setErrorMsg(''); setSuccessMsg('') }}
                    className="font-bold underline cursor-pointer"
                    style={{ color: NAVY }}
                  >
                    Create Account
                  </button>
                </div>
              </form>
            )}

            {/* SIGNUP FORM */}
            {tab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: NAVY }}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition"
                      style={{ borderColor: 'rgba(180,160,130,0.4)', color: BROWN }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: NAVY }}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition"
                      style={{ borderColor: 'rgba(180,160,130,0.4)', color: BROWN }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: NAVY }}>
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition"
                      style={{ borderColor: 'rgba(180,160,130,0.4)', color: BROWN }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: NAVY }}>
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition"
                      style={{ borderColor: 'rgba(180,160,130,0.4)', color: BROWN }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-1 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
                  style={{ backgroundColor: NAVY }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = NAVY_MID }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = NAVY }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account & Continue</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center text-xs" style={{ color: 'rgba(58,42,24,0.7)' }}>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg('') }}
                    className="font-bold underline cursor-pointer"
                    style={{ color: NAVY }}
                  >
                    Login here
                  </button>
                </div>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {tab === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg('') }}
                    className="text-xs flex items-center gap-1 font-bold hover:underline"
                    style={{ color: NAVY }}
                  >
                    <ArrowLeft size={14} /> Back to Login
                  </button>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: 'rgba(58,42,24,0.7)' }}>
                  Enter your registered email address and we'll send you a link to reset your password.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition"
                      style={{ borderColor: 'rgba(180,160,130,0.4)', color: BROWN }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
                  style={{ backgroundColor: NAVY }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending reset link...</span>
                    </>
                  ) : (
                    <span>Send Password Reset Link</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

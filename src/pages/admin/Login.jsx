import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { BG, NAVY, GOLD, NAVY_DARK } from '../../components/admin/admin-ui'
import { api } from '../../services/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: BG }}>
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: 'radial-gradient(#c7af85 0.75px, transparent 0.75px)',
        backgroundSize: '28px 28px',
      }} />
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: 'linear-gradient(180deg,#faf5ea,#f1e4c6)', border: '1px solid rgba(180,160,130,0.3)' }}>
          <div className="px-8 pt-8 pb-7 text-center relative">
            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{ background: `linear-gradient(135deg, ${NAVY_DARK}, #17315e)`, boxShadow: '0 14px 34px rgba(0,26,77,0.35)' }}>
              <ShieldCheck size={36} style={{ color: GOLD }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Cinzel', color: NAVY }}>Alpine Explorers</h1>
            <p className="text-[11px] uppercase tracking-[0.3em] font-bold mt-1" style={{ color: GOLD }}>Admin Console</p>
          </div>

          <form onSubmit={submit} className="px-8 pb-8">
            {error && (
              <div className="mb-4 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#8b2518' }}>
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-[11px] font-bold uppercase tracking-wide mb-1.5" style={{ color: NAVY }}>Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl outline-none" style={{ border: '1px solid rgba(0,26,77,0.18)', background: '#fff', fontFamily: 'Inter', fontSize: 14 }}
                  placeholder="Enter username" autoFocus />
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-[11px] font-bold uppercase tracking-wide mb-1.5" style={{ color: NAVY }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input type={show ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 rounded-xl outline-none" style={{ border: '1px solid rgba(0,26,77,0.18)', background: '#fff', fontFamily: 'Inter', fontSize: 14 }}
                  placeholder="Enter password" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-60"
              style={{ fontFamily: 'Cinzel', background: `linear-gradient(90deg, ${GOLD}, #e0c05a)`, color: NAVY, boxShadow: '0 10px 26px rgba(197,155,39,0.4)' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
            <div className="mt-4 text-center text-[11px]" style={{ color: 'rgba(58,42,24,0.6)', fontFamily: 'Inter' }}>
              Demo: <b>admin</b> / <b>admin123</b>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
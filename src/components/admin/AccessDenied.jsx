import { ShieldAlert, ArrowLeft, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NAVY, GOLD, BG } from './admin-ui'

export default function AccessDenied({ message, backTo = '/admin/dashboard' }) {
  return (
    <div
      className="min-h-[70vh] flex items-center justify-center p-4"
      style={{ background: BG }}
    >
      <div
        className="max-w-md w-full rounded-3xl p-8 text-center shadow-xl border relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #faf5ea, #f1e4c6)',
          borderColor: 'rgba(180, 160, 130, 0.35)',
        }}
      >
        <div
          className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-5 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #8b2518, #4a120b)',
            boxShadow: '0 10px 24px rgba(139, 37, 24, 0.35)',
          }}
        >
          <ShieldAlert size={40} className="text-white" />
        </div>

        <h1
          className="text-2xl font-bold tracking-wide uppercase mb-2"
          style={{ fontFamily: 'Cinzel, serif', color: NAVY }}
        >
          ACCESS DENIED
        </h1>

        <p
          className="text-sm font-medium mb-6"
          style={{ color: 'rgba(0, 26, 77, 0.65)', fontFamily: "'Inter', sans-serif" }}
        >
          {message || "You don't have permission to access this section."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={backTo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:opacity-90"
            style={{
              fontFamily: 'Cinzel, serif',
              background: `linear-gradient(90deg, ${GOLD}, #e0c05a)`,
              color: NAVY,
              boxShadow: '0 8px 20px rgba(197, 155, 39, 0.35)',
            }}
          >
            <Home size={15} /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

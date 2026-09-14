export const NAVY = '#001a4d'
export const GOLD = '#c59b27'
export const GOLD2 = '#d4af37'
export const CREAM = '#faf5ea'
export const BROWN = '#3a2a18'
export const ERR = '#dc2626'

export const font = {
  vintage: { fontFamily: 'Cinzel, serif' },
  body: { fontFamily: 'Inter, sans-serif' },
}

export const inputBase = {
  backgroundColor: '#ffffff',
  color: NAVY,
  borderRadius: '0.75rem',
  width: '100%',
  padding: '0.65rem 0.75rem',
  fontSize: '0.825rem',
  outline: 'none',
}

export function fieldStyle(hasError) {
  return { border: `1px solid ${hasError ? ERR : 'rgba(180,160,130,0.5)'}` }
}

export function Field({ id, label, error, required, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY, ...font.body }}>
        {label}
        {required && <span style={{ color: '#b45309' }}> *</span>}
        {hint && <span className="normal-case font-medium tracking-normal ml-1" style={{ color: 'rgba(58,42,24,0.6)' }}>{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[11px] font-semibold" style={{ color: ERR, ...font.body }}>
          {error}
        </p>
      )}
    </div>
  )
}

export function ChipGroup({ id, label, required, value, onChange, options, error }) {
  return (
    <div>
      <span id={`${id}-label`} className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: NAVY, ...font.body }}>
        {label}
        {required && <span style={{ color: '#b45309' }}> *</span>}
      </span>
      <div role="radiogroup" aria-labelledby={`${id}-label`} className="flex flex-wrap gap-2" style={font.body}>
        {options.map((o) => {
          const active = value === o
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={active}
              aria-invalid={!!error}
              onClick={() => onChange(o)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer"
              style={{
                backgroundColor: active ? NAVY : '#ffffff',
                color: active ? '#ffffff' : 'rgba(58,42,24,0.75)',
                border: `1px solid ${error && !active ? ERR : active ? NAVY : 'rgba(180,160,130,0.5)'}`,
                boxShadow: active ? '0 4px 12px rgba(0,26,77,0.25)' : 'none',
              }}
            >
              {o}
            </button>
          )
        })}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[11px] font-semibold" style={{ color: ERR, ...font.body }}>
          {error}
        </p>
      )}
    </div>
  )
}

export function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1" style={{ background: 'rgba(197,155,39,0.5)' }} />
      <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: NAVY, ...font.body }}>
        {children}
      </span>
      <span className="h-px flex-1" style={{ background: 'rgba(197,155,39,0.5)' }} />
    </div>
  )
}

export function NoticeBox({ children }) {
  return (
    <div className="rounded-xl px-4 py-3 text-xs leading-relaxed" style={{ backgroundColor: 'rgba(197,155,39,0.08)', border: '1px solid rgba(197,155,39,0.35)', color: 'rgba(58,42,24,0.85)', ...font.body }}>
      {children}
    </div>
  )
}
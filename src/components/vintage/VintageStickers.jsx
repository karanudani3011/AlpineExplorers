// Vintage scrapbook travel stickers, rubber postmarks, and seals

export function SwissSummitStamp({ className = "w-28 h-28" }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="54" stroke="#8b2518" strokeWidth="2.5" strokeDasharray="6 3" opacity="0.85" />
      <circle cx="60" cy="60" r="47" stroke="#8b2518" strokeWidth="1.2" opacity="0.75" />
      {/* Mountain Peak Icon */}
      <polygon points="60,35 44,60 76,60" fill="none" stroke="#8b2518" strokeWidth="2" />
      <polygon points="60,35 54,45 66,45" fill="#8b2518" opacity="0.3" />
      <polygon points="72,48 84,65 60,65" fill="none" stroke="#8b2518" strokeWidth="1.5" />
      {/* Curved Text Simulation */}
      <path id="curveTop" d="M22 60 A38 38 0 0 1 98 60" fill="none" />
      <text fill="#8b2518" fontSize="8.5" fontWeight="bold" fontFamily="serif" letterSpacing="1.5">
        <textPath href="#curveTop" startOffset="50%" textAnchor="middle">
          ALPINE SUMMIT
        </textPath>
      </text>
      <text x="60" y="80" textAnchor="middle" fill="#8b2518" fontSize="10" fontWeight="bold" fontFamily="serif">
        1924
      </text>
      <text x="60" y="93" textAnchor="middle" fill="#8b2518" fontSize="6" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">
        • ELEV. 4,478M •
      </text>
    </svg>
  )
}

export function AirMailSticker({ className = "w-36 h-20" }) {
  return (
    <div className={`relative bg-amber-50 p-2 shadow-md border-2 border-stone-300 rounded overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Air Mail Red & Blue border stripes */}
      <div
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            #1e3a8a 0px,
            #1e3a8a 10px,
            transparent 10px,
            transparent 16px,
            #b91c1c 16px,
            #b91c1c 26px,
            transparent 26px,
            transparent 32px
          )`,
          backgroundSize: '100% 8px',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'top, bottom',
        }}
      />
      <div className="bg-[#122b49] text-amber-50 rounded px-2.5 py-1 text-center font-bold tracking-widest text-xs flex items-center justify-between">
        <span>PAR AVION</span>
        <span className="text-[9px] opacity-75">✈ 1st CLASS</span>
      </div>
      <div className="flex items-center justify-between px-1 text-[9px] font-mono text-stone-700 font-semibold">
        <span>ALPINE EXPRESS</span>
        <span>VIA AIR MAIL</span>
      </div>
    </div>
  )
}

export function PassportVisaStamp({ className = "w-32 h-20" }) {
  return (
    <div className={`border-2 border-dashed border-emerald-800 text-emerald-900 p-2 rounded-lg bg-emerald-50/70 font-mono text-[10px] leading-tight rotate-3 shadow-sm ${className}`}>
      <div className="flex justify-between border-b border-emerald-700/40 pb-1 font-bold">
        <span>★ PASSPORT CONTROL</span>
        <span>ENTRY</span>
      </div>
      <div className="py-1">
        <span className="block text-xs font-bold font-serif">ZERMATT PASS</span>
        <span className="text-[9px] text-emerald-700 font-semibold">VALIDATED: 1924-EXPEDITION</span>
      </div>
      <div className="text-[8px] text-emerald-800 uppercase tracking-widest text-right font-bold">
        APPROVED ✓
      </div>
    </div>
  )
}

export function HandDrawnRoute({ className = "w-full h-24" }) {
  return (
    <svg viewBox="0 0 600 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 90 C120 20, 240 130, 360 40 S500 110, 580 30"
        stroke="#8c5828"
        strokeWidth="2.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Waypoints */}
      <circle cx="20" cy="90" r="4" fill="#ba3322" />
      <circle cx="200" cy="75" r="3.5" fill="#1e3a5f" />
      <circle cx="360" cy="40" r="3.5" fill="#1e3a5f" />
      <circle cx="580" cy="30" r="5" fill="#ba3322" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  )
}

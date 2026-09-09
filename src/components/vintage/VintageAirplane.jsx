// Handcrafted vintage golden-era expedition propeller airplane illustration
export default function VintageAirplane({ className = "w-56 h-36" }) {
  return (
    <svg
      viewBox="0 0 280 180"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="40%" stopColor="#0f233d" />
          <stop offset="100%" stopColor="#091424" />
        </linearGradient>
        <linearGradient id="wingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5efe0" />
          <stop offset="100%" stopColor="#dcd1ba" />
        </linearGradient>
        <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f7d472" />
          <stop offset="100%" stopColor="#ba8b25" />
        </linearGradient>
        <filter id="planeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#211508" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Flight contrail trail behind plane */}
      <path
        d="M20 150 C70 140, 110 115, 140 100"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="6 4"
        opacity="0.5"
      />
      <path
        d="M10 160 C65 148, 105 125, 135 110"
        stroke="#e5b869"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 6"
        opacity="0.6"
      />

      <g filter="url(#planeShadow)" transform="rotate(-12, 160, 90)">
        {/* Far Wing */}
        <polygon points="120,68 185,25 210,32 170,72" fill="#cdc1a7" stroke="#9e9177" strokeWidth="1.5" />

        {/* Tail Fin & Rudder */}
        <polygon points="65,72 82,30 98,34 92,76" fill="url(#fuselageGrad)" stroke="#132742" strokeWidth="1.5" />
        <polygon points="82,30 98,34 96,52 86,50" fill="url(#goldTrim)" />
        {/* Horizontal Stabilizer */}
        <polygon points="60,78 95,78 90,86 52,86" fill="url(#wingGrad)" stroke="#a89a7f" strokeWidth="1" />

        {/* Main Fuselage */}
        <path
          d="M60 82 C100 80, 200 75, 235 85 C240 87, 245 92, 240 98 C220 110, 110 106, 60 92 Z"
          fill="url(#fuselageGrad)"
          stroke="#091424"
          strokeWidth="2"
        />

        {/* Gold stripe along fuselage */}
        <path
          d="M65 86 C110 84, 195 82, 233 89"
          stroke="url(#goldTrim)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Cockpit Windows */}
        <polygon points="182,75 205,74 212,82 186,83" fill="#8ed0f8" opacity="0.85" stroke="#ffffff" strokeWidth="1" />
        <line x1="195" y1="74" x2="197" y2="83" stroke="#0f233d" strokeWidth="1.5" />

        {/* Passenger Portholes */}
        <circle cx="168" cy="85" r="3.5" fill="#8ed0f8" stroke="#ffffff" strokeWidth="0.8" />
        <circle cx="152" cy="86" r="3.5" fill="#8ed0f8" stroke="#ffffff" strokeWidth="0.8" />
        <circle cx="136" cy="87" r="3.5" fill="#8ed0f8" stroke="#ffffff" strokeWidth="0.8" />
        <circle cx="120" cy="88" r="3.5" fill="#8ed0f8" stroke="#ffffff" strokeWidth="0.8" />

        {/* Near Wing */}
        <polygon points="140,86 170,145 198,138 195,84" fill="url(#wingGrad)" stroke="#a89a7f" strokeWidth="2" />
        <line x1="168" y1="92" x2="188" y2="135" stroke="url(#goldTrim)" strokeWidth="3" />
        <text x="178" y="125" transform="rotate(64, 178, 125)" fill="#1e3a5f" fontSize="8" fontWeight="bold" fontFamily="serif">ALPINE-01</text>

        {/* Engine Nacelle */}
        <rect x="180" y="80" width="32" height="18" rx="7" fill="url(#fuselageGrad)" stroke="#091424" strokeWidth="1.5" />
        {/* Propeller Spinner */}
        <polygon points="212,83 222,89 212,95" fill="url(#goldTrim)" />
        {/* Spinning Propeller Blur Disc */}
        <ellipse cx="218" cy="89" rx="3" ry="24" fill="#f7d472" opacity="0.35" />
        <line x1="218" y1="68" x2="218" y2="110" stroke="#f7d472" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
      </g>
    </svg>
  )
}

// Handcrafted vintage adventure roadster / safari overland vehicle illustration
export default function VintageCar({ className = "w-52 h-32" }) {
  return (
    <svg
      viewBox="0 0 260 160"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a5d3f" />
          <stop offset="60%" stopColor="#2c3a24" />
          <stop offset="100%" stopColor="#1a2415" />
        </linearGradient>
        <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f7f9fa" />
          <stop offset="50%" stopColor="#c5cbd1" />
          <stop offset="100%" stopColor="#8d97a3" />
        </linearGradient>
        <linearGradient id="canvasRoof" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ebe1ce" />
          <stop offset="100%" stopColor="#ccbe9f" />
        </linearGradient>
        <filter id="carShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#1a140d" floodOpacity="0.4" />
        </filter>
      </defs>

      <g filter="url(#carShadow)">
        {/* Spare tire on back */}
        <ellipse cx="36" cy="94" rx="10" ry="24" fill="#242220" stroke="#12100e" strokeWidth="2" />
        <ellipse cx="36" cy="94" rx="5" ry="12" fill="#524e49" />

        {/* Roof Luggage Rack with suitcases */}
        <rect x="75" y="32" width="105" height="5" rx="2" fill="url(#chromeGrad)" />
        <line x1="85" y1="37" x2="85" y2="44" stroke="url(#chromeGrad)" strokeWidth="2" />
        <line x1="125" y1="37" x2="125" y2="44" stroke="url(#chromeGrad)" strokeWidth="2" />
        <line x1="165" y1="37" x2="165" y2="44" stroke="url(#chromeGrad)" strokeWidth="2" />
        {/* Bundled luggage on roof */}
        <rect x="82" y="20" width="38" height="14" rx="3" fill="#8c4a28" stroke="#522b16" strokeWidth="1.5" />
        <rect x="125" y="16" width="46" height="18" rx="3" fill="#3b5266" stroke="#223240" strokeWidth="1.5" />
        <line x1="78" y1="28" x2="175" y2="28" stroke="#d4a137" strokeWidth="1.5" strokeDasharray="4 2" />

        {/* Canvas Roof / Cab */}
        <path
          d="M62 82 L72 44 C74 42, 78 40, 85 40 L168 40 C174 40, 180 43, 184 48 L200 82 Z"
          fill="url(#canvasRoof)"
          stroke="#9e9177"
          strokeWidth="2"
        />

        {/* Windshield & Windows */}
        <polygon points="178,48 194,80 148,80 148,46" fill="#a4d8fa" opacity="0.8" stroke="#5c5344" strokeWidth="1.5" />
        <polygon points="80,48 140,48 140,80 72,80" fill="#a4d8fa" opacity="0.7" stroke="#5c5344" strokeWidth="1.5" />

        {/* Main Body */}
        <path
          d="M38 98 C38 88, 48 84, 60 84 L196 84 C204 84, 214 88, 222 92 L244 96 C248 98, 250 102, 248 106 L245 116 C242 120, 238 122, 230 122 L52 122 C44 122, 38 116, 38 108 Z"
          fill="url(#carBodyGrad)"
          stroke="#151f11"
          strokeWidth="2"
        />

        {/* Front Radiator Hood */}
        <path d="M200 84 L232 88 C238 90, 244 94, 245 100 L242 122 L200 122 Z" fill="#384930" />
        <rect x="238" y="94" width="8" height="26" rx="3" fill="url(#chromeGrad)" stroke="#52575c" strokeWidth="1" />
        {/* Radiator Cap Ornate Mascot */}
        <circle cx="242" cy="91" r="2.5" fill="#d4a137" />

        {/* Big Round Brass Headlight */}
        <circle cx="236" cy="98" r="9" fill="url(#chromeGrad)" stroke="#42464a" strokeWidth="1.5" />
        <circle cx="236" cy="98" r="6" fill="#fff7d6" stroke="#d4a137" strokeWidth="1" />
        {/* Light beam glow */}
        <polygon points="244,95 260,88 260,108 244,101" fill="#fff5cc" opacity="0.4" />

        {/* Running Board / Fender curves */}
        <path
          d="M50 114 C50 94, 90 94, 90 114 L160 114 C160 94, 200 94, 200 114 L225 114"
          stroke="#1a140d"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Door line & handle */}
        <rect x="110" y="86" width="36" height="34" rx="2" fill="none" stroke="#232e1d" strokeWidth="1.5" />
        <line x1="140" y1="92" x2="145" y2="92" stroke="url(#chromeGrad)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Rear Wheel */}
        <circle cx="70" cy="120" r="18" fill="#242220" stroke="#12100e" strokeWidth="2" />
        <circle cx="70" cy="120" r="11" fill="url(#chromeGrad)" />
        <circle cx="70" cy="120" r="4" fill="#12100e" />
        {/* Spokes */}
        <line x1="70" y1="109" x2="70" y2="131" stroke="#4a525c" strokeWidth="1" />
        <line x1="59" y1="120" x2="81" y2="120" stroke="#4a525c" strokeWidth="1" />

        {/* Front Wheel */}
        <circle cx="180" cy="120" r="18" fill="#242220" stroke="#12100e" strokeWidth="2" />
        <circle cx="180" cy="120" r="11" fill="url(#chromeGrad)" />
        <circle cx="180" cy="120" r="4" fill="#12100e" />
        <line x1="180" y1="109" x2="180" y2="131" stroke="#4a525c" strokeWidth="1" />
        <line x1="169" y1="120" x2="191" y2="120" stroke="#4a525c" strokeWidth="1" />
      </g>
    </svg>
  )
}

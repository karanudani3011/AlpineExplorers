// High-fidelity 3D-styled SVG illustrations for the Home Page 3D Board

// Card 1: 3D Globe with Orbiting Airplane
export function GlobeIllustration({ className = "w-20 h-20" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="globeSphere" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#7ad3ff" />
          <stop offset="45%" stopColor="#3b82f6" />
          <stop offset="85%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>
        <filter id="globeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1e40af" floodOpacity="0.35" />
        </filter>
        <linearGradient id="orbitRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>

      <g filter="url(#globeGlow)">
        {/* Back of Orbit Ring */}
        <ellipse cx="50" cy="52" rx="42" ry="18" stroke="url(#orbitRing)" strokeWidth="4.5" strokeDasharray="60 100" strokeDashoffset="40" strokeLinecap="round" opacity="0.6" transform="rotate(-28, 50, 52)" />

        {/* 3D Sphere */}
        <circle cx="50" cy="50" r="32" fill="url(#globeSphere)" />

        {/* Continents (Green 3D topography) */}
        {/* Americas */}
        <path d="M34 32 C38 32, 42 38, 40 44 C38 48, 32 52, 33 56 C34 60, 42 66, 40 70 C36 72, 30 68, 28 60 C26 50, 30 38, 34 32 Z" fill="#34d399" opacity="0.95" />
        {/* Europe / Africa */}
        <path d="M50 28 C56 26, 62 30, 64 36 C66 42, 60 46, 62 52 C64 58, 70 64, 66 68 C60 70, 54 62, 52 56 C50 48, 48 38, 50 28 Z" fill="#34d399" opacity="0.95" />
        {/* Asia */}
        <path d="M66 32 C74 30, 80 36, 78 44 C76 48, 70 50, 68 46 Z" fill="#34d399" opacity="0.95" />

        {/* Specular Highlight Gloss */}
        <ellipse cx="42" cy="34" rx="12" ry="7" fill="#ffffff" opacity="0.45" transform="rotate(-30, 42, 34)" />

        {/* Front of Orbit Ring */}
        <ellipse cx="50" cy="52" rx="42" ry="18" stroke="url(#orbitRing)" strokeWidth="4.5" strokeDasharray="100 60" strokeLinecap="round" transform="rotate(-28, 50, 52)" />

        {/* 3D Airplane on Orbit */}
        <g transform="translate(68, 30) rotate(-15)">
          <polygon points="12,6 0,0 4,6 0,12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
          <polygon points="4,6 0,2 1,6 0,10" fill="#93c5fd" />
          <ellipse cx="12" cy="6" rx="2" ry="1" fill="#f59e0b" />
        </g>
      </g>
    </svg>
  )
}

// Card 2: 3D Tourist Bus with Folded Map & Pin
export function DomesticIllustration({ className = "w-20 h-20" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="busBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="60%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <filter id="busShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#78350f" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#busShadow)">
        {/* Folded Map Underneath */}
        <polygon points="12,50 36,44 58,52 36,60" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
        <polygon points="36,44 60,38 82,46 58,52" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        <path d="M25 50 Q40 46 52 48" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 2" fill="none" />

        {/* Red Location Pin on Map */}
        <g transform="translate(48, 30)">
          <path d="M8 18 C5 13 2 10 2 6 C2 2.7 4.7 0 8 0 C11.3 0 14 2.7 14 6 C14 10 11 13 8 18 Z" fill="#ef4444" />
          <circle cx="8" cy="6" r="2.5" fill="#ffffff" />
        </g>

        {/* 3D Modern Touring Coach Bus */}
        <g transform="translate(24, 48)">
          {/* Main Body Chassis */}
          <rect x="0" y="4" width="56" height="26" rx="6" fill="url(#busBody)" stroke="#a16207" strokeWidth="1" />
          {/* Front Slant Windshield */}
          <path d="M50 4 L56 12 L56 22 L50 22 Z" fill="#38bdf8" opacity="0.9" />
          {/* Side Windows */}
          <rect x="6" y="8" width="8" height="9" rx="2" fill="#38bdf8" opacity="0.85" />
          <rect x="17" y="8" width="8" height="9" rx="2" fill="#38bdf8" opacity="0.85" />
          <rect x="28" y="8" width="8" height="9" rx="2" fill="#38bdf8" opacity="0.85" />
          <rect x="39" y="8" width="8" height="9" rx="2" fill="#38bdf8" opacity="0.85" />

          {/* Lower stripe */}
          <rect x="0" y="22" width="54" height="4" fill="#713f12" opacity="0.3" />

          {/* Wheels */}
          <circle cx="14" cy="30" r="6" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="14" cy="30" r="2.5" fill="#cbd5e1" />
          <circle cx="44" cy="30" r="6" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="44" cy="30" r="2.5" fill="#cbd5e1" />

          {/* Headlights */}
          <circle cx="55" cy="20" r="2" fill="#fef08a" />
        </g>
      </g>
    </svg>
  )
}

// Card 3: 3D Mountain Adventures (Snowy Peaks & Alpine Valley)
export function MountainIllustration({ className = "w-20 h-20" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rockGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="60%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="hillGreen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <filter id="mountainShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#1e293b" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#mountainShadow)">
        {/* Green Ground Mound */}
        <ellipse cx="50" cy="74" rx="42" ry="14" fill="url(#hillGreen)" />

        {/* Back Peak (Left) */}
        <polygon points="18,72 35,38 52,72" fill="#475569" />
        <polygon points="35,38 29,50 35,46 41,52 46,50" fill="#ffffff" />

        {/* Back Peak (Right) */}
        <polygon points="48,72 68,36 88,72" fill="#475569" />
        <polygon points="68,36 60,48 68,44 76,50 82,48" fill="#ffffff" />

        {/* Main Center Tall Peak */}
        <polygon points="26,72 50,22 74,72" fill="url(#rockGrad)" />
        {/* Snow Cap with Jagged Edges */}
        <polygon points="50,22 40,42 46,38 50,44 55,39 62,44" fill="#ffffff" />

        {/* Tiny Pine Trees in foreground */}
        <polygon points="30,76 34,68 38,76" fill="#166534" />
        <polygon points="62,76 66,66 70,76" fill="#166534" />
        <polygon points="68,78 72,70 76,78" fill="#15803d" />

        {/* Tiny Hikers */}
        <circle cx="46" cy="68" r="1.5" fill="#ef4444" />
        <line x1="46" y1="69" x2="46" y2="73" stroke="#1e293b" strokeWidth="1" />
        <circle cx="51" cy="69" r="1.5" fill="#3b82f6" />
        <line x1="51" y1="69" x2="51" y2="73" stroke="#1e293b" strokeWidth="1" />
      </g>
    </svg>
  )
}

// Card 4: 3D River & Camp (Yellow Raft & Glowing Campfire)
export function CampIllustration({ className = "w-20 h-20" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="85%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="raftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
        <filter id="campShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#7c2d12" floodOpacity="0.3" />
        </filter>
      </defs>

      <g filter="url(#campShadow)">
        {/* River Stream / Water Surface */}
        <ellipse cx="50" cy="75" rx="42" ry="12" fill="#38bdf8" opacity="0.6" />
        <path d="M15 76 Q30 73 50 75 T85 73" stroke="#e0f2fe" strokeWidth="1.5" fill="none" opacity="0.8" />

        {/* Yellow Inflatable Raft */}
        <g transform="translate(14, 52) rotate(-6)">
          <ellipse cx="22" cy="12" rx="18" ry="9" fill="url(#raftGrad)" stroke="#ca8a04" strokeWidth="1.5" />
          <ellipse cx="22" cy="12" rx="12" ry="5" fill="#713f12" opacity="0.2" />
          {/* Paddle */}
          <line x1="10" y1="2" x2="30" y2="18" stroke="#92400e" strokeWidth="1.5" />
          <ellipse cx="30" cy="18" rx="4" ry="2" fill="#d97706" transform="rotate(30, 30, 18)" />
        </g>

        {/* 3D Campfire Logs */}
        <g transform="translate(56, 42)">
          {/* Wooden Logs Base */}
          <line x1="2" y1="30" x2="32" y2="22" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
          <line x1="6" y1="22" x2="28" y2="30" stroke="#451a03" strokeWidth="5" strokeLinecap="round" />
          <circle cx="17" cy="26" r="5" fill="#991b1b" opacity="0.8" />

          {/* Dancing Flame Flames */}
          <path
            d="M17 26 C12 22, 9 16, 12 10 C14 14, 15 14, 17 6 C19 12, 21 12, 23 10 C25 15, 23 22, 17 26 Z"
            fill="url(#fireGrad)"
          />
          <path
            d="M17 25 C14 22, 13 18, 15 15 C16 17, 16 17, 17 12 C18 16, 19 16, 20 15 C21 18, 19 22, 17 25 Z"
            fill="#fef08a"
          />
        </g>
      </g>
    </svg>
  )
}

// 3D Miniature Tourist Character (Left: Facing Board)
export function TouristCharacterLeft({ className = "w-16 h-28" }) {
  return (
    <svg viewBox="0 0 80 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="charShadowLeft" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="2" dy="8" stdDeviation="4" floodColor="#3c2d1e" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#charShadowLeft)">
        {/* Ground shadow puddle */}
        <ellipse cx="40" cy="132" rx="18" ry="6" fill="#4a3728" opacity="0.3" />

        {/* Boots */}
        <rect x="28" y="118" width="10" height="12" rx="3" fill="#78350f" />
        <rect x="42" y="118" width="10" height="12" rx="3" fill="#78350f" />

        {/* Legs / Trousers */}
        <rect x="30" y="80" width="7" height="40" rx="3.5" fill="#1e3a8a" />
        <rect x="43" y="80" width="7" height="40" rx="3.5" fill="#1e3a8a" />

        {/* Heavy Adventure Backpack */}
        <rect x="18" y="44" width="16" height="34" rx="6" fill="#15803d" stroke="#166534" strokeWidth="1" />
        <rect x="16" y="48" width="4" height="14" rx="2" fill="#84cc16" />
        {/* Bedroll rolled on top */}
        <rect x="16" y="38" width="18" height="7" rx="3.5" fill="#0284c7" />

        {/* Torso / Jacket (Orange / Red) */}
        <rect x="30" y="44" width="22" height="38" rx="8" fill="#ea580c" />
        <rect x="38" y="46" width="6" height="36" fill="#c2410c" />

        {/* Head / Face */}
        <circle cx="41" cy="28" r="10" fill="#fed7aa" />
        {/* Hair */}
        <path d="M32 26 C32 18, 50 18, 50 26 C47 24, 43 23, 40 23 C36 23, 33 24, 32 26 Z" fill="#451a03" />

        {/* Extended Hand pointing to the board */}
        <path d="M50 56 C58 54, 66 50, 72 44" stroke="#ea580c" strokeWidth="5" strokeLinecap="round" />
        <circle cx="73" cy="43" r="3" fill="#fed7aa" />
      </g>
    </svg>
  )
}

// 3D Miniature Tourist Character (Right: Facing Board)
export function TouristCharacterRight({ className = "w-16 h-28" }) {
  return (
    <svg viewBox="0 0 80 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="charShadowRight" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="-2" dy="8" stdDeviation="4" floodColor="#3c2d1e" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#charShadowRight)">
        {/* Ground shadow puddle */}
        <ellipse cx="40" cy="132" rx="18" ry="6" fill="#4a3728" opacity="0.3" />

        {/* Boots */}
        <rect x="28" y="118" width="10" height="12" rx="3" fill="#78350f" />
        <rect x="42" y="118" width="10" height="12" rx="3" fill="#78350f" />

        {/* Legs / Blue Jeans */}
        <rect x="30" y="80" width="7" height="40" rx="3.5" fill="#1e3a8a" />
        <rect x="43" y="80" width="7" height="40" rx="3.5" fill="#1e3a8a" />

        {/* Heavy Adventure Backpack */}
        <rect x="46" y="44" width="16" height="34" rx="6" fill="#854d0e" stroke="#713f12" strokeWidth="1" />
        {/* Rolled sleeping mat */}
        <rect x="46" y="38" width="18" height="7" rx="3.5" fill="#0d9488" />

        {/* Torso / Brown Jacket */}
        <rect x="28" y="44" width="22" height="38" rx="8" fill="#a16207" />

        {/* Head / Hair */}
        <circle cx="39" cy="28" r="10" fill="#fed7aa" />
        <path d="M30 26 C30 18, 48 18, 48 26 C45 24, 41 23, 38 23 C34 23, 31 24, 30 26 Z" fill="#1c1917" />

        {/* Arm reaching towards the board */}
        <path d="M30 56 C22 54, 14 50, 8 44" stroke="#a16207" strokeWidth="5" strokeLinecap="round" />
        <circle cx="7" cy="43" r="3" fill="#fed7aa" />
      </g>
    </svg>
  )
}

// 3D Vintage Brass Compass Rose (Bottom Center of Board)
export function VintageBrassCompass({ className = "w-24 h-24" }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="compassBrass" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="85%" stopColor="#996515" />
          <stop offset="100%" stopColor="#5c3a09" />
        </radialGradient>
        <radialGradient id="compassFace" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="80%" stopColor="#f5ecd8" />
          <stop offset="100%" stopColor="#d9c39e" />
        </radialGradient>
        <filter id="compassDrop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#2e1a06" floodOpacity="0.4" />
        </filter>
      </defs>

      <g filter="url(#compassDrop)">
        {/* Outer Heavy Brass Rim */}
        <circle cx="60" cy="60" r="54" fill="url(#compassBrass)" stroke="#3e2504" strokeWidth="2" />
        <circle cx="60" cy="60" r="48" stroke="#ffd700" strokeWidth="1" strokeDasharray="3 2" />

        {/* Inner Parchment Face */}
        <circle cx="60" cy="60" r="44" fill="url(#compassFace)" stroke="#785018" strokeWidth="1.5" />

        {/* Degrees Ticks */}
        <circle cx="60" cy="60" r="40" stroke="#785018" strokeWidth="0.8" strokeDasharray="2 4" />
        <circle cx="60" cy="60" r="36" stroke="#785018" strokeWidth="0.5" strokeDasharray="1 3" />

        {/* Compass Cardinal Points */}
        {/* North Pointer (Ruby Red) */}
        <polygon points="60,60 56,36 60,18" fill="#b91c1c" />
        <polygon points="60,60 64,36 60,18" fill="#ef4444" />
        {/* South Pointer (Dark Slate) */}
        <polygon points="60,60 56,84 60,102" fill="#1e293b" />
        <polygon points="60,60 64,84 60,102" fill="#475569" />
        {/* East Pointer */}
        <polygon points="60,60 84,56 102,60" fill="#d97706" />
        <polygon points="60,60 84,64 102,60" fill="#f59e0b" />
        {/* West Pointer */}
        <polygon points="60,60 36,56 18,60" fill="#d97706" />
        <polygon points="60,60 36,64 18,60" fill="#f59e0b" />

        {/* Center Brass Cap */}
        <circle cx="60" cy="60" r="5" fill="url(#compassBrass)" stroke="#3e2504" strokeWidth="1" />
        <circle cx="60" cy="60" r="2" fill="#ffffff" opacity="0.8" />

        {/* Cardinal Letters */}
        <text x="60" y="29" textAnchor="middle" fill="#b91c1c" fontSize="8" fontWeight="bold" fontFamily="serif">N</text>
        <text x="60" y="98" textAnchor="middle" fill="#1e293b" fontSize="8" fontWeight="bold" fontFamily="serif">S</text>
        <text x="96" y="63" textAnchor="middle" fill="#785018" fontSize="8" fontWeight="bold" fontFamily="serif">E</text>
        <text x="24" y="63" textAnchor="middle" fill="#785018" fontSize="8" fontWeight="bold" fontFamily="serif">W</text>
      </g>
    </svg>
  )
}

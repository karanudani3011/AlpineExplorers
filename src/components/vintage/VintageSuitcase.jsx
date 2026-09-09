// Handcrafted vintage leather travel trunk / suitcase illustration
export default function VintageSuitcase({ className = "w-48 h-36" }) {
  return (
    <svg
      viewBox="0 0 240 180"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="leatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8C4A28" />
          <stop offset="50%" stopColor="#6E3416" />
          <stop offset="100%" stopColor="#4A200B" />
        </linearGradient>
        <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D061" />
          <stop offset="50%" stopColor="#D4A137" />
          <stop offset="100%" stopColor="#8F6516" />
        </linearGradient>
        <filter id="caseShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#2e1408" floodOpacity="0.45" />
        </filter>
      </defs>

      <g filter="url(#caseShadow)">
        {/* Leather Handle */}
        <path
          d="M95 38 C95 20, 145 20, 145 38"
          stroke="url(#leatherGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="88" y="34" width="14" height="8" rx="2" fill="url(#brassGrad)" />
        <rect x="138" y="34" width="14" height="8" rx="2" fill="url(#brassGrad)" />

        {/* Main Body */}
        <rect x="25" y="40" width="190" height="130" rx="14" fill="url(#leatherGrad)" stroke="#381807" strokeWidth="3" />

        {/* Inner stitch line */}
        <rect x="31" y="46" width="178" height="118" rx="10" fill="none" stroke="#D39768" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />

        {/* Horizontal Center Seam / Split */}
        <line x1="25" y1="105" x2="215" y2="105" stroke="#2c1206" strokeWidth="3" />
        <line x1="25" y1="106" x2="215" y2="106" stroke="#a3633b" strokeWidth="1" opacity="0.4" />

        {/* Vertical Straps */}
        <rect x="65" y="40" width="18" height="130" fill="#421b0a" stroke="#260f05" strokeWidth="1.5" />
        <line x1="68" y1="42" x2="68" y2="168" stroke="#cca178" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
        <line x1="79" y1="42" x2="79" y2="168" stroke="#cca178" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />

        <rect x="157" y="40" width="18" height="130" fill="#421b0a" stroke="#260f05" strokeWidth="1.5" />
        <line x1="160" y1="42" x2="160" y2="168" stroke="#cca178" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
        <line x1="171" y1="42" x2="171" y2="168" stroke="#cca178" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />

        {/* Brass Corner Protectors */}
        <path d="M25 58 L25 40 L43 40 C43 50 35 58 25 58 Z" fill="url(#brassGrad)" />
        <circle cx="31" cy="46" r="1.5" fill="#3a2505" />
        <path d="M215 58 L215 40 L197 40 C197 50 205 58 215 58 Z" fill="url(#brassGrad)" />
        <circle cx="209" cy="46" r="1.5" fill="#3a2505" />
        <path d="M25 152 L25 170 L43 170 C43 160 35 152 25 152 Z" fill="url(#brassGrad)" />
        <circle cx="31" cy="164" r="1.5" fill="#3a2505" />
        <path d="M215 152 L215 170 L197 170 C197 160 205 152 215 152 Z" fill="url(#brassGrad)" />
        <circle cx="209" cy="164" r="1.5" fill="#3a2505" />

        {/* Brass Buckles */}
        <rect x="63" y="98" width="22" height="14" rx="3" fill="url(#brassGrad)" stroke="#593b05" strokeWidth="1" />
        <rect x="68" y="102" width="12" height="6" fill="#381807" />
        <rect x="155" y="98" width="22" height="14" rx="3" fill="url(#brassGrad)" stroke="#593b05" strokeWidth="1" />
        <rect x="160" y="102" width="12" height="6" fill="#381807" />

        {/* Center Brass Lock */}
        <rect x="110" y="100" width="20" height="15" rx="3" fill="url(#brassGrad)" stroke="#593b05" strokeWidth="1" />
        <circle cx="120" cy="106" r="2.5" fill="#291605" />
        <line x1="120" y1="107" x2="120" y2="111" stroke="#291605" strokeWidth="1" />

        {/* Vintage Luggage Sticker 1 (Alps Flag) */}
        <g transform="translate(90, 58) rotate(-6)">
          <rect width="46" height="30" rx="3" fill="#faf5eb" stroke="#c25336" strokeWidth="1.5" />
          <rect x="2" y="2" width="42" height="26" fill="#ba3322" opacity="0.9" />
          <path d="M23 8 L23 22 M16 15 L30 15" stroke="white" strokeWidth="4" strokeLinecap="square" />
          <text x="23" y="27" textAnchor="middle" fill="#faf5eb" fontSize="5" fontWeight="bold" fontFamily="sans-serif">ALPES</text>
        </g>

        {/* Luggage Tag with string */}
        <path d="M142 42 C148 50, 155 56, 158 66" stroke="#e8d3b0" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
        <g transform="translate(148, 64) rotate(14)">
          <polygon points="0,0 24,0 30,12 24,24 0,24" fill="#f4ecd8" stroke="#a88960" strokeWidth="1" />
          <circle cx="6" cy="12" r="2.5" fill="#8a673f" />
          <text x="14" y="10" fill="#4a3219" fontSize="4.5" fontWeight="bold" fontFamily="serif">ALPINE</text>
          <text x="14" y="18" fill="#802118" fontSize="4" fontWeight="bold" fontFamily="serif">EXPEDITION</text>
        </g>
      </g>
    </svg>
  )
}

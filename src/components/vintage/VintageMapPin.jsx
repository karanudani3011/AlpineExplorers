// Antique folded travel map with mountain topography and gleaming 3D brass location pin
export default function VintageMapPin({ className = "w-44 h-40" }) {
  return (
    <svg
      viewBox="0 0 200 180"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mapParchment" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f7f2e1" />
          <stop offset="50%" stopColor="#ede1c5" />
          <stop offset="100%" stopColor="#ded0ae" />
        </linearGradient>
        <linearGradient id="pinBrass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd868" />
          <stop offset="50%" stopColor="#d99b26" />
          <stop offset="100%" stopColor="#875308" />
        </linearGradient>
        <filter id="mapShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#382613" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter="url(#mapShadow)">
        {/* Folded Map Panel 1 */}
        <polygon points="20,40 65,30 65,145 20,155" fill="url(#mapParchment)" stroke="#a89270" strokeWidth="1.5" />
        {/* Folded Map Panel 2 */}
        <polygon points="65,30 110,42 110,157 65,145" fill="#e8dac0" stroke="#a89270" strokeWidth="1.5" />
        {/* Folded Map Panel 3 */}
        <polygon points="110,42 155,32 155,147 110,157" fill="url(#mapParchment)" stroke="#a89270" strokeWidth="1.5" />
        {/* Folded Map Panel 4 */}
        <polygon points="155,32 190,40 190,155 155,147" fill="#dfcfb0" stroke="#a89270" strokeWidth="1.5" />

        {/* Contour Lines & Topography on Map */}
        <path d="M30 75 Q45 65 65 72 T110 65 T150 78 T180 70" stroke="#b09673" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M25 95 Q50 85 65 90 T110 84 T155 98 T185 88" stroke="#b09673" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M30 120 Q55 110 65 115 T110 110 T150 122 T180 115" stroke="#b09673" strokeWidth="1" fill="none" opacity="0.6" />

        {/* Mountain Peaks drawn on map */}
        <polygon points="75,100 88,80 102,100" stroke="#876846" strokeWidth="1.2" fill="#d9c5a3" opacity="0.8" />
        <polygon points="96,102 112,74 126,102" stroke="#876846" strokeWidth="1.2" fill="#d9c5a3" opacity="0.8" />

        {/* Navigation Compass Rose on Map corner */}
        <circle cx="45" cy="58" r="10" stroke="#826442" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.5" />
        <line x1="45" y1="46" x2="45" y2="70" stroke="#826442" strokeWidth="1" opacity="0.7" />
        <line x1="33" y1="58" x2="57" y2="58" stroke="#826442" strokeWidth="1" opacity="0.7" />

        {/* Trail dashed line to pin */}
        <path
          d="M45 130 Q70 125 85 105 T112 85"
          stroke="#c0392b"
          strokeWidth="2"
          strokeDasharray="4 3"
          fill="none"
        />

        {/* Beacon Radiating Waves */}
        <circle cx="112" cy="74" r="18" stroke="#f1c40f" strokeWidth="1.5" opacity="0.4" fill="none">
          <animate attributeName="r" values="12;26;12" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="112" cy="74" r="12" stroke="#e67e22" strokeWidth="1" opacity="0.6" fill="none" />

        {/* 3D Pin Shadow */}
        <ellipse cx="112" cy="76" rx="6" ry="3" fill="#362514" opacity="0.4" />

        {/* Vintage Location Pin (Pointer) */}
        <path
          d="M112 75 C102 54 94 40 94 28 C94 15 102 7 112 7 C122 7 130 15 130 28 C130 40 122 54 112 75 Z"
          fill="url(#pinBrass)"
          stroke="#543306"
          strokeWidth="1.5"
        />

        {/* Pin Inner Medallion */}
        <circle cx="112" cy="27" r="9" fill="#1b304c" stroke="#ffe28a" strokeWidth="1.5" />
        {/* Star / Compass star inside pin */}
        <polygon points="112,21 114,26 119,27 114,28 112,33 110,28 105,27 110,26" fill="#ffd868" />
      </g>
    </svg>
  )
}

import { Ticket, ArrowRight, Lock } from 'lucide-react'

export default function BookNowButton({ item, onOpen, label = 'Book Now', showArrow = false, className = '', style = {}, hoverStyle = {}, title, ariaLabel, disabled = false }) {
  const isClosed = disabled || item?.booking_open === 0 || item?.booking_open === false || (item?.seats_total > 0 && (item?.seats_booked || 0) >= item?.seats_total)

  if (isClosed) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center gap-1.5 opacity-60 cursor-not-allowed ${className}`}
        style={style}
        title="Fully booked"
        aria-label="Fully booked"
      >
        <Lock size={12} aria-hidden="true" />
        <span>Fully booked</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      className={`inline-flex items-center gap-1.5 transition cursor-pointer ${className}`}
      style={style}
      title={title || `Book ${item?.title || 'this trip'}`}
      aria-label={ariaLabel || `Book ${item?.title || 'this trip'}`}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
      onMouseLeave={(e) => Object.assign(e.currentTarget.style, style)}
    >
      <Ticket size={13} aria-hidden="true" />
      <span>{label}</span>
      {showArrow && <ArrowRight size={13} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />}
    </button>
  )
}
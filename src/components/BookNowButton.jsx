import { Ticket, ArrowRight } from 'lucide-react'

export default function BookNowButton({ item, onOpen, label = 'Book Now', showArrow = false, className = '', style = {}, hoverStyle = {}, title, ariaLabel }) {
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
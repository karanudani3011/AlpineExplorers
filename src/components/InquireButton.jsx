import { MessageSquare } from 'lucide-react'
import { buildWhatsAppUrl } from '../config/whatsapp'

export default function InquireButton({ item, label = 'Inquire', className = '', style = {}, hoverStyle = {}, title, ariaLabel }) {
  const handleClick = () => {
    window.open(buildWhatsAppUrl(item), '_blank')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 transition cursor-pointer ${className}`}
      style={style}
      title={title || `Inquire about ${item?.title || 'this trip'} on WhatsApp`}
      aria-label={ariaLabel || `Inquire about ${item?.title || 'this trip'} on WhatsApp`}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
      onMouseLeave={(e) => Object.assign(e.currentTarget.style, style)}
    >
      <MessageSquare size={13} aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
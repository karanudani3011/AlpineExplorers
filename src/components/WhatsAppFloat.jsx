import { FaWhatsapp } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'

export default function WhatsAppFloat() {
  const location = useLocation()

  // Hide on admin routes so it doesn't obstruct dashboard controls/tables
  if (location.pathname.startsWith('/admin')) {
    return null
  }

  const phone = '919979883339'
  const message = 'Hello Alpine Explorers, I want to know more about your tours.'
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-float-btn group"
    >
      {/* Subtle pulse animation ring */}
      <span className="whatsapp-float-ping" aria-hidden="true" />

      {/* Main circular button */}
      <span className="whatsapp-float-circle" aria-hidden="true">
        <FaWhatsapp className="whatsapp-float-icon" />
      </span>

      {/* Hover tooltip for desktop */}
      <span className="whatsapp-float-tooltip">
        Chat with us on WhatsApp
      </span>
    </a>
  )
}


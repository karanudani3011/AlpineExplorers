import { useRef } from 'react'
import { Upload, X, RefreshCw } from 'lucide-react'

const NAVY = '#001a4d'
const GOLD = '#c59b27'

/**
 * Reusable photo upload box.
 * Props:
 *  - id:        unique id for the hidden file input
 *  - value:     data URL of current photo ('' = no photo)
 *  - onChange:  called with new data URL
 *  - error:     validation error string
 */
export default function PhotoUpload({ id, value, onChange, error }) {
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Validate type
    const allowed = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowed.includes(file.type)) {
      alert('Please upload a JPG, JPEG, or PNG image.')
      return
    }
    // Validate size (5 MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be less than 5 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
    // Reset input so the same file can be re-selected
    e.target.value = ''
  }

  const trigger = () => inputRef.current?.click()

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-28 h-36 rounded-xl overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all"
        style={{
          border: `2px dashed ${error ? '#dc2626' : value ? GOLD : '#cbd5e1'}`,
          backgroundColor: value ? 'transparent' : 'rgba(0,26,77,0.03)',
          boxShadow: error ? '0 0 0 3px rgba(220,38,38,0.08)' : 'none',
        }}
        onClick={trigger}
        title="Click to upload photograph"
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Applicant photograph"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Actions overlay */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-0 hover:opacity-100 transition-opacity"
              style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange('') }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center bg-red-600 text-white shadow"
                title="Remove photo"
              >
                <X size={12} />
              </button>
              <div className="absolute bottom-0 inset-x-0 py-1.5 flex items-center justify-center gap-1 text-white text-[10px] font-semibold">
                <RefreshCw size={10} /> Change
              </div>
            </div>
          </>
        ) : (
          <>
            <Upload size={22} className="mb-1.5" style={{ color: NAVY, opacity: 0.4 }} />
            <span className="text-[10px] text-center font-medium px-1" style={{ color: '#64748b' }}>
              Click to upload
            </span>
            <span className="text-[9px] text-center mt-0.5" style={{ color: '#94a3b8' }}>
              JPG / PNG
            </span>
          </>
        )}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: NAVY }}>
        Photograph
      </span>
      {value && (
        <button
          type="button"
          onClick={trigger}
          className="text-[10px] underline"
          style={{ color: GOLD }}
        >
          Change Photo
        </button>
      )}
      {error && (
        <p className="text-[11px] font-semibold text-red-600 text-center">{error}</p>
      )}
    </div>
  )
}

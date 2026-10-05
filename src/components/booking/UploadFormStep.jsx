import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, CheckCircle2, ArrowRight, ArrowLeft, FileText } from 'lucide-react'
import { api } from '../../services/api'

const NAVY = 'var(--ae-navy)'
const GOLD = 'var(--ae-gold)'

function FilePreview({ file, onRemove }) {
  const isImage = file.type.startsWith('image/')
  const isPDF = file.type === 'application/pdf'
  const url = URL.createObjectURL(file)

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl border bg-white"
      style={{ borderColor: `${GOLD}40` }}
    >
      {isImage ? (
        <img
          src={url}
          alt="preview"
          className="w-12 h-12 object-cover rounded-lg border flex-shrink-0"
          style={{ borderColor: `${GOLD}30` }}
          onLoad={() => URL.revokeObjectURL(url)}
        />
      ) : (
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${NAVY}10` }}
        >
          <FileText size={20} style={{ color: NAVY }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold truncate" style={{ color: NAVY }}>{file.name}</p>
        <p className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(1)} KB • {isPDF ? 'PDF' : 'Image'}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="w-6 h-6 rounded-full flex items-center justify-center bg-red-50 hover:bg-red-100 transition cursor-pointer shrink-0"
      >
        <X size={12} className="text-red-500" />
      </button>
    </div>
  )
}

function TravelerUploadCard({ traveler, idx, file, onFileChange }) {
  const inputRef = useRef(null)
  const done = !!file

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) onFileChange(f)
  }

  const handleChange = (e) => {
    const f = e.target.files[0]
    if (f) onFileChange(f)
  }

  return (
    <div
      className="bg-white rounded-2xl p-5 border shadow-sm space-y-3"
      style={{ borderColor: done ? `${GOLD}60` : 'rgba(180,160,130,0.25)' }}
    >
      {/* Card header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
          style={{
            background: done ? `linear-gradient(135deg, ${GOLD}, var(--ae-gold2))` : `${NAVY}10`,
            color: NAVY,
          }}
        >
          {done ? <CheckCircle2 size={18} /> : idx + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate" style={{ color: NAVY }}>
            {traveler.fullName || `Traveler ${idx + 1}`}
          </p>
          <p className="text-xs text-gray-400">Upload signed application form for this traveler</p>
        </div>
        {done && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
            ✓ Uploaded
          </span>
        )}
      </div>

      {/* File preview or drop zone */}
      {file ? (
        <FilePreview file={file} onRemove={() => onFileChange(null)} />
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition hover:border-opacity-100"
          style={{ borderColor: `${NAVY}25`, backgroundColor: `${NAVY}03` }}
        >
          <Upload size={24} className="mx-auto mb-2" style={{ color: NAVY, opacity: 0.4 }} />
          <p className="text-xs font-semibold" style={{ color: NAVY }}>
            Click to upload or drag & drop
          </p>
          <p className="text-[10px] text-gray-400 mt-1">JPG, PNG or PDF • Max 10MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}

export default function UploadFormStep({ travelers, tour, onBack, onNext, bookingId, submitting = false, submitError = '' }) {
  // scannedFiles: array matching travelers, each is File | null
  const [scannedFiles, setScannedFiles] = useState(() => travelers.map(() => null))
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploaded, setUploaded] = useState(false)

  const handleFileChange = (idx, file) => {
    setScannedFiles((prev) => {
      const next = [...prev]
      next[idx] = file
      return next
    })
    setUploadError('')
  }

  const anyUploaded = scannedFiles.some(Boolean)

  const handleSubmit = async () => {
    if (!anyUploaded) {
      // User chose to skip — just proceed
      onNext([])
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('booking_id', bookingId || '')
      scannedFiles.forEach((file, idx) => {
        if (file) formData.append(`form_scan_${idx}`, file)
      })

      const data = await api.postForm('/bookings/upload-forms', formData)
      const uploadedList = (data && data.files) ? data.files : []

      setUploaded(true)
      onNext(uploadedList)
    } catch (err) {
      console.warn('Form upload note:', err)
      // Fallback: proceed gracefully so booking payment flow is not interrupted
      setUploaded(true)
      onNext([])
    } finally {
      setUploading(false)
    }
  }

  const isBusy = uploading || submitting
  const displayError = uploadError || submitError

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md"
          style={{ background: `linear-gradient(135deg, ${NAVY}, var(--ae-navy-mid))` }}
        >
          <Upload size={30} style={{ color: GOLD }} />
        </div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: NAVY, fontFamily: 'Cinzel, serif' }}>
          Submit Scanned Form (PDF)
        </h2>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Upload a scanned document or clear photo of your signed Alpine Explorers Application Form (PDF, JPG, or PNG).
          This step is optional — you can also email it after completing your booking.
        </p>
      </div>

      {/* Info */}
      <div
        className="rounded-2xl p-4 border flex gap-3 items-start shadow-sm"
        style={{ backgroundColor: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.25)' }}
      >
        <div className="text-2xl shrink-0">📄</div>
        <div className="text-xs text-gray-700 leading-relaxed">
          <p className="font-bold text-gray-900 mb-1">Submission &amp; Scan Guidelines:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Preferred format:</strong> PDF (or clear JPG / PNG photos)</li>
            <li>Ensure all handwritten fields, affixed photograph, and signatures are legible</li>
            <li>If you are booking for multiple travelers, you can upload their individual forms below</li>
            <li>Need help? You can also email your scanned form to <strong>alpine_explorers@yahoo.com</strong> with your Booking ID</li>
          </ul>
        </div>
      </div>

      {/* Per-traveler upload cards */}
      <div className="space-y-3">
        {travelers.map((t, idx) => (
          <TravelerUploadCard
            key={idx}
            traveler={t}
            idx={idx}
            file={scannedFiles[idx]}
            onFileChange={(file) => handleFileChange(idx, file)}
          />
        ))}
      </div>

      {displayError && (
        <div className="p-3 rounded-xl text-xs font-semibold text-red-600 bg-red-50 border border-red-200">
          {displayError}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 gap-3 flex-wrap">
        <button
          type="button"
          onClick={onBack}
          disabled={isBusy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer bg-white border disabled:opacity-50"
          style={{ color: NAVY, borderColor: '#e2e8f0' }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div className="flex gap-3 ml-auto flex-wrap">
          {!anyUploaded && (
            <button
              type="button"
              onClick={() => onNext([])}
              disabled={isBusy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer border disabled:opacity-50"
              style={{ color: NAVY, borderColor: `${NAVY}25`, backgroundColor: `${NAVY}05` }}
            >
              Skip for now
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isBusy}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-sm transition cursor-pointer shadow-lg disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${NAVY}, var(--ae-navy-mid))` }}
          >
            {isBusy ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {submitting ? 'Preparing Payment…' : 'Uploading…'}
              </>
            ) : (
              <>
                {anyUploaded ? 'Submit & Continue' : 'Continue to Payment'}
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

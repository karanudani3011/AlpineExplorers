import { useEffect, useState } from 'react'
import { api } from '../../services/api'

export default function PrivateAssetImage({ source, alt = 'Private attachment', className = '' }) {
  const [resolved, setResolved] = useState('')
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let live = true
    let objectUrl = ''
    setResolved(''); setFailed(false)
    if (!source) return () => { live = false }
    if (!source.startsWith('/uploads/')) { setResolved(source); return () => { live = false } }
    const filename = source.split('/').pop()
    api.getBlob(`/bookings/local-files/${encodeURIComponent(filename)}`).then(blob => {
      objectUrl = URL.createObjectURL(blob)
      if (live) setResolved(objectUrl)
    }).catch(() => { if (live) setFailed(true) })
    return () => { live = false; if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [source])
  if (failed) return <span className="text-xs text-gray-500">Private file unavailable</span>
  if (!resolved) return <span className="text-xs text-gray-500">Loading securely…</span>
  return <a href={resolved} target="_blank" rel="noreferrer" title={alt}><img src={resolved} alt={alt} className={className} loading="lazy" decoding="async" /></a>
}

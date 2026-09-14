import { useEffect, useRef } from 'react'
import { Eraser, PenLine } from 'lucide-react'
import { NAVY, font } from './bookingUi'

export default function SignaturePad({ value, onChange, height = 150, id = 'sig' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const initialValueRef = useRef(value || null)
  const bgImgRef = useRef(null)
  const strokesRef = useRef([])
  const currentRef = useRef([])
  const drawingRef = useRef(false)

  const drawPath = (ctx, pts) => {
    if (!pts.length) return
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i].x, pts[i].y)
    ctx.stroke()
  }

  const render = () => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const dpr = window.devicePixelRatio || 1
    const width = Math.max(wrap.clientWidth, 200)
    canvas.width = width * dpr
    canvas.height = height * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.lineWidth = 2.2
    ctx.strokeStyle = NAVY
    ctx.clearRect(0, 0, width, height)
    if (bgImgRef.current) {
      const img = bgImgRef.current
      const maxW = width - 40
      const maxH = height - 34
      let iw = img.width
      let ih = img.height
      const scale = Math.min(1, maxW / iw, maxH / ih)
      iw *= scale
      ih *= scale
      ctx.globalAlpha = 0.35
      ctx.drawImage(img, (width - iw) / 2, (height - ih) / 2, iw, ih)
      ctx.globalAlpha = 1
    }
    strokesRef.current.forEach((s) => drawPath(ctx, s))
    if (currentRef.current.length) drawPath(ctx, currentRef.current)
  }

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const emit = () => {
    const canvas = canvasRef.current
    const url = canvas.toDataURL('image/png')
    onChange?.(url)
  }

  const handlePointerDown = (e) => {
    e.preventDefault()
    canvasRef.current.setPointerCapture(e.pointerId)
    drawingRef.current = true
    currentRef.current = [getPos(e)]
  }

  const handlePointerMove = (e) => {
    if (!drawingRef.current) return
    currentRef.current = [...currentRef.current, getPos(e)]
    render()
  }

  const endStroke = () => {
    if (!drawingRef.current) return
    drawingRef.current = false
    if (currentRef.current.length) strokesRef.current = [...strokesRef.current, currentRef.current]
    currentRef.current = []
    render()
    emit()
  }

  const clear = () => {
    strokesRef.current = []
    currentRef.current = []
    bgImgRef.current = null
    initialValueRef.current = null
    render()
    onChange?.('')
  }

  useEffect(() => {
    render()
    const onResize = () => render()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [height]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!initialValueRef.current) return
    const img = new Image()
    img.onload = () => {
      bgImgRef.current = img
      render()
    }
    img.src = initialValueRef.current
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative rounded-xl overflow-hidden"
        style={{ height, border: '1.5px dashed rgba(180,160,130,0.6)', backgroundColor: '#ffffff', touchAction: 'none' }}
      >
        <canvas
          id={id}
          ref={canvasRef}
          className="block w-full cursor-crosshair"
          style={{ width: '100%', height }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
          onPointerLeave={endStroke}
        />
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-1.5">
          <span className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(58,42,24,0.35)', ...font.body }}>
            <PenLine size={11} className="inline mr-1 -translate-y-px" />
            Sign here with mouse / touch
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={clear}
        className="mt-1.5 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer"
        style={{ color: 'rgba(58,42,24,0.65)', backgroundColor: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.25)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.backgroundColor = '#dc2626' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(58,42,24,0.65)'; e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.06)' }}
      >
        <Eraser size={12} aria-hidden="true" />
        Clear Signature
      </button>
    </div>
  )
}
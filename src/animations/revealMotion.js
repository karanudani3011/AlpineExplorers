import { createElement, forwardRef, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { motion as baseMotion } from 'framer-motion'

function assignRef(ref, value) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

function useReveal(active) {
  const elementRef = useRef(null)
  const [revealed, setRevealed] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ))

  const setElement = useCallback((node) => {
    elementRef.current = node
  }, [])

  useLayoutEffect(() => {
    if (!active || revealed) return undefined

    const fallback = window.setTimeout(() => setRevealed(true), 1000)
    const element = elementRef.current
    if (!element) return () => window.clearTimeout(fallback)

    const show = () => setRevealed(true)
    const shouldShowImmediately = () => {
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      const bounds = element.getBoundingClientRect()
      return reducedMotion || bounds.top <= window.innerHeight
    }

    if (shouldShowImmediately()) {
      show()
      return undefined
    }

    let observer
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          show()
          observer.disconnect()
        }
      }, { rootMargin: '0px 0px -50px 0px', threshold: 0.01 })
      observer.observe(element)
    }

    const onPageShow = () => {
      if (shouldShowImmediately()) show()
    }
    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('popstate', onPageShow)

    return () => {
      observer?.disconnect()
      window.clearTimeout(fallback)
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('popstate', onPageShow)
    }
  }, [active, revealed])

  return { revealed, setElement }
}

const wrappedMotionComponents = new Map()

function ViewportReveal({ MotionComponent, props, forwardedRef }) {
  const { revealed, setElement } = useReveal(true)
  const setRef = useCallback((node) => {
    setElement(node)
    assignRef(forwardedRef, node)
  }, [forwardedRef, setElement])

  const { whileInView, viewport, initial, animate, transition, variants, style, ...motionProps } = props
  const resolveTarget = (target) => (typeof target === 'string' ? variants?.[target] : target)
  const hiddenTarget = resolveTarget(initial) || { opacity: 0, y: 20 }
  const visibleTarget = resolveTarget(whileInView) || {}
  const currentTarget = revealed ? visibleTarget : hiddenTarget
  const transformParts = []
  if (currentTarget.x !== undefined) transformParts.push(`translateX(${typeof currentTarget.x === 'number' ? `${currentTarget.x}px` : currentTarget.x})`)
  if (currentTarget.y !== undefined) transformParts.push(`translateY(${typeof currentTarget.y === 'number' ? `${currentTarget.y}px` : currentTarget.y})`)
  if (currentTarget.scale !== undefined) transformParts.push(`scale(${currentTarget.scale})`)
  if (currentTarget.rotate !== undefined) transformParts.push(`rotate(${currentTarget.rotate}deg)`)
  if (currentTarget.rotateX !== undefined) transformParts.push(`rotateX(${currentTarget.rotateX}deg)`)
  if (currentTarget.rotateY !== undefined) transformParts.push(`rotateY(${currentTarget.rotateY}deg)`)
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const duration = reducedMotion ? 0 : Number(transition?.duration ?? 0.55)
  const revealStyle = {
    ...style,
    opacity: currentTarget.opacity ?? (revealed ? 1 : 0),
    transform: transformParts.length ? transformParts.join(' ') : (revealed ? 'none' : 'translateY(20px)'),
    transition: `opacity ${duration}s ease, transform ${duration}s ease`,
  }
  return createElement(MotionComponent, {
    ...motionProps,
    ref: setRef,
    style: revealStyle,
    initial: false,
    animate: undefined,
    variants: undefined,
  })
}

function getRevealAwareMotionComponent(tag) {
  if (wrappedMotionComponents.has(tag)) return wrappedMotionComponents.get(tag)

  const MotionComponent = baseMotion[tag]
  const RevealAwareComponent = forwardRef(function RevealAwareComponent(props, forwardedRef) {
    if (props.whileInView === undefined) {
      return createElement(MotionComponent, { ...props, ref: forwardedRef })
    }
    return createElement(ViewportReveal, { MotionComponent, props, forwardedRef })
  })

  wrappedMotionComponents.set(tag, RevealAwareComponent)
  return RevealAwareComponent
}

// Keep Framer Motion's existing API while routing every whileInView animation
// through the shared observer, reduced-motion handling, and one-second fallback.
export const motion = new Proxy(baseMotion, {
  get(target, property, receiver) {
    if (typeof property !== 'string') return Reflect.get(target, property, receiver)
    return getRevealAwareMotionComponent(property)
  },
})

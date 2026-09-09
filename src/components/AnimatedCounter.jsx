import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export default function AnimatedCounter({ from = 0, to, duration = 2.5, suffix = '', prefix = '' }) {
  const count = useMotionValue(from)
  const rounded = useTransform(count, (latest) => {
    return Math.round(latest)
  })

  useEffect(() => {
    const controls = count.set(to)
    const animation = count.animate(to, {
      duration,
      ease: 'easeOut',
    })

    return () => animation?.stop()
  }, [to, count, duration])

  return (
    <motion.span>
      <motion.div>{prefix}</motion.div>
      <motion.span>{rounded}</motion.span>
      <motion.div>{suffix}</motion.div>
    </motion.span>
  )
}

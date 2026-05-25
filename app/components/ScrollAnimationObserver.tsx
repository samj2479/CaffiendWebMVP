'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollAnimationObserver() {
  const pathname = usePathname()

  useEffect(() => {
    // One-shot: play once on first entry
    const onceEls = document.querySelectorAll<HTMLElement>('.sr-init')
    const onceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible')
            onceObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05 }
    )
    onceEls.forEach((el) => onceObserver.observe(el))

    // Replay: re-fires every time element enters / leaves viewport.
    // Delay is stored in data-delay attr so it only applies on entry, not exit.
    const replayEls = document.querySelectorAll<HTMLElement>('.sr-replay')
    const replayObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) {
            el.style.transitionDelay = el.dataset.delay ?? '0ms'
            el.classList.add('in-view')
          } else {
            el.style.transitionDelay = '0ms'
            el.classList.remove('in-view')
          }
        })
      },
      { threshold: 0.1 }
    )
    replayEls.forEach((el) => replayObserver.observe(el))

    return () => {
      onceObserver.disconnect()
      replayObserver.disconnect()
    }
  }, [pathname])

  return null
}

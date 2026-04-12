'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollAnimationObserver() {
  const pathname = usePathname()

  useEffect(() => {
    // Re-run whenever the page changes so new sr-init elements get observed
    const elements = document.querySelectorAll<HTMLElement>('.sr-init')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  return null
}

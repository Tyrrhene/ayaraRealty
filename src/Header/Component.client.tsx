'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const leftNavItems = data?.navItems?.filter(
    (item) => item.link.label !== 'CONTACT US' && item.link.label !== 'POSTS',
  )

  const rightNavItems = data?.navItems?.filter(
    (item) => item.link.label === 'CONTACT US' || item.link.label === 'POSTS',
  )

  return (
    <header className="container relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-8 flex items-center justify-between relative">
        {/* Left-side links */}
        <div>
          <div className="text-xs">
            <HeaderNav data={{ ...data, navItems: leftNavItems }} />
          </div>
        </div>

        {/* Centered logo */}
        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </Link>

        {/* Right-side nav */}
        <div>
          <HeaderNav data={{ ...data, navItems: rightNavItems }} />
        </div>
      </div>
    </header>
  )
}

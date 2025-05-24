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
    <header
      className="top-0 w-full px-0 z-20 bg-[#009DF3]"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="flex items-center justify-between py-9 relative w-full z-20 px-12">
        {/* Left nav, aligned to start */}
        <div className="flex-1 flex justify-start">
          <HeaderNav data={{ ...data, navItems: leftNavItems }} />
        </div>
        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </Link>
        {/* Right nav, aligned to end */}
        <div className="flex-1 flex justify-end mx-auto">
          <HeaderNav data={{ ...data, navItems: rightNavItems }} />
        </div>
      </div>
    </header>
  )
}

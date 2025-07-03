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

  return (
    <header
      className="top-0 w-full px-0 z-20 bg-[#081827]"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="flex items-center justify-between text-[#ba954e] py-2 px-12 relative w-full z-20">
        {/* Logo aligned to the left */}
        <div className="flex items-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* All nav items aligned to the right */}
        <div className="flex items-center">
          <HeaderNav data={{ ...data }} />
        </div>
      </div>
    </header>
  )
}

import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  const description =
    (footerData as unknown as { description?: string })?.description ||
    'Pattaya Property is a multinational real estate consultancy founded in 2025 in Pattaya, Thailand. Our diverse team of experienced real estate professionals is dedicated to providing exceptional service to clients worldwide. We combine local expertise with global standards to help our customers buy or sell their homes with confidence using the latest technology and market insights.'

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-16 gap-12 flex flex-col md:flex-row md:justify-between">
        {/* Logo + Description */}
        <div className="flex flex-col max-w-xl md:max-w-2xl">
          <Link className="flex items-center text-white mb-8" href="/">
            <Logo />
          </Link>
          <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
        </div>

        {/* Nav + Theme Selector */}
        <div className="flex flex-col-reverse items-start md:flex-row gap-6 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4 text-white">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}

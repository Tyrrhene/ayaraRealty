'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [open, setOpen] = useState(false) // vertical dropdown
  const [collapse, setCollapse] = useState(false) // need to collapse?

  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  // Refs for measuring available space
  const barRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const measureNavRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeaderTheme(null)
    setOpen(false)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  // Determine if logo + nav fit side-by-side; if not, collapse.
  useEffect(() => {
    const check = () => {
      const bar = barRef.current
      const logoW = logoRef.current?.offsetWidth ?? 0
      const navW = measureNavRef.current?.scrollWidth ?? 0
      if (!bar) return
      const styles = getComputedStyle(bar)
      const pad = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight)
      const gap = 24 // spacing
      const fits = logoW + navW + gap + pad <= bar.clientWidth
      setCollapse(!fits)
    }

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(check) : null
    if (barRef.current) ro?.observe(barRef.current)
    if (measureNavRef.current) ro?.observe(measureNavRef.current)
    if (logoRef.current) ro?.observe(logoRef.current)

    window.addEventListener('resize', check)
    check()
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', check)
    }
  }, [data])

  // When space is back, close dropdown & show desktop nav
  useEffect(() => {
    if (!collapse && open) setOpen(false)
  }, [collapse, open])

  // ✅ Define extractItems to safely map your Payload header data into { label, href } objects
  const extractItems = (data: Header): { label: string; href: string }[] => {
    const out: { label: string; href: string }[] = []

    const push = (label?: string, href?: string) => {
      if (!label || !href) return
      if (href === '#' || href.trim() === '') return
      // dedupe
      if (out.some((i) => i.href === href || i.label === label)) return
      out.push({ label, href })
    }

    // Convert common Payload “reference” style links into hrefs
    const hrefFromReference = (ref: any): string | undefined => {
      // Payload often stores: { relationTo: 'pages' | 'posts', value: { slug } }
      const rel = ref?.relationTo
      const slug = ref?.value?.slug || ref?.slug
      if (!slug) return
      // Adjust these bases to your routes if needed
      if (rel === 'pages') return `/${slug}`
      if (rel === 'posts') return `/posts/${slug}`
      return `/${slug}`
    }

    const harvestFromLink = (link: any) => {
      if (!link) return
      const label =
        link.label ?? link.title ?? link.text ?? link.name ?? link?.reference?.value?.title

      // Direct urls
      const direct = link.url ?? link.href ?? link.linkUrl ?? link.path ?? link.to

      // Reference links (Payload: type === 'reference')
      const refHref =
        link.type === 'reference'
          ? hrefFromReference(link.reference ?? link.doc ?? link.value)
          : undefined

      push(label, direct ?? refHref)

      // Sometimes link groups include children/links arrays
      if (Array.isArray(link.links)) {
        link.links.forEach(harvestFromLink)
      }
      if (Array.isArray(link.children)) {
        link.children.forEach(harvestFromLink)
      }
    }

    const walk = (node: any) => {
      if (!node) return

      // Common header shapes
      if (Array.isArray(node.navItems)) node.navItems.forEach(walk)
      if (Array.isArray(node.links)) node.links.forEach(walk)
      if (Array.isArray(node.items)) node.items.forEach(walk)
      if (Array.isArray(node.blocks)) node.blocks.forEach(walk)

      // Block types frequently called "link", "navGroup", etc.
      if (node.link) harvestFromLink(node.link)
      if (node.links) {
        if (Array.isArray(node.links)) node.links.forEach(harvestFromLink)
        else harvestFromLink(node.links)
      }

      // Some schemas store label/href right on the object
      const label = node.label ?? node.title ?? node.text ?? node.name
      const href =
        node.url ??
        node.href ??
        node.path ??
        node.to ??
        (node.type === 'reference'
          ? hrefFromReference(node.reference ?? node.doc ?? node.value)
          : undefined)
      if (label && href) push(label, href)

      // Recurse into plain objects
      Object.values(node).forEach((v) => {
        if (!v) return
        if (Array.isArray(v)) v.forEach(walk)
        else if (typeof v === 'object') walk(v)
      })
    }

    walk(data)

    return out
  }
  const items = extractItems(data)

  return (
    <header
      className="sticky top-0 z-50 w-full bg-[#081827]"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      {/* HEADER BAR */}
      <div
        ref={barRef}
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 text-[#ba954e] sm:px-10"
      >
        {/* Left: Logo */}
        <div ref={logoRef} className="flex items-center shrink-0">
          <Link href="/" aria-label="Home">
            <Logo />
          </Link>
        </div>

        {/* Right: Nav (desktop only) */}
        {!collapse && (
          <nav className="hidden md:flex items-center gap-10 text-lg" aria-label="Primary">
            <HeaderNav data={{ ...data }} />
          </nav>
        )}

        {/* Burger button (mobile only) */}
        {collapse && (
          <button
            className="ml-auto inline-flex items-center justify-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-white/50 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        )}

        {/* Invisible nav for measuring */}
        <div
          ref={measureNavRef}
          className="pointer-events-none absolute -z-10 select-none opacity-0"
          aria-hidden
        >
          <HeaderNav data={{ ...data }} />
        </div>
      </div>

      {/* VERTICAL DROPDOWN */}
      {open && (
        <div className="border-t border-white/10 bg-[#081827] text-[#ba954e]">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            {items.length > 0 ? (
              <ul className="flex max-h-[calc(100dvh-5rem)] flex-col overflow-y-auto py-3">
                {items.map((it) => (
                  <li
                    key={`${it.href}-${it.label}`}
                    className="border-b border-white/10 last:border-0"
                  >
                    <Link
                      href={it.href}
                      className="block py-3 text-base tracking-wide hover:opacity-80"
                      onClick={() => setOpen(false)}
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-3">
                <div className="flex flex-col gap-2">
                  <HeaderNav data={{ ...data }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

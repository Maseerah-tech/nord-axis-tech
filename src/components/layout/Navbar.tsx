// src/components/layout/Navbar.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

const LOCALE_LABELS: Record<string, string> = { en: 'EN', fr: 'FR', ar: 'AR' }

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const locale = useLocale()
  const t = useTranslations('nav')
  const pathname = usePathname()

  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

  const navLinks = [
    { href: `/${locale}/services`, key: 'services' },
    { href: `/${locale}/about`, key: 'about' },
    { href: `/${locale}/training`, key: 'training' },
    { href: `/${locale}/contact`, key: 'contact' },
  ]

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href={`/${locale}`} className="font-display text-xl tracking-widest shrink-0">
          <span className="text-white">NORD </span>
          <span className="text-cyan">AXIS</span>
          <span className="text-white"> TECH</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 flex-1">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-xs tracking-widest uppercase transition-colors ${
                  active ? 'text-cyan' : 'text-muted hover:text-white'
                }`}
              >
                {t(link.key as any)}
              </Link>
            )
          })}
        </div>

        {/* Locale switcher + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex gap-1">
            {(['en', 'fr', 'ar'] as const).map((loc) => (
              <Link
                key={loc}
                href={`/${loc}${pathWithoutLocale}`}
                className={`font-mono text-xs px-2 py-1 transition-colors ${
                  locale === loc
                    ? 'text-cyan border border-cyan/40'
                    : 'text-muted hover:text-white'
                }`}
              >
                {LOCALE_LABELS[loc]}
              </Link>
            ))}
          </div>
          <Link
            href={`/${locale}/contact`}
            className="font-mono text-xs tracking-widest uppercase bg-cyan text-background px-5 py-2.5 font-bold hover:opacity-90 transition-opacity"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            {t('cta')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-muted hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface border-b border-border px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-sm text-muted hover:text-white tracking-widest uppercase transition-colors"
              onClick={() => setOpen(false)}
            >
              {t(link.key as any)}
            </Link>
          ))}
          <div className="flex gap-2 pt-4 border-t border-border">
            {(['en', 'fr', 'ar'] as const).map((loc) => (
              <Link
                key={loc}
                href={`/${loc}${pathWithoutLocale}`}
                className={`font-mono text-xs px-2 py-1 ${
                  locale === loc ? 'text-cyan border border-cyan/40' : 'text-muted'
                }`}
                onClick={() => setOpen(false)}
              >
                {LOCALE_LABELS[loc]}
              </Link>
            ))}
          </div>
          <Link
            href={`/${locale}/contact`}
            className="font-mono text-xs tracking-widest uppercase bg-cyan text-background px-5 py-2.5 font-bold text-center"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
            onClick={() => setOpen(false)}
          >
            {t('cta')}
          </Link>
        </div>
      )}
    </header>
  )
}

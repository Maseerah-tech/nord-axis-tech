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
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[rgba(15,25,35,0.09)] bg-white/95 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href={`/${locale}`} className="font-display text-xl tracking-widest shrink-0">
          <span className="text-ink">NORD </span>
          <span className="text-cyan">AXIS</span>
          <span className="text-ink"> TECH</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 flex-1">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-sm font-medium transition-colors ${
                  active ? 'text-cyan' : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {t(link.key as any)}
              </Link>
            )
          })}
        </div>

        {/* Locale switcher + CTA */}
        <div className="hidden md:flex items-center gap-5">
          <div className="flex border border-border-strong rounded-sm overflow-hidden">
            {(['en', 'fr', 'ar'] as const).map((loc) => (
              <Link
                key={loc}
                href={`/${loc}${pathWithoutLocale}`}
                className={`font-mono text-xs px-3 py-2 transition-colors min-w-[36px] text-center ${
                  locale === loc
                    ? 'bg-cyan text-white'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {LOCALE_LABELS[loc]}
              </Link>
            ))}
          </div>
          <Link
            href={`/${locale}/contact`}
            className="font-body text-sm font-semibold tracking-wide bg-ink text-white px-5 py-2 hover:bg-ink-secondary transition-colors rounded-sm"
          >
            {t('cta')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-muted hover:text-ink transition-colors p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-b border-border px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm font-medium text-ink-secondary hover:text-ink transition-colors py-1"
              onClick={() => setOpen(false)}
            >
              {t(link.key as any)}
            </Link>
          ))}
          <div className="flex border border-border-strong rounded-sm overflow-hidden self-start mt-2">
            {(['en', 'fr', 'ar'] as const).map((loc) => (
              <Link
                key={loc}
                href={`/${loc}${pathWithoutLocale}`}
                className={`font-mono text-xs px-3 py-2 transition-colors min-w-[36px] text-center ${
                  locale === loc ? 'bg-cyan text-white' : 'text-muted'
                }`}
                onClick={() => setOpen(false)}
              >
                {LOCALE_LABELS[loc]}
              </Link>
            ))}
          </div>
          <Link
            href={`/${locale}/contact`}
            className="font-body text-sm font-semibold tracking-wide bg-ink text-white px-5 py-3 text-center hover:bg-ink-secondary transition-colors rounded-sm"
            onClick={() => setOpen(false)}
          >
            {t('cta')}
          </Link>
        </div>
      )}
    </header>
  )
}

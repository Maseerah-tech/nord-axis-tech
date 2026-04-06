// src/components/layout/Footer.tsx
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function Footer() {
  const locale = await getLocale()
  const t = await getTranslations('nav')
  const tf = await getTranslations('footer')

  const pages = ['services', 'about', 'training', 'contact'] as const

  return (
    <footer className="border-t border-border bg-surface mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo */}
          <div>
            <div className="font-display text-2xl tracking-widest mb-1">
              <span className="text-white">NORD </span>
              <span className="text-cyan">AXIS</span>
              <span className="text-white"> TECH</span>
            </div>
            <p className="font-mono text-xs text-muted tracking-widest">
              {tf('tagline')}
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-6" aria-label="Footer navigation">
            {pages.map((page) => (
              <Link
                key={page}
                href={`/${locale}/${page}`}
                className="font-mono text-xs text-muted hover:text-white tracking-widest uppercase transition-colors"
              >
                {t(page)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-mono text-xs text-muted">
            © {new Date().getFullYear()} Nord Axis Tech. {tf('rights')}
          </p>
          <p className="font-mono text-xs text-muted">{tf('made')}</p>
        </div>
      </div>
    </footer>
  )
}

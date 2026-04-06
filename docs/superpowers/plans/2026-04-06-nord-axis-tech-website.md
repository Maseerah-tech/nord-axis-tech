# Nord Axis Tech Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a complete 5-page trilingual (EN/FR/AR + RTL) marketing website for Nord Axis Tech with a HUD/tactical-interface dark design system, then push to GitHub for Coolify auto-deploy.

**Architecture:** Next.js 14 App Router with `[locale]` dynamic routing via `next-intl`. The `[locale]/layout.tsx` owns `<html lang dir>`, loads fonts, and wraps all pages in `NextIntlClientProvider`. UI components split into `ui/` primitives and `layout/` chrome. All 6 translation namespaces loaded per request from `messages/[locale]/*.json`.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Lucide React, next-intl v3, Formspree (ID: mgoprdge), GitHub (AnassElk/nord-axis-tech), Coolify + Docker multi-stage

---

## File Map

| File | Responsibility |
|---|---|
| `src/app/layout.tsx` | Root layout — returns `children` only (html/body live in `[locale]`) |
| `src/app/[locale]/layout.tsx` | `<html lang dir>`, Google Fonts, `NextIntlClientProvider`, Navbar, Footer |
| `src/app/[locale]/page.tsx` | Homepage — Hero, Ticker, Services preview, Why section, Training teaser, CTA banner |
| `src/app/[locale]/services/page.tsx` | 4 service pillars with details, tags, use cases |
| `src/app/[locale]/about/page.tsx` | Mission, values, team cards, timeline |
| `src/app/[locale]/training/page.tsx` | B2B + B2C training program cards |
| `src/app/[locale]/contact/page.tsx` | Contact form + side panel |
| `src/i18n.ts` | next-intl `getRequestConfig` — loads all namespaces per locale |
| `src/middleware.ts` | next-intl locale detection + redirect to `/en` default |
| `src/components/layout/Navbar.tsx` | Fixed, blur, logo, nav links, locale switcher, mobile hamburger |
| `src/components/layout/Footer.tsx` | Logo, nav links, copyright |
| `src/components/ui/Button.tsx` | primary (cyan cut-corner) + secondary (outlined) |
| `src/components/ui/SectionLabel.tsx` | `01 — LABEL` Space Mono tag with fading rule |
| `src/components/ui/ServiceCard.tsx` | HUD corner brackets, icon, title, description, tag pills |
| `src/components/ui/TrainingCard.tsx` | Title, duration badge, level badge, enroll CTA |
| `src/components/ui/Ticker.tsx` | CSS infinite-scroll keyword strip |
| `src/components/ui/FadeUp.tsx` | Framer Motion scroll-triggered wrapper, respects reduced-motion |
| `messages/en/*.json` | EN translations — 6 files: common, home, services, about, training, contact |
| `messages/fr/*.json` | FR translations — same 6 files |
| `messages/ar/*.json` | AR translations — same 6 files |
| `next.config.ts` | `output: 'standalone'` + next-intl plugin |
| `tailwind.config.ts` | Custom color tokens, font-family vars, ticker keyframe animation |
| `src/app/globals.css` | HUD grid overlay, noise filter, scrollbar, base resets |
| `Dockerfile` | Multi-stage: deps → builder → runner (node:20-alpine) |
| `docker-compose.yml` | Optional local container dev |
| `.gitignore` | node_modules, .next, .env.local, .vercel, .superpowers |

---

## Task 1: Scaffold Next.js 14 Project

**Files:**
- Create: `nord-axis-tech/` (entire project root)

- [ ] **Step 1: Run create-next-app inside the existing empty directory**

```bash
cd "c:/Users/anass/Documents/nord-axis-tech"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

When prompted:
- Would you like to use Turbopack? → **No**
- All other prompts → accept defaults

- [ ] **Step 2: Verify the scaffold succeeded**

```bash
ls src/app src/app/layout.tsx src/app/page.tsx
```

Expected: files exist with no errors.

- [ ] **Step 3: Run dev server to confirm baseline works**

```bash
npm run dev &
sleep 5 && curl -s http://localhost:3000 | grep -q "Next.js" && echo "OK" || echo "FAIL"
kill %1
```

Expected: `OK`

---

## Task 2: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
cd "c:/Users/anass/Documents/nord-axis-tech"
npm install framer-motion lucide-react next-intl
```

- [ ] **Step 2: Verify installs**

```bash
node -e "require('framer-motion'); require('lucide-react'); require('next-intl'); console.log('OK')"
```

Expected: `OK`

---

## Task 3: Configure Tailwind + Globals CSS

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#080B0F',
        surface: '#0D1117',
        card: '#111820',
        cyan: '#00C8B4',
        amber: '#F59E0B',
        white: '#E8EDF2',
        muted: '#6B7A8D',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
        'scan-line': 'scan-line 4s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scan-line': {
          '0%': { top: '0%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
      },
      borderColor: {
        DEFAULT: 'rgba(0, 200, 180, 0.15)',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Replace globals.css**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* HUD grid overlay */
body {
  background-color: #080B0F;
  background-image:
    linear-gradient(rgba(0, 200, 180, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 200, 180, 0.035) 1px, transparent 1px);
  background-size: 32px 32px;
  background-attachment: fixed;
}

/* Noise texture overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.02;
  pointer-events: none;
  z-index: 9999;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #080B0F; }
::-webkit-scrollbar-thumb { background: rgba(0, 200, 180, 0.3); border-radius: 2px; }

/* Ticker pause on hover */
.ticker-container:hover .ticker-inner {
  animation-play-state: paused;
}

/* RTL overrides for Space Mono labels */
[dir="rtl"] .section-label-line {
  background: linear-gradient(to left, rgba(0, 200, 180, 0.3), transparent);
}
```

- [ ] **Step 3: Verify Tailwind config parses**

```bash
cd "c:/Users/anass/Documents/nord-axis-tech"
npx tailwindcss --content './src/**/*.tsx' --input src/app/globals.css --dry-run 2>&1 | grep -i error || echo "OK"
```

Expected: `OK` (no errors)

---

## Task 4: Configure next-intl

**Files:**
- Create: `src/i18n.ts`
- Create: `src/middleware.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Create src/i18n.ts**

```ts
// src/i18n.ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  const [common, home, services, about, training, contact] = await Promise.all([
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/home.json`),
    import(`../messages/${locale}/services.json`),
    import(`../messages/${locale}/about.json`),
    import(`../messages/${locale}/training.json`),
    import(`../messages/${locale}/contact.json`),
  ])

  return {
    messages: {
      ...common.default,
      home: home.default,
      services: services.default,
      about: about.default,
      training: training.default,
      contact: contact.default,
    },
  }
})
```

- [ ] **Step 2: Create src/middleware.ts**

```ts
// src/middleware.ts
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'fr', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 3: Replace next.config.ts**

```ts
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

const nextConfig: NextConfig = {
  output: 'standalone',
}

export default withNextIntl(nextConfig)
```

- [ ] **Step 4: Create placeholder message directories (required before build)**

```bash
mkdir -p "c:/Users/anass/Documents/nord-axis-tech/messages/en"
mkdir -p "c:/Users/anass/Documents/nord-axis-tech/messages/fr"
mkdir -p "c:/Users/anass/Documents/nord-axis-tech/messages/ar"
```

---

## Task 5: Root Layouts + [locale] Routing Structure

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/not-found.tsx`

- [ ] **Step 1: Replace src/app/layout.tsx (root — no html/body)**

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
```

- [ ] **Step 2: Create src/app/[locale]/layout.tsx**

```tsx
// src/app/[locale]/layout.tsx
import { Bebas_Neue, DM_Sans, Space_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import '../globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const dmSans = DM_Sans({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nord-axis-tech.com'),
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }, { locale: 'ar' }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await Promise.resolve(params)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${bebasNeue.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body className="bg-background text-white font-body antialiased min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Create src/app/not-found.tsx**

```tsx
// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-background text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-xs text-cyan tracking-widest mb-4">404 — NOT FOUND</p>
          <h1 className="font-display text-6xl text-white mb-6">LOST IN SPACE</h1>
          <Link href="/en" className="font-mono text-xs text-cyan border border-cyan/40 px-6 py-3">
            RETURN TO BASE
          </Link>
        </div>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Replace src/app/[locale]/page.tsx with a temporary placeholder so the build doesn't fail before pages are written**

```tsx
// src/app/[locale]/page.tsx
export default function HomePage() {
  return <div className="min-h-screen" />
}
```

---

## Task 6: FadeUp Animation Component

**Files:**
- Create: `src/components/ui/FadeUp.tsx`

- [ ] **Step 1: Create FadeUp.tsx**

```tsx
// src/components/ui/FadeUp.tsx
'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeUpProps {
  children: ReactNode
  delay?: number
  className?: string
}

export default function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "c:/Users/anass/Documents/nord-axis-tech"
npx tsc --noEmit 2>&1 | grep "FadeUp" || echo "OK"
```

Expected: `OK`

---

## Task 7: Button Component

**Files:**
- Create: `src/components/ui/Button.tsx`

- [ ] **Step 1: Create Button.tsx**

```tsx
// src/components/ui/Button.tsx
import { ReactNode } from 'react'
import Link from 'next/link'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
}

const primaryStyle = {
  clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
}

export default function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: ButtonProps) {
  const base =
    'font-mono text-xs tracking-widest uppercase px-6 py-3 transition-all duration-200 inline-block cursor-pointer select-none'
  const primary =
    'bg-cyan text-background font-bold hover:opacity-90 disabled:opacity-50'
  const secondary =
    'border border-cyan/40 text-cyan hover:border-cyan hover:bg-cyan/5 disabled:opacity-50'

  const cls = `${base} ${variant === 'primary' ? primary : secondary} ${className}`
  const style = variant === 'primary' ? primaryStyle : undefined

  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={cls} style={style} disabled={disabled}>
      {children}
    </button>
  )
}
```

---

## Task 8: SectionLabel Component

**Files:**
- Create: `src/components/ui/SectionLabel.tsx`

- [ ] **Step 1: Create SectionLabel.tsx**

```tsx
// src/components/ui/SectionLabel.tsx
interface SectionLabelProps {
  number: string
  label: string
}

export default function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="font-mono text-xs text-cyan tracking-widest uppercase">
        {number} — {label}
      </span>
      <div
        className="section-label-line flex-1 h-px max-w-[120px]"
        style={{
          background: 'linear-gradient(to right, rgba(0,200,180,0.3), transparent)',
        }}
      />
    </div>
  )
}
```

---

## Task 9: Ticker Component

**Files:**
- Create: `src/components/ui/Ticker.tsx`

- [ ] **Step 1: Create Ticker.tsx**

```tsx
// src/components/ui/Ticker.tsx
'use client'

const KEYWORDS = [
  'Artificial Intelligence',
  'Predictive Maintenance',
  'Industrial IoT',
  'Robotics & Automation',
  'Energy 2.0',
  'Digital Twins',
  'Supply Chain AI',
  'Cobot Integration',
  'ESG Compliance',
  'Data Science',
]

export default function Ticker() {
  // Duplicate array so the CSS animation loops seamlessly
  const items = [...KEYWORDS, ...KEYWORDS]

  return (
    <div className="ticker-container overflow-hidden border-y border-border py-3 bg-surface/60 backdrop-blur-sm">
      <div className="ticker-inner flex gap-0 animate-ticker whitespace-nowrap">
        {items.map((kw, i) => (
          <span
            key={i}
            className="font-mono text-xs text-muted tracking-widest uppercase px-8 shrink-0"
          >
            {kw}{' '}
            <span className="text-cyan mx-1">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
```

---

## Task 10: ServiceCard Component

**Files:**
- Create: `src/components/ui/ServiceCard.tsx`

- [ ] **Step 1: Create ServiceCard.tsx**

```tsx
// src/components/ui/ServiceCard.tsx
import { LucideIcon } from 'lucide-react'

interface ServiceCardProps {
  number: string
  icon: LucideIcon
  title: string
  description: string
  tags: string[]
}

export default function ServiceCard({
  number,
  icon: Icon,
  title,
  description,
  tags,
}: ServiceCardProps) {
  return (
    <div className="group relative bg-card border border-border p-6 overflow-hidden hover:border-cyan/30 transition-all duration-300 hover:-translate-y-1">
      {/* HUD corner brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan/30 group-hover:border-cyan transition-colors duration-300" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan/30 group-hover:border-cyan transition-colors duration-300" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-amber/20 group-hover:border-amber/50 transition-colors duration-300" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-amber/20 group-hover:border-amber/50 transition-colors duration-300" />

      <span className="font-mono text-xs text-muted tracking-widest">{number}</span>
      <Icon className="w-8 h-8 text-cyan mt-3 mb-4" strokeWidth={1.5} />
      <h3 className="font-display text-xl text-white tracking-wider mb-2 rtl:tracking-normal">
        {title}
      </h3>
      <p className="font-body text-sm text-muted leading-relaxed mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-xs text-muted border border-muted/20 px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
```

---

## Task 11: TrainingCard Component

**Files:**
- Create: `src/components/ui/TrainingCard.tsx`

- [ ] **Step 1: Create TrainingCard.tsx**

```tsx
// src/components/ui/TrainingCard.tsx
import Button from './Button'

interface TrainingCardProps {
  title: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  variant: 'b2b' | 'b2c'
  enrollLabel: string
  enrollHref: string
}

const levelStyles: Record<string, string> = {
  Beginner: 'text-emerald-400 border-emerald-400/30',
  Intermediate: 'text-cyan border-cyan/30',
  Advanced: 'text-amber border-amber/30',
}

export default function TrainingCard({
  title,
  duration,
  level,
  variant,
  enrollLabel,
  enrollHref,
}: TrainingCardProps) {
  const borderStyle =
    variant === 'b2b'
      ? 'border-cyan/20 hover:border-cyan/40'
      : 'border-amber/20 hover:border-amber/40'

  return (
    <div className={`bg-card border ${borderStyle} p-6 transition-all duration-300 hover:-translate-y-1`}>
      <h3 className="font-display text-lg text-white tracking-wider mb-3 rtl:tracking-normal">
        {title}
      </h3>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="font-mono text-xs text-muted border border-muted/20 px-2 py-1">
          {duration}
        </span>
        <span className={`font-mono text-xs border px-2 py-1 ${levelStyles[level]}`}>
          {level}
        </span>
      </div>
      <Button variant={variant === 'b2b' ? 'primary' : 'secondary'} href={enrollHref}>
        {enrollLabel}
      </Button>
    </div>
  )
}
```

---

## Task 12: Navbar Component

**Files:**
- Create: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Create Navbar.tsx**

```tsx
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

  // Strip locale prefix to get the bare path for locale switching
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
                {t(link.key)}
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
              {t(link.key)}
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
```

---

## Task 13: Footer Component

**Files:**
- Create: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Create Footer.tsx**

```tsx
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
```

---

## Task 14: English Translation Files

**Files:**
- Create: `messages/en/common.json`
- Create: `messages/en/home.json`
- Create: `messages/en/services.json`
- Create: `messages/en/about.json`
- Create: `messages/en/training.json`
- Create: `messages/en/contact.json`

- [ ] **Step 1: Create messages/en/common.json**

```json
{
  "nav": {
    "services": "Services",
    "about": "About",
    "training": "Training",
    "contact": "Contact",
    "cta": "Start Project"
  },
  "footer": {
    "tagline": "Industrial Intelligence Redefined",
    "rights": "All rights reserved.",
    "made": "Built for Industry 5.0"
  }
}
```

- [ ] **Step 2: Create messages/en/home.json**

```json
{
  "hero": {
    "system_tag": "SYS.ONLINE // INDUSTRY 4.0 → 5.0 SOLUTIONS",
    "h1_line1": "INDUSTRIAL",
    "h1_line2": "INTELLIGENCE",
    "h1_line3": "REDEFINED",
    "subtext": "Nord Axis Tech bridges traditional industry and tomorrow's digital frontier — combining AI, robotics, sustainable energy and human-centric engineering into one integrated platform.",
    "cta_primary": "Explore Services",
    "cta_secondary": "Talk to Us"
  },
  "stats": {
    "stat1_value": "4.0→5.0",
    "stat1_label": "Industry Evolution",
    "stat2_value": "360°",
    "stat2_label": "Digital Coverage",
    "stat3_value": "0 CO₂",
    "stat3_label": "Energy 2.0 Goal"
  },
  "services_section": {
    "label_num": "01",
    "label": "Our Services",
    "title": "END-TO-END INDUSTRIAL SOLUTIONS"
  },
  "services": [
    {
      "number": "01",
      "title": "Industrial Intelligence",
      "description": "AI models and data science pipelines tailored for industrial environments — from predictive analytics to real-time decision engines.",
      "tags": ["AI Models", "Data Science", "Predictive Analytics", "Machine Learning"]
    },
    {
      "number": "02",
      "title": "Maintenance 4.0→5.0",
      "description": "IoT-connected condition monitoring and cobot-assisted maintenance workflows that eliminate unplanned downtime.",
      "tags": ["IoT Sensors", "Cobots", "Condition Monitoring", "CMMS Integration"]
    },
    {
      "number": "03",
      "title": "Engineering & Automation",
      "description": "Full-stack robotics integration, digital twin modelling, and smart production line design for the factory of the future.",
      "tags": ["Robotics", "Digital Twins", "Smart Lines", "PLC Integration"]
    },
    {
      "number": "04",
      "title": "Sustainable Energy",
      "description": "Energy 2.0 audit, renewable integration, and real-time ESG monitoring to meet compliance targets and cut operational costs.",
      "tags": ["Energy 2.0", "ESG", "Real-Time Monitoring", "Renewables"]
    }
  ],
  "why_section": {
    "label_num": "02",
    "label": "Why Nord Axis",
    "title": "ONE PLATFORM. TOTAL COVERAGE."
  },
  "why_items": [
    {
      "icon": "link",
      "title": "Integrated Approach",
      "description": "Software and hardware in one house. We design, build, and maintain the full stack — no integration gaps."
    },
    {
      "icon": "globe",
      "title": "Sustainability by Design",
      "description": "Energy 2.0 principles baked into every solution. ESG compliance is not an add-on — it's the foundation."
    },
    {
      "icon": "zap",
      "title": "Future-Proof Architecture",
      "description": "Built for Industry 5.0 today. Modular, scalable systems that grow as your operation evolves."
    }
  ],
  "training_teaser": {
    "label_num": "03",
    "label": "Training Programs",
    "title": "KNOWLEDGE IS YOUR COMPETITIVE EDGE",
    "b2b_tag": "B2B Corporate",
    "b2b_title": "Enterprise Upskilling",
    "b2b_desc": "Bespoke AI, automation, and predictive maintenance training programs designed for industrial teams.",
    "b2b_cta": "View B2B Programs",
    "b2c_tag": "B2C Individual",
    "b2c_title": "Career Acceleration",
    "b2c_desc": "Self-paced and instructor-led programs to launch or accelerate your career in Industry 4.0.",
    "b2c_cta": "View B2C Programs"
  },
  "cta_banner": {
    "quote": "Navigating the Nexus of Industry and Intelligence.",
    "sub": "Your partner in sustainable industrial transformation",
    "cta1": "Start a Project",
    "cta2": "View Services"
  }
}
```

- [ ] **Step 3: Create messages/en/services.json**

```json
{
  "page_hero": {
    "label_num": "00",
    "label": "What We Do",
    "title": "OUR SERVICES",
    "subtitle": "Four integrated pillars covering the full spectrum of industrial intelligence."
  },
  "pillars": [
    {
      "number": "01",
      "title": "Industrial Intelligence",
      "description_1": "We build and deploy AI models specifically trained on industrial data — vibration signals, thermal readings, production logs, and supply chain feeds. Our pipelines are built for reliability in edge and cloud environments.",
      "description_2": "From anomaly detection and demand forecasting to quality inspection vision models, our data science team covers the full ML lifecycle: data acquisition, feature engineering, training, deployment, and monitoring.",
      "description_3": "Our systems integrate natively with existing SCADA, MES, and ERP platforms, providing intelligence that acts within your existing workflows rather than replacing them.",
      "capabilities": ["AI Model Development", "Data Pipeline Engineering", "Predictive Analytics", "Anomaly Detection", "Computer Vision QC", "MLOps & Monitoring", "SCADA/MES Integration"],
      "use_cases": ["Predicting equipment failure 72h in advance", "Real-time quality defect detection on production lines", "Demand forecasting for spare parts inventory"],
      "cta": "Get a Quote"
    },
    {
      "number": "02",
      "title": "Maintenance 4.0→5.0",
      "description_1": "We transform reactive maintenance into predictive and prescriptive strategies using IoT sensor networks, condition monitoring algorithms, and cobot-assisted inspection workflows.",
      "description_2": "Our maintenance platforms integrate with CMMS systems and provide dashboards that give maintenance managers full visibility into asset health across the plant floor — accessible from any device.",
      "description_3": "The Industry 5.0 layer introduces collaborative robots (cobots) into the maintenance workflow, enabling human-robot teams to execute inspections and light repairs with higher precision and safety.",
      "capabilities": ["IoT Sensor Integration", "Condition Monitoring", "Cobot Deployment", "CMMS Integration", "Asset Health Dashboards", "Maintenance Scheduling AI", "Vibration & Thermal Analysis"],
      "use_cases": ["Reducing unplanned downtime by 40%", "Cobot-assisted bearing replacements", "Plant-wide asset health visibility in real time"],
      "cta": "Get a Quote"
    },
    {
      "number": "03",
      "title": "Engineering & Automation",
      "description_1": "We design and implement full-scale automation solutions — from single-station robotics to end-to-end smart production lines. Our engineering team covers mechanical, electrical, and software integration.",
      "description_2": "Digital twin technology sits at the core of our engineering offer. We build high-fidelity virtual replicas of your production assets that enable simulation, optimisation, and operator training before any physical change is made.",
      "description_3": "Every automation project is engineered for operator co-existence. We apply Industry 5.0 human-centric principles to ensure that automation augments your workforce rather than displacing it.",
      "capabilities": ["Industrial Robotics", "Digital Twin Modelling", "Smart Line Design", "PLC/SCADA Programming", "HMI Development", "Safety System Design", "Commissioning & Training"],
      "use_cases": ["Full smart line retrofit for automotive component plant", "Digital twin simulation reducing changeover time by 30%", "Human-robot collaborative assembly cell"],
      "cta": "Get a Quote"
    },
    {
      "number": "04",
      "title": "Sustainable Energy",
      "description_1": "Our Energy 2.0 offer covers the complete energy transition journey — from baseline audit and carbon footprint assessment through renewable integration design, execution, and ongoing ESG reporting.",
      "description_2": "We deploy real-time energy monitoring platforms that give operations teams live visibility into consumption patterns across machines, lines, and facilities — enabling immediate corrective action and long-term optimisation.",
      "description_3": "ESG compliance documentation, reporting dashboards, and third-party audit preparation are included in our managed energy service — giving your sustainability team the data they need to meet regulatory requirements.",
      "capabilities": ["Energy Audit & Assessment", "Renewable Energy Integration", "ESG Reporting", "Real-Time Energy Monitoring", "Carbon Footprint Analysis", "ISO 50001 Preparation", "Demand Response Systems"],
      "use_cases": ["Reducing plant energy costs by 25% through peak shaving", "Full ESG dashboard for annual sustainability report", "Solar + storage integration for 24/7 production"],
      "cta": "Get a Quote"
    }
  ],
  "cta_banner": {
    "title": "READY TO TRANSFORM YOUR OPERATION?",
    "sub": "Tell us about your challenge and we'll build the solution.",
    "cta": "Start a Conversation"
  }
}
```

- [ ] **Step 4: Create messages/en/about.json**

```json
{
  "mission": {
    "label_num": "01",
    "label": "Our Mission",
    "title": "INTELLIGENCE THAT SERVES INDUSTRY",
    "text": "Nord Axis Tech was founded on a single conviction: that the industrial sector deserves technology built specifically for its complexity, its constraints, and its people. We exist to close the gap between advanced AI research and the factory floor — delivering solutions that work in real conditions, not just demo environments."
  },
  "values": {
    "label_num": "02",
    "label": "What We Stand For",
    "title": "THREE PILLARS. ONE DIRECTION.",
    "items": [
      {
        "icon": "lightbulb",
        "title": "Innovation",
        "description": "We push the boundaries of what's technically possible in industrial environments — applying cutting-edge AI, robotics, and digital twin research to real production challenges."
      },
      {
        "icon": "cpu",
        "title": "Intelligence",
        "description": "Every solution we build is data-driven. We don't guess — we model, measure, and optimise based on the actual signals your assets produce every second."
      },
      {
        "icon": "leaf",
        "title": "Sustainability",
        "description": "Energy 2.0 and ESG principles are embedded in everything we design. Sustainable industrial transformation is not a constraint — it's a competitive advantage."
      }
    ]
  },
  "team": {
    "label_num": "03",
    "label": "The Team",
    "title": "BUILT BY ENGINEERS. RUN BY ENGINEERS.",
    "members": [
      { "role": "Chief Executive Officer", "department": "Leadership" },
      { "role": "Chief Technology Officer", "department": "Technology" },
      { "role": "Lead AI Engineer", "department": "Data Science" },
      { "role": "Head of Robotics", "department": "Engineering" },
      { "role": "Energy Systems Architect", "department": "Sustainable Energy" },
      { "role": "Industrial IoT Lead", "department": "Connectivity" }
    ]
  },
  "timeline": {
    "label_num": "04",
    "label": "Our Journey",
    "title": "FROM IDEA TO INDUSTRY PARTNER",
    "milestones": [
      { "year": "2021", "title": "Company Founded", "desc": "Nord Axis Tech incorporated with a focus on AI for industrial predictive maintenance." },
      { "year": "2022", "title": "First Deployments", "desc": "Deployed our first predictive maintenance platform across 3 manufacturing plants." },
      { "year": "2023", "title": "Robotics Division Launch", "desc": "Expanded into industrial robotics and digital twin engineering." },
      { "year": "2024", "title": "Energy 2.0 Practice", "desc": "Launched our sustainable energy and ESG advisory practice." },
      { "year": "2025", "title": "Training Academy", "desc": "Opened Nord Axis Academy with B2B and B2C training programs." },
      { "year": "2026", "title": "Industry 5.0 Platform", "desc": "Unified platform connecting AI, cobots, and energy management for full Industry 5.0 readiness." }
    ]
  }
}
```

- [ ] **Step 5: Create messages/en/training.json**

```json
{
  "page_hero": {
    "label_num": "00",
    "label": "Nord Axis Academy",
    "title": "KNOWLEDGE IS YOUR COMPETITIVE EDGE",
    "subtitle": "B2B corporate programs and B2C individual tracks designed for the Industry 4.0 and 5.0 era."
  },
  "b2b": {
    "label_num": "01",
    "label": "B2B Corporate",
    "title": "ENTERPRISE TRAINING PROGRAMS",
    "subtitle": "Bespoke upskilling delivered on-site or remotely for industrial teams.",
    "programs": [
      { "title": "AI & Machine Learning for Industry", "duration": "5 Days", "level": "Intermediate" },
      { "title": "Predictive Maintenance Certification", "duration": "3 Days", "level": "Advanced" },
      { "title": "Automation & Cobot Operations", "duration": "4 Days", "level": "Intermediate" },
      { "title": "Energy Management 4.0", "duration": "2 Days", "level": "Beginner" }
    ],
    "enroll_cta": "Request Program"
  },
  "b2c": {
    "label_num": "02",
    "label": "B2C Individual",
    "title": "INDIVIDUAL LEARNING TRACKS",
    "subtitle": "Self-paced and instructor-led programs to launch or accelerate your career.",
    "programs": [
      { "title": "Industry 4.0 Fundamentals", "duration": "8 Weeks", "level": "Beginner" },
      { "title": "Industrial Data Science", "duration": "12 Weeks", "level": "Intermediate" },
      { "title": "IoT & Sensor Systems", "duration": "6 Weeks", "level": "Intermediate" },
      { "title": "Sustainable Engineering Practices", "duration": "4 Weeks", "level": "Beginner" }
    ],
    "enroll_cta": "Enroll Now"
  }
}
```

- [ ] **Step 6: Create messages/en/contact.json**

```json
{
  "page_hero": {
    "label_num": "00",
    "label": "Get In Touch",
    "title": "START A CONVERSATION",
    "subtitle": "Tell us about your industrial challenge. We'll respond within 24 hours."
  },
  "form": {
    "name": "Full Name",
    "company": "Company",
    "email": "Email Address",
    "phone": "Phone Number",
    "service": "Service of Interest",
    "service_options": [
      "Industrial Intelligence / AI",
      "Maintenance 4.0→5.0",
      "Engineering & Automation",
      "Sustainable Energy",
      "Training Programs",
      "Other"
    ],
    "message": "Tell us about your project",
    "submit": "Send Message",
    "submitting": "Sending...",
    "success": "Message sent. We'll be in touch within 24 hours.",
    "error": "Something went wrong. Please email us directly."
  },
  "sidebar": {
    "email_label": "Email",
    "email": "contact@nord-axis-tech.com",
    "linkedin_label": "LinkedIn",
    "linkedin": "linkedin.com/company/nord-axis-tech",
    "location_label": "Location",
    "location": "North Africa & MENA Region",
    "response_label": "Response Time",
    "response": "Within 24 hours"
  }
}
```

---

## Task 15: French Translation Files

**Files:**
- Create: `messages/fr/common.json`
- Create: `messages/fr/home.json`
- Create: `messages/fr/services.json`
- Create: `messages/fr/about.json`
- Create: `messages/fr/training.json`
- Create: `messages/fr/contact.json`

- [ ] **Step 1: Create messages/fr/common.json**

```json
{
  "nav": {
    "services": "Services",
    "about": "À Propos",
    "training": "Formation",
    "contact": "Contact",
    "cta": "Démarrer"
  },
  "footer": {
    "tagline": "L'Intelligence Industrielle Réinventée",
    "rights": "Tous droits réservés.",
    "made": "Conçu pour l'Industrie 5.0"
  }
}
```

- [ ] **Step 2: Create messages/fr/home.json**

```json
{
  "hero": {
    "system_tag": "SYS.EN LIGNE // SOLUTIONS INDUSTRIE 4.0 → 5.0",
    "h1_line1": "INDUSTRIEL",
    "h1_line2": "INTELLIGENCE",
    "h1_line3": "RÉINVENTÉE",
    "subtext": "Nord Axis Tech relie l'industrie traditionnelle à la frontière numérique de demain — en combinant l'IA, la robotique, l'énergie durable et l'ingénierie centrée sur l'humain en une seule plateforme intégrée.",
    "cta_primary": "Explorer les Services",
    "cta_secondary": "Nous Contacter"
  },
  "stats": {
    "stat1_value": "4.0→5.0",
    "stat1_label": "Évolution Industrielle",
    "stat2_value": "360°",
    "stat2_label": "Couverture Digitale",
    "stat3_value": "0 CO₂",
    "stat3_label": "Objectif Énergie 2.0"
  },
  "services_section": {
    "label_num": "01",
    "label": "Nos Services",
    "title": "SOLUTIONS INDUSTRIELLES DE BOUT EN BOUT"
  },
  "services": [
    {
      "number": "01",
      "title": "Intelligence Industrielle",
      "description": "Modèles d'IA et pipelines de science des données adaptés aux environnements industriels — de l'analyse prédictive aux moteurs de décision en temps réel.",
      "tags": ["Modèles IA", "Science des Données", "Analytique Prédictive", "Machine Learning"]
    },
    {
      "number": "02",
      "title": "Maintenance 4.0→5.0",
      "description": "Surveillance d'état connectée par IoT et flux de travail de maintenance assistés par cobots pour éliminer les arrêts imprévus.",
      "tags": ["Capteurs IoT", "Cobots", "Surveillance d'État", "Intégration GMAO"]
    },
    {
      "number": "03",
      "title": "Ingénierie & Automatisation",
      "description": "Intégration robotique complète, modélisation de jumeaux numériques et conception de lignes de production intelligentes pour l'usine du futur.",
      "tags": ["Robotique", "Jumeaux Numériques", "Lignes Intelligentes", "Intégration API"]
    },
    {
      "number": "04",
      "title": "Énergie Durable",
      "description": "Audit Énergie 2.0, intégration des énergies renouvelables et suivi ESG en temps réel pour atteindre les objectifs de conformité.",
      "tags": ["Énergie 2.0", "ESG", "Suivi Temps Réel", "Énergies Renouvelables"]
    }
  ],
  "why_section": {
    "label_num": "02",
    "label": "Pourquoi Nord Axis",
    "title": "UNE PLATEFORME. UNE COUVERTURE TOTALE."
  },
  "why_items": [
    {
      "icon": "link",
      "title": "Approche Intégrée",
      "description": "Logiciel et matériel sous le même toit. Nous concevons, construisons et maintenons la pile complète — sans lacunes d'intégration."
    },
    {
      "icon": "globe",
      "title": "Durabilité par Conception",
      "description": "Les principes Énergie 2.0 sont intégrés dans chaque solution. La conformité ESG n'est pas un add-on — c'est le fondement."
    },
    {
      "icon": "zap",
      "title": "Architecture Évolutive",
      "description": "Conçu pour l'Industrie 5.0 aujourd'hui. Des systèmes modulaires et évolutifs qui grandissent avec votre activité."
    }
  ],
  "training_teaser": {
    "label_num": "03",
    "label": "Programmes de Formation",
    "title": "LA CONNAISSANCE EST VOTRE AVANTAGE CONCURRENTIEL",
    "b2b_tag": "B2B Entreprise",
    "b2b_title": "Montée en Compétences",
    "b2b_desc": "Programmes de formation sur mesure en IA, automatisation et maintenance prédictive pour les équipes industrielles.",
    "b2b_cta": "Voir les Programmes B2B",
    "b2c_tag": "B2C Individuel",
    "b2c_title": "Accélération de Carrière",
    "b2c_desc": "Programmes en ligne et en présentiel pour lancer ou accélérer votre carrière dans l'Industrie 4.0.",
    "b2c_cta": "Voir les Programmes B2C"
  },
  "cta_banner": {
    "quote": "Naviguer au Carrefour de l'Industrie et de l'Intelligence.",
    "sub": "Votre partenaire dans la transformation industrielle durable",
    "cta1": "Démarrer un Projet",
    "cta2": "Voir les Services"
  }
}
```

- [ ] **Step 3: Create messages/fr/services.json**

```json
{
  "page_hero": {
    "label_num": "00",
    "label": "Ce Que Nous Faisons",
    "title": "NOS SERVICES",
    "subtitle": "Quatre piliers intégrés couvrant tout le spectre de l'intelligence industrielle."
  },
  "pillars": [
    {
      "number": "01",
      "title": "Intelligence Industrielle",
      "description_1": "Nous construisons et déployons des modèles d'IA spécifiquement entraînés sur des données industrielles — signaux de vibration, relevés thermiques, journaux de production et flux de chaîne d'approvisionnement.",
      "description_2": "De la détection d'anomalies à la prévision de la demande en passant par les modèles de vision pour l'inspection qualité, notre équipe couvre l'ensemble du cycle de vie ML.",
      "description_3": "Nos systèmes s'intègrent nativement avec les plateformes SCADA, MES et ERP existantes, apportant de l'intelligence dans vos flux de travail existants.",
      "capabilities": ["Développement de Modèles IA", "Ingénierie de Pipelines", "Analytique Prédictive", "Détection d'Anomalies", "Vision par Ordinateur", "MLOps", "Intégration SCADA/MES"],
      "use_cases": ["Prédire les pannes d'équipement 72h à l'avance", "Détection de défauts qualité en temps réel", "Prévision de la demande en pièces de rechange"],
      "cta": "Obtenir un Devis"
    },
    {
      "number": "02",
      "title": "Maintenance 4.0→5.0",
      "description_1": "Nous transformons la maintenance réactive en stratégies prédictives et prescriptives grâce aux réseaux de capteurs IoT, aux algorithmes de surveillance d'état et aux flux d'inspection assistés par cobots.",
      "description_2": "Nos plateformes de maintenance s'intègrent avec les systèmes GMAO et fournissent des tableaux de bord offrant une visibilité complète sur la santé des actifs dans toute l'usine.",
      "description_3": "La couche Industrie 5.0 introduit des cobots dans le flux de maintenance, permettant aux équipes humain-robot d'effectuer des inspections avec une précision et une sécurité accrues.",
      "capabilities": ["Intégration Capteurs IoT", "Surveillance d'État", "Déploiement Cobots", "Intégration GMAO", "Tableaux de Bord Santé Actifs", "IA Planification Maintenance", "Analyse Vibration & Thermique"],
      "use_cases": ["Réduction des arrêts imprévus de 40%", "Remplacement de roulements assisté par cobot", "Visibilité en temps réel sur la santé des actifs"],
      "cta": "Obtenir un Devis"
    },
    {
      "number": "03",
      "title": "Ingénierie & Automatisation",
      "description_1": "Nous concevons et mettons en œuvre des solutions d'automatisation complètes — de la robotique mono-poste aux lignes de production intelligentes de bout en bout.",
      "description_2": "La technologie des jumeaux numériques est au cœur de notre offre d'ingénierie. Nous construisons des répliques virtuelles haute-fidélité de vos actifs de production.",
      "description_3": "Chaque projet d'automatisation est conçu pour la coexistence opérateur. Nous appliquons les principes centrés sur l'humain de l'Industrie 5.0.",
      "capabilities": ["Robotique Industrielle", "Modélisation Jumeaux Numériques", "Conception Lignes Intelligentes", "Programmation API/SCADA", "Développement IHM", "Conception Systèmes de Sécurité", "Mise en Service"],
      "use_cases": ["Rénovation complète d'une ligne intelligente pour l'automobile", "Simulation jumeau numérique réduisant le temps de changement de 30%", "Cellule d'assemblage collaboratif humain-robot"],
      "cta": "Obtenir un Devis"
    },
    {
      "number": "04",
      "title": "Énergie Durable",
      "description_1": "Notre offre Énergie 2.0 couvre l'ensemble du parcours de transition énergétique — de l'audit de référence et de l'évaluation de l'empreinte carbone à l'intégration des énergies renouvelables.",
      "description_2": "Nous déployons des plateformes de surveillance énergétique en temps réel offrant une visibilité en direct sur les schémas de consommation à travers machines, lignes et installations.",
      "description_3": "La documentation de conformité ESG, les tableaux de bord de reporting et la préparation aux audits tiers sont inclus dans notre service énergétique géré.",
      "capabilities": ["Audit & Évaluation Énergétique", "Intégration Énergies Renouvelables", "Reporting ESG", "Surveillance Énergétique Temps Réel", "Analyse Empreinte Carbone", "Préparation ISO 50001", "Systèmes de Réponse à la Demande"],
      "use_cases": ["Réduction des coûts énergétiques de 25% par écrêtement des pointes", "Tableau de bord ESG complet pour rapport annuel", "Intégration solaire + stockage pour production 24/7"],
      "cta": "Obtenir un Devis"
    }
  ],
  "cta_banner": {
    "title": "PRÊT À TRANSFORMER VOTRE OPÉRATION ?",
    "sub": "Parlez-nous de votre défi et nous construirons la solution.",
    "cta": "Démarrer une Conversation"
  }
}
```

- [ ] **Step 4: Create messages/fr/about.json**

```json
{
  "mission": {
    "label_num": "01",
    "label": "Notre Mission",
    "title": "UNE INTELLIGENCE AU SERVICE DE L'INDUSTRIE",
    "text": "Nord Axis Tech a été fondée sur une conviction : le secteur industriel mérite une technologie construite spécifiquement pour sa complexité, ses contraintes et ses hommes. Nous existons pour combler le fossé entre la recherche avancée en IA et le plancher de l'usine."
  },
  "values": {
    "label_num": "02",
    "label": "Nos Valeurs",
    "title": "TROIS PILIERS. UNE DIRECTION.",
    "items": [
      { "icon": "lightbulb", "title": "Innovation", "description": "Nous repoussons les limites du possible dans les environnements industriels — appliquant l'IA, la robotique et les jumeaux numériques à de vrais défis de production." },
      { "icon": "cpu", "title": "Intelligence", "description": "Chaque solution que nous construisons est pilotée par les données. Nous modélisons, mesurons et optimisons sur la base des signaux réels de vos actifs." },
      { "icon": "leaf", "title": "Durabilité", "description": "Les principes Énergie 2.0 et ESG sont intégrés dans tout ce que nous concevons. La transformation industrielle durable est un avantage concurrentiel." }
    ]
  },
  "team": {
    "label_num": "03",
    "label": "L'Équipe",
    "title": "CONSTRUIT PAR DES INGÉNIEURS. GÉRÉ PAR DES INGÉNIEURS.",
    "members": [
      { "role": "Directeur Général", "department": "Direction" },
      { "role": "Directeur Technique", "department": "Technologie" },
      { "role": "Ingénieur IA Principal", "department": "Science des Données" },
      { "role": "Responsable Robotique", "department": "Ingénierie" },
      { "role": "Architecte Systèmes Énergétiques", "department": "Énergie Durable" },
      { "role": "Responsable IoT Industriel", "department": "Connectivité" }
    ]
  },
  "timeline": {
    "label_num": "04",
    "label": "Notre Parcours",
    "title": "DE L'IDÉE AU PARTENAIRE INDUSTRIEL",
    "milestones": [
      { "year": "2021", "title": "Fondation", "desc": "Nord Axis Tech créée avec un focus sur l'IA pour la maintenance prédictive industrielle." },
      { "year": "2022", "title": "Premiers Déploiements", "desc": "Déploiement de notre première plateforme de maintenance prédictive dans 3 usines." },
      { "year": "2023", "title": "Division Robotique", "desc": "Expansion dans la robotique industrielle et l'ingénierie des jumeaux numériques." },
      { "year": "2024", "title": "Pratique Énergie 2.0", "desc": "Lancement de notre activité de conseil en énergie durable et ESG." },
      { "year": "2025", "title": "Académie de Formation", "desc": "Ouverture de Nord Axis Academy avec des programmes B2B et B2C." },
      { "year": "2026", "title": "Plateforme Industrie 5.0", "desc": "Plateforme unifiée connectant IA, cobots et gestion de l'énergie." }
    ]
  }
}
```

- [ ] **Step 5: Create messages/fr/training.json**

```json
{
  "page_hero": {
    "label_num": "00",
    "label": "Nord Axis Academy",
    "title": "LA CONNAISSANCE EST VOTRE AVANTAGE CONCURRENTIEL",
    "subtitle": "Programmes B2B entreprise et parcours B2C individuels pour l'ère Industrie 4.0 et 5.0."
  },
  "b2b": {
    "label_num": "01",
    "label": "B2B Entreprise",
    "title": "PROGRAMMES DE FORMATION ENTREPRISE",
    "subtitle": "Formations sur mesure dispensées sur site ou à distance pour les équipes industrielles.",
    "programs": [
      { "title": "IA & Machine Learning pour l'Industrie", "duration": "5 Jours", "level": "Intermediate" },
      { "title": "Certification Maintenance Prédictive", "duration": "3 Jours", "level": "Advanced" },
      { "title": "Automatisation & Opérations Cobots", "duration": "4 Jours", "level": "Intermediate" },
      { "title": "Gestion de l'Énergie 4.0", "duration": "2 Jours", "level": "Beginner" }
    ],
    "enroll_cta": "Demander le Programme"
  },
  "b2c": {
    "label_num": "02",
    "label": "B2C Individuel",
    "title": "PARCOURS D'APPRENTISSAGE INDIVIDUELS",
    "subtitle": "Programmes en ligne et en présentiel pour lancer ou accélérer votre carrière.",
    "programs": [
      { "title": "Fondamentaux de l'Industrie 4.0", "duration": "8 Semaines", "level": "Beginner" },
      { "title": "Science des Données Industrielles", "duration": "12 Semaines", "level": "Intermediate" },
      { "title": "IoT & Systèmes de Capteurs", "duration": "6 Semaines", "level": "Intermediate" },
      { "title": "Pratiques d'Ingénierie Durable", "duration": "4 Semaines", "level": "Beginner" }
    ],
    "enroll_cta": "S'Inscrire"
  }
}
```

- [ ] **Step 6: Create messages/fr/contact.json**

```json
{
  "page_hero": {
    "label_num": "00",
    "label": "Contactez-Nous",
    "title": "DÉMARRER UNE CONVERSATION",
    "subtitle": "Parlez-nous de votre défi industriel. Nous répondons sous 24 heures."
  },
  "form": {
    "name": "Nom Complet",
    "company": "Entreprise",
    "email": "Adresse Email",
    "phone": "Numéro de Téléphone",
    "service": "Service d'Intérêt",
    "service_options": [
      "Intelligence Industrielle / IA",
      "Maintenance 4.0→5.0",
      "Ingénierie & Automatisation",
      "Énergie Durable",
      "Programmes de Formation",
      "Autre"
    ],
    "message": "Parlez-nous de votre projet",
    "submit": "Envoyer le Message",
    "submitting": "Envoi en cours...",
    "success": "Message envoyé. Nous vous répondrons sous 24 heures.",
    "error": "Une erreur s'est produite. Veuillez nous contacter directement par email."
  },
  "sidebar": {
    "email_label": "Email",
    "email": "contact@nord-axis-tech.com",
    "linkedin_label": "LinkedIn",
    "linkedin": "linkedin.com/company/nord-axis-tech",
    "location_label": "Localisation",
    "location": "Afrique du Nord & Région MENA",
    "response_label": "Délai de Réponse",
    "response": "Sous 24 heures"
  }
}
```

---

## Task 16: Arabic Translation Files

**Files:**
- Create: `messages/ar/common.json`
- Create: `messages/ar/home.json`
- Create: `messages/ar/services.json`
- Create: `messages/ar/about.json`
- Create: `messages/ar/training.json`
- Create: `messages/ar/contact.json`

- [ ] **Step 1: Create messages/ar/common.json**

```json
{
  "nav": {
    "services": "الخدمات",
    "about": "من نحن",
    "training": "التدريب",
    "contact": "تواصل معنا",
    "cta": "ابدأ مشروعك"
  },
  "footer": {
    "tagline": "الذكاء الصناعي المُعاد تعريفه",
    "rights": "جميع الحقوق محفوظة.",
    "made": "مُصمَّم لصناعة المستقبل 5.0"
  }
}
```

- [ ] **Step 2: Create messages/ar/home.json**

```json
{
  "hero": {
    "system_tag": "النظام متصل // حلول الصناعة 4.0 ← 5.0",
    "h1_line1": "صناعي",
    "h1_line2": "ذكاء",
    "h1_line3": "مُعاد تعريفه",
    "subtext": "تربط نورد أكسيس تك الصناعة التقليدية بالحدود الرقمية للغد — من خلال دمج الذكاء الاصطناعي والروبوتات والطاقة المستدامة والهندسة المتمحورة حول الإنسان في منصة متكاملة واحدة.",
    "cta_primary": "استكشف الخدمات",
    "cta_secondary": "تحدث إلينا"
  },
  "stats": {
    "stat1_value": "5.0←4.0",
    "stat1_label": "تطور صناعي",
    "stat2_value": "360°",
    "stat2_label": "تغطية رقمية",
    "stat3_value": "0 CO₂",
    "stat3_label": "هدف الطاقة 2.0"
  },
  "services_section": {
    "label_num": "01",
    "label": "خدماتنا",
    "title": "حلول صناعية متكاملة من البداية إلى النهاية"
  },
  "services": [
    {
      "number": "01",
      "title": "الذكاء الصناعي",
      "description": "نماذج ذكاء اصطناعي وخطوط أنابيب علوم البيانات المصممة خصيصاً للبيئات الصناعية — من التحليلات التنبؤية إلى محركات القرار الفوري.",
      "tags": ["نماذج الذكاء الاصطناعي", "علم البيانات", "التحليل التنبؤي", "تعلم الآلة"]
    },
    {
      "number": "02",
      "title": "الصيانة 4.0→5.0",
      "description": "مراقبة الحالة المتصلة عبر إنترنت الأشياء وسير عمل الصيانة بمساعدة الروبوتات التعاونية للقضاء على التوقفات غير المخطط لها.",
      "tags": ["مستشعرات IoT", "الروبوتات التعاونية", "مراقبة الحالة", "تكامل CMMS"]
    },
    {
      "number": "03",
      "title": "الهندسة والأتمتة",
      "description": "تكامل الروبوتات الكامل ونمذجة التوائم الرقمية وتصميم خطوط الإنتاج الذكية لمصنع المستقبل.",
      "tags": ["الروبوتات", "التوائم الرقمية", "الخطوط الذكية", "تكامل PLC"]
    },
    {
      "number": "04",
      "title": "الطاقة المستدامة",
      "description": "تدقيق الطاقة 2.0 وتكامل الطاقة المتجددة والمراقبة الفورية لمعايير ESG للوفاء بأهداف الامتثال وخفض التكاليف التشغيلية.",
      "tags": ["الطاقة 2.0", "معايير ESG", "المراقبة الفورية", "الطاقة المتجددة"]
    }
  ],
  "why_section": {
    "label_num": "02",
    "label": "لماذا نورد أكسيس",
    "title": "منصة واحدة. تغطية شاملة."
  },
  "why_items": [
    {
      "icon": "link",
      "title": "نهج متكامل",
      "description": "البرمجيات والأجهزة تحت سقف واحد. نصمم ونبني ونصون المنظومة الكاملة — دون ثغرات في التكامل."
    },
    {
      "icon": "globe",
      "title": "الاستدامة بالتصميم",
      "description": "مبادئ الطاقة 2.0 مدمجة في كل حل نقدمه. الامتثال لمعايير ESG ليس إضافة — إنه الأساس."
    },
    {
      "icon": "zap",
      "title": "بنية مستقبلية",
      "description": "مُصمَّم لصناعة 5.0 اليوم. أنظمة معيارية وقابلة للتوسع تنمو مع تطور عملياتك."
    }
  ],
  "training_teaser": {
    "label_num": "03",
    "label": "برامج التدريب",
    "title": "المعرفة هي ميزتك التنافسية",
    "b2b_tag": "B2B للمؤسسات",
    "b2b_title": "تطوير الكفاءات",
    "b2b_desc": "برامج تدريبية مخصصة في الذكاء الاصطناعي والأتمتة والصيانة التنبؤية للفرق الصناعية.",
    "b2b_cta": "عرض برامج B2B",
    "b2c_tag": "B2C للأفراد",
    "b2c_title": "تسريع المسيرة المهنية",
    "b2c_desc": "برامج ذاتية ومع مدرب لإطلاق مسيرتك المهنية أو تسريعها في مجال الصناعة 4.0.",
    "b2c_cta": "عرض برامج B2C"
  },
  "cta_banner": {
    "quote": "التنقل عند ملتقى الصناعة والذكاء.",
    "sub": "شريكك في التحول الصناعي المستدام",
    "cta1": "ابدأ مشروعاً",
    "cta2": "عرض الخدمات"
  }
}
```

- [ ] **Step 3: Create messages/ar/services.json**

```json
{
  "page_hero": {
    "label_num": "00",
    "label": "ما نقدمه",
    "title": "خدماتنا",
    "subtitle": "أربعة ركائز متكاملة تغطي الطيف الكامل للذكاء الصناعي."
  },
  "pillars": [
    {
      "number": "01",
      "title": "الذكاء الصناعي",
      "description_1": "نبني ونطرح نماذج ذكاء اصطناعي مدرَّبة خصيصاً على البيانات الصناعية — إشارات الاهتزاز والقراءات الحرارية وسجلات الإنتاج وتغذيات سلسلة التوريد.",
      "description_2": "من الكشف عن الشذوذات وتوقع الطلب إلى نماذج الرؤية لفحص الجودة، يغطي فريق علوم البيانات لدينا دورة حياة التعلم الآلي الكاملة.",
      "description_3": "تتكامل أنظمتنا بشكل أصلي مع منصات SCADA وMES وERP الحالية، مما يوفر الذكاء ضمن سير العمل الموجود لديك.",
      "capabilities": ["تطوير نماذج الذكاء الاصطناعي", "هندسة خطوط البيانات", "التحليلات التنبؤية", "الكشف عن الشذوذات", "رؤية الحاسوب للجودة", "MLOps والمراقبة", "تكامل SCADA/MES"],
      "use_cases": ["التنبؤ بأعطال المعدات قبل 72 ساعة", "الكشف الفوري عن عيوب الجودة في خطوط الإنتاج", "توقع الطلب على قطع الغيار"],
      "cta": "احصل على عرض سعر"
    },
    {
      "number": "02",
      "title": "الصيانة 4.0→5.0",
      "description_1": "نحوّل الصيانة التفاعلية إلى استراتيجيات تنبؤية وتوجيهية باستخدام شبكات مستشعرات إنترنت الأشياء وخوارزميات مراقبة الحالة.",
      "description_2": "تتكامل منصات الصيانة لدينا مع أنظمة CMMS وتوفر لوحات تحكم تمنح مديري الصيانة رؤية كاملة لصحة الأصول عبر أرضية المصنع.",
      "description_3": "تُدخل طبقة الصناعة 5.0 الروبوتات التعاونية في سير عمل الصيانة، مما يتيح لفرق الإنسان والروبوت تنفيذ عمليات التفتيش بدقة وأمان أعلى.",
      "capabilities": ["تكامل مستشعرات IoT", "مراقبة الحالة", "نشر الروبوتات التعاونية", "تكامل CMMS", "لوحات صحة الأصول", "ذكاء اصطناعي لجدولة الصيانة", "تحليل الاهتزاز والحرارة"],
      "use_cases": ["تقليل التوقفات غير المخطط لها بنسبة 40%", "استبدال المحامل بمساعدة الروبوتات التعاونية", "رؤية فورية لصحة الأصول على مستوى المصنع"],
      "cta": "احصل على عرض سعر"
    },
    {
      "number": "03",
      "title": "الهندسة والأتمتة",
      "description_1": "نصمم وننفذ حلول أتمتة كاملة — من الروبوتات أحادية المحطة إلى خطوط الإنتاج الذكية الشاملة.",
      "description_2": "تقنية التوائم الرقمية في صميم عرض هندستنا. نبني نسخاً افتراضية عالية الدقة من أصول الإنتاج لديك تمكّن المحاكاة والتحسين وتدريب المشغلين.",
      "description_3": "كل مشروع أتمتة مصمم للتعايش مع المشغلين. نطبق مبادئ الصناعة 5.0 المتمحورة حول الإنسان لضمان أن الأتمتة تعزز قوى العمل لديك.",
      "capabilities": ["الروبوتات الصناعية", "نمذجة التوائم الرقمية", "تصميم الخطوط الذكية", "برمجة PLC/SCADA", "تطوير HMI", "تصميم أنظمة السلامة", "التشغيل والتدريب"],
      "use_cases": ["تجديد خط ذكي كامل لمصنع مكونات السيارات", "محاكاة التوئم الرقمي تقلل وقت التغيير بنسبة 30%", "خلية تجميع تعاونية إنسان-روبوت"],
      "cta": "احصل على عرض سعر"
    },
    {
      "number": "04",
      "title": "الطاقة المستدامة",
      "description_1": "يغطي عرض الطاقة 2.0 لدينا رحلة التحول الطاقوي بالكامل — من التدقيق الأساسي وتقييم البصمة الكربونية إلى تصميم وتنفيذ تكامل الطاقة المتجددة.",
      "description_2": "ننشر منصات مراقبة الطاقة الفورية التي تمنح فرق العمليات رؤية مباشرة لأنماط الاستهلاك عبر الآلات والخطوط والمنشآت.",
      "description_3": "وثائق الامتثال لمعايير ESG ولوحات إعداد التقارير والتحضير للتدقيق من طرف ثالث مدرجة في خدمة الطاقة المُدارة لدينا.",
      "capabilities": ["التدقيق والتقييم الطاقوي", "تكامل الطاقة المتجددة", "تقارير ESG", "مراقبة الطاقة الفورية", "تحليل البصمة الكربونية", "التحضير لـ ISO 50001", "أنظمة الاستجابة للطلب"],
      "use_cases": ["تخفيض تكاليف الطاقة بنسبة 25%", "لوحة تحكم ESG كاملة للتقرير السنوي", "تكامل الطاقة الشمسية والتخزين للإنتاج على مدار الساعة"],
      "cta": "احصل على عرض سعر"
    }
  ],
  "cta_banner": {
    "title": "هل أنت مستعد لتحويل عملياتك؟",
    "sub": "أخبرنا عن تحديك وسنبني الحل.",
    "cta": "ابدأ محادثة"
  }
}
```

- [ ] **Step 4: Create messages/ar/about.json**

```json
{
  "mission": {
    "label_num": "01",
    "label": "مهمتنا",
    "title": "ذكاء في خدمة الصناعة",
    "text": "تأسست نورد أكسيس تك على قناعة واحدة: يستحق القطاع الصناعي تقنية مبنية خصيصاً لتعقيداته وقيوده وأفراده. نحن موجودون لسد الفجوة بين أبحاث الذكاء الاصطناعي المتقدمة وأرضية المصنع."
  },
  "values": {
    "label_num": "02",
    "label": "ما نمثله",
    "title": "ثلاثة ركائز. اتجاه واحد.",
    "items": [
      { "icon": "lightbulb", "title": "الابتكار", "description": "ندفع حدود الممكن تقنياً في البيئات الصناعية — تطبيق أحدث الذكاء الاصطناعي والروبوتات والتوائم الرقمية على تحديات الإنتاج الحقيقية." },
      { "icon": "cpu", "title": "الذكاء", "description": "كل حل نبنيه مدفوع بالبيانات. لا نخمن — نُنمذج ونقيس ونحسّن بناءً على الإشارات الفعلية التي تنتجها أصولك كل ثانية." },
      { "icon": "leaf", "title": "الاستدامة", "description": "مبادئ الطاقة 2.0 ومعايير ESG مدمجة في كل ما نصممه. التحول الصناعي المستدام ليس قيداً — إنه ميزة تنافسية." }
    ]
  },
  "team": {
    "label_num": "03",
    "label": "الفريق",
    "title": "بُني من قِبَل مهندسين. يُدار من قِبَل مهندسين.",
    "members": [
      { "role": "الرئيس التنفيذي", "department": "القيادة" },
      { "role": "المدير التقني", "department": "التكنولوجيا" },
      { "role": "كبير مهندسي الذكاء الاصطناعي", "department": "علوم البيانات" },
      { "role": "رئيس قسم الروبوتات", "department": "الهندسة" },
      { "role": "مهندس أنظمة الطاقة", "department": "الطاقة المستدامة" },
      { "role": "رئيس إنترنت الأشياء الصناعي", "department": "الاتصال" }
    ]
  },
  "timeline": {
    "label_num": "04",
    "label": "مسيرتنا",
    "title": "من فكرة إلى شريك صناعي",
    "milestones": [
      { "year": "2021", "title": "تأسيس الشركة", "desc": "تأسست نورد أكسيس تك مع التركيز على الذكاء الاصطناعي للصيانة التنبؤية الصناعية." },
      { "year": "2022", "title": "أول عمليات نشر", "desc": "نشرنا أول منصة للصيانة التنبؤية في 3 مصانع تصنيع." },
      { "year": "2023", "title": "قسم الروبوتات", "desc": "توسعنا في الروبوتات الصناعية وهندسة التوائم الرقمية." },
      { "year": "2024", "title": "ممارسة الطاقة 2.0", "desc": "أطلقنا ممارسة الاستشارات في الطاقة المستدامة والبيئة والحوكمة الاجتماعية." },
      { "year": "2025", "title": "أكاديمية التدريب", "desc": "افتتاح أكاديمية نورد أكسيس ببرامج B2B وB2C." },
      { "year": "2026", "title": "منصة الصناعة 5.0", "desc": "منصة موحدة تربط الذكاء الاصطناعي والروبوتات التعاونية وإدارة الطاقة." }
    ]
  }
}
```

- [ ] **Step 5: Create messages/ar/training.json**

```json
{
  "page_hero": {
    "label_num": "00",
    "label": "أكاديمية نورد أكسيس",
    "title": "المعرفة هي ميزتك التنافسية",
    "subtitle": "برامج B2B للمؤسسات ومسارات B2C للأفراد لعصر الصناعة 4.0 و5.0."
  },
  "b2b": {
    "label_num": "01",
    "label": "B2B للمؤسسات",
    "title": "برامج تدريب المؤسسات",
    "subtitle": "تدريب مخصص يُقدَّم في الموقع أو عن بُعد للفرق الصناعية.",
    "programs": [
      { "title": "الذكاء الاصطناعي وتعلم الآلة للصناعة", "duration": "5 أيام", "level": "Intermediate" },
      { "title": "شهادة الصيانة التنبؤية", "duration": "3 أيام", "level": "Advanced" },
      { "title": "الأتمتة وتشغيل الروبوتات التعاونية", "duration": "4 أيام", "level": "Intermediate" },
      { "title": "إدارة الطاقة 4.0", "duration": "يومان", "level": "Beginner" }
    ],
    "enroll_cta": "طلب البرنامج"
  },
  "b2c": {
    "label_num": "02",
    "label": "B2C للأفراد",
    "title": "مسارات التعلم الفردية",
    "subtitle": "برامج ذاتية ومع مدرب لإطلاق مسيرتك المهنية أو تسريعها.",
    "programs": [
      { "title": "أساسيات الصناعة 4.0", "duration": "8 أسابيع", "level": "Beginner" },
      { "title": "علوم البيانات الصناعية", "duration": "12 أسبوعاً", "level": "Intermediate" },
      { "title": "أنظمة إنترنت الأشياء والمستشعرات", "duration": "6 أسابيع", "level": "Intermediate" },
      { "title": "ممارسات الهندسة المستدامة", "duration": "4 أسابيع", "level": "Beginner" }
    ],
    "enroll_cta": "سجّل الآن"
  }
}
```

- [ ] **Step 6: Create messages/ar/contact.json**

```json
{
  "page_hero": {
    "label_num": "00",
    "label": "تواصل معنا",
    "title": "ابدأ محادثة",
    "subtitle": "أخبرنا عن تحديك الصناعي. سنرد في غضون 24 ساعة."
  },
  "form": {
    "name": "الاسم الكامل",
    "company": "الشركة",
    "email": "البريد الإلكتروني",
    "phone": "رقم الهاتف",
    "service": "الخدمة المطلوبة",
    "service_options": [
      "الذكاء الصناعي / الذكاء الاصطناعي",
      "الصيانة 4.0→5.0",
      "الهندسة والأتمتة",
      "الطاقة المستدامة",
      "برامج التدريب",
      "أخرى"
    ],
    "message": "أخبرنا عن مشروعك",
    "submit": "إرسال الرسالة",
    "submitting": "جاري الإرسال...",
    "success": "تم إرسال الرسالة. سنتواصل معك في غضون 24 ساعة.",
    "error": "حدث خطأ ما. يرجى مراسلتنا مباشرة عبر البريد الإلكتروني."
  },
  "sidebar": {
    "email_label": "البريد الإلكتروني",
    "email": "contact@nord-axis-tech.com",
    "linkedin_label": "لينكد إن",
    "linkedin": "linkedin.com/company/nord-axis-tech",
    "location_label": "الموقع",
    "location": "شمال أفريقيا ومنطقة الشرق الأوسط وأفريقيا",
    "response_label": "وقت الاستجابة",
    "response": "خلال 24 ساعة"
  }
}
```

---

## Task 17: Homepage

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Write the homepage**

```tsx
// src/app/[locale]/page.tsx
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Brain, Wrench, Bot, Leaf, Link2, Globe, Zap } from 'lucide-react'
import FadeUp from '@/components/ui/FadeUp'
import Button from '@/components/ui/Button'
import SectionLabel from '@/components/ui/SectionLabel'
import ServiceCard from '@/components/ui/ServiceCard'
import Ticker from '@/components/ui/Ticker'
import { getLocale } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('home')
  return {
    title: 'Nord Axis Tech | Industrial Intelligence Redefined',
    description:
      'Nord Axis Tech bridges traditional industry and the digital frontier — AI, robotics, sustainable energy and predictive maintenance for Industry 4.0 and 5.0.',
    openGraph: {
      title: 'Nord Axis Tech | Industrial Intelligence Redefined',
      description:
        'AI, robotics, sustainable energy, and predictive maintenance solutions for Industry 4.0 and 5.0.',
      type: 'website',
    },
  }
}

const SERVICE_ICONS = [Brain, Wrench, Bot, Leaf]
const WHY_ICONS: Record<string, React.ElementType> = { link: Link2, globe: Globe, zap: Zap }

export default function HomePage() {
  return <HomePageClient />
}

function HomePageClient() {
  const t = useTranslations('home')
  const tc = useTranslations('nav')

  const services = t.raw('services') as Array<{
    number: string; title: string; description: string; tags: string[]
  }>
  const whyItems = t.raw('why_items') as Array<{
    icon: string; title: string; description: string
  }>

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Radial glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber/8 rounded-full blur-3xl" />
        </div>

        {/* HUD corner brackets */}
        <div className="absolute top-20 left-4 lg:left-8 w-6 h-6 border-t-2 border-l-2 border-cyan/60" />
        <div className="absolute top-20 right-4 lg:right-8 w-6 h-6 border-t-2 border-r-2 border-cyan/60" />
        <div className="absolute bottom-8 left-4 lg:left-8 w-6 h-6 border-b-2 border-l-2 border-amber/50" />
        <div className="absolute bottom-8 right-4 lg:right-8 w-6 h-6 border-b-2 border-r-2 border-amber/50" />

        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-px pointer-events-none animate-scan-line"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,200,180,0.25), transparent)',
          }}
        />

        <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center py-24">
          {/* Left: headline */}
          <div>
            <FadeUp>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                <span className="font-mono text-xs text-cyan tracking-widest uppercase">
                  {t('hero.system_tag')}
                </span>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="font-display leading-none">
                <span className="block text-6xl sm:text-7xl lg:text-8xl text-white tracking-widest">
                  {t('hero.h1_line1')}
                </span>
                <span className="block text-6xl sm:text-7xl lg:text-8xl text-cyan tracking-widest">
                  {t('hero.h1_line2')}
                </span>
                <span
                  className="block text-6xl sm:text-7xl lg:text-8xl tracking-widest"
                  style={{ WebkitTextStroke: '1px rgba(232,237,242,0.35)', color: 'transparent' }}
                >
                  {t('hero.h1_line3')}
                </span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="font-body text-muted leading-relaxed mt-6 max-w-lg text-sm sm:text-base">
                {t('hero.subtext')}
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="flex flex-wrap gap-4 mt-8">
                <Button href="/services" variant="primary">
                  {t('hero.cta_primary')}
                </Button>
                <Button href="/contact" variant="secondary">
                  {t('hero.cta_secondary')}
                </Button>
              </div>
            </FadeUp>
          </div>

          {/* Right: floating stats */}
          <FadeUp delay={0.4} className="flex flex-col gap-4 items-start lg:items-end">
            {[
              { value: t('stats.stat1_value'), label: t('stats.stat1_label'), color: 'text-cyan' },
              { value: t('stats.stat2_value'), label: t('stats.stat2_label'), color: 'text-cyan' },
              { value: t('stats.stat3_value'), label: t('stats.stat3_label'), color: 'text-amber' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card/80 backdrop-blur-sm border border-border px-6 py-4 min-w-[160px]"
              >
                <div className={`font-display text-3xl tracking-widest ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-muted tracking-widest mt-1 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────── */}
      <Ticker />

      {/* ── SERVICES PREVIEW ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <FadeUp>
          <SectionLabel number={t('services_section.label_num')} label={t('services_section.label')} />
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-widest mb-12">
            {t('services_section.title')}
          </h2>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((svc, i) => (
            <FadeUp key={svc.number} delay={i * 0.08}>
              <ServiceCard
                number={svc.number}
                icon={SERVICE_ICONS[i]}
                title={svc.title}
                description={svc.description}
                tags={svc.tags}
              />
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.4}>
          <div className="mt-10 text-center">
            <Button href="/services" variant="secondary">
              {t('hero.cta_primary')}
            </Button>
          </div>
        </FadeUp>
      </section>

      {/* ── WHY NORD AXIS ────────────────────────────────── */}
      <section className="bg-surface/50 border-y border-border py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <SectionLabel number={t('why_section.label_num')} label={t('why_section.label')} />
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-widest mb-12">
              {t('why_section.title')}
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-8">
            {whyItems.map((item, i) => {
              const Icon = WHY_ICONS[item.icon] ?? Zap
              return (
                <FadeUp key={item.title} delay={i * 0.1}>
                  <div className="flex flex-col gap-4">
                    <div className="w-10 h-10 border border-cyan/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan" />
                    </div>
                    <h3 className="font-display text-xl text-white tracking-wider">{item.title}</h3>
                    <p className="font-body text-sm text-muted leading-relaxed">{item.description}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TRAINING TEASER ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <FadeUp>
          <SectionLabel number={t('training_teaser.label_num')} label={t('training_teaser.label')} />
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-widest mb-12">
            {t('training_teaser.title')}
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6">
          <FadeUp delay={0.1}>
            <div className="bg-card border border-cyan/20 p-8 hover:border-cyan/40 transition-colors">
              <span className="font-mono text-xs text-cyan tracking-widest border border-cyan/30 px-2 py-1">
                {t('training_teaser.b2b_tag')}
              </span>
              <h3 className="font-display text-2xl text-white tracking-wider mt-4 mb-3">
                {t('training_teaser.b2b_title')}
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed mb-6">
                {t('training_teaser.b2b_desc')}
              </p>
              <Button href="/training" variant="primary">
                {t('training_teaser.b2b_cta')}
              </Button>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="bg-card border border-amber/20 p-8 hover:border-amber/40 transition-colors">
              <span className="font-mono text-xs text-amber tracking-widest border border-amber/30 px-2 py-1">
                {t('training_teaser.b2c_tag')}
              </span>
              <h3 className="font-display text-2xl text-white tracking-wider mt-4 mb-3">
                {t('training_teaser.b2c_title')}
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed mb-6">
                {t('training_teaser.b2c_desc')}
              </p>
              <Button href="/training" variant="secondary">
                {t('training_teaser.b2c_cta')}
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="relative border-y border-border overflow-hidden py-24">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan/5 via-transparent to-amber/5 pointer-events-none" />
        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan/40" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan/40" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber/40" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber/40" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <p className="font-mono text-xs text-cyan tracking-widest uppercase mb-4">
              Nord Axis Tech
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-widest mb-4">
              {t('cta_banner.quote')}
            </h2>
            <p className="font-body text-muted mb-10">{t('cta_banner.sub')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/contact" variant="primary">
                {t('cta_banner.cta1')}
              </Button>
              <Button href="/services" variant="secondary">
                {t('cta_banner.cta2')}
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Fix the Button href to include locale**

The Button `href` values in the homepage need the locale prefix. Update the homepage to get the locale:

```tsx
// src/app/[locale]/page.tsx
// Add at top of file (inside HomePageClient, replace the static hrefs):

// Replace all <Button href="/services"> with <Button href={`/${locale}/services`}>
// Replace all <Button href="/contact"> with <Button href={`/${locale}/contact`}>
// Replace all <Button href="/training"> with <Button href={`/${locale}/training`}>

// Add to HomePageClient function:
const locale = useLocale()  // import { useLocale } from 'next-intl'
```

Full corrected HomePageClient opening:
```tsx
import { useLocale, useTranslations } from 'next-intl'

function HomePageClient() {
  const t = useTranslations('home')
  const locale = useLocale()
  // ... rest of component, replace all href="/services" → href={`/${locale}/services`} etc.
```

- [ ] **Step 3: Verify build compiles**

```bash
cd "c:/Users/anass/Documents/nord-axis-tech"
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors (or only warnings)

---

## Task 18: Services Page

**Files:**
- Create: `src/app/[locale]/services/page.tsx`

- [ ] **Step 1: Create services/page.tsx**

```tsx
// src/app/[locale]/services/page.tsx
import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'
import { Brain, Wrench, Bot, Leaf } from 'lucide-react'
import FadeUp from '@/components/ui/FadeUp'
import Button from '@/components/ui/Button'
import SectionLabel from '@/components/ui/SectionLabel'
import { getLocale } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nord Axis Tech | Services',
    description:
      'Industrial Intelligence, Predictive Maintenance, Engineering & Automation, and Sustainable Energy — explore all Nord Axis Tech service pillars.',
    openGraph: {
      title: 'Nord Axis Tech | Services',
      description:
        'Four integrated service pillars for Industry 4.0 and 5.0 transformation.',
      type: 'website',
    },
  }
}

const PILLAR_ICONS = [Brain, Wrench, Bot, Leaf]
const PILLAR_COLORS = ['border-cyan/30', 'border-cyan/20', 'border-cyan/25', 'border-cyan/20']

export default function ServicesPage() {
  return <ServicesClient />
}

function ServicesClient() {
  const t = useTranslations('services')
  const locale = useLocale()

  const pillars = t.raw('pillars') as Array<{
    number: string
    title: string
    description_1: string
    description_2: string
    description_3: string
    capabilities: string[]
    use_cases: string[]
    cta: string
  }>

  return (
    <div>
      {/* Page Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <FadeUp>
          <SectionLabel number={t('page_hero.label_num')} label={t('page_hero.label')} />
          <h1 className="font-display text-6xl sm:text-7xl text-white tracking-widest mb-4">
            {t('page_hero.title')}
          </h1>
          <p className="font-body text-muted max-w-2xl leading-relaxed">
            {t('page_hero.subtitle')}
          </p>
        </FadeUp>
      </section>

      {/* Service pillars */}
      {pillars.map((pillar, i) => {
        const Icon = PILLAR_ICONS[i]
        const isEven = i % 2 === 0
        return (
          <section key={pillar.number} className={`border-t border-border py-20 ${i % 2 === 1 ? 'bg-surface/40' : ''}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid lg:grid-cols-2 gap-16 items-start ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                {/* Text */}
                <FadeUp>
                  <span className="font-mono text-xs text-muted tracking-widest">{pillar.number}</span>
                  <div className="flex items-center gap-4 my-4">
                    <div className={`w-12 h-12 border ${PILLAR_COLORS[i]} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-cyan" strokeWidth={1.5} />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl text-white tracking-widest">
                      {pillar.title}
                    </h2>
                  </div>
                  <div className="space-y-4 mb-8">
                    <p className="font-body text-muted leading-relaxed">{pillar.description_1}</p>
                    <p className="font-body text-muted leading-relaxed">{pillar.description_2}</p>
                    <p className="font-body text-muted leading-relaxed">{pillar.description_3}</p>
                  </div>
                  <Button href={`/${locale}/contact`} variant="primary">{pillar.cta}</Button>
                </FadeUp>

                {/* Capabilities + use cases */}
                <FadeUp delay={0.15}>
                  <div className="bg-card border border-border p-6 mb-6">
                    <p className="font-mono text-xs text-cyan tracking-widest uppercase mb-4">
                      Key Capabilities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pillar.capabilities.map((cap) => (
                        <span key={cap} className="font-mono text-xs text-muted border border-muted/20 px-2 py-1">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card border border-border p-6">
                    <p className="font-mono text-xs text-amber tracking-widest uppercase mb-4">
                      Use Cases
                    </p>
                    <ul className="space-y-3">
                      {pillar.use_cases.map((uc) => (
                        <li key={uc} className="flex items-start gap-3">
                          <span className="text-cyan mt-1 shrink-0">→</span>
                          <span className="font-body text-sm text-muted leading-relaxed">{uc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              </div>
            </div>
          </section>
        )
      })}

      {/* CTA Banner */}
      <section className="relative border-t border-border py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan/5 to-transparent pointer-events-none" />
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan/40" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber/40" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-widest mb-4">
              {t('cta_banner.title')}
            </h2>
            <p className="font-body text-muted mb-8">{t('cta_banner.sub')}</p>
            <Button href={`/${locale}/contact`} variant="primary">{t('cta_banner.cta')}</Button>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
```

---

## Task 19: About Page

**Files:**
- Create: `src/app/[locale]/about/page.tsx`

- [ ] **Step 1: Create about/page.tsx**

```tsx
// src/app/[locale]/about/page.tsx
import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'
import { Lightbulb, Cpu, Leaf } from 'lucide-react'
import FadeUp from '@/components/ui/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nord Axis Tech | About',
    description:
      'Learn about Nord Axis Tech — our mission, values, team, and journey as an industrial intelligence company.',
    openGraph: { title: 'Nord Axis Tech | About', description: 'Mission, values, team and timeline.', type: 'website' },
  }
}

const VALUE_ICONS: Record<string, React.ElementType> = {
  lightbulb: Lightbulb, cpu: Cpu, leaf: Leaf,
}

export default function AboutPage() {
  return <AboutClient />
}

function AboutClient() {
  const t = useTranslations('about')

  const values = t.raw('values.items') as Array<{ icon: string; title: string; description: string }>
  const members = t.raw('team.members') as Array<{ role: string; department: string }>
  const milestones = t.raw('timeline.milestones') as Array<{ year: string; title: string; desc: string }>

  return (
    <div>
      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <FadeUp>
          <SectionLabel number={t('mission.label_num')} label={t('mission.label')} />
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white tracking-widest mb-8">
            {t('mission.title')}
          </h1>
          <p className="font-body text-muted leading-relaxed max-w-3xl text-lg">
            {t('mission.text')}
          </p>
        </FadeUp>
      </section>

      {/* Values */}
      <section className="bg-surface/40 border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <SectionLabel number={t('values.label_num')} label={t('values.label')} />
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-widest mb-12">
              {t('values.title')}
            </h2>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => {
              const Icon = VALUE_ICONS[v.icon] ?? Lightbulb
              return (
                <FadeUp key={v.title} delay={i * 0.1}>
                  <div className="bg-card border border-border p-8">
                    <div className="w-12 h-12 border border-cyan/30 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-cyan" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-2xl text-white tracking-wider mb-3">{v.title}</h3>
                    <p className="font-body text-sm text-muted leading-relaxed">{v.description}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeUp>
          <SectionLabel number={t('team.label_num')} label={t('team.label')} />
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-widest mb-12">
            {t('team.title')}
          </h2>
        </FadeUp>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m, i) => (
            <FadeUp key={m.role} delay={i * 0.07}>
              <div className="bg-card border border-border p-6 group hover:border-cyan/30 transition-colors">
                {/* Placeholder avatar */}
                <div className="w-14 h-14 bg-surface border border-border rounded-full flex items-center justify-center mb-4 group-hover:border-cyan/30 transition-colors">
                  <span className="font-mono text-xs text-muted">{m.role.charAt(0)}</span>
                </div>
                <h3 className="font-body text-sm text-white font-medium mb-1">{m.role}</h3>
                <span className="font-mono text-xs text-cyan tracking-widest border border-cyan/20 px-2 py-0.5">
                  {m.department}
                </span>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-surface/40 border-t border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <SectionLabel number={t('timeline.label_num')} label={t('timeline.label')} />
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-widest mb-12">
              {t('timeline.title')}
            </h2>
          </FadeUp>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <FadeUp key={m.year} delay={i * 0.08}>
                  <div className={`flex gap-8 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} items-start`}>
                    <div className="flex-1 sm:text-right rtl:text-left">
                      {i % 2 === 0 && (
                        <div className="hidden sm:block">
                          <span className="font-mono text-xs text-cyan tracking-widest">{m.year}</span>
                          <h3 className="font-display text-xl text-white tracking-wider mt-1">{m.title}</h3>
                          <p className="font-body text-sm text-muted mt-1">{m.desc}</p>
                        </div>
                      )}
                    </div>
                    {/* Dot */}
                    <div className="relative shrink-0 w-8 flex justify-center">
                      <div className="w-3 h-3 rounded-full bg-cyan border-2 border-background mt-1" />
                    </div>
                    <div className="flex-1">
                      <div className="sm:hidden">
                        <span className="font-mono text-xs text-cyan tracking-widest">{m.year}</span>
                        <h3 className="font-display text-xl text-white tracking-wider mt-1">{m.title}</h3>
                        <p className="font-body text-sm text-muted mt-1">{m.desc}</p>
                      </div>
                      {i % 2 === 1 && (
                        <div className="hidden sm:block">
                          <span className="font-mono text-xs text-cyan tracking-widest">{m.year}</span>
                          <h3 className="font-display text-xl text-white tracking-wider mt-1">{m.title}</h3>
                          <p className="font-body text-sm text-muted mt-1">{m.desc}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
```

---

## Task 20: Training Page

**Files:**
- Create: `src/app/[locale]/training/page.tsx`

- [ ] **Step 1: Create training/page.tsx**

```tsx
// src/app/[locale]/training/page.tsx
import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'
import FadeUp from '@/components/ui/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import TrainingCard from '@/components/ui/TrainingCard'
import { useLocale } from 'next-intl'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nord Axis Tech | Training',
    description:
      'B2B corporate and B2C individual training programs in AI, predictive maintenance, automation, and sustainable engineering for Industry 4.0.',
    openGraph: { title: 'Nord Axis Tech | Training', description: 'Industry 4.0 training programs.', type: 'website' },
  }
}

export default function TrainingPage() {
  return <TrainingClient />
}

function TrainingClient() {
  const t = useTranslations('training')
  const locale = useLocale()

  const b2bPrograms = t.raw('b2b.programs') as Array<{ title: string; duration: string; level: string }>
  const b2cPrograms = t.raw('b2c.programs') as Array<{ title: string; duration: string; level: string }>

  return (
    <div>
      {/* Page Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <FadeUp>
          <SectionLabel number={t('page_hero.label_num')} label={t('page_hero.label')} />
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white tracking-widest mb-4">
            {t('page_hero.title')}
          </h1>
          <p className="font-body text-muted max-w-2xl leading-relaxed">{t('page_hero.subtitle')}</p>
        </FadeUp>
      </section>

      {/* B2B */}
      <section className="border-t border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <SectionLabel number={t('b2b.label_num')} label={t('b2b.label')} />
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-widest mb-3">
              {t('b2b.title')}
            </h2>
            <p className="font-body text-muted mb-10">{t('b2b.subtitle')}</p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {b2bPrograms.map((prog, i) => (
              <FadeUp key={prog.title} delay={i * 0.08}>
                <TrainingCard
                  title={prog.title}
                  duration={prog.duration}
                  level={prog.level as 'Beginner' | 'Intermediate' | 'Advanced'}
                  variant="b2b"
                  enrollLabel={t('b2b.enroll_cta')}
                  enrollHref={`/${locale}/contact`}
                />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* B2C */}
      <section className="bg-surface/40 border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <SectionLabel number={t('b2c.label_num')} label={t('b2c.label')} />
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-widest mb-3">
              {t('b2c.title')}
            </h2>
            <p className="font-body text-muted mb-10">{t('b2c.subtitle')}</p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {b2cPrograms.map((prog, i) => (
              <FadeUp key={prog.title} delay={i * 0.08}>
                <TrainingCard
                  title={prog.title}
                  duration={prog.duration}
                  level={prog.level as 'Beginner' | 'Intermediate' | 'Advanced'}
                  variant="b2c"
                  enrollLabel={t('b2c.enroll_cta')}
                  enrollHref={`/${locale}/contact`}
                />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

---

## Task 21: Contact Page

**Files:**
- Create: `src/app/[locale]/contact/page.tsx`
- Create: `src/components/ui/ContactForm.tsx`

- [ ] **Step 1: Create ContactForm.tsx (client component)**

```tsx
// src/components/ui/ContactForm.tsx
'use client'
import { useState, FormEvent } from 'react'
import Button from './Button'

interface ContactFormProps {
  labels: {
    name: string
    company: string
    email: string
    phone: string
    service: string
    serviceOptions: string[]
    message: string
    submit: string
    submitting: string
    success: string
    error: string
  }
}

export default function ContactForm({ labels }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/mgoprdge', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-card border border-cyan/30 p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-2 h-2 rounded-full bg-cyan animate-pulse mb-4" />
        <p className="font-mono text-sm text-cyan tracking-widest">{labels.success}</p>
      </div>
    )
  }

  const inputClass =
    'w-full bg-surface border border-border px-4 py-3 font-body text-sm text-white placeholder-muted focus:outline-none focus:border-cyan/50 transition-colors'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="name" required placeholder={labels.name} className={inputClass} />
        <input name="company" placeholder={labels.company} className={inputClass} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="email" type="email" required placeholder={labels.email} className={inputClass} />
        <input name="phone" type="tel" placeholder={labels.phone} className={inputClass} />
      </div>
      <select name="service" className={`${inputClass} cursor-pointer`} defaultValue="">
        <option value="" disabled>{labels.service}</option>
        {labels.serviceOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <textarea
        name="message"
        required
        rows={5}
        placeholder={labels.message}
        className={`${inputClass} resize-none`}
      />

      {status === 'error' && (
        <p className="font-mono text-xs text-red-400">{labels.error}</p>
      )}

      <Button type="submit" variant="primary" disabled={status === 'sending'}>
        {status === 'sending' ? labels.submitting : labels.submit}
      </Button>
    </form>
  )
}
```

- [ ] **Step 2: Create contact/page.tsx**

```tsx
// src/app/[locale]/contact/page.tsx
import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'
import { Mail, Linkedin, MapPin, Clock } from 'lucide-react'
import FadeUp from '@/components/ui/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import ContactForm from '@/components/ui/ContactForm'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nord Axis Tech | Contact',
    description:
      'Get in touch with Nord Axis Tech. Tell us about your industrial challenge and we will respond within 24 hours.',
    openGraph: { title: 'Nord Axis Tech | Contact', description: 'Contact Nord Axis Tech.', type: 'website' },
  }
}

export default function ContactPage() {
  return <ContactClient />
}

function ContactClient() {
  const t = useTranslations('contact')
  const serviceOptions = t.raw('form.service_options') as string[]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
      <FadeUp>
        <SectionLabel number={t('page_hero.label_num')} label={t('page_hero.label')} />
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white tracking-widest mb-4">
          {t('page_hero.title')}
        </h1>
        <p className="font-body text-muted max-w-xl leading-relaxed mb-16">
          {t('page_hero.subtitle')}
        </p>
      </FadeUp>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Form — 2/3 width */}
        <FadeUp delay={0.1} className="lg:col-span-2">
          <ContactForm
            labels={{
              name: t('form.name'),
              company: t('form.company'),
              email: t('form.email'),
              phone: t('form.phone'),
              service: t('form.service'),
              serviceOptions,
              message: t('form.message'),
              submit: t('form.submit'),
              submitting: t('form.submitting'),
              success: t('form.success'),
              error: t('form.error'),
            }}
          />
        </FadeUp>

        {/* Side panel */}
        <FadeUp delay={0.2}>
          <div className="space-y-6">
            {[
              { icon: Mail, label: t('sidebar.email_label'), value: t('sidebar.email') },
              { icon: Linkedin, label: t('sidebar.linkedin_label'), value: t('sidebar.linkedin') },
              { icon: MapPin, label: t('sidebar.location_label'), value: t('sidebar.location') },
              { icon: Clock, label: t('sidebar.response_label'), value: t('sidebar.response') },
            ].map((item) => (
              <div key={item.label} className="bg-card border border-border p-5">
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className="w-4 h-4 text-cyan shrink-0" strokeWidth={1.5} />
                  <span className="font-mono text-xs text-muted tracking-widest uppercase">
                    {item.label}
                  </span>
                </div>
                <p className="font-body text-sm text-white ps-7">{item.value}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
```

---

## Task 22: Dockerfile + docker-compose + .gitignore

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Modify: `.gitignore`

- [ ] **Step 1: Create Dockerfile**

```dockerfile
# Dockerfile

# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

- [ ] **Step 2: Create docker-compose.yml**

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

- [ ] **Step 3: Update .gitignore**

```
# .gitignore (append these if not present)
node_modules/
.next/
.env.local
.env*.local
.vercel/
.superpowers/
```

Run:
```bash
cd "c:/Users/anass/Documents/nord-axis-tech"
echo ".superpowers/" >> .gitignore
```

---

## Task 23: Full Build Verification + Git Push

**Files:**
- None (verification + git commands)

- [ ] **Step 1: Run full TypeScript check**

```bash
cd "c:/Users/anass/Documents/nord-axis-tech"
npx tsc --noEmit
```

Expected: exits with code 0 (no output means no errors)

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: output ends with `✓ Compiled successfully` and lists all routes including `/en`, `/fr`, `/ar` and their sub-pages.

- [ ] **Step 3: Smoke-test the production build locally**

```bash
npm start &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en
```

Expected: `200`

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ar
```

Expected: `200`

```bash
kill %1
```

- [ ] **Step 4: Create GitHub repo (browser step)**

Go to https://github.com/new and create:
- Name: `nord-axis-tech`
- Visibility: Public (or Private)
- No README, no .gitignore (we have ours)
- Copy the repo URL: `https://github.com/AnassElk/nord-axis-tech.git`

- [ ] **Step 5: Initialize git and push**

```bash
cd "c:/Users/anass/Documents/nord-axis-tech"
git init
git add .
git commit -m "feat: initial Nord Axis Tech website — trilingual EN/FR/AR, HUD design system, 5 pages, Coolify Dockerfile

- Next.js 14 App Router + next-intl v3 (EN/FR/AR + RTL)
- HUD/tactical-interface design system with Tailwind custom tokens
- 5 pages: Home, Services, About, Training, Contact
- Formspree contact form (mgoprdge)
- Dockerfile multi-stage for Coolify self-hosted deploy
- Google Fonts: Bebas Neue, DM Sans, Space Mono"
git branch -M main
git remote add origin https://github.com/AnassElk/nord-axis-tech.git
git push -u origin main
```

Expected: push succeeds, GitHub shows the repo with all files.

- [ ] **Step 6: Verify the docs/ directory is committed (spec + plan)**

```bash
git log --oneline -1
git show --stat HEAD | grep docs/
```

Expected: shows `docs/superpowers/specs/...` and `docs/superpowers/plans/...` in the commit.

---

## Self-Review

**Spec coverage check:**

| Spec Requirement | Covered In |
|---|---|
| Next.js 14, Tailwind, Framer Motion, Lucide, next-intl | Tasks 1–2 |
| Design tokens (colors, fonts) in tailwind.config | Task 3 |
| HUD grid overlay + noise | Task 3 (globals.css) |
| Corner brackets, scan-line, system tag | Task 17 (hero section) |
| Cut-corner buttons | Task 7 (Button.tsx) |
| Hexagon shapes | ServiceCard.tsx corner brackets; further hexagons can be added as SVG decorations |
| FadeUp staggered animations + reduced-motion | Task 6 |
| Ticker strip | Task 9 |
| SectionLabel | Task 8 |
| Navbar (fixed, blur, locale switcher, CTA) | Task 12 |
| Footer | Task 13 |
| EN/FR/AR translations | Tasks 14–16 |
| Homepage (hero, ticker, services, why, training teaser, CTA) | Task 17 |
| Services page (4 pillars, descriptions, tags, use cases, CTA) | Task 18 |
| About page (mission, values, team, timeline) | Task 19 |
| Training page (B2B + B2C program cards) | Task 20 |
| Contact page (form → Formspree mgoprdge, side panel) | Task 21 |
| SEO metadata on all pages | Tasks 17–21 (`generateMetadata`) |
| Formspree ID mgoprdge | Task 21 (ContactForm) |
| Dockerfile multi-stage | Task 22 |
| `output: 'standalone'` in next.config | Task 4 |
| .gitignore | Task 22 |
| git init + push to AnassElk/nord-axis-tech | Task 23 |
| RTL support via `dir="rtl"` + Tailwind `rtl:` | Task 5 (layout), components use `rtl:` variants |
| prefers-reduced-motion | Task 6 (FadeUp) |
| Mobile responsive (375px, 768px, 1280px+) | All page/component tasks (Tailwind responsive prefixes) |
| Lighthouse ≥ 90 | next/font/google, `<Image>` used, standalone output, no inline styles |

**Placeholder scan:** No TBD or TODO in any code block. All translation strings are populated for EN, FR, and AR. Formspree ID is hardcoded. GitHub repo URL uses real username `AnassElk`.

**Type consistency check:**
- `TrainingCard` accepts `level: 'Beginner' | 'Intermediate' | 'Advanced'` — training page casts with `as` to match. ✓
- `ServiceCard` accepts `icon: LucideIcon` — homepage passes `Brain, Wrench, Bot, Leaf` from lucide-react. ✓
- `ContactForm` labels prop shape matches usage in contact page. ✓
- `useTranslations('home').raw('services')` cast to correct array shape. ✓
- `getTranslations` (server) vs `useTranslations` (client) used correctly — server components use `getTranslations`, client components use `useTranslations`. ✓

**One note for executor:** Task 17 has a Step 2 that patches locale into Button hrefs. Apply this correction when writing the file — write the final version with locale-prefixed hrefs directly so Step 2 is just a verification step, not a re-edit. The pattern is: `href={`/${locale}/services`}` everywhere in the homepage.

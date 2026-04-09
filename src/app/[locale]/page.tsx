// src/app/[locale]/page.tsx
import { getTranslations, getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Brain, Wrench, Bot, Leaf, Link2, Globe, Zap } from 'lucide-react'
import FadeUp from '@/components/ui/FadeUp'
import Button from '@/components/ui/Button'
import SectionLabel from '@/components/ui/SectionLabel'
import ServiceCard from '@/components/ui/ServiceCard'
import Ticker from '@/components/ui/Ticker'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nord Axis Tech | Industrial Intelligence Redefined',
    description:
      'Nord Axis Tech bridges traditional industry and the digital frontier — AI, robotics, sustainable energy and predictive maintenance for Industry 4.0 and 5.0.',
    openGraph: {
      title: 'Nord Axis Tech | Industrial Intelligence Redefined',
      description: 'AI, robotics, sustainable energy, and predictive maintenance for Industry 4.0 and 5.0.',
      type: 'website',
    },
  }
}

const SERVICE_ICONS = [Brain, Wrench, Bot, Leaf]
const WHY_ICONS: Record<string, React.ElementType> = { link: Link2, globe: Globe, zap: Zap }

export default async function HomePage() {
  const t = await getTranslations('home')
  const locale = await getLocale()

  const services = t.raw('services') as Array<{
    number: string; title: string; description: string; tags: string[]
  }>
  const whyItems = t.raw('why_items') as Array<{
    icon: string; title: string; description: string
  }>

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden px-6 lg:px-8">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan" />

        <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center py-32">
          {/* Left: headline */}
          <div>
            <FadeUp>
              <p className="font-body text-xs font-semibold text-cyan tracking-[0.2em] uppercase mb-8">
                {t('hero.system_tag')}
              </p>
            </FadeUp>

            <FadeUp delay={0.08}>
              <h1 className="font-display leading-none mb-6">
                <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-ink tracking-wide">
                  {t('hero.h1_line1')}
                </span>
                <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-cyan tracking-wide">
                  {t('hero.h1_line2')}
                </span>
                <span
                  className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-wide"
                  style={{ WebkitTextStroke: '1.5px rgba(15,25,35,0.25)', color: 'transparent' }}
                >
                  {t('hero.h1_line3')}
                </span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.16}>
              <p className="font-body text-base text-ink-secondary leading-relaxed max-w-md mb-10">
                {t('hero.subtext')}
              </p>
            </FadeUp>

            <FadeUp delay={0.24}>
              <div className="flex flex-wrap gap-3">
                <Button href={`/${locale}/services`} variant="primary">
                  {t('hero.cta_primary')}
                </Button>
                <Button href={`/${locale}/contact`} variant="secondary">
                  {t('hero.cta_secondary')}
                </Button>
              </div>
            </FadeUp>
          </div>

          {/* Right: stats */}
          <FadeUp delay={0.32} className="flex flex-col gap-4 lg:pl-12">
            {[
              { value: t('stats.stat1_value'), label: t('stats.stat1_label'), accent: true },
              { value: t('stats.stat2_value'), label: t('stats.stat2_label'), accent: true },
              { value: t('stats.stat3_value'), label: t('stats.stat3_label'), accent: false },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-border px-6 py-5 flex items-center gap-6 rounded-sm"
              >
                <div className={`font-display text-4xl tracking-wide ${stat.accent ? 'text-cyan' : 'text-amber'}`}>
                  {stat.value}
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="font-body text-xs font-semibold text-muted tracking-[0.15em] uppercase">
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
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <FadeUp>
          <SectionLabel number={t('services_section.label_num')} label={t('services_section.label')} />
          <h2 className="font-display text-4xl sm:text-5xl text-ink tracking-wide mb-12">
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

        <FadeUp delay={0.36}>
          <div className="mt-10">
            <Button href={`/${locale}/services`} variant="secondary">
              {t('hero.cta_primary')}
            </Button>
          </div>
        </FadeUp>
      </section>

      {/* ── WHY NORD AXIS ────────────────────────────────── */}
      <section className="bg-surface border-y border-border py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <SectionLabel number={t('why_section.label_num')} label={t('why_section.label')} />
            <h2 className="font-display text-4xl sm:text-5xl text-ink tracking-wide mb-16">
              {t('why_section.title')}
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-12">
            {whyItems.map((item, i) => {
              const Icon = WHY_ICONS[item.icon] ?? Zap
              return (
                <FadeUp key={item.title} delay={i * 0.1}>
                  <div className="flex flex-col gap-4">
                    <Icon className="w-6 h-6 text-cyan" strokeWidth={1.5} />
                    <h3 className="font-display text-2xl text-ink tracking-wide">{item.title}</h3>
                    <p className="font-body text-sm text-ink-secondary leading-relaxed">{item.description}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TRAINING TEASER ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <FadeUp>
          <SectionLabel number={t('training_teaser.label_num')} label={t('training_teaser.label')} />
          <h2 className="font-display text-4xl sm:text-5xl text-ink tracking-wide mb-12">
            {t('training_teaser.title')}
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6">
          <FadeUp delay={0.1}>
            <div className="bg-white border border-border p-8 hover:border-cyan/40 transition-colors rounded-sm">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-cyan" />
                <span className="font-body text-xs font-semibold text-cyan tracking-[0.15em] uppercase">
                  {t('training_teaser.b2b_tag')}
                </span>
              </div>
              <h3 className="font-display text-2xl text-ink tracking-wide mb-3">
                {t('training_teaser.b2b_title')}
              </h3>
              <p className="font-body text-sm text-ink-secondary leading-relaxed mb-8">
                {t('training_teaser.b2b_desc')}
              </p>
              <Button href={`/${locale}/training`} variant="primary">
                {t('training_teaser.b2b_cta')}
              </Button>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="bg-white border border-border p-8 hover:border-amber/40 transition-colors rounded-sm">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-amber" />
                <span className="font-body text-xs font-semibold text-amber tracking-[0.15em] uppercase">
                  {t('training_teaser.b2c_tag')}
                </span>
              </div>
              <h3 className="font-display text-2xl text-ink tracking-wide mb-3">
                {t('training_teaser.b2c_title')}
              </h3>
              <p className="font-body text-sm text-ink-secondary leading-relaxed mb-8">
                {t('training_teaser.b2c_desc')}
              </p>
              <Button href={`/${locale}/training`} variant="secondary">
                {t('training_teaser.b2c_cta')}
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="bg-ink py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <p className="font-body text-xs font-semibold text-cyan tracking-[0.2em] uppercase mb-6">
              Nord Axis Tech
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide mb-6">
              {t('cta_banner.quote')}
            </h2>
            <p className="font-body text-base text-white/60 mb-10 max-w-xl">{t('cta_banner.sub')}</p>
            <div className="flex flex-wrap gap-4">
              <Button href={`/${locale}/contact`} variant="primary">{t('cta_banner.cta1')}</Button>
              <Link
                href={`/${locale}/services`}
                className="font-body text-sm font-semibold tracking-wide border border-white/30 text-white px-6 py-3 hover:border-white/60 transition-colors rounded-sm inline-block"
              >
                {t('cta_banner.cta2')}
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}


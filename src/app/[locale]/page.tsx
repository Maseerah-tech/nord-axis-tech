// src/app/[locale]/page.tsx
import { getTranslations, getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
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
      <section className="relative min-h-screen flex items-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Radial glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(0,200,180,0.08) 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
        </div>

        {/* HUD corner brackets */}
        <div className="absolute top-20 left-4 lg:left-8 w-6 h-6 border-t-2 border-l-2 border-cyan/60" />
        <div className="absolute top-20 right-4 lg:right-8 w-6 h-6 border-t-2 border-r-2 border-cyan/60" />
        <div className="absolute bottom-8 left-4 lg:left-8 w-6 h-6 border-b-2 border-l-2 border-amber/50" />
        <div className="absolute bottom-8 right-4 lg:right-8 w-6 h-6 border-b-2 border-r-2 border-amber/50" />

        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-px pointer-events-none animate-scan-line"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,180,0.25), transparent)' }}
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
                <Button href={`/${locale}/services`} variant="primary">
                  {t('hero.cta_primary')}
                </Button>
                <Button href={`/${locale}/contact`} variant="secondary">
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
            <Button href={`/${locale}/services`} variant="secondary">
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
              <Button href={`/${locale}/training`} variant="primary">
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
              <Button href={`/${locale}/training`} variant="secondary">
                {t('training_teaser.b2c_cta')}
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="relative border-y border-border overflow-hidden py-24">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(0,200,180,0.04), transparent, rgba(245,158,11,0.04))' }} />
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan/40" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan/40" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber/40" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber/40" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <p className="font-mono text-xs text-cyan tracking-widest uppercase mb-4">Nord Axis Tech</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-widest mb-4">
              {t('cta_banner.quote')}
            </h2>
            <p className="font-body text-muted mb-10">{t('cta_banner.sub')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href={`/${locale}/contact`} variant="primary">{t('cta_banner.cta1')}</Button>
              <Button href={`/${locale}/services`} variant="secondary">{t('cta_banner.cta2')}</Button>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}

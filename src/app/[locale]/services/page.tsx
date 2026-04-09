// src/app/[locale]/services/page.tsx
import { getTranslations, getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { Brain, Wrench, Bot, Leaf } from 'lucide-react'
import FadeUp from '@/components/ui/FadeUp'
import Button from '@/components/ui/Button'
import SectionLabel from '@/components/ui/SectionLabel'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nord Axis Tech | Services',
    description: 'Industrial Intelligence, Predictive Maintenance, Engineering & Automation, and Sustainable Energy — all four Nord Axis Tech service pillars.',
    openGraph: { title: 'Nord Axis Tech | Services', description: 'Four integrated service pillars for Industry 4.0 and 5.0 transformation.', type: 'website' },
  }
}

const PILLAR_ICONS = [Brain, Wrench, Bot, Leaf]

export default async function ServicesPage() {
  const t = await getTranslations('services')
  const locale = await getLocale()

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
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <FadeUp>
          <SectionLabel number={t('page_hero.label_num')} label={t('page_hero.label')} />
          <h1 className="font-display text-6xl sm:text-7xl text-ink tracking-wide mb-4">
            {t('page_hero.title')}
          </h1>
          <p className="font-body text-base text-ink-secondary max-w-2xl leading-relaxed">{t('page_hero.subtitle')}</p>
        </FadeUp>
      </section>

      {/* Service pillars */}
      {pillars.map((pillar, i) => {
        const Icon = PILLAR_ICONS[i]
        return (
          <section key={pillar.number} className={`border-t border-border py-20 ${i % 2 === 1 ? 'bg-white' : ''}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <FadeUp>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-11 h-11 bg-cyan-light flex items-center justify-center rounded-sm shrink-0">
                      <Icon className="w-5 h-5 text-cyan" strokeWidth={1.5} />
                    </div>
                    <div>
                      <span className="font-body text-xs font-semibold text-muted tracking-[0.15em] uppercase">{pillar.number}</span>
                      <h2 className="font-display text-3xl sm:text-4xl text-ink tracking-wide leading-none">
                        {pillar.title}
                      </h2>
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                    <p className="font-body text-sm text-ink-secondary leading-relaxed">{pillar.description_1}</p>
                    <p className="font-body text-sm text-ink-secondary leading-relaxed">{pillar.description_2}</p>
                    <p className="font-body text-sm text-ink-secondary leading-relaxed">{pillar.description_3}</p>
                  </div>
                  <Button href={`/${locale}/contact`} variant="primary">{pillar.cta}</Button>
                </FadeUp>

                <FadeUp delay={0.15}>
                  <div className="bg-background border border-border p-6 mb-4 rounded-sm">
                    <p className="font-body text-xs font-semibold text-ink-secondary tracking-[0.15em] uppercase mb-4">Key Capabilities</p>
                    <div className="flex flex-wrap gap-2">
                      {pillar.capabilities.map((cap) => (
                        <span key={cap} className="font-body text-xs text-muted bg-white border border-border px-2.5 py-1 rounded-sm">{cap}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-background border border-border p-6 rounded-sm">
                    <p className="font-body text-xs font-semibold text-amber tracking-[0.15em] uppercase mb-4">Use Cases</p>
                    <ul className="space-y-3">
                      {pillar.use_cases.map((uc) => (
                        <li key={uc} className="flex items-start gap-3">
                          <span className="text-cyan mt-0.5 shrink-0 font-body text-sm">→</span>
                          <span className="font-body text-sm text-ink-secondary leading-relaxed">{uc}</span>
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
      <section className="bg-ink py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide mb-4">{t('cta_banner.title')}</h2>
            <p className="font-body text-base text-white/60 mb-8 max-w-xl">{t('cta_banner.sub')}</p>
            <Button href={`/${locale}/contact`} variant="primary">{t('cta_banner.cta')}</Button>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}

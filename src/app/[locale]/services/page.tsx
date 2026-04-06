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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <FadeUp>
          <SectionLabel number={t('page_hero.label_num')} label={t('page_hero.label')} />
          <h1 className="font-display text-6xl sm:text-7xl text-white tracking-widest mb-4">
            {t('page_hero.title')}
          </h1>
          <p className="font-body text-muted max-w-2xl leading-relaxed">{t('page_hero.subtitle')}</p>
        </FadeUp>
      </section>

      {/* Service pillars */}
      {pillars.map((pillar, i) => {
        const Icon = PILLAR_ICONS[i]
        return (
          <section key={pillar.number} className={`border-t border-border py-20 ${i % 2 === 1 ? 'bg-surface/40' : ''}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <FadeUp>
                  <span className="font-mono text-xs text-muted tracking-widest">{pillar.number}</span>
                  <div className="flex items-center gap-4 my-4">
                    <div className="w-12 h-12 border border-cyan/30 flex items-center justify-center">
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

                <FadeUp delay={0.15}>
                  <div className="bg-card border border-border p-6 mb-4">
                    <p className="font-mono text-xs text-cyan tracking-widest uppercase mb-4">Key Capabilities</p>
                    <div className="flex flex-wrap gap-2">
                      {pillar.capabilities.map((cap) => (
                        <span key={cap} className="font-mono text-xs text-muted border border-muted/20 px-2 py-1">{cap}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card border border-border p-6">
                    <p className="font-mono text-xs text-amber tracking-widest uppercase mb-4">Use Cases</p>
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
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(0,200,180,0.04), transparent)' }} />
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan/40" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber/40" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-widest mb-4">{t('cta_banner.title')}</h2>
            <p className="font-body text-muted mb-8">{t('cta_banner.sub')}</p>
            <Button href={`/${locale}/contact`} variant="primary">{t('cta_banner.cta')}</Button>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}

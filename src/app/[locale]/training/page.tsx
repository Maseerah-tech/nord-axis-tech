// src/app/[locale]/training/page.tsx
import { getTranslations, getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import FadeUp from '@/components/ui/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import TrainingCard from '@/components/ui/TrainingCard'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nord Axis Tech | Training',
    description: 'B2B corporate and B2C individual training programs in AI, predictive maintenance, automation, and sustainable engineering for Industry 4.0.',
    openGraph: { title: 'Nord Axis Tech | Training', description: 'Industry 4.0 training programs.', type: 'website' },
  }
}

export default async function TrainingPage() {
  const t = await getTranslations('training')
  const locale = await getLocale()

  const b2bPrograms = t.raw('b2b.programs') as Array<{ title: string; duration: string; level: string }>
  const b2cPrograms = t.raw('b2c.programs') as Array<{ title: string; duration: string; level: string }>

  return (
    <div>
      {/* Page Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <FadeUp>
          <SectionLabel number={t('page_hero.label_num')} label={t('page_hero.label')} />
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-ink tracking-wide mb-4">
            {t('page_hero.title')}
          </h1>
          <p className="font-body text-base text-ink-secondary max-w-2xl leading-relaxed">{t('page_hero.subtitle')}</p>
        </FadeUp>
      </section>

      {/* B2B */}
      <section className="border-t border-border py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <SectionLabel number={t('b2b.label_num')} label={t('b2b.label')} />
            <h2 className="font-display text-4xl sm:text-5xl text-ink tracking-wide mb-3">{t('b2b.title')}</h2>
            <p className="font-body text-sm text-ink-secondary mb-10 max-w-xl">{t('b2b.subtitle')}</p>
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
      <section className="bg-white border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <SectionLabel number={t('b2c.label_num')} label={t('b2c.label')} />
            <h2 className="font-display text-4xl sm:text-5xl text-ink tracking-wide mb-3">{t('b2c.title')}</h2>
            <p className="font-body text-sm text-ink-secondary mb-10 max-w-xl">{t('b2c.subtitle')}</p>
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

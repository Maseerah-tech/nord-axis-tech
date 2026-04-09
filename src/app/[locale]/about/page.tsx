// src/app/[locale]/about/page.tsx
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Lightbulb, Cpu, Leaf } from 'lucide-react'
import FadeUp from '@/components/ui/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nord Axis Tech | About',
    description: 'Learn about Nord Axis Tech — our mission, values, team, and journey as an industrial intelligence company.',
    openGraph: { title: 'Nord Axis Tech | About', description: 'Mission, values, team and timeline.', type: 'website' },
  }
}

const VALUE_ICONS: Record<string, React.ElementType> = {
  lightbulb: Lightbulb, cpu: Cpu, leaf: Leaf,
}

export default async function AboutPage() {
  const t = await getTranslations('about')

  const values = t.raw('values.items') as Array<{ icon: string; title: string; description: string }>
  const members = t.raw('team.members') as Array<{ role: string; department: string }>
  const milestones = t.raw('timeline.milestones') as Array<{ year: string; title: string; desc: string }>

  return (
    <div>
      {/* Mission */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20">
        <FadeUp>
          <SectionLabel number={t('mission.label_num')} label={t('mission.label')} />
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-ink tracking-wide mb-8">
            {t('mission.title')}
          </h1>
          <p className="font-body text-ink-secondary leading-relaxed max-w-3xl text-lg">{t('mission.text')}</p>
        </FadeUp>
      </section>

      {/* Values */}
      <section className="bg-white border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <SectionLabel number={t('values.label_num')} label={t('values.label')} />
            <h2 className="font-display text-4xl sm:text-5xl text-ink tracking-wide mb-12">{t('values.title')}</h2>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => {
              const Icon = VALUE_ICONS[v.icon] ?? Lightbulb
              return (
                <FadeUp key={v.title} delay={i * 0.1}>
                  <div className="bg-background border border-border p-8 rounded-sm">
                    <Icon className="w-6 h-6 text-cyan mb-5" strokeWidth={1.5} />
                    <h3 className="font-display text-2xl text-ink tracking-wide mb-3">{v.title}</h3>
                    <p className="font-body text-sm text-ink-secondary leading-relaxed">{v.description}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <FadeUp>
          <SectionLabel number={t('team.label_num')} label={t('team.label')} />
          <h2 className="font-display text-4xl sm:text-5xl text-ink tracking-wide mb-12">{t('team.title')}</h2>
        </FadeUp>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m, i) => (
            <FadeUp key={m.role} delay={i * 0.07}>
              <div className="bg-white border border-border p-6 group hover:border-cyan/30 transition-colors rounded-sm">
                <div className="w-12 h-12 bg-cyan-light rounded-full flex items-center justify-center mb-4">
                  <span className="font-body text-sm font-semibold text-cyan">{m.role.charAt(0)}</span>
                </div>
                <h3 className="font-body text-sm text-ink font-semibold mb-1">{m.role}</h3>
                <span className="font-body text-xs font-medium text-cyan bg-cyan-light px-2 py-0.5 rounded-sm inline-block">{m.department}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white border-t border-border py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <SectionLabel number={t('timeline.label_num')} label={t('timeline.label')} />
            <h2 className="font-display text-4xl sm:text-5xl text-ink tracking-wide mb-12">{t('timeline.title')}</h2>
          </FadeUp>
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-border-strong" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <FadeUp key={m.year} delay={i * 0.08}>
                  <div className="flex gap-8 items-start">
                    <div className="flex-1 hidden sm:block">
                      {i % 2 === 0 && (
                        <div className="text-right rtl:text-left pr-8 rtl:pr-0 rtl:pl-8">
                          <span className="font-mono text-xs text-cyan tracking-widest">{m.year}</span>
                          <h3 className="font-display text-xl text-ink tracking-wide mt-1">{m.title}</h3>
                          <p className="font-body text-sm text-ink-secondary mt-1">{m.desc}</p>
                        </div>
                      )}
                    </div>
                    <div className="relative shrink-0 w-8 flex justify-center">
                      <div className="w-3 h-3 rounded-full bg-cyan border-2 border-background mt-1" />
                    </div>
                    <div className="flex-1">
                      <div className="sm:hidden pl-2">
                        <span className="font-mono text-xs text-cyan tracking-widest">{m.year}</span>
                        <h3 className="font-display text-xl text-ink tracking-wide mt-1">{m.title}</h3>
                        <p className="font-body text-sm text-ink-secondary mt-1">{m.desc}</p>
                      </div>
                      {i % 2 === 1 && (
                        <div className="hidden sm:block pl-8 rtl:pl-0 rtl:pr-8">
                          <span className="font-mono text-xs text-cyan tracking-widest">{m.year}</span>
                          <h3 className="font-display text-xl text-ink tracking-wide mt-1">{m.title}</h3>
                          <p className="font-body text-sm text-ink-secondary mt-1">{m.desc}</p>
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

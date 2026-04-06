// src/app/[locale]/contact/page.tsx
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Mail, ExternalLink, MapPin, Clock } from 'lucide-react'
import FadeUp from '@/components/ui/FadeUp'
import SectionLabel from '@/components/ui/SectionLabel'
import ContactForm from '@/components/ui/ContactForm'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nord Axis Tech | Contact',
    description: 'Get in touch with Nord Axis Tech. Tell us about your industrial challenge and we will respond within 24 hours.',
    openGraph: { title: 'Nord Axis Tech | Contact', description: 'Contact Nord Axis Tech.', type: 'website' },
  }
}

export default async function ContactPage() {
  const t = await getTranslations('contact')
  const serviceOptions = t.raw('form.service_options') as string[]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
      <FadeUp>
        <SectionLabel number={t('page_hero.label_num')} label={t('page_hero.label')} />
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white tracking-widest mb-4">
          {t('page_hero.title')}
        </h1>
        <p className="font-body text-muted max-w-xl leading-relaxed mb-16">{t('page_hero.subtitle')}</p>
      </FadeUp>

      <div className="grid lg:grid-cols-3 gap-12">
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

        <FadeUp delay={0.2}>
          <div className="space-y-4">
            {[
              { icon: Mail, label: t('sidebar.email_label'), value: t('sidebar.email') },
              { icon: ExternalLink, label: t('sidebar.linkedin_label'), value: t('sidebar.linkedin') },
              { icon: MapPin, label: t('sidebar.location_label'), value: t('sidebar.location') },
              { icon: Clock, label: t('sidebar.response_label'), value: t('sidebar.response') },
            ].map((item) => (
              <div key={item.label} className="bg-card border border-border p-5">
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className="w-4 h-4 text-cyan shrink-0" strokeWidth={1.5} />
                  <span className="font-mono text-xs text-muted tracking-widest uppercase">{item.label}</span>
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

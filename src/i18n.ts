// src/i18n.ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? 'en'

  const [common, home, services, about, training, contact] = await Promise.all([
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/home.json`),
    import(`../messages/${locale}/services.json`),
    import(`../messages/${locale}/about.json`),
    import(`../messages/${locale}/training.json`),
    import(`../messages/${locale}/contact.json`),
  ])

  return {
    locale,
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

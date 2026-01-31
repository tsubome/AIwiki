import { getTranslations, setRequestLocale } from 'next-intl/server'

export const dynamic = 'force-static'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('privacy')

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {t('title')}
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('lastUpdated')}: 2026-01-30
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('section1Title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('section1Content')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('section2Title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('section2Content')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('section3Title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('section3Content')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('section4Title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('section4Content')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('section5Title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('section5Content')}
          </p>
          <a
            href="https://github.com/tsubome/AIwiki/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            GitHub Issues
          </a>
        </section>
      </div>
    </div>
  )
}

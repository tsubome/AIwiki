import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { getModelsForList } from '@/lib/model-service'

// Force static generation
export const dynamic = 'force-static'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // Enable static rendering for this locale
  setRequestLocale(locale)

  const t = await getTranslations('home')
  const tCommon = await getTranslations('common')
  const tType = await getTranslations('modelType')

  // Date formatter based on locale
  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US')
  }

  // Get latest models sorted by release date (with locale for descriptions)
  const allModels = getModelsForList(locale)
  const latestModels = allModels
    .filter(m => m.releaseDate)
    .sort((a, b) => {
      const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0
      const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 6)

  const modelTypeColors: Record<string, string> = {
    BASE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    FINETUNE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    MERGE: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    QUANTIZED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    INSTRUCT: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  }

  return (
    <div>
      <section className="text-center py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          {t('title')}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
          {t('subtitle')}
        </p>
      </section>

      <section className="py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('latestModels')}
          </h2>
          <Link
            href="/models"
            className="text-sm sm:text-base text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 active:text-primary-800 font-medium"
          >
            {t('viewAll')} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {latestModels.map((model) => (
            <Link
              key={model.id}
              href={`/models/${model.slug}`}
              className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 active:bg-gray-50 dark:active:bg-gray-750 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{model.name}</h3>
                  {model.developer && (
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{model.developer}</p>
                  )}
                </div>
                <span
                  className={`flex-shrink-0 px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full ${modelTypeColors[model.modelType] || modelTypeColors.BASE}`}
                >
                  {tType(model.modelType)}
                </span>
              </div>

              {model.description && (
                <p className="text-gray-600 dark:text-gray-300 mt-2 sm:mt-3 text-xs sm:text-sm line-clamp-2">
                  {model.description}
                </p>
              )}

              <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  {tCommon('variants', { count: model.variantCount })}
                </span>
                {model.releaseDate && (
                  <span className="flex items-center" suppressHydrationWarning>
                    {formatDate(model.releaseDate)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

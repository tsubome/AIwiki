'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import type { ModelWithChildren } from '@/lib/model-service'
import { getMaxParameters, getVariantCount } from '@/lib/sort-utils'

type Props = {
  model: ModelWithChildren
  sortParam?: string
}

const modelTypeColors: Record<string, string> = {
  BASE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  FINETUNE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  MERGE: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  QUANTIZED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
}

export default function ModelCard({ model, sortParam }: Props) {
  const tType = useTranslations('modelType')
  const locale = useLocale()

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const maxParams = getMaxParameters(model)
  const variantCount = getVariantCount(model)

  // Build link with sort parameter
  const href = sortParam
    ? `/models/${model.slug}?sort=${sortParam}`
    : `/models/${model.slug}`

  return (
    <Link
      href={href}
      className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
          {model.name}
        </h3>
        <span
          className={`flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${modelTypeColors[model.modelType]}`}
        >
          {tType(model.modelType)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
        {model.developer && (
          <span>{model.developer}</span>
        )}
        {model.developer && model.releaseDate && (
          <span className="text-gray-300 dark:text-gray-600">•</span>
        )}
        {model.releaseDate && (
          <span suppressHydrationWarning>{formatDate(model.releaseDate)}</span>
        )}
        {(model.developer || model.releaseDate) && maxParams > 0 && (
          <span className="text-gray-300 dark:text-gray-600">•</span>
        )}
        {maxParams > 0 && (
          <span>{maxParams}B</span>
        )}
      </div>

      {model.description && (
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
          {model.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {variantCount > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {variantCount} variants
          </span>
        )}
        {model.contextLength && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {model.contextLength >= 1000
              ? `${Math.round(model.contextLength / 1000)}K ctx`
              : `${model.contextLength} ctx`}
          </span>
        )}
        {model.tags && model.tags.length > 0 && (
          <>
            {model.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
              >
                {tag}
              </span>
            ))}
          </>
        )}
      </div>
    </Link>
  )
}

'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import type { ModelWithChildren } from '@/lib/model-service'
import type { SortOption } from '@/lib/sort-utils'
import { sortModels } from '@/lib/sort-utils'

type Props = {
  family: ModelWithChildren
  showAllModels: boolean
  sortBy?: SortOption
}

const modelTypeColors: Record<string, string> = {
  BASE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  FINETUNE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  MERGE: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  QUANTIZED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
}

export default function ModelFamily({ family, showAllModels, sortBy = 'newest' }: Props) {
  const t = useTranslations('models')
  const tType = useTranslations('modelType')
  const locale = useLocale()

  // Date formatter based on locale
  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US')
  }
  const formatDateShort = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', { year: 'numeric', month: 'short' })
  }

  // Get version nodes (direct children of the family root, typically without parameters)
  // These are the major versions like Llama 1, Llama 2, Llama 3, etc.
  const allVersionNodes = family.children
    .filter(child => child.parentId === family.id && !child.parameters)

  // Filter by modelType based on showAllModels flag
  const filteredVersionNodes = showAllModels
    ? allVersionNodes
    : allVersionNodes.filter(child => child.modelType === 'BASE')

  // Sort version nodes using the sortBy parameter
  const sortedVersionNodes = sortModels(filteredVersionNodes, sortBy)

  // Take only the first 5 versions AFTER filtering and sorting
  const visibleChildren = sortedVersionNodes.slice(0, 5)

  // Use filtered count for display
  const totalVersionCount = filteredVersionNodes.length

  // Build link with sort parameter
  const familyHref = sortBy && sortBy !== 'newest'
    ? `/models/${family.slug}?sort=${sortBy}`
    : `/models/${family.slug}`

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Family Header (Root Model) */}
      <Link
        href={familyHref}
        className="block p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors border-b border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">{family.name}</h3>
            {family.developer && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{family.developer}</p>
            )}
          </div>
          <span
            className={`flex-shrink-0 px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full ${modelTypeColors[family.modelType]}`}
          >
            {tType(family.modelType)}
          </span>
        </div>

        {family.description && (
          <p className="text-gray-600 dark:text-gray-300 mt-2 sm:mt-3 text-xs sm:text-sm line-clamp-2">
            {family.description}
          </p>
        )}

        <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {family.parameters && (
            <span className="flex items-center">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              {family.parameters}
            </span>
          )}
          {family.releaseDate && (
            <span className="flex items-center" suppressHydrationWarning>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(family.releaseDate)}
            </span>
          )}
        </div>
      </Link>

      {/* Child Models (Version Nodes) */}
      {visibleChildren.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900">
          <div className="px-4 sm:px-6 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
            {t('variants')} ({totalVersionCount}{totalVersionCount > 5 ? '+' : ''})
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {visibleChildren.map((child) => {
              const childHref = sortBy && sortBy !== 'newest'
                ? `/models/${child.slug}?sort=${sortBy}`
                : `/models/${child.slug}`

              return (
                <Link
                  key={child.id}
                  href={childHref}
                  className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">└</span>
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate block">{child.name}</span>
                      {child.releaseDate && (
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning>
                          {formatDateShort(child.releaseDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`flex-shrink-0 ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${modelTypeColors[child.modelType]}`}
                  >
                    {tType(child.modelType)}
                  </span>
                </Link>
              )
            })}
            {totalVersionCount > 5 && (
              <Link
                href={familyHref}
                className="flex items-center justify-center px-4 sm:px-6 py-2 text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
              >
                +{totalVersionCount - 5} more...
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

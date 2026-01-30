'use client'

import { useTranslations } from 'next-intl'
import type { SortOption, DisplayMode } from '@/lib/sort-utils'
import { sortOptions } from '@/lib/sort-utils'

type Props = {
  showAllModels: boolean
  onFilterChange: (showAll: boolean) => void
  displayMode: DisplayMode
  onDisplayModeChange: (mode: DisplayMode) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

export default function ModelFilter({
  showAllModels,
  onFilterChange,
  displayMode,
  onDisplayModeChange,
  sortBy,
  onSortChange,
}: Props) {
  const t = useTranslations('models')

  return (
    <div className="space-y-3">
      {/* 1行目: 表示モード + ソート */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        {/* 表示モードトグル */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {t('displayMode')}:
          </span>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => onDisplayModeChange('family')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                displayMode === 'family'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('displayFamily')}
            </button>
            <button
              onClick={() => onDisplayModeChange('model')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                displayMode === 'model'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t('displayModel')}
            </button>
          </div>
        </div>

        {/* ソートドロップダウン */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {t('sortBy')}:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {t(`sort_${option.replace('-', '_')}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2行目: ベースモデルフィルター */}
      <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => onFilterChange(false)}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
            !showAllModels
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 active:bg-gray-200 dark:active:bg-gray-600'
          }`}
        >
          {t('baseModelsOnly')}
        </button>
        <button
          onClick={() => onFilterChange(true)}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
            showAllModels
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 active:bg-gray-200 dark:active:bg-gray-600'
          }`}
        >
          {t('allModels')}
        </button>
      </div>
    </div>
  )
}

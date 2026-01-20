'use client'

import { useTranslations } from 'next-intl'

type Props = {
  showAllModels: boolean
  onFilterChange: (showAll: boolean) => void
}

export default function ModelFilter({ showAllModels, onFilterChange }: Props) {
  const t = useTranslations('models')

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => onFilterChange(false)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          !showAllModels
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        {t('baseModelsOnly')}
      </button>
      <button
        onClick={() => onFilterChange(true)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          showAllModels
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        {t('allModels')}
      </button>
    </div>
  )
}

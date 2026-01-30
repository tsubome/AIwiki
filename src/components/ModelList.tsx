'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { ModelWithChildren } from '@/lib/model-service'
import type { SortOption, DisplayMode } from '@/lib/sort-utils'
import { sortFamilies, sortModels, flattenModels } from '@/lib/sort-utils'
import ModelFamily from './ModelFamily'
import ModelFilter from './ModelFilter'
import ModelCard from './ModelCard'

type Props = {
  families: ModelWithChildren[]
}

export default function ModelList({ families }: Props) {
  const t = useTranslations('models')
  const [showAllModels, setShowAllModels] = useState(false)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('family')
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  // Filter families based on showAllModels
  const filteredFamilies = families.map(family => {
    if (showAllModels) return family
    // Filter children to only BASE models
    return {
      ...family,
      children: family.children.filter(child => child.modelType === 'BASE'),
    }
  })

  // Sort families
  const sortedFamilies = sortFamilies(filteredFamilies, sortBy)

  // For model mode, flatten and sort all models
  const allModels = flattenModels(filteredFamilies)
  const sortedModels = sortModels(
    showAllModels ? allModels : allModels.filter(m => m.modelType === 'BASE'),
    sortBy
  )

  // Count total visible models
  const totalModels = displayMode === 'family'
    ? sortedFamilies.reduce((acc, family) => {
        const versionNodes = family.children.filter(c => c.parentId === family.id && !c.parameters)
        return acc + 1 + versionNodes.length
      }, 0)
    : sortedModels.length

  return (
    <div>
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {t('totalModels', { count: totalModels })}
          </p>
        </div>
        <ModelFilter
          showAllModels={showAllModels}
          onFilterChange={setShowAllModels}
          displayMode={displayMode}
          onDisplayModeChange={setDisplayMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {displayMode === 'family' ? (
        // Family mode
        sortedFamilies.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
            {t('noModels')}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {sortedFamilies.map((family) => (
              <ModelFamily
                key={family.id}
                family={family}
                showAllModels={showAllModels}
                sortBy={sortBy}
              />
            ))}
          </div>
        )
      ) : (
        // Model mode
        sortedModels.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
            {t('noModels')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                sortParam={sortBy}
              />
            ))}
          </div>
        )
      )}
    </div>
  )
}

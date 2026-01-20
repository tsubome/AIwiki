'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { LLMModel } from '@prisma/client'
import ModelFamily from './ModelFamily'
import ModelFilter from './ModelFilter'

type ModelWithChildren = LLMModel & {
  children: LLMModel[]
}

type Props = {
  families: ModelWithChildren[]
}

export default function ModelList({ families }: Props) {
  const t = useTranslations('models')
  const [showAllModels, setShowAllModels] = useState(false)

  // Filter families based on showAllModels
  // When showing base models only, also filter out families that have no base model children
  const visibleFamilies = families.filter(family => {
    if (showAllModels) return true
    // Always show the family (root is always BASE), but children will be filtered in ModelFamily
    return true
  })

  // Count total visible models (version nodes, not parameter variants)
  const totalModels = families.reduce((acc, family) => {
    const versionNodes = family.children.filter(c => c.parentId === family.id && !c.parameters)
    const visibleVersions = showAllModels
      ? versionNodes
      : versionNodes.filter(c => c.modelType === 'BASE')
    return acc + 1 + Math.min(visibleVersions.length, 5)
  }, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {t('totalModels', { count: totalModels })}
        </p>
        <ModelFilter
          showAllModels={showAllModels}
          onFilterChange={setShowAllModels}
        />
      </div>

      {visibleFamilies.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {t('noModels')}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {visibleFamilies.map((family) => (
            <ModelFamily
              key={family.id}
              family={family}
              showAllModels={showAllModels}
            />
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { Link } from '@/i18n/routing'

interface RelatedModel {
  id: string
  name: string
  slug: string
  developer: string | null
  modelType: string
  parameters: string | null  // e.g., "7B", "70B"
}

interface RelatedModelsTabsProps {
  currentModel: {
    developer: string | null
  }
  childModels: RelatedModel[]  // Renamed from 'children' to avoid React reserved prop conflict
  siblingVersions?: RelatedModel[]  // Other versions in the same family (e.g., Llama 1, Llama 3 when viewing Llama 2)
  translations: {
    evolution: string
    officialDerivatives: string
    thirdPartyFT: string
    noModels: string
  }
}

type TabCategory = 'evolution' | 'official' | 'thirdparty'

/**
 * Extract base name by removing parameter size suffix (7B, 70B, etc.)
 * e.g., "Code Llama 7B" -> "Code Llama"
 */
function getBaseName(name: string): string {
  return name.replace(/\s*\d+(\.\d+)?[Bb]\s*$/, '').trim()
}

/**
 * Classify child models into official derivatives and third-party FT.
 * Evolution (sibling versions) is handled separately.
 *
 * Parameter variations (7B, 70B, etc.) are grouped by base name.
 */
function classifyChildren(
  parentDeveloper: string | null,
  children: RelatedModel[]
): {
  official: RelatedModel[]
  thirdparty: RelatedModel[]
} {
  const official: RelatedModel[] = []
  const thirdparty: RelatedModel[] = []

  // Track which base names we've already added (for grouping parameter variations)
  const seenBaseNames = new Set<string>()

  for (const child of children) {
    const sameDeveloper = parentDeveloper && child.developer === parentDeveloper
    const baseName = getBaseName(child.name)

    // Skip if we've already added a model with this base name
    // This groups parameter variations (e.g., "Code Llama 7B", "Code Llama 34B" -> just "Code Llama")
    if (seenBaseNames.has(baseName)) {
      continue
    }

    // Skip BASE type children (parameter variations like 7B, 70B)
    if (child.modelType === 'BASE') {
      continue
    }

    if (sameDeveloper) {
      // Official derivatives
      official.push(child)
      seenBaseNames.add(baseName)
    } else {
      // Third-party FT
      thirdparty.push(child)
      seenBaseNames.add(baseName)
    }
  }

  return { official, thirdparty }
}

export default function RelatedModelsTabs({
  currentModel,
  childModels,
  siblingVersions = [],
  translations,
}: RelatedModelsTabsProps) {
  // Classify children into official derivatives and third-party FT
  const classified = useMemo(
    () => classifyChildren(currentModel.developer, childModels),
    [currentModel.developer, childModels]
  )

  // Build the full classification including sibling versions as evolution
  const allClassified = useMemo(() => ({
    evolution: siblingVersions,
    official: classified.official,
    thirdparty: classified.thirdparty,
  }), [siblingVersions, classified])

  // Determine which tabs have content
  const availableTabs: TabCategory[] = []
  if (allClassified.evolution.length > 0) availableTabs.push('evolution')
  if (allClassified.official.length > 0) availableTabs.push('official')
  if (allClassified.thirdparty.length > 0) availableTabs.push('thirdparty')

  // Default to first available tab
  const [activeTab, setActiveTab] = useState<TabCategory>(availableTabs[0] || 'evolution')

  // If no related models in any category, don't render
  if (availableTabs.length === 0) {
    return null
  }

  const tabLabels: Record<TabCategory, string> = {
    evolution: translations.evolution,
    official: translations.officialDerivatives,
    thirdparty: translations.thirdPartyFT,
  }

  const currentModels = allClassified[activeTab] || []

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {availableTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {tabLabels[tab]}
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
              ({allClassified[tab].length})
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-2">
        {currentModels.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">{translations.noModels}</p>
        ) : (
          <ul className="space-y-2">
            {currentModels.map((model) => (
              <li key={model.id}>
                <Link
                  href={`/models/${model.slug}`}
                  className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  → {model.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

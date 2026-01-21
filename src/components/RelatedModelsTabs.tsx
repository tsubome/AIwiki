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
  children: RelatedModel[]
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
 * Classify related models into three categories:
 * 1. Evolution: Same developer + BASE type + no parameters (next-gen versions)
 * 2. Official Derivatives: Same developer + non-BASE type (official fine-tunes)
 * 3. Third-party FT: Different developer (external fine-tunes)
 *
 * Parameter variations (7B, 70B, etc.) are excluded from tabs.
 * Models with the same base name are grouped and only one representative is shown.
 */
function classifyModels(
  parentDeveloper: string | null,
  children: RelatedModel[]
): {
  evolution: RelatedModel[]
  official: RelatedModel[]
  thirdparty: RelatedModel[]
} {
  const evolution: RelatedModel[] = []
  const official: RelatedModel[] = []
  const thirdparty: RelatedModel[] = []

  // Track which base names we've already added (for grouping parameter variations)
  const seenBaseNames = new Set<string>()

  for (const child of children) {
    const sameDeveloper = parentDeveloper && child.developer === parentDeveloper
    const baseName = getBaseName(child.name)
    const isParameterVariation = child.parameters !== null

    // Skip if we've already added a model with this base name
    // This groups parameter variations (e.g., "Code Llama 7B", "Code Llama 34B" -> just "Code Llama")
    if (seenBaseNames.has(baseName)) {
      continue
    }

    if (sameDeveloper) {
      if (child.modelType === 'BASE') {
        // Evolution: Only include if it's NOT a parameter variation
        // (versions like "Llama 3" don't have parameters field set)
        if (!isParameterVariation) {
          evolution.push(child)
          seenBaseNames.add(baseName)
        }
      } else {
        // Official derivatives: Include but group by base name
        official.push(child)
        seenBaseNames.add(baseName)
      }
    } else {
      // Third-party FT: Include but group by base name
      thirdparty.push(child)
      seenBaseNames.add(baseName)
    }
  }

  return { evolution, official, thirdparty }
}

export default function RelatedModelsTabs({
  currentModel,
  children,
  translations,
}: RelatedModelsTabsProps) {
  const classified = useMemo(
    () => classifyModels(currentModel.developer, children),
    [currentModel.developer, children]
  )

  // Determine which tabs have content
  const availableTabs: TabCategory[] = []
  if (classified.evolution.length > 0) availableTabs.push('evolution')
  if (classified.official.length > 0) availableTabs.push('official')
  if (classified.thirdparty.length > 0) availableTabs.push('thirdparty')

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

  const currentModels = classified[activeTab] || []

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
              ({classified[tab].length})
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

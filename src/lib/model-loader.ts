/**
 * Model Loader - New Structure
 *
 * Directory structure:
 *   data/models/
 *   └── llama/
 *       ├── _family.json      # Family metadata
 *       ├── llama-1.json      # Model with all variants
 *       ├── llama-2.json
 *       ├── llama-3.json
 *       └── ...
 */

import fs from 'fs'
import path from 'path'
import type {
  FamilyData,
  ModelData,
  ModelVariant,
  ResolvedFamily,
  ResolvedModel,
  ResolvedVariant,
  GGUFFile,
} from '@/types/model-data'

const DATA_DIR = path.join(process.cwd(), 'data', 'models')

// ============================================
// File System Helpers
// ============================================

function readJsonFile<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content) as T
  } catch {
    return null
  }
}

function getFamilyDirs(): string[] {
  if (!fs.existsSync(DATA_DIR)) return []
  return fs.readdirSync(DATA_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

function getModelFiles(familyDir: string): string[] {
  const familyPath = path.join(DATA_DIR, familyDir)
  return fs.readdirSync(familyPath, { withFileTypes: true })
    .filter(dirent =>
      dirent.isFile() &&
      dirent.name.endsWith('.json') &&
      dirent.name !== '_family.json'
    )
    .map(dirent => dirent.name.replace('.json', ''))
}

// ============================================
// ID Generation
// ============================================

function generateModelId(familySlug: string, modelSlug: string): string {
  return `${familySlug}:${modelSlug}`
}

function generateVariantId(familySlug: string, modelSlug: string, variantSlug: string): string {
  return `${familySlug}:${modelSlug}:${variantSlug}`
}

// ============================================
// Data Resolution
// ============================================

function resolveVariant(
  variant: ModelVariant,
  model: ModelData,
  familySlug: string
): ResolvedVariant {
  return {
    ...variant,
    id: generateVariantId(familySlug, model.slug, variant.slug),
    modelSlug: model.slug,
    familySlug,
    gguf: variant.gguf || [],
  }
}

function resolveModel(
  model: ModelData,
  familySlug: string
): ResolvedModel {
  const resolvedVariants = (model.variants || []).map(v =>
    resolveVariant(v, model, familySlug)
  )

  return {
    ...model,
    id: generateModelId(familySlug, model.slug),
    familySlug,
    variants: resolvedVariants,
  }
}

// ============================================
// Public API
// ============================================

/**
 * Load a single family with all its models and variants
 */
export function loadFamily(familySlug: string): ResolvedFamily | null {
  const familyPath = path.join(DATA_DIR, familySlug)
  if (!fs.existsSync(familyPath)) return null

  // Load family metadata
  const familyData = readJsonFile<FamilyData>(path.join(familyPath, '_family.json'))
  if (!familyData) return null

  // Load all models in this family
  const models: ResolvedModel[] = []

  for (const modelFile of getModelFiles(familySlug)) {
    const modelData = readJsonFile<ModelData>(
      path.join(familyPath, `${modelFile}.json`)
    )
    if (!modelData) continue

    models.push(resolveModel(modelData, familySlug))
  }

  // Sort models by version order if specified, otherwise by release date
  if (familyData.versions && familyData.versions.length > 0) {
    models.sort((a, b) => {
      const aIndex = familyData.versions.indexOf(a.slug)
      const bIndex = familyData.versions.indexOf(b.slug)
      if (aIndex === -1 && bIndex === -1) return 0
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
  } else {
    models.sort((a, b) => {
      if (!a.releaseDate && !b.releaseDate) return 0
      if (!a.releaseDate) return 1
      if (!b.releaseDate) return -1
      return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
    })
  }

  return {
    ...familyData,
    models,
  }
}

/**
 * Load all families
 */
export function loadAllFamilies(): ResolvedFamily[] {
  const families: ResolvedFamily[] = []
  for (const familyDir of getFamilyDirs()) {
    const family = loadFamily(familyDir)
    if (family) families.push(family)
  }
  return families
}

/**
 * Find a model by slug
 */
export function findModelBySlug(slug: string): ResolvedModel | null {
  for (const family of loadAllFamilies()) {
    for (const model of family.models) {
      if (model.slug === slug) {
        return model
      }
    }
  }
  return null
}

/**
 * Find a variant by slug
 */
export function findVariantBySlug(slug: string): ResolvedVariant | null {
  for (const family of loadAllFamilies()) {
    for (const model of family.models) {
      for (const variant of model.variants) {
        if (variant.slug === slug) {
          return variant
        }
      }
    }
  }
  return null
}

/**
 * Find model or variant by slug
 */
export function findBySlug(slug: string): { type: 'model' | 'variant', model: ResolvedModel, variant?: ResolvedVariant } | null {
  for (const family of loadAllFamilies()) {
    for (const model of family.models) {
      if (model.slug === slug) {
        return { type: 'model', model }
      }
      for (const variant of model.variants) {
        if (variant.slug === slug) {
          return { type: 'variant', model, variant }
        }
      }
    }
  }
  return null
}

/**
 * Get all models as flat array
 */
export function getAllModels(): ResolvedModel[] {
  const models: ResolvedModel[] = []
  for (const family of loadAllFamilies()) {
    models.push(...family.models)
  }
  return models
}

/**
 * Get all variants as flat array
 */
export function getAllVariants(): ResolvedVariant[] {
  const variants: ResolvedVariant[] = []
  for (const family of loadAllFamilies()) {
    for (const model of family.models) {
      variants.push(...model.variants)
    }
  }
  return variants
}

/**
 * Get sibling models (same family, different models)
 */
export function getSiblingModels(modelSlug: string): ResolvedModel[] {
  for (const family of loadAllFamilies()) {
    for (const model of family.models) {
      if (model.slug === modelSlug) {
        return family.models.filter(m => m.slug !== modelSlug)
      }
    }
  }
  return []
}

/**
 * Get family by model slug
 */
export function getFamilyByModelSlug(modelSlug: string): ResolvedFamily | null {
  for (const family of loadAllFamilies()) {
    for (const model of family.models) {
      if (model.slug === modelSlug) {
        return family
      }
      for (const variant of model.variants) {
        if (variant.slug === modelSlug) {
          return family
        }
      }
    }
  }
  return null
}

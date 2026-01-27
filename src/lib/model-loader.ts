/**
 * Model Loader - Uses pre-generated static data
 *
 * Data is generated at build time by: node scripts/generate-data.js
 * This ensures compatibility with Cloudflare Workers (no fs access at runtime)
 */

import type {
  FamilyData,
  ModelData,
  ModelVariant,
  ResolvedFamily,
  ResolvedModel,
  ResolvedVariant,
} from '@/types/model-data'
import { GENERATED_FAMILIES, MODEL_MAP, VARIANT_MAP, FAMILY_MAP, type TreeData } from './generated-data'

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
// Cached resolved data
// ============================================

let _resolvedFamilies: ResolvedFamily[] | null = null

function getResolvedFamilies(): ResolvedFamily[] {
  if (_resolvedFamilies) return _resolvedFamilies

  _resolvedFamilies = GENERATED_FAMILIES.map(family => ({
    ...family,
    models: family.models.map(model => resolveModel(model, family.slug)),
  }))

  return _resolvedFamilies
}

// ============================================
// Public API
// ============================================

/**
 * Load a single family with all its models and variants
 */
export function loadFamily(familySlug: string): ResolvedFamily | null {
  const families = getResolvedFamilies()
  return families.find(f => f.slug === familySlug) || null
}

/**
 * Load all families
 */
export function loadAllFamilies(): ResolvedFamily[] {
  return getResolvedFamilies()
}

/**
 * Find a model by slug
 */
export function findModelBySlug(slug: string): ResolvedModel | null {
  const entry = MODEL_MAP.get(slug)
  if (!entry) return null

  const family = loadFamily(entry.familySlug)
  if (!family) return null

  return family.models.find(m => m.slug === slug) || null
}

/**
 * Find a variant by slug
 */
export function findVariantBySlug(slug: string): ResolvedVariant | null {
  const entry = VARIANT_MAP.get(slug)
  if (!entry) return null

  const family = loadFamily(entry.familySlug)
  if (!family) return null

  const model = family.models.find(m => m.slug === entry.model.slug)
  if (!model) return null

  return model.variants.find(v => v.slug === slug) || null
}

/**
 * Find model or variant by slug
 */
export function findBySlug(slug: string): { type: 'model' | 'variant', model: ResolvedModel, variant?: ResolvedVariant } | null {
  // Check if it's a model
  const model = findModelBySlug(slug)
  if (model) {
    return { type: 'model', model }
  }

  // Check if it's a variant
  const variantEntry = VARIANT_MAP.get(slug)
  if (variantEntry) {
    const parentModel = findModelBySlug(variantEntry.model.slug)
    if (parentModel) {
      const variant = parentModel.variants.find(v => v.slug === slug)
      if (variant) {
        return { type: 'variant', model: parentModel, variant }
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
  for (const family of getResolvedFamilies()) {
    models.push(...family.models)
  }
  return models
}

/**
 * Get all variants as flat array
 */
export function getAllVariants(): ResolvedVariant[] {
  const variants: ResolvedVariant[] = []
  for (const family of getResolvedFamilies()) {
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
  for (const family of getResolvedFamilies()) {
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
  for (const family of getResolvedFamilies()) {
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

/**
 * Get tree data for a family
 */
export function getTreeDataByFamilySlug(familySlug: string): TreeData | null {
  const generatedFamily = GENERATED_FAMILIES.find(f => f.slug === familySlug)
  return generatedFamily?.tree || null
}

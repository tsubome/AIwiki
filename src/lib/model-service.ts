/**
 * Model Data Service - New Structure
 *
 * Provides interface for accessing model data from the new JSON structure.
 * Each model file contains all variants with their GGUF links.
 */

import {
  loadAllFamilies,
  loadFamily,
  findModelBySlug,
  findVariantBySlug,
  findBySlug,
  getAllModels,
  getSiblingModels,
  getFamilyByModelSlug,
} from './model-loader'
import type {
  ResolvedModel,
  ResolvedFamily,
  ResolvedVariant,
  GGUFFile,
} from '@/types/model-data'

// ============================================
// Types for Page Components
// ============================================

export interface ModelForList {
  id: string
  name: string
  slug: string
  description: string | null
  developer: string | null
  modelType: string
  releaseDate: Date | null
  variantCount: number
}

export interface ModelForDetail {
  id: string
  name: string
  slug: string
  description: string | null
  developer: string | null
  license: string | null
  modelType: string
  releaseDate: Date | null
  specs: {
    contextLength?: number
    trainingTokens?: string
    knowledgeCutoff?: string
    languages?: string[]
    architecture?: string
  } | null
  links: {
    huggingface?: string
    paper?: string
    github?: string
    website?: string
  } | null
  variants: VariantForDetail[]
}

export interface VariantForDetail {
  id: string
  name: string
  slug: string
  parameters: string
  parameterDetails?: {
    active: string
    total: string
    experts?: number
  }
  description: string | null
  huggingface: string | null
  ggufFiles: GGUFFileForDetail[]
}

export interface GGUFFileForDetail {
  id: string
  name: string
  size: string | null
  url: string
  recommended: boolean
  description: string | null
}

export interface ModelForTree {
  id: string
  name: string
  slug: string
  modelType: string
  releaseDate: Date | null
}

// ============================================
// Converters
// ============================================

function toModelForList(model: ResolvedModel): ModelForList {
  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    description: model.description || null,
    developer: model.developer || null,
    modelType: model.modelType,
    releaseDate: model.releaseDate ? new Date(model.releaseDate) : null,
    variantCount: model.variants.length,
  }
}

function toVariantForDetail(variant: ResolvedVariant, index: number): VariantForDetail {
  return {
    id: variant.id,
    name: variant.name,
    slug: variant.slug,
    parameters: variant.parameters,
    parameterDetails: variant.parameterDetails,
    description: variant.description || null,
    huggingface: variant.huggingface || null,
    ggufFiles: (variant.gguf || []).map((file, i) => ({
      id: `${variant.id}-gguf-${i}`,
      name: file.name,
      size: file.size || null,
      url: file.url,
      recommended: file.recommended || false,
      description: file.description || null,
    })),
  }
}

function toModelForDetail(model: ResolvedModel): ModelForDetail {
  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    description: model.description || null,
    developer: model.developer || null,
    license: model.license || null,
    modelType: model.modelType,
    releaseDate: model.releaseDate ? new Date(model.releaseDate) : null,
    specs: model.specs || null,
    links: model.links || null,
    variants: model.variants.map((v, i) => toVariantForDetail(v, i)),
  }
}

function toModelForTree(model: ResolvedModel): ModelForTree {
  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    modelType: model.modelType,
    releaseDate: model.releaseDate ? new Date(model.releaseDate) : null,
  }
}

// ============================================
// Public API
// ============================================

/**
 * Get all models for the list page
 */
export function getModelsForList(): ModelForList[] {
  return getAllModels().map(toModelForList)
}

/**
 * Get a model by slug for the detail page
 * Returns null if not found
 */
export function getModelBySlug(slug: string): ModelForDetail | null {
  const model = findModelBySlug(slug)
  if (!model) return null
  return toModelForDetail(model)
}

/**
 * Check if a slug is a variant and return parent model slug
 * Returns null if it's a model (not variant)
 */
export function getParentModelSlug(slug: string): string | null {
  const result = findBySlug(slug)
  if (!result) return null
  if (result.type === 'variant') {
    return result.model.slug
  }
  return null
}

/**
 * Get sibling models (same family) for related models section
 */
export function getSiblingVersions(modelSlug: string): ModelForList[] {
  return getSiblingModels(modelSlug).map(toModelForList)
}

/**
 * Get all models in the same family for family tree
 */
export function getFamilyTreeModels(modelSlug: string): ModelForTree[] {
  const family = getFamilyByModelSlug(modelSlug)
  if (!family) return []
  return family.models.map(toModelForTree)
}

/**
 * Get GGUF files grouped by variant (for backward compatibility)
 */
export function getVersionGgufFiles(modelSlug: string): { parameter: string; files: GGUFFileForDetail[] }[] {
  const model = findModelBySlug(modelSlug)
  if (!model) return []

  return model.variants.map(variant => ({
    parameter: variant.parameters,
    files: (variant.gguf || []).map((file, i) => ({
      id: `${variant.id}-gguf-${i}`,
      name: file.name,
      size: file.size || null,
      url: file.url,
      recommended: file.recommended || false,
      description: file.description || null,
    })),
  }))
}

/**
 * Get all families for navigation
 */
export function getAllFamilies(): { name: string; slug: string; modelCount: number }[] {
  return loadAllFamilies().map(family => ({
    name: family.name,
    slug: family.slug,
    modelCount: family.models.length,
  }))
}

// ============================================
// Family Detail Page
// ============================================

export interface FamilyForDetail {
  slug: string
  name: string
  developer: string | null
  description: string | null
  models: ModelForList[]
}

/**
 * Get family by slug for the detail page
 */
export function getFamilyBySlug(slug: string): FamilyForDetail | null {
  const family = loadFamily(slug)
  if (!family) return null

  return {
    slug: family.slug,
    name: family.name,
    developer: family.developer || null,
    description: family.description || null,
    models: family.models.map(toModelForList),
  }
}

/**
 * Get all family slugs (for generateStaticParams)
 */
export function getAllFamilySlugs(): string[] {
  return loadAllFamilies().map(f => f.slug)
}

// ============================================
// Legacy API (for backward compatibility)
// Keep these during migration, remove later
// ============================================

export interface ModelWithChildren {
  id: string
  name: string
  slug: string
  description: string | null
  parameters: string | null
  releaseDate: Date | null
  developer: string | null
  license: string | null
  huggingface: string | null
  modelType: string
  parentId: string | null
  createdAt: Date
  updatedAt: Date
  children: ModelWithChildren[]
  parent?: ModelWithChildren | null
  ggufFiles: { id: string; name: string; size: string | null; url: string; recommended: boolean }[]
}

const DEFAULT_TIMESTAMP = new Date('2024-01-01')

function toLegacyModel(model: ResolvedModel): ModelWithChildren {
  const releaseDate = model.releaseDate ? new Date(model.releaseDate) : null
  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    description: model.description || null,
    parameters: model.variants[0]?.parameters || null,
    releaseDate,
    developer: model.developer || null,
    license: model.license || null,
    huggingface: model.links?.huggingface || null,
    modelType: model.modelType,
    parentId: null,
    createdAt: releaseDate || DEFAULT_TIMESTAMP,
    updatedAt: releaseDate || DEFAULT_TIMESTAMP,
    children: [],
    ggufFiles: model.variants.flatMap((v, vi) =>
      (v.gguf || []).map((f, fi) => ({
        id: `${v.id}-gguf-${fi}`,
        name: f.name,
        size: f.size || null,
        url: f.url,
        recommended: f.recommended || false,
      }))
    ),
  }
}

/**
 * Legacy: Get root models with children
 */
export function getRootModelsWithChildren(): ModelWithChildren[] {
  const families = loadAllFamilies()

  return families.map(family => {
    const children = family.models.map(m => toLegacyModel(m))

    return {
      id: family.slug,
      name: family.name,
      slug: family.slug,
      description: family.description || null,
      parameters: null,
      releaseDate: null,
      developer: family.developer || null,
      license: null,
      huggingface: null,
      modelType: 'BASE',
      parentId: null,
      createdAt: DEFAULT_TIMESTAMP,
      updatedAt: DEFAULT_TIMESTAMP,
      children,
      ggufFiles: [],
    }
  })
}

/**
 * Legacy: Get model by slug
 */
export function getLegacyModelBySlug(slug: string): ModelWithChildren | null {
  const model = findModelBySlug(slug)
  if (!model) return null
  return toLegacyModel(model)
}

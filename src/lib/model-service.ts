/**
 * Model Data Service
 *
 * Provides a Prisma-like interface for model data, reading from
 * the directory-based data structure.
 *
 * This allows existing page components to work with minimal changes
 * while using the new file-based data storage.
 */

import {
  loadAllFamilies,
  loadFamily,
  findModelBySlug,
  getAllModelsFlat,
} from './model-loader'
import type { ResolvedModel, ResolvedFamily } from '@/types/model-data'

// Prisma-compatible model type
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
  ggufFiles: GGUFFileData[]
}

export interface GGUFFileData {
  id: string
  name: string
  size: string | null
  url: string
  recommended: boolean
}

// Default timestamp for file-based models
const DEFAULT_TIMESTAMP = new Date('2024-01-01')

// Convert ResolvedModel to Prisma-compatible format
function toPrismaModel(model: ResolvedModel): ModelWithChildren {
  const releaseDate = model.releaseDate ? new Date(model.releaseDate) : null
  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    description: model.description || null,
    parameters: model.parameters || null,
    releaseDate,
    developer: model.developer || null,
    license: model.license || null,
    huggingface: model.huggingface || null,
    modelType: model.modelType,
    parentId: model.parentId || null,
    createdAt: releaseDate || DEFAULT_TIMESTAMP,
    updatedAt: releaseDate || DEFAULT_TIMESTAMP,
    children: model.children.map(c => toPrismaModel(c)),
    ggufFiles: (model.ggufFiles || []).map((f, i) => ({
      id: `${model.id}-gguf-${i}`,
      name: f.name,
      size: f.size || null,
      url: f.url,
      recommended: f.recommended || false,
    })),
  }
}

// Build flat children array including all descendants
function flattenDescendants(model: ResolvedModel, allModels: Map<string, ResolvedModel>): ModelWithChildren[] {
  const flat: ModelWithChildren[] = []
  const stack = [...model.children]

  while (stack.length > 0) {
    const child = stack.pop()!
    flat.push(toPrismaModel(child))
    stack.push(...child.children)
  }

  return flat
}

/**
 * Get all root models (families) with their children flattened
 * Used by the models list page
 */
export function getRootModelsWithChildren(): ModelWithChildren[] {
  const families = loadAllFamilies()

  return families.map(family => {
    const allDescendants: ModelWithChildren[] = []

    // Collect all descendants
    for (const version of family.versions) {
      allDescendants.push(toPrismaModel(version))
      for (const variant of version.variants) {
        allDescendants.push(toPrismaModel(variant))
      }
      for (const derivative of version.derivatives) {
        allDescendants.push(toPrismaModel(derivative))
      }
    }

    return {
      ...toPrismaModel(family),
      children: allDescendants,
    }
  })
}

/**
 * Get a single model by slug with parent and children
 * Used by the model detail page
 */
export function getModelBySlug(slug: string): ModelWithChildren | null {
  const model = findModelBySlug(slug)
  if (!model) return null

  const prismaModel = toPrismaModel(model)

  // Find parent if exists
  if (model.parentId) {
    const allModels = getAllModelsFlat()
    const parent = allModels.find(m => m.id === model.parentId)
    if (parent) {
      prismaModel.parent = toPrismaModel(parent)
    }
  }

  return prismaModel
}

/**
 * Get all models in a family tree for visualization
 * Used by the family tree component
 */
export function getFamilyTreeModels(modelSlug: string): ModelWithChildren[] {
  const model = findModelBySlug(modelSlug)
  if (!model) return []

  // Find the family root
  let familySlug = modelSlug
  const families = loadAllFamilies()

  for (const family of families) {
    // Check if this model belongs to this family
    if (family.slug === modelSlug) {
      familySlug = family.slug
      break
    }
    for (const version of family.versions) {
      if (version.slug === modelSlug) {
        familySlug = family.slug
        break
      }
      for (const child of [...version.variants, ...version.derivatives]) {
        if (child.slug === modelSlug) {
          familySlug = family.slug
          break
        }
      }
    }
  }

  // Load the full family
  const family = loadFamily(familySlug)
  if (!family) return []

  // Convert all family models to Prisma format
  const result: ModelWithChildren[] = [toPrismaModel(family)]

  for (const version of family.versions) {
    result.push(toPrismaModel(version))
    for (const variant of version.variants) {
      result.push(toPrismaModel(variant))
    }
    for (const derivative of version.derivatives) {
      result.push(toPrismaModel(derivative))
    }
  }

  return result
}

/**
 * Get all models as a flat array
 */
export function getAllModels(): ModelWithChildren[] {
  return getAllModelsFlat().map(m => toPrismaModel(m))
}

/**
 * Get sibling versions in the same family (excluding self)
 * e.g., For Llama 2, returns [Llama 1, Llama 3, Llama 3.1, ...]
 * Used by the related models tabs
 */
export function getSiblingVersions(modelSlug: string): ModelWithChildren[] {
  const families = loadAllFamilies()

  for (const family of families) {
    // Check if model is a version in this family
    for (const version of family.versions) {
      if (version.slug === modelSlug) {
        // Found! Return other versions (excluding self)
        return family.versions
          .filter(v => v.slug !== modelSlug)
          .map(v => toPrismaModel(v))
      }
    }
  }

  return []
}

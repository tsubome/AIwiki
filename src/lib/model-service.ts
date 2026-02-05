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
  getTreeDataByFamilySlug,
} from './model-loader'
import type { TreeData, TreeRelationship } from './generated-data'
import type {
  ResolvedModel,
  ResolvedFamily,
  ResolvedVariant,
  GGUFFile,
} from '@/types/model-data'
import { getLocalizedString } from '@/types/model-data'

// Default locale for fallback
const DEFAULT_LOCALE = 'ja'

// ============================================
// VRAM Auto-Calculation
// ============================================

/**
 * パラメータ文字列から数値（十億単位）を抽出
 * "8B" -> 8, "70B" -> 70, "671B (+14B MTP)" -> 671
 */
function parseParamBillions(params: string): number {
  const match = params.match(/([\d.]+)\s*B/i)
  if (match) return parseFloat(match[1])
  return 0
}

/**
 * パラメータ数から最小VRAM（4bit量子化、コンテキスト長4096前提）を自動計算
 *
 * 計算式: VRAM(GB) = パラメータ数(B) × 0.55 + 0.3
 *   - モデル重み: パラメータ数 × 0.5 bytes (4bit)
 *   - KVキャッシュ: パラメータ数 × 0.05 (4096トークン時の概算)
 *   - オーバーヘッド: 0.3GB (CUDAコンテキスト等)
 *
 * MoEモデルの場合は全パラメータ数（total）を使用
 */
export function calculateMinVram(
  parameters: string,
  parameterDetails?: { active: string; total: string; experts?: number }
): string {
  // MoEモデルはtotalパラメータを使用（全エキスパートの重みがVRAMに載るため）
  const paramStr = parameterDetails?.total || parameters
  const paramsB = parseParamBillions(paramStr)

  if (paramsB <= 0) return ''

  const vramGB = paramsB * 0.55 + 0.3

  // フォーマット
  if (vramGB >= 1000) {
    const tb = vramGB / 1000
    return `${Math.round(tb * 10) / 10}TB`
  }
  if (vramGB >= 10) {
    return `${Math.round(vramGB)}GB`
  }
  // 0.5GB単位で丸める
  const rounded = Math.round(vramGB * 2) / 2
  if (rounded === Math.floor(rounded)) {
    return `${rounded}GB`
  }
  return `${rounded}GB`
}

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
  familySlug: string
  familyName: string
  description: string | null
  developer: string | null
  license: string | null
  modelType: string
  releaseDate: Date | null
  baseModel: string | null
  tags: string[] | null
  benchmarks: {
    mmlu?: number
    mmlupro?: number
    humaneval?: number
    math?: number
    gpqa?: number
    ifeval?: number
    custom?: Record<string, number>
    source?: string
  } | null
  specs: {
    contextLength?: number
    trainingTokens?: string
    knowledgeCutoff?: string
    languages?: string[]
    architecture?: string
    promptTemplate?: {
      format: string
      system?: string
      user?: string
      assistant?: string
      stopTokens?: string[]
    }
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
  baseModel?: string
  huggingface: string | null
  minVram: string
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
  parentId: string | null
  developer: string | null
  parameters: string | null
}

// ============================================
// Converters
// ============================================

function toModelForList(model: ResolvedModel, locale: string = DEFAULT_LOCALE): ModelForList {
  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    description: getLocalizedString(model.description, locale) || null,
    developer: model.developer || null,
    modelType: model.modelType,
    releaseDate: model.releaseDate ? new Date(model.releaseDate) : null,
    variantCount: model.variants.length,
  }
}

function toVariantForDetail(variant: ResolvedVariant, index: number, locale: string = DEFAULT_LOCALE): VariantForDetail {
  return {
    id: variant.id,
    name: variant.name,
    slug: variant.slug,
    parameters: variant.parameters,
    parameterDetails: variant.parameterDetails,
    description: getLocalizedString(variant.description, locale) || null,
    baseModel: variant.baseModel,
    huggingface: variant.huggingface || null,
    minVram: calculateMinVram(variant.parameters, variant.parameterDetails),
    ggufFiles: (variant.gguf || []).map((file, i) => ({
      id: `${variant.id}-gguf-${i}`,
      name: file.name,
      size: file.size || null,
      url: file.url,
      recommended: file.recommended || false,
      description: getLocalizedString(file.description, locale) || null,
    })),
  }
}

function toModelForDetail(model: ResolvedModel, locale: string = DEFAULT_LOCALE): ModelForDetail {
  const family = getFamilyByModelSlug(model.slug)
  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    familySlug: family?.slug || model.familySlug,
    familyName: family?.name || model.familySlug,
    description: getLocalizedString(model.description, locale) || null,
    developer: model.developer || null,
    license: model.license || null,
    modelType: model.modelType,
    releaseDate: model.releaseDate ? new Date(model.releaseDate) : null,
    baseModel: model.baseModel || null,
    tags: model.tags || null,
    benchmarks: model.benchmarks || null,
    specs: model.specs || null,
    links: model.links || null,
    variants: model.variants.map((v, i) => toVariantForDetail(v, i, locale)),
  }
}

function toModelForTree(model: ResolvedModel, familySlug: string): ModelForTree {
  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    modelType: model.modelType,
    releaseDate: model.releaseDate ? new Date(model.releaseDate) : null,
    parentId: familySlug, // All models belong to the family
    developer: model.developer || null,
    parameters: null, // Version nodes don't have parameters
  }
}

// TreeNode type for FamilyTreeNew (includes variants as separate nodes)
export interface TreeNode {
  id: string
  name: string
  slug: string
  modelType: string
  parentId: string | null
  developer: string | null
  parameters: string | null
}

// ============================================
// Public API
// ============================================

/**
 * Get all models for the list page
 * @param locale - Language code ('ja' or 'en')
 */
export function getModelsForList(locale: string = DEFAULT_LOCALE): ModelForList[] {
  return getAllModels().map(m => toModelForList(m, locale))
}

/**
 * Get a model by slug for the detail page
 * Returns null if not found
 * @param slug - Model slug
 * @param locale - Language code ('ja' or 'en')
 */
export function getModelBySlug(slug: string, locale: string = DEFAULT_LOCALE): ModelForDetail | null {
  const model = findModelBySlug(slug)
  if (!model) return null
  return toModelForDetail(model, locale)
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
 * @param modelSlug - Model slug
 * @param locale - Language code ('ja' or 'en')
 */
export function getSiblingVersions(modelSlug: string, locale: string = DEFAULT_LOCALE): ModelForList[] {
  return getSiblingModels(modelSlug).map(m => toModelForList(m, locale))
}

/**
 * Helper function to build tree nodes using _tree.json relationships
 * If _tree.json exists, use it. Otherwise, fall back to baseModel field.
 *
 * IMPORTANT: FamilyTreeNew component expects:
 * - Main evolution line models: parentId = family.slug (direct children of family root)
 * - Derivative models (finetune, official-derivative, distill): parentId = parent model's id
 *
 * The component creates vertical edges between main line models based on array ORDER,
 * and branch edges to derivatives based on parentId.
 */
function buildTreeNodesForFamily(family: ResolvedFamily): TreeNode[] {
  const nodes: TreeNode[] = []
  const treeData = getTreeDataByFamilySlug(family.slug)

  // Build a map of model slug -> relationship for quick lookup
  const relationshipMap = new Map<string, TreeRelationship>()
  if (treeData?.relationships) {
    for (const rel of treeData.relationships) {
      relationshipMap.set(rel.child, rel)
    }
  }

  // 1. Add family root node
  nodes.push({
    id: family.slug,
    name: family.name,
    slug: family.slug,
    modelType: 'BASE',
    parentId: null,
    developer: family.developer || null,
    parameters: null,
  })

  // Build a map of model slug -> model.id for parent resolution
  const modelIdMap = new Map<string, string>()
  for (const model of family.models) {
    modelIdMap.set(model.slug, model.id)
  }

  // 2. Add each model as a version node
  for (const model of family.models) {
    // Determine parentId based on relationship type
    let parentId = family.slug // Default: direct child of family root

    // Check _tree.json first (priority)
    const relationship = relationshipMap.get(model.slug)
    if (relationship) {
      // Main evolution line (evolution type) stays as direct child of family root
      // The component will create vertical edges based on array order
      if (relationship.type === 'evolution') {
        parentId = family.slug
      } else if (relationship.parent) {
        // Derivatives (finetune, official-derivative, distill, etc.)
        // become children of their parent model
        const parentModelId = modelIdMap.get(relationship.parent)
        if (parentModelId) {
          parentId = parentModelId
        }
      }
    } else if (model.modelType === 'FINETUNE' && model.baseModel) {
      // Fallback: use baseModel field for FINETUNE without _tree.json entry
      const baseModelSlug = model.baseModel.split('/').pop()?.toLowerCase()
      const baseModel = family.models.find(m =>
        m.slug === baseModelSlug ||
        m.slug.includes(baseModelSlug || '') ||
        baseModelSlug?.includes(m.slug)
      )
      if (baseModel) {
        parentId = baseModel.id
      }
    }

    // Add the model (version) node
    nodes.push({
      id: model.id,
      name: model.name,
      slug: model.slug,
      modelType: model.modelType,
      parentId,
      developer: model.developer || null,
      parameters: null,
    })

    // 3. Add each variant as a parameter node (child of this model)
    for (const variant of model.variants) {
      nodes.push({
        id: variant.id,
        name: variant.name,
        slug: variant.slug,
        modelType: 'BASE',
        parentId: model.id,
        developer: model.developer || null,
        parameters: variant.parameters,
      })
    }
  }

  return nodes
}

/**
 * Get all models in the same family for family tree
 * Returns a flat array with proper parent-child relationships for FamilyTreeNew
 */
export function getFamilyTreeModels(modelSlug: string): TreeNode[] {
  const family = getFamilyByModelSlug(modelSlug)
  if (!family) return []
  return buildTreeNodesForFamily(family)
}

/**
 * Get family tree nodes by family slug (for family pages)
 */
export function getFamilyTreeByFamilySlug(familySlug: string): TreeNode[] {
  const family = loadFamily(familySlug)
  if (!family) return []
  return buildTreeNodesForFamily(family)
}

/**
 * Get GGUF files grouped by variant (for backward compatibility)
 * @param modelSlug - Model slug
 * @param locale - Language code ('ja' or 'en')
 */
export function getVersionGgufFiles(modelSlug: string, locale: string = DEFAULT_LOCALE): { parameter: string; files: GGUFFileForDetail[] }[] {
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
      description: getLocalizedString(file.description, locale) || null,
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
 * @param slug - Family slug
 * @param locale - Language code ('ja' or 'en')
 */
export function getFamilyBySlug(slug: string, locale: string = DEFAULT_LOCALE): FamilyForDetail | null {
  const family = loadFamily(slug)
  if (!family) return null

  return {
    slug: family.slug,
    name: family.name,
    developer: family.developer || null,
    description: getLocalizedString(family.description, locale) || null,
    models: family.models.map(m => toModelForList(m, locale)),
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
  contextLength?: number
  tags?: string[]
  variants?: { parameters: string; parameterDetails?: { total?: string } }[]
}

const DEFAULT_TIMESTAMP = new Date('2024-01-01')

function toLegacyModel(model: ResolvedModel, parentId: string | null = null, locale: string = DEFAULT_LOCALE): ModelWithChildren {
  const releaseDate = model.releaseDate ? new Date(model.releaseDate) : null
  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    description: getLocalizedString(model.description, locale) || null,
    parameters: null, // Version nodes don't have parameters directly
    releaseDate,
    developer: model.developer || null,
    license: model.license || null,
    huggingface: model.links?.huggingface || null,
    modelType: model.modelType,
    parentId,
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
    contextLength: model.specs?.contextLength,
    tags: model.tags,
    variants: model.variants.map(v => ({
      parameters: v.parameters,
      parameterDetails: v.parameterDetails ? { total: v.parameterDetails.total } : undefined,
    })),
  }
}

/**
 * Legacy: Get root models with children
 * @param locale - Language code ('ja' or 'en')
 */
export function getRootModelsWithChildren(locale: string = DEFAULT_LOCALE): ModelWithChildren[] {
  const families = loadAllFamilies()

  return families.map(family => {
    // Pass family.slug as parentId for each child model
    const children = family.models.map(m => toLegacyModel(m, family.slug, locale))

    return {
      id: family.slug,
      name: family.name,
      slug: family.slug,
      description: getLocalizedString(family.description, locale) || null,
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
 * @param slug - Model slug
 * @param locale - Language code ('ja' or 'en')
 */
export function getLegacyModelBySlug(slug: string, locale: string = DEFAULT_LOCALE): ModelWithChildren | null {
  const model = findModelBySlug(slug)
  if (!model) return null
  return toLegacyModel(model, null, locale)
}

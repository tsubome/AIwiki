// Model data types for directory-based storage

export type ModelType = 'BASE' | 'FINETUNE' | 'MERGE' | 'QUANTIZED'

export interface GGUFFile {
  name: string
  size?: string
  url: string
  recommended?: boolean
}

export interface BaseModelData {
  name: string
  slug: string
  description?: string
  parameters?: string
  releaseDate?: string
  developer?: string
  license?: string
  huggingface?: string
  modelType: ModelType
  ggufFiles?: GGUFFile[]
}

// Family root (e.g., Llama)
export interface FamilyData extends BaseModelData {
  // Family-level metadata
}

// Version (e.g., Llama 1, Llama 2)
export interface VersionData extends BaseModelData {
  // Version-level metadata
}

// Model variant (e.g., Llama 2 7B, Swallow 7B)
export interface ModelData extends BaseModelData {
  // Model-level metadata
}

// Runtime model with resolved relationships
export interface ResolvedModel extends BaseModelData {
  id: string
  parentId?: string
  parent?: ResolvedModel
  children: ResolvedModel[]
}

// Family with all descendants loaded
export interface ResolvedFamily extends ResolvedModel {
  versions: ResolvedVersion[]
}

export interface ResolvedVersion extends ResolvedModel {
  variants: ResolvedModel[]
  derivatives: ResolvedModel[]
}

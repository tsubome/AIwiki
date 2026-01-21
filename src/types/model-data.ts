// Model data types for directory-based storage
// Refactored: 1 model = 1 JSON file with all variants

// ============================================
// GGUF Files
// ============================================

export interface GGUFFile {
  name: string           // "Q4_K_M"
  size?: string          // "4.9GB"
  url: string            // Download URL
  recommended?: boolean  // Recommended flag
  description?: string   // "バランス型。多くの環境で推奨"
}

// ============================================
// Model Variants (e.g., 8B, 70B)
// ============================================

export interface ParameterDetails {
  active: string         // "17B" (MoE active parameters)
  total: string          // "109B" (MoE total parameters)
  experts?: number       // 16 (number of experts)
}

export interface ModelVariant {
  name: string           // "Llama 3 8B"
  slug: string           // "llama-3-8b"
  parameters: string     // "8B" or "17B/109B"
  parameterDetails?: ParameterDetails
  description?: string
  huggingface?: string
  gguf: GGUFFile[]
}

// ============================================
// Model Specs & Links
// ============================================

export interface ModelSpecs {
  contextLength?: number
  trainingTokens?: string
  knowledgeCutoff?: string
  languages?: string[]
  architecture?: string
}

export interface ModelLinks {
  huggingface?: string
  paper?: string
  github?: string
  website?: string
}

// ============================================
// Model Types
// ============================================

export type ModelType = 'BASE' | 'FINETUNE' | 'MERGE' | 'QUANTIZED' | 'INSTRUCT'

// ============================================
// Model Data (Single JSON file)
// ============================================

export interface ModelData {
  name: string           // "Llama 3"
  slug: string           // "llama-3"
  releaseDate?: string   // "2024-04-18"
  developer?: string     // "Meta"
  license?: string       // "Llama 3 Community License"
  modelType: ModelType
  description?: string
  specs?: ModelSpecs
  links?: ModelLinks
  variants: ModelVariant[]
}

// ============================================
// Family Data (_family.json)
// ============================================

export interface FamilyData {
  name: string           // "Llama"
  slug: string           // "llama"
  developer?: string     // "Meta"
  description?: string
  website?: string
  versions: string[]     // ["llama-1", "llama-2", "llama-3", ...]
}

// ============================================
// Runtime Types (with resolved relationships)
// ============================================

export interface ResolvedModel extends ModelData {
  id: string
  familySlug: string
  variants: ResolvedVariant[]
}

export interface ResolvedVariant extends ModelVariant {
  id: string
  modelSlug: string      // Parent model's slug
  familySlug: string
}

export interface ResolvedFamily extends FamilyData {
  models: ResolvedModel[]
}

// ============================================
// Legacy types (for backward compatibility during migration)
// ============================================

export interface LegacyBaseModelData {
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
  contextLength?: number
  trainingTokens?: string
  knowledgeCutoff?: string
  languages?: string[]
}

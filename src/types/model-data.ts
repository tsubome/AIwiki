// Model data types for directory-based storage
// Refactored: 1 model = 1 JSON file with all variants

// ============================================
// Localization Support
// ============================================

/**
 * Localized string - supports multiple languages
 * Can be either a plain string (legacy) or an object with language keys
 */
export type LocalizedString = string | {
  ja?: string
  en?: string
  [key: string]: string | undefined
}

/**
 * Helper to get localized value
 */
export function getLocalizedString(
  value: LocalizedString | undefined,
  locale: string,
  fallbackLocale: string = 'ja'
): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[locale] || value[fallbackLocale] || Object.values(value).find(v => v) || ''
}

// ============================================
// GGUF Files
// ============================================

export interface GGUFFile {
  name: string           // "Q4_K_M"
  size?: string          // "4.9GB"
  url: string            // Download URL
  recommended?: boolean  // Recommended flag
  description?: LocalizedString   // "バランス型。多くの環境で推奨" or { ja: "...", en: "..." }
}

// ============================================
// Prompt Template (for local LLM users)
// ============================================

export interface PromptTemplate {
  format: string         // "llama-3", "chatml", "alpaca", "vicuna", etc.
  system?: string        // System prompt template
  user?: string          // User prompt template
  assistant?: string     // Assistant prompt template
  stopTokens?: string[]  // ["<|eot_id|>", "<|end_of_text|>"]
}

// ============================================
// Hardware Requirements
// ============================================

export interface HardwareRequirements {
  minVram?: string       // "6GB" (minimum VRAM for quantized)
  recommendedVram?: string // "8GB" (recommended VRAM)
  ram?: string           // "16GB" (RAM for CPU inference)
  notes?: string         // "Q4_K_M量子化で24GB×2枚構成推奨"
}

// ============================================
// Benchmark Scores
// ============================================

export interface BenchmarkScores {
  mmlu?: number          // MMLU score
  mmlupro?: number       // MMLU-Pro score
  humaneval?: number     // HumanEval (code) score
  math?: number          // MATH score
  gpqa?: number          // GPQA Diamond score
  ifeval?: number        // IFEval score
  custom?: Record<string, number>  // Other benchmarks
  source?: string        // "Open LLM Leaderboard 2024-12-01"
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
  description?: LocalizedString  // { ja: "...", en: "..." }
  huggingface?: string
  requirements?: HardwareRequirements  // Hardware requirements for this variant
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
  promptTemplate?: PromptTemplate  // Prompt format for inference
}

export interface ModelLinks {
  huggingface?: string
  paper?: string
  github?: string
  website?: string
}

// ============================================
// Model Types & Tags
// ============================================

export type ModelType = 'BASE' | 'FINETUNE' | 'MERGE' | 'QUANTIZED' | 'INSTRUCT'

// Tags for filtering and categorization
export type ModelTag =
  | 'official'           // Official model from developer
  | 'uncensored'         // Uncensored/unfiltered
  | 'censored'           // Has safety filters
  | 'roleplay'           // Roleplay optimized
  | 'coding'             // Code generation
  | 'math'               // Math/reasoning
  | 'multilingual'       // Multiple languages
  | 'japanese'           // Japanese optimized
  | 'chinese'            // Chinese optimized
  | 'vision'             // Image understanding
  | 'long-context'       // Extended context (>32K)
  | 'fast'               // Optimized for speed
  | 'moe'                // Mixture of Experts
  | 'distilled'          // Knowledge distillation
  | 'merged'             // Merged model
  | string               // Allow custom tags

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
  description?: LocalizedString  // { ja: "...", en: "..." }

  // New fields for local LLM users
  baseModel?: string     // "meta-llama/Meta-Llama-3-8B" (for finetunes)
  mergedFrom?: string[]  // ["model-A", "model-B"] (for merged models)
  tags?: ModelTag[]      // ["official", "coding", "multilingual"]
  benchmarks?: BenchmarkScores

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
  description?: LocalizedString  // { ja: "...", en: "..." }
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

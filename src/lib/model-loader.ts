import fs from 'fs'
import path from 'path'
import type {
  FamilyData,
  VersionData,
  ModelData,
  ResolvedModel,
  ResolvedFamily,
  ResolvedVersion,
} from '@/types/model-data'

const DATA_DIR = path.join(process.cwd(), 'data', 'models')

// Generate unique ID from path
function generateId(familySlug: string, versionSlug?: string, modelSlug?: string): string {
  const parts = [familySlug]
  if (versionSlug) parts.push(versionSlug)
  if (modelSlug) parts.push(modelSlug)
  return parts.join('-')
}

// Read JSON file safely
function readJsonFile<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content) as T
  } catch {
    return null
  }
}

// Get all family directories
export function getFamilyDirs(): string[] {
  if (!fs.existsSync(DATA_DIR)) return []
  return fs.readdirSync(DATA_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

// Get all version directories for a family
function getVersionDirs(familyDir: string): string[] {
  const familyPath = path.join(DATA_DIR, familyDir)
  return fs.readdirSync(familyPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

// Get all model files in a version directory
function getModelFiles(familyDir: string, versionDir: string): string[] {
  const versionPath = path.join(DATA_DIR, familyDir, versionDir)
  return fs.readdirSync(versionPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.json') && dirent.name !== '_version.json')
    .map(dirent => dirent.name.replace('.json', ''))
}

// Load a single family with all its data
export function loadFamily(familySlug: string): ResolvedFamily | null {
  const familyPath = path.join(DATA_DIR, familySlug)
  if (!fs.existsSync(familyPath)) return null

  const familyData = readJsonFile<FamilyData>(path.join(familyPath, '_family.json'))
  if (!familyData) return null

  const familyId = generateId(familySlug)
  const versions: ResolvedVersion[] = []
  const allChildren: ResolvedModel[] = []

  // Load versions
  for (const versionDir of getVersionDirs(familySlug)) {
    const versionData = readJsonFile<VersionData>(
      path.join(familyPath, versionDir, '_version.json')
    )
    if (!versionData) continue

    const versionId = generateId(familySlug, versionDir)
    const variants: ResolvedModel[] = []
    const derivatives: ResolvedModel[] = []

    // Load models in this version
    for (const modelFile of getModelFiles(familySlug, versionDir)) {
      const modelData = readJsonFile<ModelData>(
        path.join(familyPath, versionDir, `${modelFile}.json`)
      )
      if (!modelData) continue

      const modelId = generateId(familySlug, versionDir, modelFile)
      const resolvedModel: ResolvedModel = {
        ...modelData,
        id: modelId,
        parentId: versionId,
        children: [],
      }

      if (modelData.modelType === 'BASE') {
        variants.push(resolvedModel)
      } else {
        derivatives.push(resolvedModel)
      }
      allChildren.push(resolvedModel)
    }

    const resolvedVersion: ResolvedVersion = {
      ...versionData,
      id: versionId,
      parentId: familyId,
      children: [...variants, ...derivatives],
      variants,
      derivatives,
    }
    versions.push(resolvedVersion)
    allChildren.push(resolvedVersion)
  }

  return {
    ...familyData,
    id: familyId,
    children: allChildren,
    versions,
  }
}

// Load all families
export function loadAllFamilies(): ResolvedFamily[] {
  const families: ResolvedFamily[] = []
  for (const familyDir of getFamilyDirs()) {
    const family = loadFamily(familyDir)
    if (family) families.push(family)
  }
  return families
}

// Find a model by slug (searches all families)
export function findModelBySlug(slug: string): ResolvedModel | null {
  for (const familyDir of getFamilyDirs()) {
    const family = loadFamily(familyDir)
    if (!family) continue

    // Check family root
    if (family.slug === slug) return family

    // Check versions and their children
    for (const version of family.versions) {
      if (version.slug === slug) return version
      for (const child of [...version.variants, ...version.derivatives]) {
        if (child.slug === slug) return child
      }
    }
  }
  return null
}

// Get all models as flat array (for compatibility with existing code)
export function getAllModelsFlat(): ResolvedModel[] {
  const models: ResolvedModel[] = []
  for (const family of loadAllFamilies()) {
    models.push(family)
    for (const version of family.versions) {
      models.push(version)
      models.push(...version.variants)
      models.push(...version.derivatives)
    }
  }
  return models
}

// Convert to Prisma-like format for compatibility
export function toPrismaFormat(family: ResolvedFamily) {
  const flatChildren: ResolvedModel[] = []

  for (const version of family.versions) {
    flatChildren.push(version)
    flatChildren.push(...version.variants)
    flatChildren.push(...version.derivatives)
  }

  return {
    ...family,
    children: flatChildren,
  }
}

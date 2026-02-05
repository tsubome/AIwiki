/**
 * Generate static data file from JSON models
 * Run: node scripts/generate-data.js
 */

const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, '..', 'data', 'models')
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'generated-data.ts')

function getFamilyDirs() {
  if (!fs.existsSync(DATA_DIR)) return []
  return fs.readdirSync(DATA_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

function getModelFiles(familyDir) {
  const familyPath = path.join(DATA_DIR, familyDir)
  return fs.readdirSync(familyPath, { withFileTypes: true })
    .filter(dirent =>
      dirent.isFile() &&
      dirent.name.endsWith('.json') &&
      dirent.name !== '_family.json' &&
      dirent.name !== '_tree.json'
    )
    .map(dirent => dirent.name.replace('.json', ''))
}

function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

function generateData() {
  const families = []

  for (const familyDir of getFamilyDirs()) {
    const familyPath = path.join(DATA_DIR, familyDir)
    const familyData = readJsonFile(path.join(familyPath, '_family.json'))
    if (!familyData) continue

    const models = []
    for (const modelFile of getModelFiles(familyDir)) {
      const modelData = readJsonFile(path.join(familyPath, `${modelFile}.json`))
      if (modelData) {
        models.push(modelData)
      }
    }

    // Sort models by version order
    if (familyData.versions && familyData.versions.length > 0) {
      models.sort((a, b) => {
        const aIndex = familyData.versions.indexOf(a.slug)
        const bIndex = familyData.versions.indexOf(b.slug)
        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
      })
    }

    // Read _tree.json if exists
    const treeData = readJsonFile(path.join(familyPath, '_tree.json'))

    families.push({
      ...familyData,
      models,
      tree: treeData || null,
    })
  }

  return families
}

function main() {
  const data = generateData()

  const output = `// AUTO-GENERATED FILE - DO NOT EDIT
// Run: node scripts/generate-data.js
// Generated at: ${new Date().toISOString()}

import type { FamilyData, ModelData } from '@/types/model-data'

export interface TreeRelationship {
  child: string
  parent: string | null
  type: 'evolution' | 'official-derivative' | 'finetune' | 'distill' | 'merge' | 'quantize'
}

export interface TreeData {
  description?: string
  relationships: TreeRelationship[]
}

export interface GeneratedFamily extends FamilyData {
  models: ModelData[]
  tree: TreeData | null
}

export const DATA_GENERATED_AT = '${new Date().toISOString()}'

export const GENERATED_FAMILIES: GeneratedFamily[] = ${JSON.stringify(data, null, 2)} as const

// Quick lookup maps
export const FAMILY_MAP = new Map(GENERATED_FAMILIES.map(f => [f.slug, f]))
export const MODEL_MAP = new Map(GENERATED_FAMILIES.flatMap(f => f.models.map(m => [m.slug, { model: m, familySlug: f.slug }])))
export const VARIANT_MAP = new Map(GENERATED_FAMILIES.flatMap(f => f.models.flatMap(m => m.variants.map(v => [v.slug, { variant: v, model: m, familySlug: f.slug }]))))
`

  fs.writeFileSync(OUTPUT_FILE, output)
  console.log(`Generated ${OUTPUT_FILE}`)
  console.log(`- ${data.length} families`)
  console.log(`- ${data.reduce((acc, f) => acc + f.models.length, 0)} models`)
  console.log(`- ${data.reduce((acc, f) => acc + f.models.reduce((a, m) => a + m.variants.length, 0), 0)} variants`)
}

main()

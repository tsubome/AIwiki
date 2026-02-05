import { loadAllFamilies } from '@/lib/model-loader'
import { getLocalizedString } from '@/types/model-data'
import { calculateMinVram } from '@/lib/model-service'

export const dynamic = 'force-static'

export async function GET() {
  const families = loadAllFamilies()
  const locale = 'en' // Use English for LLM consumption

  let content = `# AIwiki - Complete Model Database

Generated: ${new Date().toISOString()}

This document contains complete information about all models in the AIwiki database.

---

`

  for (const family of families) {
    content += `# ${family.name} Family

- **Developer**: ${family.developer || 'N/A'}
- **Website**: ${family.website || 'N/A'}

${getLocalizedString(family.description, locale) || ''}

`

    for (const model of family.models) {
      content += `## ${model.name}

| Field | Value |
|-------|-------|
| Slug | \`${model.slug}\` |
| Release Date | ${model.releaseDate || 'N/A'} |
| Developer | ${model.developer || 'N/A'} |
| License | ${model.license || 'N/A'} |
| Model Type | ${model.modelType} |
| Base Model | ${model.baseModel || 'N/A'} |

### Description

${getLocalizedString(model.description, locale) || 'No description available.'}

`

      // Specs
      if (model.specs) {
        content += `### Specifications

| Spec | Value |
|------|-------|
| Context Length | ${model.specs.contextLength?.toLocaleString() || 'N/A'} tokens |
| Training Tokens | ${model.specs.trainingTokens || 'N/A'} |
| Knowledge Cutoff | ${model.specs.knowledgeCutoff || 'N/A'} |
| Languages | ${model.specs.languages?.join(', ') || 'N/A'} |
| Architecture | ${model.specs.architecture || 'N/A'} |

`
      }

      // Benchmarks
      if (model.benchmarks) {
        content += `### Benchmarks

| Benchmark | Score |
|-----------|-------|
`
        if (model.benchmarks.mmlu) content += `| MMLU | ${model.benchmarks.mmlu} |\n`
        if (model.benchmarks.mmlupro) content += `| MMLU-Pro | ${model.benchmarks.mmlupro} |\n`
        if (model.benchmarks.humaneval) content += `| HumanEval | ${model.benchmarks.humaneval} |\n`
        if (model.benchmarks.math) content += `| MATH | ${model.benchmarks.math} |\n`
        if (model.benchmarks.gpqa) content += `| GPQA | ${model.benchmarks.gpqa} |\n`
        if (model.benchmarks.ifeval) content += `| IFEval | ${model.benchmarks.ifeval} |\n`
        if (model.benchmarks.custom) {
          for (const [key, value] of Object.entries(model.benchmarks.custom)) {
            content += `| ${key} | ${value} |\n`
          }
        }
        if (model.benchmarks.source) {
          content += `\nSource: ${model.benchmarks.source}\n`
        }
        content += '\n'
      }

      // Links
      if (model.links) {
        content += `### Links

`
        if (model.links.huggingface) content += `- HuggingFace: ${model.links.huggingface}\n`
        if (model.links.paper) content += `- Paper: ${model.links.paper}\n`
        if (model.links.github) content += `- GitHub: ${model.links.github}\n`
        if (model.links.website) content += `- Website: ${model.links.website}\n`
        content += '\n'
      }

      // Tags
      if (model.tags && model.tags.length > 0) {
        content += `### Tags

${model.tags.map(t => `\`${t}\``).join(', ')}

`
      }

      // Variants
      if (model.variants && model.variants.length > 0) {
        content += `### Variants

| Name | Parameters | VRAM | HuggingFace |
|------|------------|------|-------------|
`
        for (const variant of model.variants) {
          const vram = calculateMinVram(variant.parameters, variant.parameterDetails) || 'N/A'
          const hf = variant.huggingface || 'N/A'
          content += `| ${variant.name} | ${variant.parameters} | ${vram} | ${hf} |\n`
        }
        content += '\n'

        // GGUF files
        for (const variant of model.variants) {
          if (variant.gguf && variant.gguf.length > 0) {
            content += `#### ${variant.name} GGUF Files

| Name | Size | Recommended | URL |
|------|------|-------------|-----|
`
            for (const gguf of variant.gguf) {
              content += `| ${gguf.name} | ${gguf.size || 'N/A'} | ${gguf.recommended ? 'Yes' : 'No'} | ${gguf.url} |\n`
            }
            content += '\n'
          }
        }
      }

      content += '---\n\n'
    }
  }

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

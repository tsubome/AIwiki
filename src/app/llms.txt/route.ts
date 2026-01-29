import { loadAllFamilies, getAllModels } from '@/lib/model-loader'

export const dynamic = 'force-static'

export async function GET() {
  const families = loadAllFamilies()
  const models = getAllModels()

  const baseUrl = 'https://aiwiki.ara-tech.jp'

  const content = `# AIwiki - Local LLM Information Wiki

> A comprehensive database of locally runnable Large Language Models (LLMs) with detailed specifications, benchmarks, and GGUF download links.

## Overview

AIwiki provides structured information about:
- Model specifications (parameters, context length, architecture)
- Benchmark scores (MMLU, HumanEval, MATH, etc.)
- Hardware requirements (VRAM, RAM)
- GGUF quantization files for local inference
- Model family trees showing evolution and derivatives

## Available Data

- **${families.length} Model Families**: ${families.map(f => f.name).join(', ')}
- **${models.length} Models** with detailed specifications
- **Multiple languages**: Japanese (ja) and English (en)

## API Endpoints

For programmatic access, use these JSON endpoints:

- \`${baseUrl}/api/models\` - List all models
- \`${baseUrl}/api/models/{slug}\` - Get specific model details
- \`${baseUrl}/api/families\` - List all model families
- \`${baseUrl}/api/families/{slug}\` - Get specific family details

## Full Content

For complete model information in markdown format:
- \`${baseUrl}/llms-full.txt\` - All model data

## Model Families

${families.map(f => `### ${f.name}
- Developer: ${f.developer || 'N/A'}
- Models: ${f.models.length}
- URL: ${baseUrl}/ja/family/${f.slug}
- API: ${baseUrl}/api/families/${f.slug}
`).join('\n')}

## Recent Models

${models.slice(0, 10).map(m => `- [${m.name}](${baseUrl}/ja/models/${m.slug}) - ${m.developer || 'Unknown'}`).join('\n')}

## Contact

- GitHub: https://github.com/tsubome/AIwiki
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

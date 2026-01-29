import { findModelBySlug, getFamilyByModelSlug } from '@/lib/model-loader'
import { getLocalizedString } from '@/types/model-data'
import { NextRequest } from 'next/server'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const { getAllModels } = await import('@/lib/model-loader')
  const models = getAllModels()
  return models.map(model => ({ slug: model.slug }))
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const locale = request.nextUrl.searchParams.get('locale') || 'en'

  const model = findModelBySlug(slug)
  if (!model) {
    return Response.json({ error: 'Model not found' }, { status: 404 })
  }

  const family = getFamilyByModelSlug(slug)

  const data = {
    slug: model.slug,
    name: model.name,
    developer: model.developer,
    releaseDate: model.releaseDate,
    modelType: model.modelType,
    license: model.license,
    baseModel: model.baseModel,
    description: getLocalizedString(model.description, locale),
    tags: model.tags,

    specs: model.specs ? {
      contextLength: model.specs.contextLength,
      trainingTokens: model.specs.trainingTokens,
      knowledgeCutoff: model.specs.knowledgeCutoff,
      languages: model.specs.languages,
      architecture: model.specs.architecture,
      promptTemplate: model.specs.promptTemplate,
    } : null,

    benchmarks: model.benchmarks,

    links: model.links,

    family: family ? {
      slug: family.slug,
      name: family.name,
      developer: family.developer,
    } : null,

    variants: model.variants.map(variant => ({
      slug: variant.slug,
      name: variant.name,
      parameters: variant.parameters,
      parameterDetails: variant.parameterDetails,
      description: getLocalizedString(variant.description, locale),
      huggingface: variant.huggingface,
      requirements: variant.requirements,
      ggufFiles: (variant.gguf || []).map(g => ({
        name: g.name,
        size: g.size,
        url: g.url,
        recommended: g.recommended,
        description: getLocalizedString(g.description, locale),
      })),
    })),
  }

  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

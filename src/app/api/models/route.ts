import { getAllModels } from '@/lib/model-loader'
import { getLocalizedString } from '@/types/model-data'
import { NextRequest } from 'next/server'

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  const models = getAllModels()
  const locale = request.nextUrl.searchParams.get('locale') || 'en'

  const data = models.map(model => ({
    slug: model.slug,
    name: model.name,
    developer: model.developer,
    releaseDate: model.releaseDate,
    modelType: model.modelType,
    license: model.license,
    description: getLocalizedString(model.description, locale),
    tags: model.tags,
    variantCount: model.variants.length,
    familySlug: model.familySlug,
    links: {
      detail: `/api/models/${model.slug}`,
      page: `/${locale}/models/${model.slug}`,
    },
  }))

  return Response.json({
    count: data.length,
    models: data,
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

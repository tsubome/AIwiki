import { loadFamily, getTreeDataByFamilySlug } from '@/lib/model-loader'
import { getLocalizedString } from '@/types/model-data'
import { NextRequest } from 'next/server'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const { loadAllFamilies } = await import('@/lib/model-loader')
  const families = loadAllFamilies()
  return families.map(family => ({ slug: family.slug }))
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const locale = request.nextUrl.searchParams.get('locale') || 'en'

  const family = loadFamily(slug)
  if (!family) {
    return Response.json({ error: 'Family not found' }, { status: 404 })
  }

  const tree = getTreeDataByFamilySlug(slug)

  const data = {
    slug: family.slug,
    name: family.name,
    developer: family.developer,
    description: getLocalizedString(family.description, locale),
    website: family.website,

    tree: tree ? {
      description: tree.description,
      relationships: tree.relationships,
    } : null,

    models: family.models.map(model => ({
      slug: model.slug,
      name: model.name,
      developer: model.developer,
      releaseDate: model.releaseDate,
      modelType: model.modelType,
      license: model.license,
      baseModel: model.baseModel,
      description: getLocalizedString(model.description, locale),
      tags: model.tags,
      variantCount: model.variants.length,
      links: {
        detail: `/api/models/${model.slug}`,
        page: `/${locale}/models/${model.slug}`,
      },
    })),
  }

  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

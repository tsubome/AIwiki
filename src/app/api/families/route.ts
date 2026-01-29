import { loadAllFamilies } from '@/lib/model-loader'
import { getLocalizedString } from '@/types/model-data'
import { NextRequest } from 'next/server'

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  const families = loadAllFamilies()
  const locale = request.nextUrl.searchParams.get('locale') || 'en'

  const data = families.map(family => ({
    slug: family.slug,
    name: family.name,
    developer: family.developer,
    description: getLocalizedString(family.description, locale),
    website: family.website,
    modelCount: family.models.length,
    models: family.models.map(m => m.slug),
    links: {
      detail: `/api/families/${family.slug}`,
      page: `/${locale}/family/${family.slug}`,
    },
  }))

  return Response.json({
    count: data.length,
    families: data,
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

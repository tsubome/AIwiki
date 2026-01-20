import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/prisma'
import ModelList from '@/components/ModelList'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'models' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ModelsPage() {
  const t = await getTranslations('models')

  // Fetch root models (models without parent) with their children
  const rootModels = await prisma.lLMModel.findMany({
    where: {
      parentId: null,
    },
    include: {
      children: {
        include: {
          children: true, // Include grandchildren for nested families
        },
        orderBy: [
          { modelType: 'asc' },
          { parameters: 'asc' },
        ],
      },
    },
    orderBy: [
      { developer: 'asc' },
      { name: 'asc' },
    ],
  })

  // Flatten the family structure: root + all descendants as direct children
  const families = rootModels.map(root => {
    // Collect all descendants recursively
    const getAllDescendants = (model: typeof root): typeof root.children => {
      const descendants: typeof root.children = []
      for (const child of model.children) {
        descendants.push(child)
        if ('children' in child && Array.isArray(child.children)) {
          descendants.push(...getAllDescendants(child as typeof root))
        }
      }
      return descendants
    }

    const allChildren = getAllDescendants(root)

    return {
      ...root,
      children: allChildren,
    }
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-600">
          {t('description')}
        </p>
      </div>

      <ModelList families={families} />
    </div>
  )
}

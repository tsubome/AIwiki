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
  // Include up to 5 levels of nesting to capture deep family trees
  const rootModels = await prisma.lLMModel.findMany({
    where: {
      parentId: null,
    },
    include: {
      children: {
        include: {
          children: {
            include: {
              children: {
                include: {
                  children: true, // 5th level
                },
              },
            },
          },
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

  console.log('[ModelsPage] Root models found:', rootModels.length)
  rootModels.forEach(m => {
    console.log(`[ModelsPage] - ${m.name}: ${m.children.length} direct children`)
  })

  // Flatten the family structure: root + all descendants as direct children
  const families = rootModels.map(root => {
    // Collect all descendants recursively
    const getAllDescendants = (model: any, depth = 0): any[] => {
      const descendants: any[] = []
      if (!model.children || !Array.isArray(model.children)) {
        return descendants
      }
      for (const child of model.children) {
        console.log(`[ModelsPage]   ${'  '.repeat(depth)}└── ${child.name} (${child.modelType})`)
        descendants.push(child)
        descendants.push(...getAllDescendants(child, depth + 1))
      }
      return descendants
    }

    console.log(`[ModelsPage] Processing family: ${root.name}`)
    const allChildren = getAllDescendants(root)
    console.log(`[ModelsPage] Total descendants for ${root.name}: ${allChildren.length}`)

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

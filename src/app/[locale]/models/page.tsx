import { getTranslations } from 'next-intl/server'
import { getRootModelsWithChildren } from '@/lib/model-service'
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

  // Load families from directory-based data
  const families = getRootModelsWithChildren()

  console.log('[ModelsPage] Families loaded:', families.length)
  families.forEach(f => {
    console.log(`[ModelsPage] - ${f.name}: ${f.children.length} descendants`)
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('description')}
        </p>
      </div>

      <ModelList families={families} />
    </div>
  )
}

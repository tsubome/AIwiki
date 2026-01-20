import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/prisma'
import { Link } from '@/i18n/routing'
import FamilyTree from '@/components/FamilyTree'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params

  const model = await prisma.lLMModel.findUnique({
    where: { slug },
  })

  if (!model) {
    return { title: 'Model Not Found' }
  }

  return {
    title: `${model.name} - AIwiki`,
    description: model.description || `Information about ${model.name}`,
  }
}

export default async function ModelDetailPage({ params }: Props) {
  const { slug } = await params
  const t = await getTranslations('model')
  const tType = await getTranslations('modelType')

  const model = await prisma.lLMModel.findUnique({
    where: { slug },
    include: {
      ggufFiles: true,
      parent: true,
      children: true,
    },
  })

  if (!model) {
    notFound()
  }

  // Get all related models for the family tree
  // First, find the root ancestor
  let rootId = model.id
  let currentModel = model
  const ancestorIds: string[] = [model.id]

  while (currentModel.parentId) {
    ancestorIds.push(currentModel.parentId)
    rootId = currentModel.parentId
    const parent = await prisma.lLMModel.findUnique({
      where: { id: currentModel.parentId },
      include: { parent: true },
    })
    if (!parent) break
    currentModel = parent as typeof currentModel
  }

  // Get all descendants from the root
  const getAllDescendants = async (id: string): Promise<string[]> => {
    const children = await prisma.lLMModel.findMany({
      where: { parentId: id },
      select: { id: true },
    })

    const descendantIds: string[] = []
    for (const child of children) {
      descendantIds.push(child.id)
      const grandchildren = await getAllDescendants(child.id)
      descendantIds.push(...grandchildren)
    }

    return descendantIds
  }

  const descendantIds = await getAllDescendants(rootId)
  const allRelatedIds = [...new Set([rootId, ...descendantIds])]

  const familyModels = await prisma.lLMModel.findMany({
    where: { id: { in: allRelatedIds } },
    select: {
      id: true,
      name: true,
      slug: true,
      modelType: true,
      parentId: true,
      developer: true,
    },
  })

  const modelTypeColors: Record<string, string> = {
    BASE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    FINETUNE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    MERGE: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    QUANTIZED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Model Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{model.name}</h1>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${modelTypeColors[model.modelType]}`}
          >
            {tType(model.modelType)}
          </span>
        </div>

        {/* Model Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {model.developer && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('developer')}</dt>
              <dd className="text-gray-900 dark:text-gray-100">{model.developer}</dd>
            </div>
          )}
          {model.parameters && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('parameters')}</dt>
              <dd className="text-gray-900 dark:text-gray-100">{model.parameters}</dd>
            </div>
          )}
          {model.license && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('license')}</dt>
              <dd className="text-gray-900 dark:text-gray-100">{model.license}</dd>
            </div>
          )}
          {model.releaseDate && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('releaseDate')}</dt>
              <dd className="text-gray-900 dark:text-gray-100">
                {new Date(model.releaseDate).toLocaleDateString()}
              </dd>
            </div>
          )}
        </div>

        {/* Description */}
        {model.description && (
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{model.description}</p>
          </div>
        )}

        {/* HuggingFace Link */}
        {model.huggingface && (
          <div>
            <a
              href={model.huggingface}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 15.5v-7H9v7h1.5zm3 0v-7H12v7h1.5zm3 0v-7h-1.5v7H16.5z" />
              </svg>
              {t('huggingface')}
            </a>
          </div>
        )}
      </div>

      {/* GGUF Files Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('ggufFiles')}</h2>

        {model.ggufFiles.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">{t('noGgufFiles')}</p>
        ) : (
          <div className="space-y-3">
            {model.ggufFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  file.recommended
                    ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {file.recommended && (
                    <span className="text-yellow-500">★</span>
                  )}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {file.name}
                    {file.recommended && (
                      <span className="ml-2 text-xs text-primary-600 dark:text-primary-400">
                        ({t('recommended')})
                      </span>
                    )}
                  </span>
                  {file.size && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">- {file.size}</span>
                  )}
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {t('download')}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Models */}
      {(model.parent || model.children.length > 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('relatedModels')}</h2>

          {model.parent && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('parentModel')}</h3>
              <Link
                href={`/models/${model.parent.slug}`}
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                ← {model.parent.name}
              </Link>
            </div>
          )}

          {model.children.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('childModels')}</h3>
              <ul className="space-y-2">
                {model.children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={`/models/${child.slug}`}
                      className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      → {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Family Tree Section */}
      {familyModels.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('familyTree')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {t('currentModel')}: <span className="font-medium text-red-600 dark:text-red-400">{model.name}</span>
          </p>
          <FamilyTree models={familyModels} currentModelId={model.id} />
        </div>
      )}
    </div>
  )
}

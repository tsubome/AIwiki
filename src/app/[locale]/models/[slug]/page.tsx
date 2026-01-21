import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import {
  getModelBySlug,
  getFamilyTreeModels,
  getSiblingVersions,
  getParentModelSlug,
} from '@/lib/model-service'
import { Link } from '@/i18n/routing'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params

  // Check if this is a variant - redirect to parent model
  const parentSlug = getParentModelSlug(slug)
  if (parentSlug) {
    const parentModel = getModelBySlug(parentSlug)
    if (parentModel) {
      return {
        title: `${parentModel.name} - AIwiki`,
        description: parentModel.description || `Information about ${parentModel.name}`,
      }
    }
  }

  const model = getModelBySlug(slug)

  if (!model) {
    return { title: 'Model Not Found' }
  }

  return {
    title: `${model.name} - AIwiki`,
    description: model.description || `Information about ${model.name}`,
  }
}

export default async function ModelDetailPage({ params }: Props) {
  const { locale, slug } = await params

  // Check if this is a variant - redirect to parent model
  const parentSlug = getParentModelSlug(slug)
  if (parentSlug) {
    redirect(`/${locale}/models/${parentSlug}`)
  }

  const t = await getTranslations('model')
  const tType = await getTranslations('modelType')

  const model = getModelBySlug(slug)

  if (!model) {
    notFound()
  }

  // Get sibling models for related section
  const siblingModels = getSiblingVersions(slug)

  // Get family tree models
  const familyModels = getFamilyTreeModels(slug)

  const modelTypeColors: Record<string, string> = {
    BASE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    FINETUNE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    MERGE: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    QUANTIZED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    INSTRUCT: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Model Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{model.name}</h1>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${modelTypeColors[model.modelType] || modelTypeColors.BASE}`}
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
          {model.license && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('license')}</dt>
              <dd className="text-gray-900 dark:text-gray-100">{model.license}</dd>
            </div>
          )}
          {model.releaseDate && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('releaseDate')}</dt>
              <dd className="text-gray-900 dark:text-gray-100" suppressHydrationWarning>
                {new Date(model.releaseDate).toLocaleDateString('ja-JP')}
              </dd>
            </div>
          )}
          {model.specs?.contextLength && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">コンテキスト長</dt>
              <dd className="text-gray-900 dark:text-gray-100" suppressHydrationWarning>
                {model.specs.contextLength.toLocaleString('ja-JP')} tokens
              </dd>
            </div>
          )}
          {model.specs?.trainingTokens && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">トレーニングトークン</dt>
              <dd className="text-gray-900 dark:text-gray-100">{model.specs.trainingTokens}</dd>
            </div>
          )}
          {model.specs?.languages && model.specs.languages.length > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">対応言語</dt>
              <dd className="text-gray-900 dark:text-gray-100">
                {model.specs.languages.join(', ')}
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

        {/* Links */}
        {model.links?.huggingface && (
          <div>
            <a
              href={model.links.huggingface}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 15.5v-7H9v7h1.5zm3 0v-7H12v7h1.5zm3 0v-7h-1.5v7H16.5z" />
              </svg>
              HuggingFace
            </a>
          </div>
        )}
      </div>

      {/* Variants Section */}
      {model.variants.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            パラメータバリエーション
          </h2>

          <div className="space-y-6">
            {model.variants.map((variant) => (
              <div key={variant.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {variant.name}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({variant.parameters})
                    </span>
                  </h3>
                  {variant.huggingface && (
                    <a
                      href={variant.huggingface}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      HuggingFace
                    </a>
                  )}
                </div>

                {variant.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {variant.description}
                  </p>
                )}

                {/* GGUF Files */}
                {variant.ggufFiles.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      GGUF ファイル
                    </h4>
                    {variant.ggufFiles.map((file) => (
                      <div
                        key={file.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
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
                                (推奨)
                              </span>
                            )}
                          </span>
                          {file.size && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              - {file.size}
                            </span>
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
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    GGUFファイルは登録されていません
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Models (Sibling Versions) */}
      {siblingModels.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('relatedModels')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {siblingModels.map((sibling) => (
              <Link
                key={sibling.id}
                href={`/models/${sibling.slug}`}
                className="block p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {sibling.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {sibling.variantCount} バリエーション
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Family Tree - Simplified for now */}
      {familyModels.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('familyTree')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {familyModels.map((fm) => (
              <Link
                key={fm.id}
                href={`/models/${fm.slug}`}
                className={`px-3 py-2 rounded-lg text-sm ${
                  fm.slug === slug
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {fm.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

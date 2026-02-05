import { notFound, redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import {
  getModelBySlug,
  getFamilyTreeModels,
  getFamilyTreeByFamilySlug,
  getSiblingVersions,
  getParentModelSlug,
  getFamilyBySlug,
  getAllFamilySlugs,
} from '@/lib/model-service'
import { getAllModels } from '@/lib/model-loader'
import { Link, routing } from '@/i18n/routing'
import FamilyTreeNew from '@/components/FamilyTreeNew'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

// Force static generation - no server-side code at runtime
export const dynamic = 'force-static'

// Generate static params for all model and family slugs
export function generateStaticParams() {
  const models = getAllModels()
  const modelSlugs = models.map(m => m.slug)
  const variantSlugs = models.flatMap(m => m.variants.map(v => v.slug))
  const familySlugs = getAllFamilySlugs()
  const allSlugs = [...new Set([...modelSlugs, ...variantSlugs, ...familySlugs])]

  return routing.locales.flatMap(locale =>
    allSlugs.map(slug => ({ locale, slug }))
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params

  // Check if this is a family
  const family = getFamilyBySlug(slug)
  if (family) {
    return {
      title: `${family.name} - AIwiki`,
      description: family.description || `${family.name} model family`,
    }
  }

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

  // Enable static rendering for this locale
  setRequestLocale(locale)

  // Check if this is a variant - redirect to parent model
  const parentSlug = getParentModelSlug(slug)
  if (parentSlug) {
    redirect(`/${locale}/models/${parentSlug}`)
  }

  const t = await getTranslations('model')
  const tCommon = await getTranslations('common')
  const tType = await getTranslations('modelType')

  // Date formatter based on locale
  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US')
  }
  const formatNumber = (num: number) => {
    return num.toLocaleString(locale === 'ja' ? 'ja-JP' : 'en-US')
  }

  const modelTypeColors: Record<string, string> = {
    BASE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    FINETUNE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    MERGE: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    QUANTIZED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    INSTRUCT: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  }

  // Check if this is a family page (with locale for descriptions)
  const family = getFamilyBySlug(slug, locale)
  if (family) {
    // Get family tree nodes for the family page
    const familyTreeNodes = getFamilyTreeByFamilySlug(slug)

    return (
      <div className="max-w-4xl mx-auto">
        {/* Family Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            {family.name}
          </h1>

          {family.developer && (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
              {t('developer')}: {family.developer}
            </p>
          )}

          {family.description && (
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {family.description}
            </p>
          )}
        </div>

        {/* Family Tree */}
        {familyTreeNodes.length > 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
              {t('familyTree')}
            </h2>
            <FamilyTreeNew models={familyTreeNodes} currentModelId={slug} />
          </div>
        )}

        {/* Models in this Family */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            {tCommon('modelList')} ({family.models.length})
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {family.models.map((model) => (
              <Link
                key={model.id}
                href={`/models/${model.slug}`}
                className="block p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
                      {model.name}
                    </h3>
                    {model.description && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {model.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <span>{tCommon('variants', { count: model.variantCount })}</span>
                      {model.releaseDate && (
                        <span suppressHydrationWarning>
                          {formatDate(model.releaseDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`flex-shrink-0 px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full ${modelTypeColors[model.modelType] || modelTypeColors.BASE}`}
                  >
                    {tType(model.modelType)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Model page (with locale for descriptions)
  const model = getModelBySlug(slug, locale)

  if (!model) {
    notFound()
  }

  // Get sibling models for related section (with locale)
  const siblingModels = getSiblingVersions(slug, locale)

  // Get family tree models
  const familyModels = getFamilyTreeModels(slug)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Model Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{model.name}</h1>
          <span
            className={`flex-shrink-0 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium rounded-full ${modelTypeColors[model.modelType] || modelTypeColors.BASE}`}
          >
            {tType(model.modelType)}
          </span>
        </div>

        {/* Model Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {model.developer && (
            <div>
              <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t('developer')}</dt>
              <dd className="text-sm sm:text-base text-gray-900 dark:text-gray-100">{model.developer}</dd>
            </div>
          )}
          {model.license && (
            <div>
              <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t('license')}</dt>
              <dd className="text-sm sm:text-base text-gray-900 dark:text-gray-100">{model.license}</dd>
            </div>
          )}
          {model.releaseDate && (
            <div>
              <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t('releaseDate')}</dt>
              <dd className="text-sm sm:text-base text-gray-900 dark:text-gray-100" suppressHydrationWarning>
                {formatDate(model.releaseDate)}
              </dd>
            </div>
          )}
          {model.specs?.contextLength && (
            <div>
              <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{tCommon('contextLength')}</dt>
              <dd className="text-sm sm:text-base text-gray-900 dark:text-gray-100" suppressHydrationWarning>
                {formatNumber(model.specs.contextLength)} {tCommon('tokens')}
              </dd>
            </div>
          )}
          {model.specs?.trainingTokens && (
            <div>
              <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{tCommon('trainingTokens')}</dt>
              <dd className="text-sm sm:text-base text-gray-900 dark:text-gray-100">{model.specs.trainingTokens}</dd>
            </div>
          )}
          {model.specs?.languages && model.specs.languages.length > 0 && (
            <div>
              <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{tCommon('supportedLanguages')}</dt>
              <dd className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                {model.specs.languages.join(', ')}
              </dd>
            </div>
          )}
          {model.specs?.knowledgeCutoff && (
            <div>
              <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t('knowledgeCutoff')}</dt>
              <dd className="text-sm sm:text-base text-gray-900 dark:text-gray-100">{model.specs.knowledgeCutoff}</dd>
            </div>
          )}
          {model.baseModel && (
            <div>
              <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t('baseModel')}</dt>
              <dd className="text-sm sm:text-base text-gray-900 dark:text-gray-100">{model.baseModel}</dd>
            </div>
          )}
        </div>

        {/* Tags */}
        {model.tags && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            {model.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {model.description && (
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{model.description}</p>
          </div>
        )}

        {/* Links */}
        {(model.links?.huggingface || model.links?.paper || model.links?.github || model.links?.website) && (
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {model.links?.huggingface && (
              <a
                href={model.links.huggingface}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm sm:text-base text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 15.5v-7H9v7h1.5zm3 0v-7H12v7h1.5zm3 0v-7h-1.5v7H16.5z" />
                </svg>
                HuggingFace
              </a>
            )}
            {model.links?.paper && (
              <a
                href={model.links.paper}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm sm:text-base text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('paper')}
              </a>
            )}
            {model.links?.github && (
              <a
                href={model.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm sm:text-base text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                </svg>
                GitHub
              </a>
            )}
            {model.links?.website && (
              <a
                href={model.links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm sm:text-base text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {t('website')}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Benchmarks Section */}
      {model.benchmarks && (Object.keys(model.benchmarks).length > 1 || (Object.keys(model.benchmarks).length === 1 && !model.benchmarks.source)) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            {t('benchmarks')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {model.benchmarks.mmlu !== undefined && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">MMLU</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{model.benchmarks.mmlu}</div>
              </div>
            )}
            {model.benchmarks.mmlupro !== undefined && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">MMLU-Pro</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{model.benchmarks.mmlupro}</div>
              </div>
            )}
            {model.benchmarks.humaneval !== undefined && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">HumanEval</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{model.benchmarks.humaneval}</div>
              </div>
            )}
            {model.benchmarks.math !== undefined && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">MATH</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{model.benchmarks.math}</div>
              </div>
            )}
            {model.benchmarks.gpqa !== undefined && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">GPQA</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{model.benchmarks.gpqa}</div>
              </div>
            )}
            {model.benchmarks.ifeval !== undefined && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">IFEval</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{model.benchmarks.ifeval}</div>
              </div>
            )}
            {model.benchmarks.custom && Object.entries(model.benchmarks.custom).map(([key, value]) => (
              <div key={key} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate" title={key}>{key}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{value}</div>
              </div>
            ))}
          </div>
          {model.benchmarks.source && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {t('benchmarkSource')}: {model.benchmarks.source}
            </p>
          )}
        </div>
      )}

      {/* Technical Specs Section */}
      {(model.specs?.architecture || model.specs?.promptTemplate) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            {t('technicalSpecs')}
          </h2>

          {model.specs?.architecture && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('architecture')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {model.specs.architecture}
              </p>
            </div>
          )}

          {model.specs?.promptTemplate && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('promptTemplate')}</h3>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-3 sm:p-4 overflow-x-auto">
                <div className="text-xs text-gray-400 mb-2">
                  {t('promptFormat')}: <span className="text-green-400">{model.specs.promptTemplate.format}</span>
                </div>
                {model.specs.promptTemplate.system && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">{t('systemPrompt')}:</span>
                    <pre className="text-xs sm:text-sm text-gray-300 mt-1 whitespace-pre-wrap break-all">{model.specs.promptTemplate.system}</pre>
                  </div>
                )}
                {model.specs.promptTemplate.user && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">{t('userPrompt')}:</span>
                    <pre className="text-xs sm:text-sm text-gray-300 mt-1 whitespace-pre-wrap break-all">{model.specs.promptTemplate.user}</pre>
                  </div>
                )}
                {model.specs.promptTemplate.assistant && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">{t('assistantPrompt')}:</span>
                    <pre className="text-xs sm:text-sm text-gray-300 mt-1 whitespace-pre-wrap break-all">{model.specs.promptTemplate.assistant}</pre>
                  </div>
                )}
                {model.specs.promptTemplate.stopTokens && model.specs.promptTemplate.stopTokens.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500">{t('stopTokens')}:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {model.specs.promptTemplate.stopTokens.map((token, i) => (
                        <code key={i} className="text-xs px-1.5 py-0.5 bg-gray-800 text-yellow-400 rounded">{token}</code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Variants Section */}
      {model.variants.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            {tCommon('parameterVariations')}
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {model.variants.map((variant) => (
              <div key={variant.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 sm:pb-6 last:border-0 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {variant.name}
                    <span className="ml-2 text-xs sm:text-sm font-normal text-gray-500">
                      ({variant.parameters})
                    </span>
                  </h3>
                  {variant.huggingface && (
                    <a
                      href={variant.huggingface}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:underline active:text-primary-800"
                    >
                      HuggingFace
                    </a>
                  )}
                </div>

                {variant.description && (
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {variant.description}
                  </p>
                )}

                {/* MoE Details & VRAM & Base Model */}
                {(variant.parameterDetails || variant.minVram || variant.baseModel) && (
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-3">
                    {variant.parameterDetails && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-purple-50 dark:bg-purple-900/30 text-xs">
                        <span className="text-purple-600 dark:text-purple-400 font-medium">MoE</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {t('activeParams')}: {variant.parameterDetails.active}
                          {variant.parameterDetails.experts && ` / ${variant.parameterDetails.experts} ${t('experts')}`}
                        </span>
                      </div>
                    )}
                    {variant.minVram && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-xs">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">VRAM</span>
                        <span className="text-gray-600 dark:text-gray-400">{variant.minVram}</span>
                      </div>
                    )}
                    {variant.baseModel && (
                      <Link
                        href={`/models/${variant.baseModel}`}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-orange-50 dark:bg-orange-900/30 text-xs hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                      >
                        <span className="text-orange-600 dark:text-orange-400 font-medium">{t('baseModel')}</span>
                        <span className="text-gray-600 dark:text-gray-400">{variant.baseModel}</span>
                      </Link>
                    )}
                  </div>
                )}

                {/* GGUF Files */}
                {variant.ggufFiles.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('ggufFiles')}
                    </h4>
                    {variant.ggufFiles.map((file) => (
                      <div
                        key={file.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border ${
                          file.recommended
                            ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/30'
                            : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                          {file.recommended && (
                            <span className="text-yellow-500 flex-shrink-0">★</span>
                          )}
                          <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
                            {file.name}
                            {file.recommended && (
                              <span className="ml-1 sm:ml-2 text-xs text-primary-600 dark:text-primary-400">
                                ({t('recommended')})
                              </span>
                            )}
                          </span>
                          {file.size && (
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                              - {file.size}
                            </span>
                          )}
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-600 text-white text-xs sm:text-sm rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors text-center"
                        >
                          {t('download')}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {t('noGgufFiles')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Models (Sibling Versions) */}
      {siblingModels.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            {t('relatedModels')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {siblingModels.map((sibling) => (
              <Link
                key={sibling.id}
                href={`/models/${sibling.slug}`}
                className="block p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 active:bg-gray-50 dark:active:bg-gray-700 transition-colors"
              >
                <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
                  {sibling.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {tCommon('variants', { count: sibling.variantCount })}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Family Tree */}
      {familyModels.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            {t('familyTree')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
            {t('currentModel')}: <span className="font-medium text-red-600 dark:text-red-400">{model.name}</span>
          </p>
          <FamilyTreeNew models={familyModels} currentModelId={model.id} />
        </div>
      )}
    </div>
  )
}

'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import type { LLMModel } from '@prisma/client'

type ModelWithChildren = LLMModel & {
  children: LLMModel[]
}

type Props = {
  family: ModelWithChildren
  showAllModels: boolean
}

const modelTypeColors: Record<string, string> = {
  BASE: 'bg-blue-100 text-blue-800',
  FINETUNE: 'bg-green-100 text-green-800',
  MERGE: 'bg-purple-100 text-purple-800',
  QUANTIZED: 'bg-orange-100 text-orange-800',
}

export default function ModelFamily({ family, showAllModels }: Props) {
  const t = useTranslations('models')
  const tType = useTranslations('modelType')

  // Filter children based on showAllModels flag
  const visibleChildren = showAllModels
    ? family.children
    : family.children.filter(child => child.modelType === 'BASE')

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Family Header (Root Model) */}
      <Link
        href={`/models/${family.slug}`}
        className="block p-6 hover:bg-gray-50 transition-colors border-b border-gray-100"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{family.name}</h3>
            {family.developer && (
              <p className="text-sm text-gray-500 mt-1">{family.developer}</p>
            )}
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${modelTypeColors[family.modelType]}`}
          >
            {tType(family.modelType)}
          </span>
        </div>

        {family.description && (
          <p className="text-gray-600 mt-3 text-sm line-clamp-2">
            {family.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
          {family.parameters && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 flex-shrink-0" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              {family.parameters}
            </span>
          )}
          {family.releaseDate && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 flex-shrink-0" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(family.releaseDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </Link>

      {/* Child Models */}
      {visibleChildren.length > 0 && (
        <div className="bg-gray-50">
          <div className="px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
            {t('variants')} ({visibleChildren.length})
          </div>
          <div className="divide-y divide-gray-200">
            {visibleChildren.map((child) => (
              <Link
                key={child.id}
                href={`/models/${child.slug}`}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">└</span>
                  <div>
                    <span className="font-medium text-gray-900">{child.name}</span>
                    {child.parameters && (
                      <span className="ml-2 text-sm text-gray-500">({child.parameters})</span>
                    )}
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${modelTypeColors[child.modelType]}`}
                >
                  {tType(child.modelType)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

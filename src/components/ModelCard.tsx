'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import type { LLMModel } from '@prisma/client'

type Props = {
  model: LLMModel
}

const modelTypeColors: Record<string, string> = {
  BASE: 'bg-blue-100 text-blue-800',
  FINETUNE: 'bg-green-100 text-green-800',
  MERGE: 'bg-purple-100 text-purple-800',
  QUANTIZED: 'bg-orange-100 text-orange-800',
}

export default function ModelCard({ model }: Props) {
  const t = useTranslations('models')
  const tType = useTranslations('modelType')

  return (
    <Link
      href={`/models/${model.slug}`}
      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
          {model.developer && (
            <p className="text-sm text-gray-500 mt-1">{model.developer}</p>
          )}
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${modelTypeColors[model.modelType]}`}
        >
          {tType(model.modelType)}
        </span>
      </div>

      {model.description && (
        <p className="text-gray-600 mt-3 text-sm line-clamp-2">
          {model.description}
        </p>
      )}

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
        {model.parameters && (
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" style={{ width: '16px', height: '16px', minWidth: '16px', maxWidth: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            {model.parameters}
          </span>
        )}
        {model.releaseDate && (
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" style={{ width: '16px', height: '16px', minWidth: '16px', maxWidth: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(model.releaseDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </Link>
  )
}

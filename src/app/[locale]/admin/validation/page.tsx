'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  isAuthenticated,
  getCurrentUser,
  logout,
  getModelFamilies,
  getFamilyData,
} from '@/lib/github-api'

interface ValidationIssue {
  type: 'error' | 'warning'
  family: string
  model?: string
  field: string
  message: string
}

export default function ValidationPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params.locale as string) || 'ja'
  const [user, setUser] = useState<{ login: string; avatar_url: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isValidating, setIsValidating] = useState(false)
  const [issues, setIssues] = useState<ValidationIssue[]>([])
  const [validated, setValidated] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0, family: '' })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/${locale}/admin/`)
      return
    }
    loadUser()
  }, [router, locale])

  const loadUser = async () => {
    try {
      const userInfo = await getCurrentUser()
      setUser(userInfo)
    } catch (err) {
      console.error('Failed to load user:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const runValidation = async () => {
    setIsValidating(true)
    setIssues([])
    setValidated(false)
    const foundIssues: ValidationIssue[] = []

    try {
      const families = await getModelFamilies()
      setProgress({ current: 0, total: families.length, family: '' })

      const allSlugs: { family: string; model: string; slug: string }[] = []

      for (let i = 0; i < families.length; i++) {
        const family = families[i]
        setProgress({ current: i + 1, total: families.length, family })

        try {
          const familyData = await getFamilyData(family)

          // Validate _family.json
          const fData = familyData.family as Record<string, unknown>
          if (!fData.name) {
            foundIssues.push({
              type: 'error',
              family,
              field: 'name',
              message: '_family.jsonにnameがありません',
            })
          }
          if (!fData.slug) {
            foundIssues.push({
              type: 'error',
              family,
              field: 'slug',
              message: '_family.jsonにslugがありません',
            })
          }

          // Validate each model
          for (const model of familyData.models) {
            const mData = model.data as Record<string, unknown>

            // Required fields
            if (!mData.name) {
              foundIssues.push({
                type: 'error',
                family,
                model: model.slug,
                field: 'name',
                message: 'nameフィールドがありません',
              })
            }

            if (!mData.slug) {
              foundIssues.push({
                type: 'error',
                family,
                model: model.slug,
                field: 'slug',
                message: 'slugフィールドがありません',
              })
            } else {
              // Check for duplicate slugs
              const existingSlug = allSlugs.find(s => s.slug === mData.slug && s.family === family)
              if (existingSlug) {
                foundIssues.push({
                  type: 'error',
                  family,
                  model: model.slug,
                  field: 'slug',
                  message: `slugが重複しています: ${mData.slug}`,
                })
              } else {
                allSlugs.push({ family, model: model.slug, slug: mData.slug as string })
              }
            }

            // Check variants
            if (!mData.variants || !Array.isArray(mData.variants)) {
              foundIssues.push({
                type: 'warning',
                family,
                model: model.slug,
                field: 'variants',
                message: 'variantsが空または存在しません',
              })
            } else {
              const variants = mData.variants as Array<Record<string, unknown>>
              for (let vi = 0; vi < variants.length; vi++) {
                const v = variants[vi]
                if (!v.name) {
                  foundIssues.push({
                    type: 'error',
                    family,
                    model: model.slug,
                    field: `variants[${vi}].name`,
                    message: `バリアント${vi + 1}にnameがありません`,
                  })
                }
                if (!v.slug) {
                  foundIssues.push({
                    type: 'error',
                    family,
                    model: model.slug,
                    field: `variants[${vi}].slug`,
                    message: `バリアント${vi + 1}にslugがありません`,
                  })
                }
                if (!v.parameters) {
                  foundIssues.push({
                    type: 'warning',
                    family,
                    model: model.slug,
                    field: `variants[${vi}].parameters`,
                    message: `バリアント${vi + 1}にparametersがありません`,
                  })
                }
              }
            }

            // Check optional but recommended fields
            if (!mData.modelType) {
              foundIssues.push({
                type: 'warning',
                family,
                model: model.slug,
                field: 'modelType',
                message: 'modelTypeが設定されていません',
              })
            }
          }
        } catch (err) {
          foundIssues.push({
            type: 'error',
            family,
            field: 'load',
            message: `ファミリーの読み込みに失敗: ${err instanceof Error ? err.message : '不明なエラー'}`,
          })
        }
      }

      setIssues(foundIssues)
      setValidated(true)
    } catch (err) {
      console.error('Validation failed:', err)
    } finally {
      setIsValidating(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push(`/${locale}/admin/`)
  }

  const errorCount = issues.filter(i => i.type === 'error').length
  const warningCount = issues.filter(i => i.type === 'warning').length

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href={`/${locale}/admin/`}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              ← 管理トップ
            </a>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              データ整合性チェック
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <img src={user.avatar_url} alt={user.login} className="w-8 h-8 rounded-full" />
                <span className="text-gray-700 dark:text-gray-300">{user.login}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Run Validation Button */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            検証を実行
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            すべてのモデルデータをチェックし、問題を検出します。
          </p>
          <button
            onClick={runValidation}
            disabled={isValidating}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? '検証中...' : '検証を開始'}
          </button>

          {isValidating && (
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  {progress.family} を検証中... ({progress.current}/{progress.total})
                </span>
              </div>
              <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {validated && (
          <>
            {/* Summary */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                検証結果
              </h2>
              <div className="flex gap-6">
                <div className={`text-center p-4 rounded-lg ${errorCount > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                  <div className={`text-3xl font-bold ${errorCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {errorCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">エラー</div>
                </div>
                <div className={`text-center p-4 rounded-lg ${warningCount > 0 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                  <div className={`text-3xl font-bold ${warningCount > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {warningCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">警告</div>
                </div>
              </div>
              {errorCount === 0 && warningCount === 0 && (
                <p className="mt-4 text-green-600 font-medium">
                  すべてのデータが正常です！
                </p>
              )}
            </div>

            {/* Issue List */}
            {issues.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-6 pb-4">
                  問題一覧
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          種別
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          ファミリー
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          モデル
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          フィールド
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          メッセージ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {issues.map((issue, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-3 whitespace-nowrap">
                            {issue.type === 'error' ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                エラー
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                警告
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            <a
                              href={`/${locale}/admin/families/?edit=${issue.family}`}
                              className="hover:underline text-blue-600"
                            >
                              {issue.family}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            {issue.model ? (
                              <a
                                href={`/${locale}/admin/models/?family=${issue.family}&slug=${issue.model}`}
                                className="hover:underline text-blue-600"
                              >
                                {issue.model}
                              </a>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">
                            {issue.field}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            {issue.message}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

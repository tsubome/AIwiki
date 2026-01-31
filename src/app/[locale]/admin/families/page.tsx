'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  getModelFamilies,
  getFamilyData,
  isAuthenticated,
  getCurrentUser,
  logout,
} from '@/lib/github-api'

interface FamilyInfo {
  slug: string
  name: string
  developer: string
  modelCount: number
}

export default function FamiliesPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string || 'ja'
  const [families, setFamilies] = useState<FamilyInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ login: string; avatar_url: string } | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/${locale}/admin/`)
      return
    }
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const userInfo = await getCurrentUser()
      setUser(userInfo)

      const familyList = await getModelFamilies()

      const familyInfos: FamilyInfo[] = []
      for (const slug of familyList) {
        try {
          const familyData = await getFamilyData(slug)
          const family = familyData.family as { name?: string; developer?: string }
          familyInfos.push({
            slug,
            name: family.name || slug,
            developer: family.developer || 'Unknown',
            modelCount: familyData.models.length,
          })
        } catch (err) {
          console.error(`Failed to load family ${slug}:`, err)
          familyInfos.push({
            slug,
            name: slug,
            developer: 'Unknown',
            modelCount: 0,
          })
        }
      }

      setFamilies(familyInfos)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'データの読み込みに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push(`/${locale}/admin/`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">ファミリーデータを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href={`/${locale}/admin/`} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              ← ダッシュボード
            </a>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              ファミリー管理
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
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 text-gray-600 dark:text-gray-400">
          {families.length} 件のファミリー
        </div>

        {/* Family List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  名前
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  スラッグ
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  開発者
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  モデル数
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {families.map(family => (
                <tr
                  key={family.slug}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3">
                    <a
                      href={`/admin/families/${family.slug}/`}
                      className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600"
                    >
                      {family.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <code className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                      {family.slug}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {family.developer}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {family.modelCount}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/admin/families/${family.slug}/`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      編集
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {families.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              ファミリーが見つかりません
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            💡 新しいファミリーを作成するには、「モデル管理」→「新規作成」から行えます。
          </p>
        </div>
      </main>
    </div>
  )
}

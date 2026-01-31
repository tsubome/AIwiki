'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  getModelFamilies,
  getFamilyData,
  isAuthenticated,
  getCurrentUser,
  logout,
} from '@/lib/github-api'

interface ModelInfo {
  family: string
  slug: string
  name: string
  developer?: string
  releaseDate?: string
  variantCount: number
}

export default function ModelsPage() {
  const router = useRouter()
  const [models, setModels] = useState<ModelInfo[]>([])
  const [filteredModels, setFilteredModels] = useState<ModelInfo[]>([])
  const [families, setFamilies] = useState<string[]>([])
  const [selectedFamily, setSelectedFamily] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ login: string; avatar_url: string } | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/')
      return
    }
    loadData()
  }, [router])

  useEffect(() => {
    filterModels()
  }, [models, selectedFamily, searchQuery])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get user info
      const userInfo = await getCurrentUser()
      setUser(userInfo)

      // Get all families
      const familyList = await getModelFamilies()
      setFamilies(familyList)

      // Get all models from all families
      const allModels: ModelInfo[] = []

      for (const family of familyList) {
        try {
          const familyData = await getFamilyData(family)
          for (const model of familyData.models) {
            const data = model.data as {
              name: string
              developer?: string
              releaseDate?: string
              variants?: unknown[]
            }
            allModels.push({
              family,
              slug: model.slug,
              name: data.name,
              developer: data.developer,
              releaseDate: data.releaseDate,
              variantCount: data.variants?.length || 0,
            })
          }
        } catch (err) {
          console.error(`Failed to load family ${family}:`, err)
        }
      }

      setModels(allModels)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'データの読み込みに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const filterModels = () => {
    let filtered = [...models]

    if (selectedFamily !== 'all') {
      filtered = filtered.filter(m => m.family === selectedFamily)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        m =>
          m.name.toLowerCase().includes(query) ||
          m.developer?.toLowerCase().includes(query) ||
          m.slug.toLowerCase().includes(query)
      )
    }

    // Sort by release date (newest first)
    filtered.sort((a, b) => {
      if (!a.releaseDate) return 1
      if (!b.releaseDate) return -1
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    })

    setFilteredModels(filtered)
  }

  const handleLogout = () => {
    logout()
    router.push('/admin/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">モデルデータを読み込み中...</p>
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
            <a href="/admin/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              ← ダッシュボード
            </a>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              モデル管理
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

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="検索..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <select
                value={selectedFamily}
                onChange={e => setSelectedFamily(e.target.value)}
                className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="all">すべてのファミリー</option>
                {families.map(f => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <a
                href="/admin/models/new/"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + 新規作成
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 text-gray-600 dark:text-gray-400">
          {filteredModels.length} 件のモデル
          {selectedFamily !== 'all' && ` (${selectedFamily})`}
        </div>

        {/* Model List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  名前
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  ファミリー
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  開発者
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  リリース日
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  バリアント
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredModels.map(model => (
                <tr
                  key={`${model.family}/${model.slug}`}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3">
                    <a
                      href={`/admin/models/${model.family}/${model.slug}/`}
                      className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600"
                    >
                      {model.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                      {model.family}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {model.developer || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {model.releaseDate || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {model.variantCount}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/admin/models/${model.family}/${model.slug}/`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      編集
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredModels.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              モデルが見つかりません
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import {
  getModelFamilies,
  getFamilyData,
  getFamilyMetadata,
  saveFamilyMetadata,
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

interface FamilyData {
  name: string
  slug: string
  developer: string
  description?: { ja?: string; en?: string }
  website?: string
  versions?: string[]
}

function FamiliesPageContent() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string || 'ja'
  const searchParams = useSearchParams()
  const editSlug = searchParams.get('edit')
  const isEditing = !!editSlug

  const [families, setFamilies] = useState<FamilyInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [user, setUser] = useState<{ login: string; avatar_url: string } | null>(null)

  // Editor state
  const [editingFamily, setEditingFamily] = useState<FamilyData | null>(null)
  const [editingSha, setEditingSha] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<FamilyData>({
    name: '',
    slug: '',
    developer: '',
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/${locale}/admin/`)
      return
    }
    loadData()
  }, [router])

  useEffect(() => {
    if (isEditing && editSlug) {
      loadEditingFamily(editSlug)
    } else {
      setEditingFamily(null)
      setEditingSha(null)
    }
  }, [editSlug, isEditing])

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

  const loadEditingFamily = async (slug: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, sha } = await getFamilyMetadata(slug)
      const familyData = data as FamilyData
      setEditingFamily(familyData)
      setEditingSha(sha)
      setFormData(familyData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ファミリーの読み込みに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push(`/${locale}/admin/`)
  }

  const handleEdit = (slug: string) => {
    router.push(`/${locale}/admin/families/?edit=${slug}`)
  }

  const handleCloseEditor = () => {
    router.push(`/${locale}/admin/families/`)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDescriptionChange = (lang: 'ja' | 'en', value: string) => {
    setFormData(prev => ({
      ...prev,
      description: {
        ...(prev.description || {}),
        [lang]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editSlug) return

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await saveFamilyMetadata(
        editSlug,
        formData,
        editingSha || undefined
      )

      setSuccess('保存しました！GitHub Actionsで自動デプロイが開始されます。')
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditing ? 'ファミリーを読み込み中...' : 'ファミリーデータを読み込み中...'}
          </p>
        </div>
      </div>
    )
  }

  // Editor View
  if (isEditing && editingFamily) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCloseEditor}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                ← ファミリー一覧
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {editingFamily.name} を編集
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

        <main className="max-w-4xl mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">基本情報</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">名前 *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">スラッグ</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    disabled
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">開発者</label>
                  <input
                    type="text"
                    name="developer"
                    value={formData.developer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ウェブサイト</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">説明</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">日本語</label>
                  <textarea
                    value={formData.description?.ja || ''}
                    onChange={e => handleDescriptionChange('ja', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">英語</label>
                  <textarea
                    value={formData.description?.en || ''}
                    onChange={e => handleDescriptionChange('en', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? '保存中...' : '保存'}
              </button>
              <button
                type="button"
                onClick={handleCloseEditor}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                キャンセル
              </button>
            </div>
          </form>
        </main>
      </div>
    )
  }

  // List View
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-6 text-gray-600 dark:text-gray-400">
          {families.length} 件のファミリー
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">名前</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">スラッグ</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">開発者</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">モデル数</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {families.map(family => (
                <tr key={family.slug} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(family.slug)}
                      className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600"
                    >
                      {family.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <code className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-sm">{family.slug}</code>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{family.developer}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{family.modelCount}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleEdit(family.slug)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      編集
                    </button>
                    <a
                      href={`/${locale}/admin/models/?family=${family.slug}`}
                      className="text-green-600 hover:text-green-800 dark:text-green-400"
                    >
                      モデル
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

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            新しいファミリーを作成するには、「モデル管理」→「新規作成」から行えます。
          </p>
        </div>
      </main>
    </div>
  )
}

export default function FamiliesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
        </div>
      </div>
    }>
      <FamiliesPageContent />
    </Suspense>
  )
}

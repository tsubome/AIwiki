'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  getModelFamilies,
  isAuthenticated,
  getCurrentUser,
  logout,
} from '@/lib/github-api'

export default function NewModelPage() {
  const router = useRouter()
  const [families, setFamilies] = useState<string[]>([])
  const [selectedFamily, setSelectedFamily] = useState<string>('')
  const [newFamily, setNewFamily] = useState<string>('')
  const [useNewFamily, setUseNewFamily] = useState(false)
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

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const userInfo = await getCurrentUser()
      setUser(userInfo)

      const familyList = await getModelFamilies()
      setFamilies(familyList)
      if (familyList.length > 0) {
        setSelectedFamily(familyList[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'データの読み込みに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    const family = useNewFamily ? newFamily.toLowerCase().replace(/\s+/g, '-') : selectedFamily
    if (!family) {
      setError('ファミリーを選択または入力してください')
      return
    }
    router.push(`/admin/models/${family}/new/`)
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
          <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
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
            <a
              href="/admin/models/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              ← モデル一覧
            </a>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              新規モデル作成
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
      <main className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            ファミリーを選択
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            モデルを追加するファミリーを選択してください。新しいファミリーを作成することもできます。
          </p>

          <div className="space-y-4">
            {/* Existing Family */}
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id="existing"
                checked={!useNewFamily}
                onChange={() => setUseNewFamily(false)}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="existing" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  既存のファミリーに追加
                </label>
                <select
                  value={selectedFamily}
                  onChange={e => setSelectedFamily(e.target.value)}
                  disabled={useNewFamily}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 disabled:opacity-50"
                >
                  {families.map(f => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* New Family */}
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id="new"
                checked={useNewFamily}
                onChange={() => setUseNewFamily(true)}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="new" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  新しいファミリーを作成
                </label>
                <input
                  type="text"
                  value={newFamily}
                  onChange={e => setNewFamily(e.target.value)}
                  disabled={!useNewFamily}
                  placeholder="例: llama, mistral, qwen"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 disabled:opacity-50"
                />
                {useNewFamily && newFamily && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    作成されるフォルダ: data/models/{newFamily.toLowerCase().replace(/\s+/g, '-')}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleContinue}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              続ける
            </button>
            <a
              href="/admin/models/"
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              キャンセル
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}

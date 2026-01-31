'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getModelFamilies, getFamilyData, getRecentCommits, CommitInfo } from '@/lib/github-api'

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || ''

interface Stats {
  families: number
  models: number
  variants: number
}

export default function AdminPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string || 'ja'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ login: string; avatar_url: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({ families: 0, models: 0, variants: 0 })
  const [recentCommits, setRecentCommits] = useState<CommitInfo[]>([])
  const [statsLoading, setStatsLoading] = useState(false)

  // Build redirect URI with locale
  const redirectUri = typeof window !== 'undefined'
    ? `${window.location.origin}/${locale}/admin/callback/`
    : ''

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('github_token')
    if (token) {
      validateToken(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const validateToken = async (token: string) => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const userData = await response.json()
        // Check if user is authorized (you can add more users here)
        const authorizedUsers = ['tsubome'] // Add authorized GitHub usernames
        if (authorizedUsers.includes(userData.login)) {
          setUser(userData)
          setIsAuthenticated(true)
          // Load stats after authentication
          loadStats()
          loadRecentCommits()
        } else {
          localStorage.removeItem('github_token')
          alert('このユーザーは管理者権限がありません')
        }
      } else {
        localStorage.removeItem('github_token')
      }
    } catch (error) {
      console.error('Token validation failed:', error)
      localStorage.removeItem('github_token')
    }
    setIsLoading(false)
  }

  const loadStats = async () => {
    try {
      setStatsLoading(true)
      const families = await getModelFamilies()

      let totalModels = 0
      let totalVariants = 0

      // Load each family's data to count models and variants
      for (const family of families) {
        try {
          const familyData = await getFamilyData(family)
          totalModels += familyData.models.length

          // Count variants in each model
          for (const model of familyData.models) {
            const modelData = model.data as { variants?: unknown[] }
            if (modelData.variants && Array.isArray(modelData.variants)) {
              totalVariants += modelData.variants.length
            }
          }
        } catch (err) {
          console.error(`Failed to load family ${family}:`, err)
        }
      }

      setStats({
        families: families.length,
        models: totalModels,
        variants: totalVariants,
      })
    } catch (err) {
      console.error('Failed to load stats:', err)
    } finally {
      setStatsLoading(false)
    }
  }

  const loadRecentCommits = async () => {
    try {
      const commits = await getRecentCommits(5)
      setRecentCommits(commits)
    } catch (err) {
      console.error('Failed to load commits:', err)
    }
  }

  const handleLogin = () => {
    const scope = 'repo' // Need repo access to commit changes
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`
    window.location.href = authUrl
  }

  const handleLogout = () => {
    localStorage.removeItem('github_token')
    setIsAuthenticated(false)
    setUser(null)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
    return `${jst.getUTCMonth() + 1}/${jst.getUTCDate()} ${jst.getUTCHours()}:${String(jst.getUTCMinutes()).padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">読み込み中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
            AIwiki 管理画面
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            管理画面にアクセスするにはGitHubでログインしてください
          </p>
          {GITHUB_CLIENT_ID ? (
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
              GitHubでログイン
            </button>
          ) : (
            <div className="text-red-600 text-center">
              GitHub OAuth が設定されていません。<br />
              環境変数 NEXT_PUBLIC_GITHUB_CLIENT_ID を設定してください。
            </div>
          )}
        </div>
      </div>
    )
  }

  // Authenticated - show admin dashboard
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            AIwiki 管理画面
          </h1>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-8 h-8 rounded-full"
                />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Models Card */}
          <a
            href={`/${locale}/admin/models/`}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-3">📦</div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              モデル管理
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              モデルの追加・編集・削除
            </p>
          </a>

          {/* Families Card */}
          <a
            href={`/${locale}/admin/families/`}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-3">📁</div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              ファミリー管理
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              モデルファミリーの追加・編集
            </p>
          </a>

          {/* Analytics Card */}
          <a
            href={`/${locale}/admin/analytics/`}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-3">📊</div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              アナリティクス
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              PV・ユニークビジター・アクセス解析
            </p>
          </a>

          {/* Validation Card */}
          <a
            href={`/${locale}/admin/validation/`}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-3">🔍</div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              データ整合性チェック
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              壊れたデータ・必須項目欠けを検出
            </p>
          </a>

          {/* Deploy Status Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-3xl mb-3">🚀</div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              デプロイ状況
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              変更を保存すると自動でデプロイされます
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            サイト統計
          </h2>
          {statsLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">統計を読み込み中...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">{stats.families}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">ファミリー</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{stats.models}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">モデル</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">{stats.variants}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">バリアント</div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Changes */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            最近の変更
          </h2>
          {recentCommits.length > 0 ? (
            <div className="space-y-3">
              {recentCommits.map((commit) => (
                <a
                  key={commit.sha}
                  href={commit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                        {commit.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">
                          {commit.sha}
                        </span>
                        {' '}by {commit.author}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(commit.date)}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">コミット履歴を読み込み中...</p>
          )}
        </div>
      </main>
    </div>
  )
}

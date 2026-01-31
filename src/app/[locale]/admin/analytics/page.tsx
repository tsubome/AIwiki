'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { isAuthenticated, getCurrentUser, logout } from '@/lib/github-api'

interface DailyData {
  date: string
  pageViews: number
  requests: number
  uniques: number
}

interface CountryData {
  country: string
  pageViews: number
  requests: number
  uniques: number
}

interface AnalyticsData {
  daily: DailyData[]
  totals: {
    pageViews: number
    requests: number
    uniques: number
  }
  countries: CountryData[]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params.locale as string) || 'ja'
  const [user, setUser] = useState<{ login: string; avatar_url: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [days, setDays] = useState(30)
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/${locale}/admin/`)
      return
    }
    loadUser()
  }, [router, locale])

  useEffect(() => {
    if (user) {
      loadAnalytics()
    }
  }, [user, days])

  const loadUser = async () => {
    try {
      const userInfo = await getCurrentUser()
      setUser(userInfo)
    } catch (err) {
      setError(err instanceof Error ? err.message : '認証エラー')
      setIsLoading(false)
    }
  }

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/analytics?metric=daily&days=${days}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'データの取得に失敗しました')
      }

      const result = await response.json()

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
      }

      const zones = result.data?.viewer?.zones
      if (!zones || zones.length === 0) {
        throw new Error('ゾーンデータが見つかりません')
      }

      const groups = zones[0].httpRequests1dGroups || []

      // Process daily data
      const daily: DailyData[] = groups.map((item: {
        dimensions: { date: string }
        sum: { pageViews: number; requests: number }
        uniq: { uniques: number }
      }) => ({
        date: item.dimensions.date,
        pageViews: item.sum.pageViews,
        requests: item.sum.requests,
        uniques: item.uniq.uniques,
      }))

      // Calculate totals
      const totals = daily.reduce(
        (acc, item) => ({
          pageViews: acc.pageViews + item.pageViews,
          requests: acc.requests + item.requests,
          uniques: acc.uniques + item.uniques,
        }),
        { pageViews: 0, requests: 0, uniques: 0 }
      )

      // Country data would need a separate API call
      // For now, set empty array
      const countries: CountryData[] = []

      setData({ daily, totals, countries })
    } catch (err) {
      console.error('Analytics error:', err)
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push(`/${locale}/admin/`)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ja-JP').format(num)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  // Simple bar chart component
  const BarChart = ({ data, maxValue }: { data: DailyData[]; maxValue: number }) => {
    if (data.length === 0) return null

    return (
      <div className="flex items-end gap-1 h-40">
        {data.slice(-30).map((item, index) => {
          const height = maxValue > 0 ? (item.pageViews / maxValue) * 100 : 0
          return (
            <div
              key={item.date}
              className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors rounded-t cursor-pointer group relative"
              style={{ height: `${Math.max(height, 2)}%` }}
              title={`${item.date}: ${formatNumber(item.pageViews)} PV`}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                {item.date}<br />
                {formatNumber(item.pageViews)} PV
              </div>
            </div>
          )
        })}
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
              アナリティクス
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
        {/* Period Selector */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-gray-700 dark:text-gray-300 font-medium">期間:</span>
          <div className="flex gap-2">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  days === d
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                過去{d}日
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">エラー</p>
            <p>{error}</p>
            <p className="text-sm mt-2">
              Cloudflare APIトークンとZone IDが正しく設定されているか確認してください。
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600 dark:text-gray-400">読み込み中...</span>
          </div>
        ) : data ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  ページビュー
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {formatNumber(data.totals.pageViews)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  過去{days}日間
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  ユニークビジター
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatNumber(data.totals.uniques)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  過去{days}日間
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  総リクエスト数
                </div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {formatNumber(data.totals.requests)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  過去{days}日間
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                日別ページビュー
              </h2>
              {data.daily.length > 0 ? (
                <>
                  <BarChart
                    data={data.daily}
                    maxValue={Math.max(...data.daily.map((d) => d.pageViews))}
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>{data.daily.length > 0 ? formatDate(data.daily[0].date) : ''}</span>
                    <span>{data.daily.length > 0 ? formatDate(data.daily[data.daily.length - 1].date) : ''}</span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">データがありません</p>
              )}
            </div>

            {/* Daily Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 p-6 pb-4">
                日別データ
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        日付
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ページビュー
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ユニークビジター
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        リクエスト
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[...data.daily].reverse().map((item) => (
                      <tr key={item.date} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                          {formatNumber(item.pageViews)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400">
                          {formatNumber(item.uniques)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                          {formatNumber(item.requests)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  )
}

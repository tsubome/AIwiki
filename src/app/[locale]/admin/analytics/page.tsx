'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { isAuthenticated, getCurrentUser, logout } from '@/lib/github-api'

interface TimeData {
  date: string
  pageViews: number
  requests: number
  uniques: number
}

interface TopPageData {
  path: string
  count: number
}

interface AnalyticsData {
  data: TimeData[]
  totals: {
    pageViews: number
    requests: number
    uniques: number
  }
  topPages: TopPageData[]
  topPagesError?: string
  isHourly: boolean
}

// Cache key and duration
const CACHE_KEY = 'aiwiki_analytics_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface CacheEntry {
  data: AnalyticsData
  days: number
  timestamp: number
}

function getCache(days: number): AnalyticsData | null {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (!cached) return null
    const entry: CacheEntry = JSON.parse(cached)
    if (entry.days !== days) return null
    if (Date.now() - entry.timestamp > CACHE_DURATION) return null
    return entry.data
  } catch {
    return null
  }
}

function setCache(days: number, data: AnalyticsData): void {
  try {
    const entry: CacheEntry = { data, days, timestamp: Date.now() }
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // Ignore storage errors
  }
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

  const loadAnalytics = async (forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh) {
      const cached = getCache(days)
      if (cached) {
        setData(cached)
        setIsLoading(false)
        return
      }
    }

    try {
      setIsLoading(true)
      setError(null)

      const isHourly = days === 1
      const metric = isHourly ? 'hourly' : 'daily'
      const response = await fetch(`/api/analytics?metric=${metric}&days=${days}`)

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

      let timeData: TimeData[] = []

      if (isHourly) {
        const groups = zones[0].httpRequests1hGroups || []
        timeData = groups.map((item: {
          dimensions: { datetime: string }
          sum: { pageViews: number; requests: number }
          uniq: { uniques: number }
        }) => ({
          date: item.dimensions.datetime,
          pageViews: item.sum.pageViews,
          requests: item.sum.requests,
          uniques: item.uniq.uniques,
        }))
      } else {
        const groups = zones[0].httpRequests1dGroups || []
        timeData = groups.map((item: {
          dimensions: { date: string }
          sum: { pageViews: number; requests: number }
          uniq: { uniques: number }
        }) => ({
          date: item.dimensions.date,
          pageViews: item.sum.pageViews,
          requests: item.sum.requests,
          uniques: item.uniq.uniques,
        }))
      }

      // Calculate totals
      const totals = timeData.reduce(
        (acc, item) => ({
          pageViews: acc.pageViews + item.pageViews,
          requests: acc.requests + item.requests,
          uniques: acc.uniques + item.uniques,
        }),
        { pageViews: 0, requests: 0, uniques: 0 }
      )

      // Fetch top pages
      let topPages: TopPageData[] = []
      let topPagesError: string | undefined
      try {
        const topPagesResponse = await fetch(`/api/analytics?metric=topPages&days=${days}`)
        if (topPagesResponse.ok) {
          const topPagesResult = await topPagesResponse.json()

          // Check for GraphQL errors
          if (topPagesResult.errors && topPagesResult.errors.length > 0) {
            topPagesError = topPagesResult.errors[0].message
          } else {
            const topPagesZones = topPagesResult.data?.viewer?.zones
            if (topPagesZones && topPagesZones.length > 0) {
              const groups = topPagesZones[0].httpRequestsAdaptiveGroups || []

              // Aggregate by path (removing locale and trailing slash)
              const pathCounts: Record<string, number> = {}
              groups.forEach((item: {
                count: number
                dimensions: { clientRequestPath: string }
              }) => {
                const rawPath = item.dimensions?.clientRequestPath
                if (rawPath && rawPath.includes('/models/')) {
                  // Normalize path: remove locale prefix (/ja/, /en/) and trailing slash
                  const normalizedPath = rawPath
                    .replace(/^\/(ja|en)\//, '/')
                    .replace(/\/$/, '')
                  pathCounts[normalizedPath] = (pathCounts[normalizedPath] || 0) + (item.count || 0)
                }
              })

              // Sort and take top 10
              topPages = Object.entries(pathCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([path, count]) => ({ path, count }))
            }
          }
        } else {
          topPagesError = 'APIリクエストに失敗しました'
        }
      } catch (err) {
        console.error('Failed to load top pages:', err)
        topPagesError = err instanceof Error ? err.message : 'データ取得エラー'
      }

      const analyticsData: AnalyticsData = { data: timeData, totals, topPages, topPagesError, isHourly }
      setData(analyticsData)
      setCache(days, analyticsData)
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

  // Convert to JST and format
  const toJST = (dateStr: string) => {
    const date = new Date(dateStr)
    // Add 9 hours for JST (UTC+9)
    return new Date(date.getTime() + 9 * 60 * 60 * 1000)
  }

  const formatDate = (dateStr: string, isHourly: boolean) => {
    const date = toJST(dateStr)
    if (isHourly) {
      return `${date.getUTCHours()}:00`
    }
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`
  }

  const formatFullDate = (dateStr: string, isHourly: boolean) => {
    const date = toJST(dateStr)
    if (isHourly) {
      return `${date.getUTCMonth() + 1}/${date.getUTCDate()} ${date.getUTCHours()}:00 JST`
    }
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
  }

  const getPeriodLabel = () => {
    if (days === 1) return '過去24時間'
    return `過去${days}日間`
  }

  // Export to Markdown
  const exportToMarkdown = () => {
    if (!data) return

    const now = new Date()
    const jstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)
    const dateStr = `${jstNow.getUTCFullYear()}-${String(jstNow.getUTCMonth() + 1).padStart(2, '0')}-${String(jstNow.getUTCDate()).padStart(2, '0')}`
    const timeStr = `${String(jstNow.getUTCHours()).padStart(2, '0')}:${String(jstNow.getUTCMinutes()).padStart(2, '0')}`

    // Calculate statistics
    const avgPV = data.data.length > 0 ? Math.round(data.totals.pageViews / data.data.length) : 0
    const avgUV = data.data.length > 0 ? Math.round(data.totals.uniques / data.data.length) : 0
    const maxPV = data.data.length > 0 ? Math.max(...data.data.map(d => d.pageViews)) : 0
    const minPV = data.data.length > 0 ? Math.min(...data.data.map(d => d.pageViews)) : 0
    const peakData = data.data.find(d => d.pageViews === maxPV)

    let md = `# AIwiki アナリティクスレポート\n\n`
    md += `**生成日時:** ${dateStr} ${timeStr} JST\n`
    md += `**期間:** ${getPeriodLabel()}\n`
    md += `**データ件数:** ${data.data.length}${data.isHourly ? '時間' : '日'}\n\n`

    // Summary
    md += `## サマリー\n\n`
    md += `### 合計\n\n`
    md += `| 指標 | 値 |\n`
    md += `|------|----|\n`
    md += `| ページビュー | ${formatNumber(data.totals.pageViews)} |\n`
    md += `| ユニークビジター | ${formatNumber(data.totals.uniques)} |\n`
    md += `| リクエスト数 | ${formatNumber(data.totals.requests)} |\n\n`

    md += `### 平均値（${data.isHourly ? '1時間あたり' : '1日あたり'}）\n\n`
    md += `| 指標 | 値 |\n`
    md += `|------|----|\n`
    md += `| 平均PV | ${formatNumber(avgPV)} |\n`
    md += `| 平均UV | ${formatNumber(avgUV)} |\n\n`

    md += `### ピーク\n\n`
    md += `| 指標 | 値 |\n`
    md += `|------|----|\n`
    md += `| 最大PV | ${formatNumber(maxPV)} |\n`
    md += `| 最小PV | ${formatNumber(minPV)} |\n`
    if (peakData) {
      md += `| ピーク${data.isHourly ? '時間' : '日'} | ${formatFullDate(peakData.date, data.isHourly)} |\n`
    }
    md += `\n`

    // Popular Models
    if (data.topPages.length > 0) {
      md += `## 人気モデルランキング（Top ${data.topPages.length}）\n\n`
      md += `| 順位 | ページ | アクセス数 | 全体比率 |\n`
      md += `|------|--------|------------|----------|\n`
      const totalTopPages = data.topPages.reduce((sum, p) => sum + p.count, 0)
      data.topPages.forEach((page, index) => {
        const pathMatch = page.path.match(/\/models\/([^/]+)\/([^/]+)/)
        const displayName = pathMatch ? `${pathMatch[1]} / ${pathMatch[2]}` : page.path
        const ratio = totalTopPages > 0 ? ((page.count / totalTopPages) * 100).toFixed(1) : '0'
        md += `| ${index + 1} | ${displayName} | ${formatNumber(page.count)} | ${ratio}% |\n`
      })
      md += `\n`
    }

    // Daily/Hourly Data - Full table
    md += `## ${data.isHourly ? '時間別' : '日別'}詳細データ\n\n`
    md += `| ${data.isHourly ? '時間' : '日付'} | PV | UV | リクエスト | PV前日比 |\n`
    md += `|------|----|----|------------|----------|\n`
    const reversedData = [...data.data].reverse()
    reversedData.forEach((item, index) => {
      const prevItem = reversedData[index + 1]
      let change = '-'
      if (prevItem) {
        const diff = item.pageViews - prevItem.pageViews
        const pct = prevItem.pageViews > 0 ? ((diff / prevItem.pageViews) * 100).toFixed(1) : '0'
        change = diff >= 0 ? `+${pct}%` : `${pct}%`
      }
      md += `| ${formatFullDate(item.date, data.isHourly)} | ${formatNumber(item.pageViews)} | ${formatNumber(item.uniques)} | ${formatNumber(item.requests)} | ${change} |\n`
    })
    md += `\n`

    md += `---\n`
    md += `*このレポートは AIwiki 管理パネルから自動生成されました*\n`
    md += `*サイト: https://aiwiki.ara-tech.jp*\n`

    // Download
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aiwiki-analytics-${dateStr}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Simple bar chart component
  const BarChart = ({ data, maxValue, isHourly }: { data: TimeData[]; maxValue: number; isHourly: boolean }) => {
    if (data.length === 0) return null

    const displayData = isHourly ? data : data.slice(-30)

    return (
      <div className="flex items-end gap-1 h-40">
        {displayData.map((item) => {
          const height = maxValue > 0 ? (item.pageViews / maxValue) * 100 : 0
          return (
            <div
              key={item.date}
              className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors rounded-t cursor-pointer group relative"
              style={{ height: `${Math.max(height, 2)}%` }}
              title={`${formatFullDate(item.date, isHourly)}: ${formatNumber(item.pageViews)} PV`}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                {formatFullDate(item.date, isHourly)}<br />
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">期間:</span>
            <div className="flex gap-2">
              {[1, 7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    days === d
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {d === 1 ? '24時間' : `${d}日`}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => loadAnalytics(true)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              title="キャッシュを無視して再取得"
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              更新
            </button>
            {data && (
              <button
                onClick={exportToMarkdown}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                MDでエクスポート
              </button>
            )}
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
                  {getPeriodLabel()}
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
                  {getPeriodLabel()}
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
                  {getPeriodLabel()}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                {data.isHourly ? '時間別ページビュー' : '日別ページビュー'}
              </h2>
              {data.data.length > 0 ? (
                <>
                  <BarChart
                    data={data.data}
                    maxValue={Math.max(...data.data.map((d) => d.pageViews))}
                    isHourly={data.isHourly}
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>{data.data.length > 0 ? formatDate(data.data[0].date, data.isHourly) : ''}</span>
                    <span>{data.data.length > 0 ? formatDate(data.data[data.data.length - 1].date, data.isHourly) : ''}</span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">データがありません</p>
              )}
            </div>

            {/* Popular Models Ranking */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  人気モデルランキング
                </h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">過去24時間</span>
              </div>
              {data.topPages.length > 0 ? (
                <div className="space-y-3">
                  {data.topPages.map((page, index) => {
                    // Extract model info from path
                    const pathMatch = page.path.match(/\/models\/([^/]+)\/([^/]+)/)
                    const family = pathMatch ? pathMatch[1] : ''
                    const model = pathMatch ? pathMatch[2] : page.path
                    const maxCount = data.topPages[0]?.count || 1
                    const percentage = (page.count / maxCount) * 100

                    return (
                      <div key={page.path} className="flex items-center gap-4">
                        <div className="w-8 text-center">
                          <span className={`font-bold ${index < 3 ? 'text-yellow-500' : 'text-gray-400'}`}>
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <a
                              href={page.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline truncate"
                            >
                              {family && model ? `${family} / ${model}` : page.path}
                            </a>
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                              {formatNumber(page.count)}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="mb-2">データを取得できませんでした</p>
                  {data.topPagesError ? (
                    <p className="text-xs text-red-500">{data.topPagesError}</p>
                  ) : (
                    <p className="text-xs">Cloudflare Pro プラン以上が必要な可能性があります</p>
                  )}
                </div>
              )}
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 p-6 pb-4">
                {data.isHourly ? '時間別データ' : '日別データ'}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {data.isHourly ? '時間' : '日付'}
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
                    {[...data.data].reverse().map((item) => (
                      <tr key={item.date} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {formatFullDate(item.date, data.isHourly)}
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

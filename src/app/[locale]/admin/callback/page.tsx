'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter, useParams } from 'next/navigation'

function CallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string || 'ja'
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      exchangeCodeForToken(code)
    } else {
      setError('認証コードが見つかりません')
    }
  }, [searchParams])

  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await fetch('/api/auth/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error('トークンの取得に失敗しました')
      }

      const data = await response.json()

      if (data.access_token) {
        localStorage.setItem('github_token', data.access_token)
        router.push(`/${locale}/admin/`)
      } else {
        throw new Error(data.error || '認証に失敗しました')
      }
    } catch (err) {
      console.error('OAuth error:', err)
      setError(err instanceof Error ? err.message : '認証に失敗しました')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-600 text-xl mb-4">認証エラー</div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <a
            href={`/${locale}/admin/`}
            className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            ログイン画面に戻る
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">認証中...</p>
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}

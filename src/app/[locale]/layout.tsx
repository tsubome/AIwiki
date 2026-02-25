import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/routing'
import Header from '@/components/Header'
import { ThemeProvider } from '@/components/ThemeProvider'
import { DATA_GENERATED_AT } from '@/lib/generated-data'
import '../globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Enable static rendering for this locale
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
              {children}
            </main>
            <footer className="border-t border-gray-200 dark:border-gray-700 mt-8 sm:mt-16 py-6 sm:py-8 text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm px-4">
              <div className="mb-2">AIwiki - Local LLM Information Wiki</div>
              <div className="flex justify-center gap-4 mb-2">
                <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">
                  Privacy Policy
                </Link>
                <a
                  href="https://github.com/tsubome/AIwiki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-700 dark:hover:text-gray-300"
                >
                  GitHub
                </a>
                <a href="https://ara-tech.jp" className="hover:text-gray-700 dark:hover:text-gray-300">
                  ARA technology
                </a>
              </div>
              <div className="text-gray-400 dark:text-gray-500 text-xs">
                Data updated: {new Date(DATA_GENERATED_AT).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
              </div>
            </footer>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

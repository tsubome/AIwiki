'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const t = useTranslations('common')

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600">
                {t('siteName')}
              </span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                {t('home')}
              </Link>
              <Link
                href="/models"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                {t('models')}
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}

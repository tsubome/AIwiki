'use client'

import { useLocale } from 'next-intl'

export default function LanguageSwitcher() {
  const currentLocale = useLocale()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value

    // Get current URL and replace locale in path
    const currentPath = window.location.pathname

    // Replace the locale prefix: /ja/... -> /en/... or /ja -> /en
    let newPath: string
    if (currentPath.match(/^\/(ja|en)\//)) {
      // Path like /ja/models -> /en/models
      newPath = currentPath.replace(/^\/(ja|en)\//, `/${newLocale}/`)
    } else if (currentPath.match(/^\/(ja|en)$/)) {
      // Path like /ja -> /en
      newPath = `/${newLocale}`
    } else {
      // Fallback: just go to the new locale root
      newPath = `/${newLocale}`
    }

    window.location.href = newPath
  }

  return (
    <select
      value={currentLocale}
      onChange={handleChange}
      className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
    >
      <option value="ja">日本語</option>
      <option value="en">English</option>
    </select>
  )
}

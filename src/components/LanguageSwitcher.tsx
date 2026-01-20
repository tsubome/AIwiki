'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(pathname, { locale: e.target.value })
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="bg-gray-100 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
    >
      <option value="ja">日本語</option>
      <option value="en">English</option>
    </select>
  )
}

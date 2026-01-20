import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { prisma } from '@/lib/prisma'
import ModelCard from '@/components/ModelCard'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function HomePage() {
  const t = await getTranslations('home')

  const latestModels = await prisma.lLMModel.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  return (
    <div>
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </section>

      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('latestModels')}
          </h2>
          <Link
            href="/models"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {t('viewAll')} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>
    </div>
  )
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 全モデルを取得
    const allModels = await prisma.lLMModel.findMany({
      include: {
        children: true,
        parent: true,
        ggufFiles: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    // ルートモデル（親がないモデル）
    const rootModels = allModels.filter(m => !m.parentId)

    // 統計情報
    const stats = {
      totalModels: allModels.length,
      rootModels: rootModels.length,
      modelsByType: allModels.reduce((acc, m) => {
        acc[m.modelType] = (acc[m.modelType] || 0) + 1
        return acc
      }, {} as Record<string, number>),
    }

    return NextResponse.json({
      success: true,
      stats,
      rootModels: rootModels.map(m => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        modelType: m.modelType,
        childrenCount: m.children.length,
        children: m.children.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          modelType: c.modelType,
        })),
      })),
      allModels: allModels.map(m => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        modelType: m.modelType,
        parentId: m.parentId,
        parentName: m.parent?.name,
      })),
    }, { status: 200 })
  } catch (error) {
    console.error('Debug API Error:', error)
    return NextResponse.json({
      success: false,
      error: String(error),
    }, { status: 500 })
  }
}

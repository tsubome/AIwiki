import type { ModelWithChildren } from './model-service'

// ソートオプションの型定義
export type SortOption =
  | 'newest'
  | 'oldest'
  | 'params-desc'
  | 'params-asc'
  | 'name-asc'
  | 'name-desc'
  | 'developer'
  | 'context'
  | 'variants'

export type DisplayMode = 'family' | 'model'

// ソートオプションのリスト
export const sortOptions: SortOption[] = [
  'newest',
  'oldest',
  'params-desc',
  'params-asc',
  'name-asc',
  'name-desc',
  'developer',
  'context',
  'variants',
]

// パラメータ文字列を数値に変換（比較用）
// "7B" -> 7, "70B" -> 70, "1.3B" -> 1.3, "Unknown" -> 0
export function parseParameters(params: string | null | undefined): number {
  if (!params) return 0
  const match = params.match(/^([\d.]+)B?$/i)
  if (match) {
    return parseFloat(match[1])
  }
  return 0
}

// モデルの最大パラメータサイズを取得
export function getMaxParameters(model: ModelWithChildren): number {
  // まず variants から最大を探す
  if (model.variants && model.variants.length > 0) {
    const variantParams = model.variants.map(v => {
      // parameterDetails.total があればそれを使う
      if (v.parameterDetails?.total) {
        return parseParameters(v.parameterDetails.total)
      }
      return parseParameters(v.parameters)
    })
    const maxVariant = Math.max(...variantParams)
    if (maxVariant > 0) return maxVariant
  }

  // variants がなければモデル自体の parameters
  return parseParameters(model.parameters)
}

// モデルの最小パラメータサイズを取得
export function getMinParameters(model: ModelWithChildren): number {
  if (model.variants && model.variants.length > 0) {
    const variantParams = model.variants
      .map(v => {
        if (v.parameterDetails?.total) {
          return parseParameters(v.parameterDetails.total)
        }
        return parseParameters(v.parameters)
      })
      .filter(p => p > 0)

    if (variantParams.length > 0) {
      return Math.min(...variantParams)
    }
  }

  return parseParameters(model.parameters)
}

// モデルのコンテキスト長を取得
export function getContextLength(model: ModelWithChildren): number {
  return model.contextLength || 0
}

// モデルのバリアント数を取得
export function getVariantCount(model: ModelWithChildren): number {
  return model.variants?.length || 0
}

// ファミリーの総バリアント数を取得
export function getFamilyVariantCount(family: ModelWithChildren): number {
  let count = getVariantCount(family)

  // 子モデルのバリアントも含める
  for (const child of family.children) {
    count += getVariantCount(child)
  }

  return count
}

// リリース日をタイムスタンプに変換
export function getReleaseTimestamp(model: ModelWithChildren): number {
  if (!model.releaseDate) return 0
  return new Date(model.releaseDate).getTime()
}

// ファミリー内の最新リリース日を取得
export function getFamilyNewestDate(family: ModelWithChildren): number {
  let newest = getReleaseTimestamp(family)

  for (const child of family.children) {
    const childDate = getReleaseTimestamp(child)
    if (childDate > newest) {
      newest = childDate
    }
  }

  return newest
}

// ファミリー内の最古リリース日を取得
export function getFamilyOldestDate(family: ModelWithChildren): number {
  let oldest = getReleaseTimestamp(family) || Infinity

  for (const child of family.children) {
    const childDate = getReleaseTimestamp(child)
    if (childDate > 0 && childDate < oldest) {
      oldest = childDate
    }
  }

  return oldest === Infinity ? 0 : oldest
}

// ファミリー内の最大パラメータを取得
export function getFamilyMaxParameters(family: ModelWithChildren): number {
  let max = getMaxParameters(family)

  for (const child of family.children) {
    const childMax = getMaxParameters(child)
    if (childMax > max) {
      max = childMax
    }
  }

  return max
}

// ファミリー内の最小パラメータを取得
export function getFamilyMinParameters(family: ModelWithChildren): number {
  let min = getMinParameters(family)
  if (min === 0) min = Infinity

  for (const child of family.children) {
    const childMin = getMinParameters(child)
    if (childMin > 0 && childMin < min) {
      min = childMin
    }
  }

  return min === Infinity ? 0 : min
}

// ファミリー内の最大コンテキスト長を取得
export function getFamilyMaxContext(family: ModelWithChildren): number {
  let max = getContextLength(family)

  for (const child of family.children) {
    const childContext = getContextLength(child)
    if (childContext > max) {
      max = childContext
    }
  }

  return max
}

// モデル配列をソート
export function sortModels(models: ModelWithChildren[], sortBy: SortOption): ModelWithChildren[] {
  const sorted = [...models]

  sorted.sort((a, b) => {
    let result = 0

    switch (sortBy) {
      case 'newest':
        result = getReleaseTimestamp(b) - getReleaseTimestamp(a)
        break
      case 'oldest':
        result = getReleaseTimestamp(a) - getReleaseTimestamp(b)
        break
      case 'params-desc':
        result = getMaxParameters(b) - getMaxParameters(a)
        break
      case 'params-asc':
        result = getMinParameters(a) - getMinParameters(b)
        break
      case 'name-asc':
        result = a.name.localeCompare(b.name)
        break
      case 'name-desc':
        result = b.name.localeCompare(a.name)
        break
      case 'developer':
        result = (a.developer || '').localeCompare(b.developer || '')
        break
      case 'context':
        result = getContextLength(b) - getContextLength(a)
        break
      case 'variants':
        result = getVariantCount(b) - getVariantCount(a)
        break
    }

    // タイブレーク: 名前順
    if (result === 0) {
      result = a.name.localeCompare(b.name)
    }

    return result
  })

  return sorted
}

// ファミリー配列をソート（内部モデルもソート）
export function sortFamilies(families: ModelWithChildren[], sortBy: SortOption): ModelWithChildren[] {
  const sorted = [...families]

  sorted.sort((a, b) => {
    let result = 0

    switch (sortBy) {
      case 'newest':
        result = getFamilyNewestDate(b) - getFamilyNewestDate(a)
        break
      case 'oldest':
        result = getFamilyOldestDate(a) - getFamilyOldestDate(b)
        break
      case 'params-desc':
        result = getFamilyMaxParameters(b) - getFamilyMaxParameters(a)
        break
      case 'params-asc':
        result = getFamilyMinParameters(a) - getFamilyMinParameters(b)
        break
      case 'name-asc':
        result = a.name.localeCompare(b.name)
        break
      case 'name-desc':
        result = b.name.localeCompare(a.name)
        break
      case 'developer':
        result = (a.developer || '').localeCompare(b.developer || '')
        break
      case 'context':
        result = getFamilyMaxContext(b) - getFamilyMaxContext(a)
        break
      case 'variants':
        result = getFamilyVariantCount(b) - getFamilyVariantCount(a)
        break
    }

    // タイブレーク: 名前順
    if (result === 0) {
      result = a.name.localeCompare(b.name)
    }

    return result
  })

  // 各ファミリー内のモデルもソート
  return sorted.map(family => ({
    ...family,
    children: sortModels(family.children, sortBy),
  }))
}

// 全モデルをフラットに取得（ファミリー + 子モデル）
export function flattenModels(families: ModelWithChildren[]): ModelWithChildren[] {
  const allModels: ModelWithChildren[] = []

  for (const family of families) {
    // ファミリー自体を追加
    allModels.push(family)

    // 子モデルを追加
    for (const child of family.children) {
      allModels.push(child)
    }
  }

  return allModels
}

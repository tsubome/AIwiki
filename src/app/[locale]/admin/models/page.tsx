'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import {
  getModelFamilies,
  getFamilyData,
  getModelData,
  saveModelData,
  deleteModel,
  isAuthenticated,
  getCurrentUser,
  logout,
} from '@/lib/github-api'

interface ModelInfo {
  family: string
  slug: string
  name: string
  developer?: string
  releaseDate?: string
  variantCount: number
}

interface Variant {
  name: string
  slug: string
  parameters: string
  parameterDetails?: {
    active: string
    total: string
    experts?: number
  }
  description?: { ja?: string; en?: string }
  baseModel?: string
  huggingface?: string
  requirements?: {
    minVram?: string
    recommendedVram?: string
    ram?: string
  }
  gguf: Array<{
    name: string
    size?: string
    url: string
    recommended?: boolean
  }>
}

interface ModelData {
  name: string
  slug: string
  releaseDate?: string
  developer?: string
  license?: string
  modelType: string
  baseModel?: string
  description?: { ja?: string; en?: string }
  tags?: string[]
  specs?: {
    contextLength?: number
    languages?: string[]
    architecture?: string
  }
  links?: {
    huggingface?: string
    github?: string
    paper?: string
    website?: string
  }
  variants: Variant[]
}

function ModelsPageContent() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string || 'ja'
  const searchParams = useSearchParams()
  const editFamily = searchParams.get('family')
  const editSlug = searchParams.get('slug')
  const isEditing = editFamily && editSlug

  const [models, setModels] = useState<ModelInfo[]>([])
  const [filteredModels, setFilteredModels] = useState<ModelInfo[]>([])
  const [families, setFamilies] = useState<string[]>([])
  const [selectedFamily, setSelectedFamily] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ login: string; avatar_url: string } | null>(null)

  // Editor state
  const [editingModel, setEditingModel] = useState<ModelData | null>(null)
  const [editingSha, setEditingSha] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<ModelData>({
    name: '',
    slug: '',
    modelType: 'BASE',
    variants: [],
  })
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [variants, setVariants] = useState<Variant[]>([])

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/${locale}/admin/`)
      return
    }
    loadData()
  }, [router])

  // Set initial family filter from URL if not editing
  useEffect(() => {
    if (!isEditing && editFamily) {
      setSelectedFamily(editFamily)
    }
  }, [editFamily, isEditing])

  useEffect(() => {
    filterModels()
  }, [models, selectedFamily, searchQuery])

  useEffect(() => {
    if (isEditing) {
      loadEditingModel()
    } else {
      setEditingModel(null)
      setEditingSha(null)
    }
  }, [editFamily, editSlug])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get user info
      const userInfo = await getCurrentUser()
      setUser(userInfo)

      // Get all families
      const familyList = await getModelFamilies()
      setFamilies(familyList)

      // Get all models from all families
      const allModels: ModelInfo[] = []

      for (const family of familyList) {
        try {
          const familyData = await getFamilyData(family)
          for (const model of familyData.models) {
            const data = model.data as {
              name: string
              developer?: string
              releaseDate?: string
              variants?: unknown[]
            }
            allModels.push({
              family,
              slug: model.slug,
              name: data.name,
              developer: data.developer,
              releaseDate: data.releaseDate,
              variantCount: data.variants?.length || 0,
            })
          }
        } catch (err) {
          console.error(`Failed to load family ${family}:`, err)
        }
      }

      setModels(allModels)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'データの読み込みに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const loadEditingModel = async () => {
    if (!editFamily || !editSlug) return

    try {
      setIsLoading(true)
      setError(null)

      if (editSlug === 'new') {
        setEditingModel(null)
        setEditingSha(null)
        setFormData({
          name: '',
          slug: '',
          modelType: 'BASE',
          variants: [],
        })
        setTags([])
        setVariants([])
      } else {
        const { data, sha } = await getModelData(editFamily, editSlug)
        const modelData = data as ModelData
        setEditingModel(modelData)
        setEditingSha(sha)
        setFormData(modelData)
        setTags(modelData.tags || [])
        setVariants(modelData.variants || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'モデルの読み込みに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const filterModels = () => {
    let filtered = [...models]

    if (selectedFamily !== 'all') {
      filtered = filtered.filter(m => m.family === selectedFamily)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        m =>
          m.name.toLowerCase().includes(query) ||
          m.developer?.toLowerCase().includes(query) ||
          m.slug.toLowerCase().includes(query)
      )
    }

    // Sort by release date (newest first)
    filtered.sort((a, b) => {
      if (!a.releaseDate) return 1
      if (!b.releaseDate) return -1
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    })

    setFilteredModels(filtered)
  }

  const handleLogout = () => {
    logout()
    router.push(`/${locale}/admin/`)
  }

  const handleEdit = (family: string, slug: string) => {
    router.push(`/${locale}/admin/models/?family=${family}&slug=${slug}`)
  }

  const handleCloseEditor = () => {
    router.push(`/${locale}/admin/models/`)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNestedChange = (
    section: 'description' | 'specs' | 'links',
    field: string,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }))
  }

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        name: '',
        slug: '',
        parameters: '',
        gguf: [],
      },
    ])
  }

  const updateVariant = (index: number, field: string, value: unknown) => {
    setVariants(
      variants.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    )
  }

  const updateVariantNested = (
    index: number,
    section: 'description' | 'requirements',
    field: string,
    value: string
  ) => {
    setVariants(
      variants.map((v, i) =>
        i === index
          ? {
              ...v,
              [section]: {
                ...(v[section] || {}),
                [field]: value,
              },
            }
          : v
      )
    )
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editFamily) return

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const dataToSave: ModelData = {
        ...formData,
        tags: tags.length > 0 ? tags : undefined,
        variants: variants.filter(v => v.name && v.slug),
      }

      // Clean up empty optional fields
      if (!dataToSave.releaseDate) delete dataToSave.releaseDate
      if (!dataToSave.developer) delete dataToSave.developer
      if (!dataToSave.license) delete dataToSave.license
      if (!dataToSave.baseModel) delete dataToSave.baseModel

      await saveModelData(
        editFamily,
        formData.slug,
        dataToSave,
        editingSha || undefined
      )

      setSuccess('保存しました！GitHub Actionsで自動デプロイが開始されます。')

      // Refresh data
      if (editSlug === 'new') {
        router.push(`/${locale}/admin/models/?family=${editFamily}&slug=${formData.slug}`)
      }
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editFamily || !editSlug || editSlug === 'new') return
    if (!confirm('本当にこのモデルを削除しますか？この操作は取り消せません。')) {
      return
    }

    try {
      if (editingSha) {
        await deleteModel(editFamily, editSlug, editingSha)
        router.push(`/${locale}/admin/models/`)
        loadData()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditing ? 'モデルを読み込み中...' : 'モデルデータを読み込み中...'}
          </p>
        </div>
      </div>
    )
  }

  // Editor View
  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCloseEditor}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                ← モデル一覧
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {editSlug === 'new' ? `新規モデル作成 (${editFamily})` : `${editingModel?.name || editSlug} を編集`}
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

        <main className="max-w-4xl mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">基本情報</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">名前 *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">スラッグ *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    disabled={editSlug !== 'new'}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">開発者</label>
                  <input
                    type="text"
                    name="developer"
                    value={formData.developer || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">リリース日</label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ライセンス</label>
                  <input
                    type="text"
                    name="license"
                    value={formData.license || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">モデルタイプ</label>
                  <select
                    name="modelType"
                    value={formData.modelType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  >
                    <option value="BASE">BASE</option>
                    <option value="FINETUNE">FINETUNE</option>
                    <option value="MERGE">MERGE</option>
                    <option value="INSTRUCT">INSTRUCT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ベースモデル</label>
                  <input
                    type="text"
                    name="baseModel"
                    value={formData.baseModel || ''}
                    onChange={handleInputChange}
                    placeholder="例: llama-3.1"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">説明</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">日本語</label>
                  <textarea
                    value={formData.description?.ja || ''}
                    onChange={e => handleNestedChange('description', 'ja', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">英語</label>
                  <textarea
                    value={formData.description?.en || ''}
                    onChange={e => handleNestedChange('description', 'en', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">タグ</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(i)} className="hover:text-blue-600">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="タグを追加"
                  className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  追加
                </button>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">バリアント</h2>
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  + 追加
                </button>
              </div>
              <div className="space-y-4">
                {variants.map((variant, i) => (
                  <div key={i} className="border dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {variant.name || '新規バリアント'}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="text-red-600 hover:text-red-800"
                      >
                        削除
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">名前</label>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={e => updateVariant(i, 'name', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">スラッグ</label>
                        <input
                          type="text"
                          value={variant.slug}
                          onChange={e => updateVariant(i, 'slug', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">パラメータ</label>
                        <input
                          type="text"
                          value={variant.parameters}
                          onChange={e => updateVariant(i, 'parameters', e.target.value)}
                          placeholder="7B, 70B, etc."
                          className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">ベースモデル</label>
                        <input
                          type="text"
                          value={variant.baseModel || ''}
                          onChange={e => updateVariant(i, 'baseModel', e.target.value)}
                          placeholder="qwen2-5, llama-3.1, etc."
                          className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">HuggingFace URL</label>
                        <input
                          type="text"
                          value={variant.huggingface || ''}
                          onChange={e => updateVariant(i, 'huggingface', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">最小VRAM</label>
                        <input
                          type="text"
                          value={variant.requirements?.minVram || ''}
                          onChange={e => updateVariantNested(i, 'requirements', 'minVram', e.target.value)}
                          placeholder="16GB"
                          className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
                        />
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">説明 (日本語)</label>
                        <input
                          type="text"
                          value={variant.description?.ja || ''}
                          onChange={e => updateVariantNested(i, 'description', 'ja', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">説明 (英語)</label>
                        <input
                          type="text"
                          value={variant.description?.en || ''}
                          onChange={e => updateVariantNested(i, 'description', 'en', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {variants.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">バリアントがありません</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? '保存中...' : '保存'}
              </button>
              {editSlug !== 'new' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  削除
                </button>
              )}
              <button
                type="button"
                onClick={handleCloseEditor}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                キャンセル
              </button>
            </div>
          </form>
        </main>
      </div>
    )
  }

  // List View
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href={`/${locale}/admin/`} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              ← ダッシュボード
            </a>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              モデル管理
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
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="検索..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <select
                value={selectedFamily}
                onChange={e => setSelectedFamily(e.target.value)}
                className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="all">すべてのファミリー</option>
                {families.map(f => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <a
                href={`/${locale}/admin/models/new/`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + 新規作成
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 text-gray-600 dark:text-gray-400">
          {filteredModels.length} 件のモデル
          {selectedFamily !== 'all' && ` (${selectedFamily})`}
        </div>

        {/* Model List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  名前
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  ファミリー
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  開発者
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  リリース日
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  バリアント
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredModels.map(model => (
                <tr
                  key={`${model.family}/${model.slug}`}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(model.family, model.slug)}
                      className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600"
                    >
                      {model.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                      {model.family}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {model.developer || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {model.releaseDate || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {model.variantCount}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(model.family, model.slug)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      編集
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredModels.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              モデルが見つかりません
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function ModelsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
        </div>
      </div>
    }>
      <ModelsPageContent />
    </Suspense>
  )
}

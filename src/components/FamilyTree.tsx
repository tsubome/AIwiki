'use client'

import { useCallback, useMemo, useState, useEffect } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

type ModelNode = {
  id: string
  name: string
  slug: string
  modelType: string
  parentId: string | null
  developer?: string | null
}

type Props = {
  models: ModelNode[]
  currentModelId: string
}

const modelTypeColorsLight: Record<string, { bg: string; border: string; text: string }> = {
  BASE: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
  FINETUNE: { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
  MERGE: { bg: '#f3e8ff', border: '#a855f7', text: '#6b21a8' },
  QUANTIZED: { bg: '#ffedd5', border: '#f97316', text: '#9a3412' },
}

const modelTypeColorsDark: Record<string, { bg: string; border: string; text: string }> = {
  BASE: { bg: '#1e3a5f', border: '#60a5fa', text: '#93c5fd' },
  FINETUNE: { bg: '#14532d', border: '#4ade80', text: '#86efac' },
  MERGE: { bg: '#3b0764', border: '#c084fc', text: '#d8b4fe' },
  QUANTIZED: { bg: '#431407', border: '#fb923c', text: '#fdba74' },
}

export default function FamilyTree({ models, currentModelId }: Props) {
  const router = useRouter()
  const t = useTranslations('modelType')
  const tTree = useTranslations('familyTree')
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const modelTypeColors = isDark ? modelTypeColorsDark : modelTypeColorsLight

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFinetuned, setShowFinetuned] = useState(true)

  // Filter models based on showFinetuned
  const filteredModels = useMemo(() => {
    if (showFinetuned) return models
    return models.filter(m => m.modelType !== 'FINETUNE')
  }, [models, showFinetuned])

  // Build the tree structure
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    const positionMap = new Map<string, { x: number; y: number }>()

    // Find root nodes (no parent or parent not in filtered list)
    const modelIds = new Set(filteredModels.map(m => m.id))
    const rootNodes = filteredModels.filter(m => !m.parentId || !modelIds.has(m.parentId))
    const childMap = new Map<string, ModelNode[]>()

    filteredModels.forEach(m => {
      if (m.parentId && modelIds.has(m.parentId)) {
        const children = childMap.get(m.parentId) || []
        children.push(m)
        childMap.set(m.parentId, children)
      }
    })

    // Position nodes using BFS
    const HORIZONTAL_SPACING = 280
    const VERTICAL_SPACING = 120
    let currentY = 0

    const processNode = (model: ModelNode, x: number, y: number) => {
      positionMap.set(model.id, { x, y })

      const isCurrent = model.id === currentModelId
      const colors = modelTypeColors[model.modelType] || modelTypeColorsLight.BASE

      nodes.push({
        id: model.id,
        position: { x, y },
        data: {
          label: (
            <div className="text-center">
              <div className="font-semibold text-sm" style={{ color: colors.text }}>{model.name}</div>
              {model.developer && (
                <div className="text-xs mt-0.5" style={{ color: colors.text, opacity: 0.6 }}>{model.developer}</div>
              )}
              <div className="text-xs mt-1 px-2 py-0.5 rounded" style={{
                color: colors.text,
                opacity: 0.8,
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
              }}>
                {t(model.modelType)}
              </div>
            </div>
          ),
        },
        style: {
          background: colors.bg,
          border: `2px solid ${isCurrent ? '#ef4444' : colors.border}`,
          borderRadius: '8px',
          padding: '10px',
          minWidth: '180px',
          boxShadow: isCurrent ? '0 0 0 3px rgba(239, 68, 68, 0.3)' : undefined,
          cursor: 'pointer',
        },
      })

      // Process children
      const children = childMap.get(model.id) || []
      let childX = x - ((children.length - 1) * HORIZONTAL_SPACING) / 2

      children.forEach((child, index) => {
        processNode(child, childX + index * HORIZONTAL_SPACING, y + VERTICAL_SPACING)

        const edgeColor = isDark ? '#9ca3af' : '#6b7280'
        edges.push({
          id: `${model.id}-${child.id}`,
          source: model.id,
          target: child.id,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeColor,
          },
          style: {
            stroke: edgeColor,
            strokeWidth: 2,
          },
        })
      })
    }

    // Process all root nodes
    rootNodes.forEach((root, index) => {
      processNode(root, index * HORIZONTAL_SPACING * 2, currentY)
    })

    return { nodes, edges }
  }, [filteredModels, currentModelId, t, isDark, modelTypeColors])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes/edges when filter changes
  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const model = filteredModels.find(m => m.id === node.id)
    if (model) {
      router.push(`/models/${model.slug}`)
    }
  }, [filteredModels, router])

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  if (models.length === 0) {
    return null
  }

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900'
    : 'relative h-[400px] w-full border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900'

  const hasFinetuned = models.some(m => m.modelType === 'FINETUNE')

  return (
    <div className={containerClass}>
      {/* Controls Bar */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        {/* FT Toggle */}
        {hasFinetuned && (
          <button
            onClick={() => setShowFinetuned(!showFinetuned)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              showFinetuned
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {showFinetuned ? 'FT: ON' : 'FT: OFF'}
          </button>
        )}

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={isFullscreen ? 'Exit fullscreen (ESC)' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>
      </div>

      {/* Fullscreen Header */}
      {isFullscreen && (
        <div className="absolute top-2 left-2 z-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {tTree('title')}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ESC {tTree('pressEscToExit')}
          </p>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        minZoom={0.3}
        maxZoom={2}
      >
        <Background color={isDark ? '#374151' : '#e5e7eb'} gap={16} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

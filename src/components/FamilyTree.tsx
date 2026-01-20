'use client'

import { useCallback, useMemo } from 'react'
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
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const modelTypeColors = isDark ? modelTypeColorsDark : modelTypeColorsLight

  // Build the tree structure
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    const positionMap = new Map<string, { x: number; y: number }>()

    // Find root nodes (no parent)
    const rootNodes = models.filter(m => !m.parentId)
    const childMap = new Map<string, ModelNode[]>()

    models.forEach(m => {
      if (m.parentId) {
        const children = childMap.get(m.parentId) || []
        children.push(m)
        childMap.set(m.parentId, children)
      }
    })

    // Position nodes using BFS
    const HORIZONTAL_SPACING = 250
    const VERTICAL_SPACING = 100
    let currentY = 0

    const processNode = (model: ModelNode, x: number, y: number) => {
      positionMap.set(model.id, { x, y })

      const isCurrent = model.id === currentModelId
      const colors = modelTypeColors[model.modelType]

      nodes.push({
        id: model.id,
        position: { x, y },
        data: {
          label: (
            <div className="text-center">
              <div className="font-semibold" style={{ color: colors.text }}>{model.name}</div>
              <div className="text-xs" style={{ color: colors.text, opacity: 0.7 }}>{t(model.modelType)}</div>
            </div>
          ),
        },
        style: {
          background: colors.bg,
          border: `2px solid ${isCurrent ? '#ef4444' : colors.border}`,
          borderRadius: '8px',
          padding: '10px',
          minWidth: '150px',
          boxShadow: isCurrent ? '0 0 0 3px rgba(239, 68, 68, 0.3)' : undefined,
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
  }, [models, currentModelId, t, isDark, modelTypeColors])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const model = models.find(m => m.id === node.id)
    if (model) {
      router.push(`/models/${model.slug}`)
    }
  }, [models, router])

  if (models.length === 0) {
    return null
  }

  return (
    <div className="h-[400px] w-full border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
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
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color={isDark ? '#374151' : '#e5e7eb'} gap={16} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

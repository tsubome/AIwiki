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

const modelTypeColors: Record<string, { bg: string; border: string }> = {
  BASE: { bg: '#dbeafe', border: '#3b82f6' },
  FINETUNE: { bg: '#dcfce7', border: '#22c55e' },
  MERGE: { bg: '#f3e8ff', border: '#a855f7' },
  QUANTIZED: { bg: '#ffedd5', border: '#f97316' },
}

export default function FamilyTree({ models, currentModelId }: Props) {
  const router = useRouter()
  const t = useTranslations('modelType')

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
              <div className="font-semibold">{model.name}</div>
              <div className="text-xs opacity-70">{t(model.modelType)}</div>
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

        edges.push({
          id: `${model.id}-${child.id}`,
          source: model.id,
          target: child.id,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#6b7280',
          },
          style: {
            stroke: '#6b7280',
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
  }, [models, currentModelId, t])

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
    <div className="h-[400px] w-full border border-gray-200 rounded-lg bg-gray-50">
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
        <Background color="#e5e7eb" gap={16} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

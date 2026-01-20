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
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

// Types
type ModelNode = {
  id: string
  name: string
  slug: string
  modelType: string
  parentId: string | null
  developer?: string | null
  parameters?: string | null
}

type Props = {
  models: ModelNode[]
  currentModelId: string
}

// Constants
const NODE_WIDTH = 140
const NODE_GAP = 40
const ESTIMATED_NODE_HEIGHT = 90

// Node type colors
// 1. Main version (blue) - part of the main lineage
// 2. FT derivative (green) - fine-tuned models
// 3. Non-FT derivative (purple) - other derivatives like distillations
type NodeStyle = {
  bg: string
  bgDark: string
  border: string
  text: string
  textDark: string
}

const NODE_STYLES: Record<string, NodeStyle> = {
  main: {
    bg: '#dbeafe',      // blue-100
    bgDark: '#1e3a5f',
    border: '#3b82f6',  // blue-500
    text: '#1e40af',    // blue-800
    textDark: '#93c5fd', // blue-300
  },
  finetune: {
    bg: '#dcfce7',      // green-100
    bgDark: '#14532d',
    border: '#22c55e',  // green-500
    text: '#166534',    // green-800
    textDark: '#86efac', // green-300
  },
  derivative: {
    bg: '#f3e8ff',      // purple-100
    bgDark: '#3b1f5c',
    border: '#a855f7',  // purple-500
    text: '#6b21a8',    // purple-800
    textDark: '#d8b4fe', // purple-300
  },
}

// Custom Node Component
function VersionNodeComponent({ data }: { data: any }) {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const isFinetune = data.modelType === 'FINETUNE'
  const isDerivative = data.isDerivative
  const isCurrent = data.isCurrent

  // Determine node style based on type
  let styleKey: string
  if (isDerivative) {
    styleKey = isFinetune ? 'finetune' : 'derivative'
  } else {
    styleKey = 'main'
  }
  const style = NODE_STYLES[styleKey]

  const bgColor = isDark ? style.bgDark : style.bg
  const borderColor = isCurrent ? '#ef4444' : style.border
  const textColor = isDark ? style.textDark : style.text

  const handleBubbleClick = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation()
    router.push(`/models/${slug}`)
  }

  return (
    <div
      style={{
        background: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        padding: '12px 16px',
        width: `${NODE_WIDTH}px`,
        textAlign: 'center',
        boxShadow: isCurrent ? '0 0 0 3px rgba(239, 68, 68, 0.3)' : undefined,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />

      <div style={{ fontSize: '14px', fontWeight: 600, color: textColor, marginBottom: '4px' }}>
        {data.name}
      </div>
      {data.developer && (
        <div style={{ fontSize: '11px', color: textColor, opacity: 0.6, marginBottom: '8px' }}>
          {data.developer}
        </div>
      )}
      {data.parameterVariants && data.parameterVariants.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px' }}>
          {data.parameterVariants.map((variant: any) => (
            <span
              key={variant.id}
              onClick={(e) => handleBubbleClick(e, variant.slug)}
              style={{
                background: isDark ? 'rgba(255,255,255,0.1)' : 'white',
                border: `2px solid ${borderColor}`,
                color: textColor,
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              {variant.parameters}
            </span>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </div>
  )
}

const nodeTypes = {
  versionNode: VersionNodeComponent,
}

export default function FamilyTreeNew({ models, currentModelId }: Props) {
  const router = useRouter()
  const tTree = useTranslations('familyTree')
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFinetuned, setShowFinetuned] = useState(true)

  // Build nodes and edges
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    // Build parent-child map
    const modelIds = new Set(models.map(m => m.id))
    const childMap = new Map<string, ModelNode[]>()
    models.forEach(m => {
      if (m.parentId && modelIds.has(m.parentId)) {
        const children = childMap.get(m.parentId) || []
        children.push(m)
        childMap.set(m.parentId, children)
      }
    })

    // Find the root (family root)
    const roots = models.filter(m => !m.parentId || !modelIds.has(m.parentId))
    if (roots.length === 0) return { nodes, edges }

    const familyRoot = roots[0]
    const versionModels = childMap.get(familyRoot.id) || []

    // Filter if not showing finetuned
    const filteredModels = showFinetuned ? models : models.filter(m => m.modelType !== 'FINETUNE')
    const filteredModelIds = new Set(filteredModels.map(m => m.id))

    // Build version nodes with their parameter variants
    type VersionData = {
      id: string
      name: string
      slug: string
      developer: string | null
      modelType: string
      parameterVariants: { id: string; slug: string; parameters: string }[]
      derivatives: VersionData[]
    }

    const buildVersionData = (versionModel: ModelNode): VersionData | null => {
      if (!filteredModelIds.has(versionModel.id)) return null

      const children = childMap.get(versionModel.id) || []

      // Parameter variants: children with parameters that are BASE type
      const paramVariants = children
        .filter(c => c.parameters && c.modelType === 'BASE' && filteredModelIds.has(c.id))
        .map(c => ({ id: c.id, slug: c.slug, parameters: c.parameters! }))

      // Find derivatives (children of parameter variants - both FINETUNE and other types)
      const derivatives: VersionData[] = []
      children.forEach(paramChild => {
        if (paramChild.parameters && filteredModelIds.has(paramChild.id)) {
          const grandchildren = childMap.get(paramChild.id) || []
          grandchildren.forEach(gc => {
            if (filteredModelIds.has(gc.id)) {
              derivatives.push({
                id: gc.id,
                name: gc.name.replace(/\s+\d+[BM]$/i, '').replace(/\s+8B$/i, ''),
                slug: gc.slug,
                developer: gc.developer || null,
                modelType: gc.modelType,
                parameterVariants: gc.parameters
                  ? [{ id: gc.id, slug: gc.slug, parameters: gc.parameters }]
                  : [],
                derivatives: [],
              })
            }
          })
        }
      })

      return {
        id: versionModel.id,
        name: versionModel.name,
        slug: versionModel.slug,
        developer: versionModel.developer || null,
        modelType: versionModel.modelType,
        parameterVariants: paramVariants,
        derivatives,
      }
    }

    const versions = versionModels
      .map(v => buildVersionData(v))
      .filter((v): v is VersionData => v !== null && v.parameterVariants.length > 0)

    // Layout: Plan rows - derivatives appear on the NEXT row (same row as next version)
    // This matches the mockup where ELYZA JP and Swallow (derivatives of Llama 3)
    // appear on the same row as Llama 3.1
    type RowPlan = {
      mainVersion: VersionData | null
      derivatives: VersionData[]  // Derivatives from PREVIOUS version
    }

    const rowPlans: RowPlan[] = []
    for (let i = 0; i < versions.length; i++) {
      const prevDerivatives = i > 0 ? versions[i - 1].derivatives : []
      rowPlans.push({
        mainVersion: versions[i],
        derivatives: prevDerivatives
      })
    }

    // If last version has derivatives, add an extra row for them
    const lastVersion = versions[versions.length - 1]
    if (lastVersion && lastVersion.derivatives.length > 0) {
      rowPlans.push({
        mainVersion: null,
        derivatives: lastVersion.derivatives
      })
    }

    // Calculate Y positions based on row heights
    let currentY = 30
    const rowYPositions: number[] = []
    rowPlans.forEach(() => {
      rowYPositions.push(currentY)
      currentY += ESTIMATED_NODE_HEIGHT + NODE_GAP
    })

    // Create nodes
    rowPlans.forEach((plan, rowIndex) => {
      const y = rowYPositions[rowIndex]
      let xOffset = 0

      // Main version at column 0
      if (plan.mainVersion) {
        const version = plan.mainVersion
        const isCurrent = version.id === currentModelId ||
          version.parameterVariants.some(v => v.id === currentModelId)

        nodes.push({
          id: version.id,
          type: 'versionNode',
          position: { x: 80, y },
          data: {
            name: version.name,
            developer: version.developer,
            modelType: version.modelType,
            parameterVariants: version.parameterVariants,
            isCurrent,
            isDerivative: false,  // Main version, not a derivative
          },
        })
        xOffset = 1
      }

      // Derivative nodes to the right
      plan.derivatives.forEach((derivative, dIndex) => {
        const dIsCurrent = derivative.id === currentModelId ||
          derivative.parameterVariants.some(v => v.id === currentModelId)

        nodes.push({
          id: derivative.id,
          type: 'versionNode',
          position: { x: 80 + (xOffset + dIndex) * (NODE_WIDTH + NODE_GAP), y },
          data: {
            name: derivative.name,
            developer: derivative.developer,
            modelType: derivative.modelType,
            parameterVariants: derivative.parameterVariants,
            isCurrent: dIsCurrent,
            isDerivative: true,  // This is a derivative model
          },
        })
      })
    })

    // Create edges
    // Edge colors match node types
    const mainEdgeColor = NODE_STYLES.main.border      // blue for main lineage
    const ftEdgeColor = NODE_STYLES.finetune.border    // green for finetune
    const derivativeEdgeColor = NODE_STYLES.derivative.border  // purple for non-FT derivatives

    // Main vertical edges between consecutive versions
    for (let i = 0; i < versions.length - 1; i++) {
      edges.push({
        id: `main-${versions[i].id}-${versions[i + 1].id}`,
        source: versions[i].id,
        target: versions[i + 1].id,
        type: 'straight',
        style: { stroke: mainEdgeColor, strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: mainEdgeColor,
          width: 15,
          height: 15,
        },
      })
    }

    // Branch edges from version to its derivatives (on the next row)
    versions.forEach((version) => {
      version.derivatives.forEach((derivative) => {
        // Choose edge color based on derivative type
        const color = derivative.modelType === 'FINETUNE' ? ftEdgeColor : derivativeEdgeColor
        edges.push({
          id: `branch-${version.id}-${derivative.id}`,
          source: version.id,
          target: derivative.id,
          type: 'smoothstep',
          style: { stroke: color, strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: color,
            width: 15,
            height: 15,
          },
        })
      })
    })

    return { nodes, edges }
  }, [models, currentModelId, isDark, showFinetuned])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const model = models.find(m => m.id === node.id)
    if (model) {
      router.push(`/models/${model.slug}`)
    }
  }, [models, router])

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // Body scroll lock
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isFullscreen])

  if (models.length === 0) return null

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900'
    : 'relative h-[500px] w-full border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900'

  const hasFinetuned = models.some(m => m.modelType === 'FINETUNE')

  return (
    <div className={containerClass}>
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
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
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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

      {isFullscreen && (
        <div className="absolute top-2 left-2 z-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{tTree('title')}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">ESC {tTree('pressEscToExit')}</p>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
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

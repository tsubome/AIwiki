'use client'

import { useCallback, useMemo, useState, useEffect, useRef } from 'react'
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
  EdgeProps,
  BaseEdge,
  getStraightPath,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

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
const NODE_GAP = 40  // Visual gap between node edges (both vertical and horizontal)
const ARROW_HEIGHT = 25  // Height of arrow marker (increased for better visibility)
const VERTICAL_SPACING = NODE_GAP + ARROW_HEIGHT  // Total vertical spacing including arrow

// Calculate node height based on actual CSS styles
// CSS breakdown:
// - padding: 12px top + 12px bottom = 24px
// - border: 2px top + 2px bottom = 4px
// - name: ~20px (14px font * 1.4 line-height) + 4px margin = 24px
// - developer: ~15px (11px font * 1.4) + 8px margin = 23px (when present)
// - bubble: ~25px (11px font + 6px padding + 4px border)
// - bubble gap: 6px between rows
// Note: With 140px node width and 16px side padding, inner width is 108px
// Each bubble ~36px + 6px gap = max 2 bubbles per row
function calculateNodeHeight(paramCount: number, hasDeveloper: boolean = true): number {
  const paddingAndBorder = 28  // 24px padding + 4px border
  const nameHeight = 24  // font + margin
  const developerHeight = hasDeveloper ? 23 : 0  // font + margin (when present)
  const bubbleHeight = 25  // single bubble row height
  const bubbleGap = 6  // gap between bubble rows
  const bubblesPerRow = 2  // max bubbles per row based on width

  const rows = Math.max(1, Math.ceil(paramCount / bubblesPerRow))
  const bubblesHeight = rows * bubbleHeight + (rows - 1) * bubbleGap

  return paddingAndBorder + nameHeight + developerHeight + bubblesHeight
}

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

// Custom T-Junction Edge for branch connections
// Path: from main line's branch point → horizontal to derivative → down to derivative
function TJunctionEdge({ id, sourceX, sourceY, targetX, targetY, style, markerEnd, data }: EdgeProps) {
  // branchY is the Y coordinate where the horizontal branch starts (in the gap)
  const branchY = data?.branchY as number || sourceY + 20

  // Path: start at (sourceX, branchY), go horizontal to targetX, then down to targetY
  const path = `M ${sourceX} ${branchY} L ${targetX} ${branchY} L ${targetX} ${targetY}`

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={path}
      style={style}
      markerEnd={markerEnd as string}
      fill="none"
    />
  )
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
          {data.parameterVariants.map((variant: any) => {
            // Determine bubble color class for hover effect
            const bubbleColorClass = isDerivative
              ? (isFinetune ? 'green' : 'purple')
              : 'blue'

            return (
              <span
                key={variant.id}
                onClick={(e) => handleBubbleClick(e, variant.slug)}
                className={`family-tree-bubble ${bubbleColorClass}`}
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
            )
          })}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </div>
  )
}

const nodeTypes = {
  versionNode: VersionNodeComponent,
}

const edgeTypes = {
  tJunction: TJunctionEdge,
}

function FamilyTreeInner({ models, currentModelId }: Props) {
  const router = useRouter()
  const tTree = useTranslations('familyTree')
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFinetuned, setShowFinetuned] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { getNodes, getViewport } = useReactFlow()

  // Export function
  const handleExport = useCallback(async (format: 'png' | 'pdf') => {
    if (!containerRef.current) return
    setIsExporting(true)

    try {
      // Find the ReactFlow viewport element
      const viewport = containerRef.current.querySelector('.react-flow__viewport') as HTMLElement
      if (!viewport) {
        console.error('ReactFlow viewport not found')
        return
      }

      // Get the bounding box of all nodes to determine the content area
      const nodes = getNodes()
      if (nodes.length === 0) return

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      nodes.forEach(node => {
        const x = node.position.x
        const y = node.position.y
        const width = NODE_WIDTH
        const height = 150 // Approximate max node height
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x + width)
        maxY = Math.max(maxY, y + height)
      })

      // Add padding
      const padding = 50
      minX -= padding
      minY -= padding
      maxX += padding
      maxY += padding

      const contentWidth = maxX - minX
      const contentHeight = maxY - minY

      // Create canvas from the entire container
      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: isDark ? '#111827' : '#f9fafb',
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        // Capture the full content
        width: containerRef.current.scrollWidth,
        height: containerRef.current.scrollHeight,
      })

      if (format === 'png') {
        // Download as PNG
        const link = document.createElement('a')
        link.download = `family-tree-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      } else {
        // Download as PDF
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = canvas.width
        const imgHeight = canvas.height

        // Create PDF with appropriate dimensions
        const pdfWidth = imgWidth * 0.75 // Convert to points (assuming 96 DPI)
        const pdfHeight = imgHeight * 0.75
        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
          unit: 'pt',
          format: [pdfWidth, pdfHeight],
        })

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save(`family-tree-${Date.now()}.pdf`)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }, [isDark, getNodes])

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

      // Find derivatives - can be:
      // 1. Direct children that are not BASE type (FINETUNE, etc.) - new file-based structure
      // 2. Children of parameter variants (grandchildren) - old Prisma structure
      const derivatives: VersionData[] = []
      const seenDerivativeNames = new Set<string>()

      // Check direct children (non-BASE types with parameters)
      children.forEach(child => {
        if (child.modelType !== 'BASE' && filteredModelIds.has(child.id)) {
          // Group derivatives by base name (remove parameter suffix)
          const baseName = child.name.replace(/\s+\d+[BMT]+$/i, '').trim()
          if (!seenDerivativeNames.has(baseName)) {
            seenDerivativeNames.add(baseName)
            // Find all parameter variants for this derivative
            const derivativeVariants = children
              .filter(c =>
                c.modelType !== 'BASE' &&
                filteredModelIds.has(c.id) &&
                c.name.replace(/\s+\d+[BMT]+$/i, '').trim() === baseName
              )
              .map(c => ({ id: c.id, slug: c.slug, parameters: c.parameters || '' }))

            derivatives.push({
              id: child.id,
              name: baseName,
              slug: child.slug,
              developer: child.developer || null,
              modelType: child.modelType,
              parameterVariants: derivativeVariants,
              derivatives: [],
            })
          }
        }
      })

      // Also check grandchildren (old structure compatibility)
      children.forEach(paramChild => {
        if (paramChild.parameters && filteredModelIds.has(paramChild.id)) {
          const grandchildren = childMap.get(paramChild.id) || []
          grandchildren.forEach(gc => {
            if (filteredModelIds.has(gc.id)) {
              const baseName = gc.name.replace(/\s+\d+[BMT]+$/i, '').trim()
              if (!seenDerivativeNames.has(baseName)) {
                seenDerivativeNames.add(baseName)
                derivatives.push({
                  id: gc.id,
                  name: baseName,
                  slug: gc.slug,
                  developer: gc.developer || null,
                  modelType: gc.modelType,
                  parameterVariants: gc.parameters
                    ? [{ id: gc.id, slug: gc.slug, parameters: gc.parameters }]
                    : [],
                  derivatives: [],
                })
              }
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

    // Layout: Plan rows - derivatives appear on their OWN row below their parent
    // Row order: Main Version → Derivatives (if any) → Next Main Version → ...
    // This ensures derivatives don't share rows with unrelated main versions
    type RowPlan = {
      mainVersion: VersionData | null
      derivatives: VersionData[]
      parentVersionId: string | null  // For derivative rows, the parent version's ID
      maxHeight: number
    }

    const rowPlans: RowPlan[] = []
    for (let i = 0; i < versions.length; i++) {
      const mainVersion = versions[i]

      // Add main version row
      const mainHeight = calculateNodeHeight(
        mainVersion.parameterVariants.length,
        !!mainVersion.developer
      )
      rowPlans.push({
        mainVersion,
        derivatives: [],
        parentVersionId: null,
        maxHeight: mainHeight
      })

      // Add derivative row if this version has derivatives
      if (mainVersion.derivatives.length > 0) {
        let derivativeMaxHeight = 0
        mainVersion.derivatives.forEach(d => {
          const dHeight = calculateNodeHeight(d.parameterVariants.length, !!d.developer)
          derivativeMaxHeight = Math.max(derivativeMaxHeight, dHeight)
        })
        rowPlans.push({
          mainVersion: null,
          derivatives: mainVersion.derivatives,
          parentVersionId: mainVersion.id,
          maxHeight: derivativeMaxHeight
        })
      }
    }

    // Calculate Y positions based on actual row heights with spacing that includes arrow height
    let currentY = 30
    const rowYPositions: number[] = []
    const rowBottoms: number[] = []  // Track bottom edge of each row for edge connections
    rowPlans.forEach((plan, idx) => {
      rowYPositions.push(currentY)
      rowBottoms.push(currentY + plan.maxHeight)
      const derivativeNames = plan.derivatives.map(d => d.name).join(',')
      console.log(`[FamilyTree] Row ${idx}: y=${currentY}, maxHeight=${plan.maxHeight}, bottom=${currentY + plan.maxHeight}, main=${plan.mainVersion?.name || 'none'}, derivatives=${derivativeNames}`)
      // Next row starts at: current row's bottom + VERTICAL_SPACING (includes arrow height)
      currentY = currentY + plan.maxHeight + VERTICAL_SPACING
    })

    // Create nodes
    rowPlans.forEach((plan, rowIndex) => {
      const y = rowYPositions[rowIndex]

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
            isDerivative: false,
          },
        })
      }

      // Derivative nodes (on their own row, starting from column 1)
      plan.derivatives.forEach((derivative, dIndex) => {
        const dIsCurrent = derivative.id === currentModelId ||
          derivative.parameterVariants.some(v => v.id === currentModelId)

        // Derivatives start at column 1 (to the right of main column)
        const derivativeX = 80 + (1 + dIndex) * (NODE_WIDTH + NODE_GAP)
        nodes.push({
          id: derivative.id,
          type: 'versionNode',
          position: { x: derivativeX, y },
          data: {
            name: derivative.name,
            developer: derivative.developer,
            modelType: derivative.modelType,
            parameterVariants: derivative.parameterVariants,
            isCurrent: dIsCurrent,
            isDerivative: true,
          },
        })
      })
    })

    // Create edges
    // Edge colors
    const mainEdgeColor = '#6b7280'  // gray-500 for main lineage (neutral, matches mockup)
    const ftEdgeColor = NODE_STYLES.finetune.border    // green for finetune
    const derivativeEdgeColor = NODE_STYLES.derivative.border  // purple for non-FT derivatives

    // Main vertical edges between consecutive main versions
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

    // Branch edges from version to its derivatives using T-junction style
    // The branch point is in the middle of the gap above the derivative row
    rowPlans.forEach((plan, rowIndex) => {
      if (plan.derivatives.length === 0 || !plan.parentVersionId) return

      // This is a derivative row - find the parent version
      const parentVersion = versions.find(v => v.id === plan.parentVersionId)
      if (!parentVersion) return

      // Calculate branchY: middle of the gap above this derivative row
      // branchY = derivativeRowY - VERTICAL_SPACING/2
      const branchY = rowYPositions[rowIndex] - VERTICAL_SPACING / 2

      plan.derivatives.forEach((derivative, dIndex) => {
        // Choose edge color based on derivative type
        const color = derivative.modelType === 'FINETUNE' ? ftEdgeColor : derivativeEdgeColor

        edges.push({
          id: `branch-${parentVersion.id}-${derivative.id}`,
          source: parentVersion.id,
          target: derivative.id,
          type: 'tJunction',
          style: { stroke: color, strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: color,
            width: 15,
            height: 15,
          },
          data: {
            branchY,  // Pass the Y coordinate for the T-junction
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
    <div ref={containerRef} className={containerClass}>
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        {/* Export buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleExport('png')}
            disabled={isExporting}
            className="px-2 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            title={tTree('saveAsPng')}
          >
            {isExporting ? '...' : 'PNG'}
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="px-2 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            title={tTree('saveAsPdf')}
          >
            {isExporting ? '...' : 'PDF'}
          </button>
        </div>
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
        edgeTypes={edgeTypes}
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

      {/* Legend */}
      <div className={`absolute bottom-2 left-2 z-10 ${
        isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
      } border rounded-lg px-3 py-2 text-xs`}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-100" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{tTree('legendBase')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-100" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{tTree('legendFinetune')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2 border-purple-500 bg-purple-100" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{tTree('legendDerivative')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2 border-red-500 bg-blue-100 shadow-[0_0_0_2px_rgba(239,68,68,0.3)]" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{tTree('legendCurrent')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrap with ReactFlowProvider to enable useReactFlow hook
export default function FamilyTreeNew({ models, currentModelId }: Props) {
  return (
    <ReactFlowProvider>
      <FamilyTreeInner models={models} currentModelId={currentModelId} />
    </ReactFlowProvider>
  )
}

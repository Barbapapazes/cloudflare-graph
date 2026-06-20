import type {
  WorkflowGraphBlockNode,
  WorkflowGraphConditionalBranch,
  WorkflowGraphFunctionDefinitionNode,
  WorkflowGraphNode,
  WorkflowGraphParallelNode,
  WorkflowGraphTryNode,
  WorkflowGraphWorkflow,
} from '../types/graph'
import type {
  WorkflowGraphRenderableBranchFrame,
  WorkflowGraphRenderableBranchGroupLayout,
  WorkflowGraphRenderableBranchLayout,
  WorkflowGraphRenderableBranchRole,
  WorkflowGraphRenderableGroupVariant,
} from './workflow-graph-layout'
import { createBranchGroupLayout, createBranchLayout } from './workflow-graph-layout'

export type WorkflowGraphRenderableKind = 'step_sleep' | 'step_do' | 'step_wait_for_event' | 'function_call' | 'break' | 'unsupported'
export type {
  WorkflowGraphRenderableBranchColumn,
  WorkflowGraphRenderableBranchFrame,
  WorkflowGraphRenderableBranchGap,
  WorkflowGraphRenderableBranchGroupLayout,
  WorkflowGraphRenderableBranchLayout,
  WorkflowGraphRenderableBranchRole,
  WorkflowGraphRenderableGroupVariant,
} from './workflow-graph-layout'

export interface WorkflowGraphRenderableNodeBase {
  description?: string
  displayType: string
  id: string
  kind: WorkflowGraphRenderableKind
  label: string
}

export interface WorkflowGraphRenderableSleepNode extends WorkflowGraphRenderableNodeBase {
  kind: 'step_sleep'
  type: 'step_sleep' | 'step_sleep_until'
}

export interface WorkflowGraphRenderableDoNode extends WorkflowGraphRenderableNodeBase {
  kind: 'step_do'
  type: 'step_do'
}

export interface WorkflowGraphRenderableWaitForEventNode extends WorkflowGraphRenderableNodeBase {
  kind: 'step_wait_for_event'
  type: 'step_wait_for_event'
}

export interface WorkflowGraphRenderableFunctionCallNode extends WorkflowGraphRenderableNodeBase {
  kind: 'function_call'
  type: 'function_call'
}

export interface WorkflowGraphRenderableBreakNode extends WorkflowGraphRenderableNodeBase {
  kind: 'break'
  type: 'break'
}

export interface WorkflowGraphRenderableUnsupportedNode extends WorkflowGraphRenderableNodeBase {
  kind: 'unsupported'
  node: WorkflowGraphNode
  type: WorkflowGraphNode['type']
}

export interface WorkflowGraphRenderableBranch {
  frame: WorkflowGraphRenderableBranchFrame
  id: string
  items: WorkflowGraphRenderableItem[]
  label: string
  layout: WorkflowGraphRenderableBranchLayout
  role: WorkflowGraphRenderableBranchRole
}

export interface WorkflowGraphRenderableBranchGroup {
  branches: WorkflowGraphRenderableBranch[]
  displayType: string
  id: string
  kind: 'branches'
  layout: WorkflowGraphRenderableBranchGroupLayout
  variant: WorkflowGraphRenderableGroupVariant
}

interface WorkflowGraphRenderableBranchInput extends Omit<WorkflowGraphRenderableBranch, 'layout'> {
  layout?: Partial<WorkflowGraphRenderableBranchLayout>
}

interface WorkflowGraphRenderableBranchGroupInput extends Omit<WorkflowGraphRenderableBranchGroup, 'branches' | 'kind' | 'layout'> {
  branches: WorkflowGraphRenderableBranchInput[]
  layout?: WorkflowGraphRenderableBranchGroupLayout
}

export type WorkflowGraphRenderableNode
  = | WorkflowGraphRenderableSleepNode
    | WorkflowGraphRenderableDoNode
    | WorkflowGraphRenderableWaitForEventNode
    | WorkflowGraphRenderableFunctionCallNode
    | WorkflowGraphRenderableBreakNode
    | WorkflowGraphRenderableUnsupportedNode

export type WorkflowGraphRenderableItem = WorkflowGraphRenderableNode | WorkflowGraphRenderableBranchGroup

export interface WorkflowGraphViewModel {
  nodes: WorkflowGraphRenderableItem[]
}

export function createWorkflowGraphViewModel(workflow: WorkflowGraphWorkflow): WorkflowGraphViewModel {
  return {
    nodes: flattenRenderableNodes(workflow.nodes),
  }
}

function flattenRenderableNodes(nodes: WorkflowGraphNode[]): WorkflowGraphRenderableItem[] {
  return nodes.flatMap((node, index) => normalizeNode(node, [index]))
}

function normalizeNode(node: WorkflowGraphNode, path: number[]): WorkflowGraphRenderableItem[] {
  switch (node.type) {
    case 'step_sleep':
    case 'step_sleep_until':
      return [
        {
          displayType: formatDisplayType(node.type),
          id: createNodeId(path, node.type, node.name),
          kind: 'step_sleep',
          label: node.name,
          type: node.type,
        },
      ]

    case 'step_do':
      return [
        {
          displayType: formatDisplayType(node.type),
          id: createNodeId(path, node.type, node.name),
          kind: 'step_do',
          label: node.name,
          type: node.type,
        },
      ]

    case 'step_wait_for_event':
      return [
        {
          description: `Waits for ${node.options.event_type}`,
          displayType: formatDisplayType(node.type),
          id: createNodeId(path, node.type, node.name),
          kind: 'step_wait_for_event',
          label: node.name,
          type: node.type,
        },
      ]

    case 'function_call':
      return [
        {
          description: `Calls ${node.name}`,
          displayType: formatDisplayType(node.type),
          id: createNodeId(path, node.type, node.name),
          kind: 'function_call',
          label: node.name,
          type: node.type,
        },
      ]

    case 'break':
      return [
        {
          displayType: node.kind,
          id: createNodeId(path, node.type, node.kind),
          kind: 'break',
          label: node.kind,
          type: node.type,
        },
      ]

    case 'block':
      return flattenContainer(node, path)

    case 'function_def':
      return flattenContainer(node, path)

    case 'start':
      return flattenRenderableNodes(node.nodes)

    case 'try':
      return [normalizeTryNode(node, path)]

    case 'if':
      return [
        createBranchGroup({
          branches: node.branches.map((branch, index) => ({
            frame: 'none',
            id: createBranchId(path, index, branch.condition || `branch-${index + 1}`),
            items: normalizeBranchItems(branch, [...path, index]),
            label: branch.condition || `branch ${index + 1}`,
            role: branch.condition ? 'condition' : 'fallback',
          })),
          displayType: formatDisplayType(node.type),
          id: createNodeId(path, node.type),
          variant: 'conditional',
        }),
      ]

    case 'switch':
      return [
        createBranchGroup({
          branches: node.branches.map((branch, index) => ({
            frame: 'none',
            id: createBranchId(path, index, branch.condition || `case-${index + 1}`),
            items: normalizeBranchItems(branch, [...path, index]),
            label: branch.condition || `case ${index + 1}`,
            role: branch.condition ? 'condition' : 'fallback',
          })),
          displayType: formatDisplayType(node.type),
          id: createNodeId(path, node.type),
          variant: 'conditional',
        }),
      ]

    case 'parallel':
      return [normalizeParallelNode(node, path)]

    case 'loop':
      return [
        createBranchGroup({
          branches: [
            {
              frame: 'none',
              id: createBranchId(path, 0, 'loop-body'),
              items: flattenRenderableNodes(node.nodes),
              label: 'loop',
              role: 'loop-body',
            },
          ],
          displayType: formatDisplayType(node.type),
          id: createNodeId(path, node.type),
          variant: 'loop',
        }),
      ]

    default: {
      const unsupportedNode = node as WorkflowGraphNode

      return [
        {
          description: formatUnsupportedDescription(unsupportedNode),
          displayType: formatDisplayType(unsupportedNode.type),
          id: createNodeId(path, unsupportedNode.type),
          kind: 'unsupported',
          label: formatUnsupportedLabel(unsupportedNode.type),
          node: unsupportedNode,
          type: unsupportedNode.type,
        },
      ]
    }
  }
}

function flattenContainer(
  node: WorkflowGraphBlockNode | WorkflowGraphFunctionDefinitionNode,
  path: number[],
): WorkflowGraphRenderableItem[] {
  return node.nodes.flatMap((childNode, index) => normalizeNode(childNode, [...path, index]))
}

function normalizeTryNode(node: WorkflowGraphTryNode, path: number[]): WorkflowGraphRenderableBranchGroup {
  const branches: WorkflowGraphRenderableBranch[] = [
    {
      frame: 'dashed',
      id: createBranchId(path, 0, 'try'),
      items: flattenRenderableNodes(node.try_block.nodes),
      label: 'try',
      layout: createBranchLayout('try', 'primary'),
      role: 'primary',
    },
  ]

  branches.push({
    frame: 'none',
    id: createBranchId(path, 1, 'catch'),
    items: node.catch_block ? flattenRenderableNodes(node.catch_block.nodes) : [],
    label: 'catch',
    layout: createBranchLayout('try', 'catch'),
    role: 'catch',
  })

  if (node.finally_block) {
    branches.push({
      frame: 'none',
      id: createBranchId(path, branches.length, 'finally'),
      items: flattenRenderableNodes(node.finally_block.nodes),
      label: 'finally',
      layout: createBranchLayout('try', 'finally'),
      role: 'finally',
    })
  }

  return createBranchGroup({
    branches,
    displayType: formatDisplayType(node.type),
    id: createNodeId(path, node.type),
    variant: 'try',
  })
}

function normalizeParallelNode(node: WorkflowGraphParallelNode, path: number[]): WorkflowGraphRenderableBranchGroup {
  return createBranchGroup({
    branches: node.nodes.map((branchNode, index) => ({
      frame: 'none',
      id: createBranchId(path, index, `parallel-${index + 1}`),
      items: normalizeParallelBranch(branchNode, [...path, index]),
      label: `${node.kind.replaceAll('_', ' ')} ${index + 1}`,
      role: 'parallel',
    })),
    displayType: formatDisplayType(node.type),
    id: createNodeId(path, node.type),
    variant: 'parallel',
  })
}

function normalizeParallelBranch(node: WorkflowGraphNode, path: number[]): WorkflowGraphRenderableItem[] {
  if (node.type === 'block' || node.type === 'function_def')
    return flattenContainer(node, path)

  return normalizeNode(node, path)
}

function normalizeBranchItems(branch: WorkflowGraphConditionalBranch, path: number[]): WorkflowGraphRenderableItem[] {
  return branch.nodes.flatMap((childNode, index) => normalizeNode(childNode, [...path, index]))
}

function createRenderableBranch(
  variant: WorkflowGraphRenderableGroupVariant,
  branch: WorkflowGraphRenderableBranchInput,
): WorkflowGraphRenderableBranch {
  return {
    ...branch,
    layout: {
      ...createBranchLayout(variant, branch.role),
      ...branch.layout,
    },
  }
}

function createBranchGroup(group: WorkflowGraphRenderableBranchGroupInput): WorkflowGraphRenderableBranchGroup {
  return {
    ...group,
    kind: 'branches',
    layout: group.layout ?? createBranchGroupLayout(group.variant),
    branches: group.branches.length > 0
      ? group.branches.map(branch => createRenderableBranch(group.variant, branch))
      : [{
          frame: 'none',
          id: `${group.id}-branch-empty`,
          items: [],
          label: 'branch',
          layout: createBranchLayout(group.variant, 'branch'),
          role: 'branch',
        }],
  }
}

function createNodeId(path: number[], type: WorkflowGraphNode['type'], name?: string): string {
  const slug = (name ?? type)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return `${type}-${path.join('-')}-${slug}`
}

function createBranchId(path: number[], index: number, name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return `branch-${path.join('-')}-${index}-${slug}`
}

function formatDisplayType(type: WorkflowGraphNode['type']): string {
  switch (type) {
    case 'step_sleep_until':
      return 'sleep'
    case 'step_wait_for_event':
      return 'wait'
    default:
      return type.replace(/^step_/, '').replaceAll('_', ' ')
  }
}

function formatUnsupportedLabel(type: WorkflowGraphNode['type']): string {
  return formatDisplayType(type)
}

function formatUnsupportedDescription(node: WorkflowGraphNode): string {
  switch (node.type) {
    case 'step_wait_for_event':
      return `Waits for ${node.options.event_type}`
    case 'step_sleep_until':
      return `Sleeps until ${node.timestamp}`
    case 'parallel':
      return `${node.nodes.length} branch${node.nodes.length === 1 ? '' : 'es'}`
    case 'if':
    case 'switch':
      return `${node.branches.length} branch${node.branches.length === 1 ? '' : 'es'}`
    case 'try': {
      const extras = [node.catch_block && 'catch', node.finally_block && 'finally'].filter(Boolean)
      return extras.length > 0 ? `Includes ${extras.join(' and ')}` : 'Protected block'
    }
    case 'function_call':
      return `Calls ${node.name}`
    case 'break':
      return node.kind
    case 'start':
      return node.class_name
    case 'loop':
      return `${node.nodes.length} nested node${node.nodes.length === 1 ? '' : 's'}`
    default:
      return node.type
  }
}

import type {
  WorkflowGraphBlockNode,
  WorkflowGraphBreakKind,
  WorkflowGraphNode,
  WorkflowGraphParallelKind,
  WorkflowGraphWorkflow,
} from '../src/types/graph'
import type {
  WorkflowGraphRenderableBranchGroup,
  WorkflowGraphRenderableItem,
  WorkflowGraphRenderableNode,
} from '../src/utils/workflow-graph'
import { createWorkflowGraphViewModel } from '../src/utils/workflow-graph'

export function createDoStep(name: string) {
  return {
    config: {
      retries: {
        backoff: 'constant' as const,
        delay: 0,
        limit: 0,
      },
      timeout: 0,
    },
    name,
    nodes: [],
    type: 'step_do' as const,
  }
}

export function createSleepStep(name: string) {
  return {
    duration: '5 minutes',
    name,
    type: 'step_sleep' as const,
  }
}

export function createSleepUntilStep(name: string) {
  return {
    name,
    timestamp: '2026-06-14T09:00:00.000Z',
    type: 'step_sleep_until' as const,
  }
}

export function createWaitForEventStep(name: string) {
  return {
    name,
    options: {
      event_type: 'build.completed',
      timeout: '30 minutes',
    },
    payload: {
      fields: {
        status: { type: 'unknown' as const },
      },
      type: 'object' as const,
    },
    type: 'step_wait_for_event' as const,
  }
}

export function createFunctionCall(name: string) {
  return {
    name,
    type: 'function_call' as const,
  }
}

export function createBreak(kind: WorkflowGraphBreakKind) {
  return {
    kind,
    type: 'break' as const,
  }
}

export function createBlock(...nodes: WorkflowGraphBlockNode['nodes']): WorkflowGraphBlockNode {
  return {
    nodes,
    type: 'block',
  }
}

export function createWorkflow(...nodes: WorkflowGraphWorkflow['nodes']): WorkflowGraphWorkflow {
  return {
    class_name: 'snapshot-workflow',
    functions: {
      helper: {
        name: 'helper',
        nodes: [createDoStep('helper-step')],
        type: 'function_def',
      },
    },
    nodes,
    payload: {
      fields: {
        deployment: {
          fields: {
            id: { type: 'unknown' as const },
          },
          type: 'object' as const,
        },
      },
      type: 'object' as const,
    },
  }
}

export function createParallelWorkflow(kind: WorkflowGraphParallelKind): WorkflowGraphWorkflow {
  return createWorkflow({
    kind,
    nodes: [
      createBlock(createDoStep('alpha')),
      createBlock(createWaitForEventStep('beta')),
    ],
    type: 'parallel',
  })
}

export function getBranchGroup(workflow: WorkflowGraphWorkflow): WorkflowGraphRenderableBranchGroup {
  const branchGroup = createWorkflowGraphViewModel(workflow).nodes.find(
    (item): item is WorkflowGraphRenderableBranchGroup => item.kind === 'branches',
  )

  if (!branchGroup)
    throw new Error('Expected a branch group in the workflow view model.')

  return branchGroup
}

export function getFirstNode(...nodes: WorkflowGraphNode[]): WorkflowGraphRenderableNode {
  const node = createWorkflowGraphViewModel(createWorkflow(...nodes)).nodes.find(
    (item): item is WorkflowGraphRenderableNode => item.kind !== 'branches',
  )

  if (!node)
    throw new Error('Expected a renderable node in the workflow view model.')

  return node
}

export const conditionalBranchGroup = getBranchGroup(createWorkflow({
  branches: [
    {
      condition: 'deployment.status === "success"',
      nodes: [createDoStep('publish-release')],
    },
    {
      condition: '',
      nodes: [createFunctionCall('notify-team')],
    },
  ],
  type: 'if',
}))

export const loopBranchGroup = getBranchGroup(createWorkflow({
  nodes: [createSleepStep('wait-before-retry'), createDoStep('retry-build')],
  type: 'loop',
}))

export const parallelBranchGroup = getBranchGroup(createParallelWorkflow('all'))

export const specialTryBranchGroup = getBranchGroup(createWorkflow({
  catch_block: createBlock(createDoStep('recover-build')),
  finally_block: null,
  try_block: createBlock(createDoStep('run-build')),
  type: 'try',
}))

export const fallbackTryBranchGroup = getBranchGroup(createWorkflow({
  catch_block: createBlock(createDoStep('recover-build')),
  finally_block: createBlock(createDoStep('cleanup-artifacts')),
  try_block: createBlock(createDoStep('run-build')),
  type: 'try',
}))

export const complexWorkflow = createWorkflow(
  createSleepStep('initial-backoff'),
  createWaitForEventStep('await-approval'),
  {
    branches: [
      {
        condition: 'approval.approved',
        nodes: [createDoStep('deploy-preview')],
      },
      {
        condition: '',
        nodes: [createFunctionCall('cancel-deployment')],
      },
    ],
    type: 'if',
  },
  {
    kind: 'all',
    nodes: [
      createBlock(createDoStep('upload-assets')),
      createBlock(createWaitForEventStep('await-cache-warmup')),
    ],
    type: 'parallel',
  },
  {
    nodes: [createSleepUntilStep('retry-at-sunrise'), createDoStep('deploy-again')],
    type: 'loop',
  },
  {
    catch_block: createBlock(createDoStep('rollback-deployment')),
    finally_block: createBlock(createDoStep('report-status')),
    try_block: createBlock(createDoStep('deploy-production')),
    type: 'try',
  },
  createBreak('return'),
)

export const nodeCardNode = getFirstNode(createWaitForEventStep('await-webhook'))

export const nodeListItems = createWorkflowGraphViewModel(complexWorkflow).nodes as WorkflowGraphRenderableItem[]

import type { WorkflowGraphBlockNode, WorkflowGraphParallelKind, WorkflowGraphWorkflow } from '../types/graph'
import { describe, expect, it } from 'vitest'
import { createWorkflowGraphViewModel } from './workflow-graph'

function createDoStep(name: string) {
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

function createBlock(...nodes: WorkflowGraphBlockNode['nodes']): WorkflowGraphBlockNode {
  return {
    nodes,
    type: 'block',
  }
}

function createWorkflow(...nodes: WorkflowGraphWorkflow['nodes']): WorkflowGraphWorkflow {
  return {
    class_name: 'test-workflow',
    functions: {},
    nodes,
    payload: {
      type: 'unknown',
    },
  }
}

function createParallelWorkflow(kind: WorkflowGraphParallelKind): WorkflowGraphWorkflow {
  return createWorkflow({
    kind,
    nodes: [
      createBlock(createDoStep('alpha')),
      createBlock(createDoStep('beta')),
    ],
    type: 'parallel',
  })
}

describe('createWorkflowGraphViewModel', () => {
  it('assigns explicit roles and layout metadata for try branches', () => {
    const workflow = createWorkflow({
      catch_block: createBlock(createDoStep('recover')),
      finally_block: createBlock(createDoStep('cleanup')),
      try_block: createBlock(createDoStep('dangerous-step')),
      type: 'try',
    })

    const viewModel = createWorkflowGraphViewModel(workflow)
    const branchGroup = viewModel.nodes[0]

    expect(branchGroup.kind).toBe('branches')
    if (branchGroup.kind !== 'branches')
      throw new Error('Expected branch group')

    expect(branchGroup.variant).toBe('try')
    expect(branchGroup.layout).toEqual({
      gap: 'none',
      sharedJunction: true,
    })
    expect(branchGroup.branches.map(branch => ({
      column: branch.layout.column,
      connectorProfile: branch.layout.connectorProfile,
      frame: branch.frame,
      role: branch.role,
    }))).toEqual([
      {
        column: 'compact',
        connectorProfile: 'try-primary',
        frame: 'dashed',
        role: 'primary',
      },
      {
        column: 'compact',
        connectorProfile: 'try-secondary',
        frame: 'none',
        role: 'catch',
      },
      {
        column: 'compact',
        connectorProfile: 'try-secondary',
        frame: 'none',
        role: 'finally',
      },
    ])
  })

  it('creates an empty catch branch when the API omits it', () => {
    const workflow = createWorkflow({
      catch_block: null,
      finally_block: null,
      try_block: createBlock(createDoStep('dangerous-step')),
      type: 'try',
    })

    const viewModel = createWorkflowGraphViewModel(workflow)
    const branchGroup = viewModel.nodes[0]

    expect(branchGroup.kind).toBe('branches')
    if (branchGroup.kind !== 'branches')
      throw new Error('Expected branch group')

    expect(branchGroup.variant).toBe('try')
    expect(branchGroup.branches.map(branch => branch.role)).toEqual(['primary', 'catch'])
    expect(branchGroup.branches[1].items).toEqual([])
    expect(branchGroup.branches[1].layout.column).toBe('compact')
  })

  it('marks conditional fallback branches explicitly', () => {
    const workflow = createWorkflow({
      branches: [
        {
          condition: 'result.ok',
          nodes: [createDoStep('handle-success')],
        },
        {
          condition: '',
          nodes: [createDoStep('handle-failure')],
        },
      ],
      type: 'if',
    })

    const viewModel = createWorkflowGraphViewModel(workflow)
    const branchGroup = viewModel.nodes[0]

    expect(branchGroup.kind).toBe('branches')
    if (branchGroup.kind !== 'branches')
      throw new Error('Expected branch group')

    expect(branchGroup.variant).toBe('conditional')
    expect(branchGroup.layout.sharedJunction).toBe(true)
    expect(branchGroup.branches.map(branch => branch.role)).toEqual(['condition', 'fallback'])
    expect(branchGroup.branches.map(branch => branch.layout.column)).toEqual(['comfortable', 'comfortable'])
  })

  it('uses parallel-specific branch styling metadata', () => {
    const viewModel = createWorkflowGraphViewModel(createParallelWorkflow('all'))
    const branchGroup = viewModel.nodes[0]

    expect(branchGroup.kind).toBe('branches')
    if (branchGroup.kind !== 'branches')
      throw new Error('Expected branch group')

    expect(branchGroup.variant).toBe('parallel')
    expect(branchGroup.layout).toEqual({
      gap: 'wide',
      sharedJunction: true,
    })
    expect(branchGroup.branches.every(branch => branch.role === 'parallel')).toBe(true)
    expect(branchGroup.branches.every(branch => branch.layout.labelTone === 'muted')).toBe(true)
    expect(branchGroup.branches.every(branch => branch.layout.column === 'wide')).toBe(true)
  })

  it('keeps loop branches isolated from shared junction layout', () => {
    const workflow = createWorkflow({
      nodes: [createDoStep('repeat-me')],
      type: 'loop',
    })

    const viewModel = createWorkflowGraphViewModel(workflow)
    const branchGroup = viewModel.nodes[0]

    expect(branchGroup.kind).toBe('branches')
    if (branchGroup.kind !== 'branches')
      throw new Error('Expected branch group')

    expect(branchGroup.variant).toBe('loop')
    expect(branchGroup.layout).toEqual({
      gap: 'standard',
      sharedJunction: false,
    })
    expect(branchGroup.branches).toHaveLength(1)
    expect(branchGroup.branches[0].role).toBe('loop-body')
    expect(branchGroup.branches[0].layout.connectorProfile).toBe('isolated')
  })
})

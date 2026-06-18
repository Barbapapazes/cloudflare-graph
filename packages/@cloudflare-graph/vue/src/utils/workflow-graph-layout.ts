export type WorkflowGraphRenderableBranchFrame = 'dashed' | 'none'

export type WorkflowGraphRenderableGroupVariant = 'try' | 'conditional' | 'parallel' | 'loop'

export type WorkflowGraphRenderableBranchRole = 'branch' | 'primary' | 'catch' | 'finally' | 'condition' | 'fallback' | 'parallel' | 'loop-body'

export type WorkflowGraphRenderableBranchColumn = 'compact' | 'standard' | 'comfortable' | 'wide'

export type WorkflowGraphRenderableBranchGap = 'none' | 'compact' | 'standard' | 'wide'

export type WorkflowGraphRenderableBranchConnectorProfile = 'shared' | 'isolated' | 'parallel' | 'try-primary' | 'try-secondary'

export type WorkflowGraphRenderableBranchLabelTone = 'default' | 'muted'

export interface WorkflowGraphRenderableBranchLayout {
  column: WorkflowGraphRenderableBranchColumn
  connectorProfile: WorkflowGraphRenderableBranchConnectorProfile
  labelTone: WorkflowGraphRenderableBranchLabelTone
}

export interface WorkflowGraphRenderableBranchGroupLayout {
  gap: WorkflowGraphRenderableBranchGap
  sharedJunction: boolean
}

export function createBranchLayout(
  variant: WorkflowGraphRenderableGroupVariant,
  role: WorkflowGraphRenderableBranchRole,
): WorkflowGraphRenderableBranchLayout {
  switch (variant) {
    case 'try':
      return role === 'primary'
        ? {
            column: 'compact',
            connectorProfile: 'try-primary',
            labelTone: 'default',
          }
        : {
            column: 'compact',
            connectorProfile: 'try-secondary',
            labelTone: 'default',
          }

    case 'parallel':
      return {
        column: 'wide',
        connectorProfile: 'parallel',
        labelTone: 'muted',
      }

    case 'loop':
      return {
        column: 'comfortable',
        connectorProfile: 'isolated',
        labelTone: 'default',
      }

    case 'conditional':
    default:
      return {
        column: 'comfortable',
        connectorProfile: 'shared',
        labelTone: 'default',
      }
  }
}

export function createBranchGroupLayout(variant: WorkflowGraphRenderableGroupVariant): WorkflowGraphRenderableBranchGroupLayout {
  switch (variant) {
    case 'try':
      return {
        gap: 'none',
        sharedJunction: true,
      }

    case 'parallel':
      return {
        gap: 'wide',
        sharedJunction: true,
      }

    case 'loop':
      return {
        gap: 'standard',
        sharedJunction: false,
      }

    case 'conditional':
    default:
      return {
        gap: 'standard',
        sharedJunction: true,
      }
  }
}

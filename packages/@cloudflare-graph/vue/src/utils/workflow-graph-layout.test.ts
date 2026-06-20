import { describe, expect, it } from 'vitest'
import { createBranchGroupLayout, createBranchLayout } from './workflow-graph-layout'

describe('createBranchLayout', () => {
  it('returns the primary try styling for primary branches', () => {
    expect(createBranchLayout('try', 'primary')).toEqual({
      column: 'compact',
      connectorProfile: 'try-primary',
      labelTone: 'default',
    })
  })

  it('returns the secondary try styling for non-primary try branches', () => {
    expect(createBranchLayout('try', 'catch')).toEqual({
      column: 'compact',
      connectorProfile: 'try-secondary',
      labelTone: 'default',
    })
    expect(createBranchLayout('try', 'finally')).toEqual({
      column: 'compact',
      connectorProfile: 'try-secondary',
      labelTone: 'default',
    })
  })

  it('returns parallel styling for parallel branches', () => {
    expect(createBranchLayout('parallel', 'parallel')).toEqual({
      column: 'wide',
      connectorProfile: 'parallel',
      labelTone: 'muted',
    })
  })

  it('returns isolated styling for loop branches', () => {
    expect(createBranchLayout('loop', 'loop-body')).toEqual({
      column: 'comfortable',
      connectorProfile: 'isolated',
      labelTone: 'default',
    })
  })

  it('falls back to shared conditional styling', () => {
    expect(createBranchLayout('conditional', 'condition')).toEqual({
      column: 'comfortable',
      connectorProfile: 'shared',
      labelTone: 'default',
    })
    expect(createBranchLayout('conditional', 'fallback')).toEqual({
      column: 'comfortable',
      connectorProfile: 'shared',
      labelTone: 'default',
    })
  })
})

describe('createBranchGroupLayout', () => {
  it('returns the try group layout', () => {
    expect(createBranchGroupLayout('try')).toEqual({
      gap: 'none',
      sharedJunction: true,
    })
  })

  it('returns the parallel group layout', () => {
    expect(createBranchGroupLayout('parallel')).toEqual({
      gap: 'wide',
      sharedJunction: true,
    })
  })

  it('returns the loop group layout', () => {
    expect(createBranchGroupLayout('loop')).toEqual({
      gap: 'standard',
      sharedJunction: false,
    })
  })

  it('falls back to the conditional group layout', () => {
    expect(createBranchGroupLayout('conditional')).toEqual({
      gap: 'standard',
      sharedJunction: true,
    })
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  conditionalBranchGroup,
  loopBranchGroup,
  parallelBranchGroup,
  specialTryBranchGroup,
} from './test-fixtures'
import WorkflowGraphBranchGroup from './WorkflowGraphBranchGroup.vue'

describe('workflowGraphBranchGroup', () => {
  it.each([
    ['try', specialTryBranchGroup],
    ['conditional', conditionalBranchGroup],
    ['parallel', parallelBranchGroup],
    ['loop', loopBranchGroup],
  ] as const)('matches the %s snapshot', (_variant, item) => {
    const wrapper = mount(WorkflowGraphBranchGroup, {
      props: {
        item,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})

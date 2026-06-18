import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { fallbackTryBranchGroup, specialTryBranchGroup } from '../../test/fixtures'
import WorkflowGraphTryBranchGroup from './WorkflowGraphTryBranchGroup.vue'

describe('workflowGraphTryBranchGroup', () => {
  it('matches the special two-branch snapshot', () => {
    const wrapper = mount(WorkflowGraphTryBranchGroup, {
      props: {
        item: specialTryBranchGroup,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })

  it('matches the fallback multi-branch snapshot', () => {
    const wrapper = mount(WorkflowGraphTryBranchGroup, {
      props: {
        item: fallbackTryBranchGroup,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { loopBranchGroup } from '../../test/fixtures'
import WorkflowGraphLoopBranchGroup from './WorkflowGraphLoopBranchGroup.vue'

describe('workflowGraphLoopBranchGroup', () => {
  it('matches the snapshot', () => {
    const wrapper = mount(WorkflowGraphLoopBranchGroup, {
      props: {
        item: loopBranchGroup,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})

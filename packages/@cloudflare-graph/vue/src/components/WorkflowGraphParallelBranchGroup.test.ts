import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { parallelBranchGroup } from './test-fixtures'
import WorkflowGraphParallelBranchGroup from './WorkflowGraphParallelBranchGroup.vue'

describe('workflowGraphParallelBranchGroup', () => {
  it('matches the snapshot', () => {
    const wrapper = mount(WorkflowGraphParallelBranchGroup, {
      props: {
        item: parallelBranchGroup,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})

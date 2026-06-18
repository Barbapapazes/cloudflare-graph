import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { conditionalBranchGroup } from '../../test/fixtures'
import WorkflowGraphConditionalBranchGroup from './WorkflowGraphConditionalBranchGroup.vue'

describe('workflowGraphConditionalBranchGroup', () => {
  it('matches the snapshot', () => {
    const wrapper = mount(WorkflowGraphConditionalBranchGroup, {
      props: {
        item: conditionalBranchGroup,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})

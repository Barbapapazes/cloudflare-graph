import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { conditionalBranchGroup } from '../../test/fixtures'
import WorkflowGraphBranchColumns from './WorkflowGraphBranchColumns.vue'

describe('workflowGraphBranchColumns', () => {
  it('matches the snapshot', () => {
    const wrapper = mount(WorkflowGraphBranchColumns, {
      props: {
        item: conditionalBranchGroup,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})

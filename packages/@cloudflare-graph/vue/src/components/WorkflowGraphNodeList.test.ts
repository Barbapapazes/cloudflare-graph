import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nodeListItems } from '../../test/fixtures'
import WorkflowGraphNodeList from './WorkflowGraphNodeList.vue'

describe('workflowGraphNodeList', () => {
  it('matches the snapshot', () => {
    const wrapper = mount(WorkflowGraphNodeList, {
      props: {
        items: nodeListItems,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nodeCardNode } from './test-fixtures'
import WorkflowGraphNodeCard from './WorkflowGraphNodeCard.vue'

describe('workflowGraphNodeCard', () => {
  it('matches the snapshot', () => {
    const wrapper = mount(WorkflowGraphNodeCard, {
      props: {
        node: nodeCardNode,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})

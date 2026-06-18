import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { complexWorkflow } from './test-fixtures'
import WorkflowGraph from './WorkflowGraph.vue'

describe('workflowGraph', () => {
  it('matches the snapshot', () => {
    const wrapper = mount(WorkflowGraph, {
      props: {
        workflow: complexWorkflow,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})

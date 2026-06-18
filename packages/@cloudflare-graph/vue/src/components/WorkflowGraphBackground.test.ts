import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WorkflowGraphBackground from './WorkflowGraphBackground.vue'

describe('workflowGraphBackground', () => {
  it('matches the snapshot', () => {
    const wrapper = mount(WorkflowGraphBackground, {
      props: {
        patternId: 'snapshot-pattern',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})

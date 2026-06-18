import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WorkflowGraphNodeIcon from './WorkflowGraphNodeIcon.vue'

describe('workflowGraphNodeIcon', () => {
  it.each([
    'step_do',
    'step_sleep',
    'break',
  ] as const)('matches the %s snapshot', (kind) => {
    const wrapper = mount(WorkflowGraphNodeIcon, {
      props: {
        kind,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})

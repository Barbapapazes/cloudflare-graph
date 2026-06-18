import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ScrollableViewport from './ScrollableViewport.vue'

describe('scrollableViewport', () => {
  it('matches the snapshot', () => {
    const wrapper = mount(ScrollableViewport, {
      props: {
        contentClass: 'min-h-48 min-w-56 px-4 py-3',
        viewportClass: 'max-h-24 max-w-28',
      },
      slots: {
        default: `
          <p class="font-medium">Snapshot content</p>
          <p class="text-sm text-neutral-500">Scrollable content keeps its wrapper structure intact.</p>
        `,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})

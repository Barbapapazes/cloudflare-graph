<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ScrollableViewportProps>(), {
  contentClass: undefined,
  dragToScroll: true,
  minThumbSize: 10,
  viewportClass: undefined,
})

defineSlots<{
  default?: () => any
}>()

export interface ScrollableViewportProps {
  contentClass?: HTMLAttributes['class']
  dragToScroll?: boolean
  minThumbSize?: number
  viewportClass?: HTMLAttributes['class']
}

const attrs = useAttrs()
const viewportRef = ref<HTMLDivElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
const isPointerInside = ref(false)
const horizontalMetrics = ref({ thumbOffset: 0, thumbSize: 100 })
const verticalMetrics = ref({ thumbOffset: 0, thumbSize: 100 })

let activePointerId: number | null = null
let dragOriginX = 0
let dragOriginY = 0
let dragScrollLeft = 0
let dragScrollTop = 0
let resizeObserver: ResizeObserver | null = null

const viewportClasses = computed(() => [
  'scrollable-viewport relative overflow-auto overscroll-contain',
  props.dragToScroll
    ? (isDragging.value ? 'cursor-grabbing select-none' : 'cursor-grab')
    : undefined,
  props.viewportClass,
])

const showHorizontalIndicator = computed(() => {
  const viewport = viewportRef.value
  return viewport ? viewport.scrollWidth > viewport.clientWidth + 1 : false
})

const showVerticalIndicator = computed(() => {
  const viewport = viewportRef.value
  return viewport ? viewport.scrollHeight > viewport.clientHeight + 1 : false
})

const indicatorVisibilityClass = computed(() => {
  return isDragging.value || isPointerInside.value
    ? 'opacity-100'
    : 'opacity-0 group-hover:opacity-100'
})

const horizontalThumbStyle = computed(() => ({
  left: `${horizontalMetrics.value.thumbOffset}%`,
  width: `${horizontalMetrics.value.thumbSize}%`,
}))

const verticalThumbStyle = computed(() => ({
  height: `${verticalMetrics.value.thumbSize}%`,
  top: `${verticalMetrics.value.thumbOffset}%`,
}))

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element
    && Boolean(target.closest('a, button, input, textarea, select, option, label, summary, [contenteditable="true"], [data-no-drag-scroll], [draggable="true"]'))
}

function updateScrollIndicators(): void {
  const viewport = viewportRef.value
  if (!viewport)
    return

  const minThumbSize = clamp(props.minThumbSize, 0, 100)
  const verticalTrack = Math.max(viewport.scrollHeight - viewport.clientHeight, 0)
  const horizontalTrack = Math.max(viewport.scrollWidth - viewport.clientWidth, 0)

  const verticalSize = viewport.scrollHeight > 0
    ? clamp((viewport.clientHeight / viewport.scrollHeight) * 100, minThumbSize, 100)
    : 100
  const horizontalSize = viewport.scrollWidth > 0
    ? clamp((viewport.clientWidth / viewport.scrollWidth) * 100, minThumbSize, 100)
    : 100

  verticalMetrics.value = {
    thumbOffset: verticalTrack > 0 ? (viewport.scrollTop / verticalTrack) * (100 - verticalSize) : 0,
    thumbSize: verticalSize,
  }

  horizontalMetrics.value = {
    thumbOffset: horizontalTrack > 0 ? (viewport.scrollLeft / horizontalTrack) * (100 - horizontalSize) : 0,
    thumbSize: horizontalSize,
  }
}

function stopDragging(): void {
  if (!isDragging.value)
    return

  const viewport = viewportRef.value
  const pointerId = activePointerId

  if (viewport && pointerId !== null && viewport.hasPointerCapture(pointerId))
    viewport.releasePointerCapture(pointerId)

  isDragging.value = false
  activePointerId = null
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', handlePointerUp)
  window.removeEventListener('pointercancel', handlePointerUp)
}

function handlePointerMove(event: PointerEvent): void {
  const viewport = viewportRef.value
  if (!viewport || !isDragging.value || activePointerId !== event.pointerId)
    return

  viewport.scrollLeft = dragScrollLeft - (event.clientX - dragOriginX)
  viewport.scrollTop = dragScrollTop - (event.clientY - dragOriginY)
  updateScrollIndicators()
}

function handlePointerUp(event: PointerEvent): void {
  if (activePointerId !== event.pointerId)
    return

  stopDragging()
}

function handlePointerDown(event: PointerEvent): void {
  const viewport = viewportRef.value
  if (!viewport || !props.dragToScroll || event.button !== 0 || event.pointerType === 'touch' || isInteractiveTarget(event.target))
    return

  event.preventDefault()
  activePointerId = event.pointerId
  dragOriginX = event.clientX
  dragOriginY = event.clientY
  dragScrollLeft = viewport.scrollLeft
  dragScrollTop = viewport.scrollTop
  isDragging.value = true
  viewport.setPointerCapture(event.pointerId)

  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', handlePointerUp)
  window.addEventListener('pointercancel', handlePointerUp)
}

defineExpose({
  refresh: updateScrollIndicators,
  viewportRef,
})

onMounted(async () => {
  await nextTick()
  updateScrollIndicators()

  resizeObserver = new ResizeObserver(() => {
    updateScrollIndicators()
  })

  if (viewportRef.value)
    resizeObserver.observe(viewportRef.value)

  if (contentRef.value)
    resizeObserver.observe(contentRef.value)

  window.addEventListener('resize', updateScrollIndicators)
})

onBeforeUnmount(() => {
  stopDragging()
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updateScrollIndicators)
})
</script>

<template>
  <div class="group relative overflow-hidden" v-bind="attrs">
    <div
      ref="viewportRef"
      :class="viewportClasses"
      @pointerdown="handlePointerDown"
      @pointerenter="isPointerInside = true"
      @pointerleave="isPointerInside = false"
      @scroll="updateScrollIndicators"
    >
      <div ref="contentRef" :class="props.contentClass">
        <slot />
      </div>
    </div>

    <div
      v-if="showVerticalIndicator"
      class="pointer-events-none absolute top-4 right-1 bottom-4 w-1.5 rounded-full bg-neutral-200/50 transition-opacity duration-200 dark:bg-neutral-700/50"
      :class="indicatorVisibilityClass"
      aria-hidden="true"
    >
      <div class="absolute w-full rounded-full bg-neutral-400/70 dark:bg-neutral-500/70" :style="verticalThumbStyle" />
    </div>

    <div
      v-if="showHorizontalIndicator"
      class="pointer-events-none absolute right-4 bottom-1 left-4 h-1.5 rounded-full bg-neutral-200/50 transition-opacity duration-200 dark:bg-neutral-700/50"
      :class="indicatorVisibilityClass"
      aria-hidden="true"
    >
      <div class="absolute h-full rounded-full bg-neutral-400/70 dark:bg-neutral-500/70" :style="horizontalThumbStyle" />
    </div>
  </div>
</template>

<style scoped>
.scrollable-viewport {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.scrollable-viewport::-webkit-scrollbar {
	display: none;
	width: 0;
	height: 0;
}
</style>

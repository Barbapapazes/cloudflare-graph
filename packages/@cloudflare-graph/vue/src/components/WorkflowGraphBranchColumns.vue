<script lang="ts" setup>
import type { WorkflowGraphRenderableBranch, WorkflowGraphRenderableBranchColumn, WorkflowGraphRenderableBranchGap, WorkflowGraphRenderableBranchGroup } from '../utils/workflow-graph'
import WorkflowGraphNodeList from './WorkflowGraphNodeList.vue'

const props = defineProps<{
  item: WorkflowGraphRenderableBranchGroup
}>()

function branchLineClass(index: number, branchCount: number, position: 'top' | 'bottom'): string {
  if (branchCount === 1)
    return 'hidden'

  if (index === 0)
    return position === 'top' ? 'left-1/2 right-0 top-0' : 'bottom-0 left-1/2 right-0'

  if (index === branchCount - 1)
    return position === 'top' ? 'left-0 right-1/2 top-0' : 'bottom-0 left-0 right-1/2'

  return position === 'top' ? 'left-0 right-0 top-0' : 'bottom-0 left-0 right-0'
}

function branchLabelConnectorClass(branch: WorkflowGraphRenderableBranch): string {
  return branch.items.length > 0 ? 'h-3' : 'h-10'
}

function branchTailConnectorClass(branch: WorkflowGraphRenderableBranch): string {
  return branch.items.length > 0 ? 'min-h-3' : 'min-h-10'
}

function branchWrapperClass(branch: WorkflowGraphRenderableBranch): string {
  return branch.frame === 'dashed'
    ? 'rounded-3xl border border-dashed border-(--color-connector) px-4 py-0'
    : 'px-4'
}

function branchColumnClass(column: WorkflowGraphRenderableBranchColumn): string {
  switch (column) {
    case 'compact':
      return 'min-w-16'
    case 'standard':
      return 'min-w-20'
    case 'wide':
      return 'min-w-36'
    case 'comfortable':
    default:
      return 'min-w-28'
  }
}

function branchGapClass(gap: WorkflowGraphRenderableBranchGap): string {
  switch (gap) {
    case 'none':
      return 'gap-0'
    case 'compact':
      return 'gap-3'
    case 'wide':
      return 'gap-5'
    case 'standard':
    default:
      return 'gap-4'
  }
}

function branchLabelClass(branch: WorkflowGraphRenderableBranch): string {
  const tone = branch.layout.labelTone === 'muted'
    ? 'bg-neutral-50 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300'
    : 'bg-white text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'

  return `w-fit rounded-full px-1.5 py-0.5 text-xs whitespace-nowrap ring ring-black/15 shadow-xs dark:ring-neutral-700 ${tone}`
}

function showsSharedJunction(): boolean {
  return props.item.layout.sharedJunction && props.item.branches.length > 1
}
</script>

<template>
  <li class="w-fit" :data-branch-group-variant="item.variant">
    <div class="relative">
      <div
        v-if="showsSharedJunction()"
        class="relative -mb-0.75 flex h-[calc(var(--connector-height)/2)] flex-col items-center"
        aria-hidden="true"
      >
        <div class="h-full w-0.5 bg-(--color-connector)" />

        <div class="grid w-full grid-cols-[1fr_auto_1fr] items-center">
          <div class="h-0.5 bg-(--color-connector)" />
          <div class="size-2 rounded-xs bg-(--color-connector)" />
          <div class="h-0.5 bg-(--color-connector)" />
        </div>
      </div>

      <ul class="ml-0 flex list-none" :class="branchGapClass(item.layout.gap)">
        <li
          v-for="(branch, index) in item.branches"
          :key="branch.id"
          class="flex flex-col"
          :class="branchColumnClass(branch.layout.column)"
          :data-branch-role="branch.role"
        >
          <div
            class="relative flex h-6 items-start justify-center text-(--color-connector)"
            aria-hidden="true"
          >
            <div
              class="absolute h-0.5 bg-current"
              :class="branchLineClass(index, item.branches.length, 'top')"
            />
            <div class="absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2 bg-current" />
          </div>

          <div class="relative z-10 flex flex-col items-center">
            <div :class="branchLabelClass(branch)" :title="branch.label">
              {{ branch.label }}
            </div>

            <div class="flex flex-col items-center text-(--color-connector)" :class="branchLabelConnectorClass(branch)">
              <div class="w-0.5 grow bg-current" />
            </div>
          </div>

          <div v-if="branch.items.length > 0" :class="branchWrapperClass(branch)">
            <WorkflowGraphNodeList :items="branch.items" />
          </div>

          <div class="flex grow flex-col items-center text-(--color-connector)" :class="branchTailConnectorClass(branch)">
            <div class="w-0.5 grow bg-current" />
          </div>

          <div
            class="relative flex h-6 items-end justify-center text-(--color-connector)"
            aria-hidden="true"
          >
            <div class="absolute bottom-0 left-1/2 h-full w-0.5 -translate-x-1/2 bg-current" />
            <div
              class="absolute h-0.5 bg-current"
              :class="branchLineClass(index, item.branches.length, 'bottom')"
            />
          </div>
        </li>
      </ul>

      <div
        v-if="showsSharedJunction()"
        class="relative -mt-0.75 -mb-0.75 flex h-[calc(var(--connector-height)/2)] flex-col-reverse items-center"
        aria-hidden="true"
      >
        <div class="h-full w-0.5 bg-(--color-connector)" />

        <div class="grid w-full grid-cols-[1fr_auto_1fr] items-center">
          <div class="h-0.5 bg-(--color-connector)" />
          <div class="size-2 rounded-xs bg-(--color-connector)" />
          <div class="h-0.5 bg-(--color-connector)" />
        </div>
      </div>
    </div>
  </li>
</template>

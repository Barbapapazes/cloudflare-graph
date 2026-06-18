<script lang="ts" setup>
import type { WorkflowGraphRenderableBranch, WorkflowGraphRenderableBranchGroup } from '../utils/workflow-graph'
import { computed } from 'vue'
import WorkflowGraphBranchColumns from './WorkflowGraphBranchColumns.vue'
import WorkflowGraphNodeList from './WorkflowGraphNodeList.vue'

const props = defineProps<{
  item: WorkflowGraphRenderableBranchGroup
}>()

type WorkflowGraphTryRenderableBranch = WorkflowGraphRenderableBranch & {
  role: 'primary' | 'catch' | 'finally'
}

const branches = computed(() => props.item.branches as WorkflowGraphTryRenderableBranch[])

const tryPrimaryBranch = computed(() => branches.value.find(branch => branch.role === 'primary') ?? null)

const trySecondaryBranch = computed(() => {
  return branches.value.find(branch => branch.role === 'catch' || branch.role === 'finally') ?? null
})

const useSpecialLayout = computed(() => {
  return props.item.branches.length === 2
    && !!tryPrimaryBranch.value
    && !!trySecondaryBranch.value
})

function branchLabelClass(branch: WorkflowGraphTryRenderableBranch): string {
  const tone = branch.layout.labelTone === 'muted'
    ? 'bg-neutral-50 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300'
    : 'bg-white text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'

  return `mx-auto w-fit rounded-full px-1.5 py-0.5 text-xs whitespace-nowrap ring ring-black/15 shadow-xs dark:ring-neutral-700 ${tone}`
}

function branchHasItems(branch: WorkflowGraphTryRenderableBranch | null): branch is WorkflowGraphTryRenderableBranch {
  return !!branch && branch.items.length > 0
}
</script>

<template>
  <li v-if="useSpecialLayout && tryPrimaryBranch && trySecondaryBranch" class="w-fit" data-branch-group-variant="try">
    <div class="relative">
      <div
        class="relative -mb-0.75 flex h-[calc(var(--connector-height)/2)] flex-col items-center"
        aria-hidden="true"
      >
        <div class="h-full w-0.5 bg-(--color-connector)" />

        <div class="grid w-full grid-cols-[1fr_auto_1fr] items-center">
          <div class="h-0.5 bg-(--color-connector)" />
          <div class="size-2 rounded-xs bg-(--color-connector)" />
        </div>
      </div>

      <ul class="ml-0 flex list-none">
        <li class="flex min-w-16 flex-col" :data-branch-role="tryPrimaryBranch.role">
          <div class="relative -mt-0.5 flex h-[calc(var(--connector-height)/2)] justify-center text-(--color-connector)" aria-hidden="true">
            <div class="absolute top-0 left-0 right-[calc(50%-12px)] border-t-2 border-(--color-background)" />
            <div class="relative -mr-3.5 h-full w-4 rounded-tl-xl border-t-2 border-l-2 border-current" />
          </div>

          <div class="relative">
            <div class="absolute top-2.5 left-1/2 right-0 h-0.5 bg-(--color-connector)" aria-hidden="true" />

            <div class="relative z-10">
              <div :class="branchLabelClass(tryPrimaryBranch)">
                {{ tryPrimaryBranch.label }}
              </div>

              <div class="flex h-(--connector-height) grow flex-col items-center text-(--color-connector)" style="--connector-height: 12px;" aria-hidden="true">
                <div class="grow w-0.5 bg-current" />
              </div>
            </div>
          </div>

          <div class="-mt-1 -mb-px rounded-3xl border border-dashed border-(--color-connector)">
            <div class="flex h-(--connector-height) grow flex-col items-center text-(--color-connector)" style="--connector-height: 12px;" aria-hidden="true">
              <div class="grow w-0.5 bg-current" />
            </div>

            <div class="px-4">
              <WorkflowGraphNodeList :items="tryPrimaryBranch.items" />
            </div>

            <div class="flex h-(--connector-height) grow flex-col items-center text-(--color-connector)" style="--connector-height: 12px;" aria-hidden="true">
              <div class="grow w-0.5 bg-current" />
            </div>
          </div>

          <div class="flex grow flex-col items-center text-(--color-connector)">
            <div class="w-0.5 grow bg-current" />
          </div>

          <div class="relative -mb-0.5 flex h-[calc(var(--connector-height)/2)] justify-center text-(--color-connector)" aria-hidden="true">
            <div class="absolute bottom-0 left-0 right-[calc(50%-12px)] z-10 border-b-2 border-(--color-background)" />
            <div class="relative z-20 -mr-3.5 h-full w-4 rounded-bl-xl border-b-2 border-l-2 border-current" />
          </div>
        </li>

        <li class="flex min-w-16 flex-col" :data-branch-role="trySecondaryBranch.role">
          <div class="h-[calc(var(--connector-height)/2)]" aria-hidden="true" />

          <div class="relative">
            <div class="absolute top-2 left-0 right-1/2 h-0.5 bg-(--color-connector)" aria-hidden="true" />

            <div class="relative z-10">
              <div :class="branchLabelClass(trySecondaryBranch)">
                {{ trySecondaryBranch.label }}
              </div>

              <div class="flex h-(--connector-height) grow flex-col items-center text-(--color-connector)" style="--connector-height: 12px;">
                <div class="grow w-0.5 bg-current" />
              </div>
            </div>

            <div class="flex h-(--connector-height) grow flex-col items-center text-(--color-connector)" style="--connector-height: 7px;" aria-hidden="true">
              <div class="grow w-0.5 bg-current" />
            </div>
          </div>

          <div v-if="branchHasItems(trySecondaryBranch)" class="px-4">
            <WorkflowGraphNodeList :items="trySecondaryBranch.items" />
          </div>
          <div v-else class="px-4" />

          <div class="flex grow flex-col items-center text-(--color-connector)">
            <div class="w-0.5 grow bg-current" />
          </div>

          <div class="relative -mb-0.5 flex h-[calc(var(--connector-height)/2)] justify-center text-(--color-connector)" aria-hidden="true">
            <div class="absolute right-0 bottom-0 left-[calc(50%-12px)] z-10 border-b-2 border-(--color-background)" />
            <div class="relative z-20 -ml-3.5 h-full w-4 rounded-br-xl border-r-2 border-b-2 border-current" />
          </div>
        </li>
      </ul>

      <div
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

  <WorkflowGraphBranchColumns v-else :item="item" />
</template>

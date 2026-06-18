<script lang="ts" setup>
import type { WorkflowGraphRenderableNode } from '../utils/workflow-graph'
import WorkflowGraphNodeIcon from './WorkflowGraphNodeIcon.vue'

defineProps<{
  node: WorkflowGraphRenderableNode
}>()
</script>

<template>
  <li>
    <div class="w-fit">
      <div class="mx-auto h-1.25 w-2.5 rounded-t-xs bg-(--color-connector)" />

      <article
        class="relative z-20 w-fit overflow-hidden rounded-lg bg-white text-base ring ring-black/20 shadow-md shadow-black/7 dark:bg-neutral-900 dark:ring-neutral-800"
        :class="{
          'border border-dashed border-neutral-300 dark:border-neutral-700': node.kind === 'unsupported',
        }"
      >
        <header class="flex justify-between border-b border-neutral-200 bg-neutral-50 px-2 py-1 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
          <p class="font-mono text-xs">
            {{ node.displayType }}
          </p>
        </header>

        <div class="flex gap-1 py-2 pr-2.5 pl-2">
          <WorkflowGraphNodeIcon :kind="node.kind" />

          <span class="min-w-0 truncate font-medium" :title="node.label">
            {{ node.label }}
          </span>
        </div>

        <p
          v-if="node.description"
          class="px-2 pb-2 text-xs text-neutral-500 dark:text-neutral-400"
        >
          {{ node.description }}
        </p>
      </article>

      <div class="relative z-30 mx-auto -mt-1.5 size-3 rounded border border-black/20 bg-white dark:border-neutral-700 dark:bg-neutral-800" />
    </div>
  </li>
</template>

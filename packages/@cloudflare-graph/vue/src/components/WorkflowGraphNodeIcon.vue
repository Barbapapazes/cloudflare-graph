<script lang="ts" setup>
import type { WorkflowGraphRenderableKind } from '../utils/workflow-graph'
import checkSquare from '~icons/ph/check-square'
import clock from '~icons/ph/clock'
import warningCircle from '~icons/ph/warning-circle'

defineProps<{
  kind: WorkflowGraphRenderableKind
}>()
</script>

<template>
  <span class="flex items-center" aria-hidden="true">
    <clock
      v-if="kind === 'step_sleep' || kind === 'step_wait_for_event'"
      class="size-4"
    />

    <check-square
      v-else-if="kind === 'step_do' || kind === 'function_call'"
      class="size-4"
    />

    <warning-circle
      v-else
      class="size-4 text-neutral-500 dark:text-neutral-400"
    />
  </span>
</template>

<script lang="ts" setup>
import type { WorkflowGraphRenderableItem } from '../utils/workflow-graph'
import WorkflowGraphBranchGroup from './WorkflowGraphBranchGroup.vue'
import WorkflowGraphNodeCard from './WorkflowGraphNodeCard.vue'

defineProps<{
  items: WorkflowGraphRenderableItem[]
}>()
</script>

<template>
  <ul class="ml-0 flex list-none flex-col items-center">
    <template v-for="(item, index) in items" :key="item.id">
      <WorkflowGraphBranchGroup v-if="item.kind === 'branches'" :item="item" />
      <WorkflowGraphNodeCard v-else :node="item" />

      <div
        v-if="index < items.length - 1"
        class="flex h-(--connector-height) grow flex-col items-center text-(--color-connector)"
        aria-hidden="true"
      >
        <div class="w-0.5 grow bg-current" />
      </div>
    </template>
  </ul>
</template>

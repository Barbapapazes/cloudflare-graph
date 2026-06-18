<script lang="ts" setup>
import type { WorkflowGraphRenderableBranchGroup } from '../utils/workflow-graph'
import WorkflowGraphConditionalBranchGroup from './WorkflowGraphConditionalBranchGroup.vue'
import WorkflowGraphLoopBranchGroup from './WorkflowGraphLoopBranchGroup.vue'
import WorkflowGraphParallelBranchGroup from './WorkflowGraphParallelBranchGroup.vue'
import WorkflowGraphTryBranchGroup from './WorkflowGraphTryBranchGroup.vue'

defineProps<{
  item: WorkflowGraphRenderableBranchGroup
}>()
</script>

<template>
  <WorkflowGraphTryBranchGroup v-if="item.variant === 'try'" :item="item" />
  <WorkflowGraphConditionalBranchGroup v-else-if="item.variant === 'conditional'" :item="item" />
  <WorkflowGraphParallelBranchGroup v-else-if="item.variant === 'parallel'" :item="item" />
  <WorkflowGraphLoopBranchGroup v-else :item="item" />
</template>

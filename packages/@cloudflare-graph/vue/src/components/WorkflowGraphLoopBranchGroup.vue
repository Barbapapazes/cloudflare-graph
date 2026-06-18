<script lang="ts" setup>
import type { WorkflowGraphRenderableBranchGroup } from '../utils/workflow-graph'
import WorkflowGraphBranchColumns from './WorkflowGraphBranchColumns.vue'

defineProps<{
  item: WorkflowGraphRenderableBranchGroup
}>()
</script>

<template>
  <WorkflowGraphBranchColumns :item="item" />
</template>

<script lang="ts" setup>
import type { WorkflowGraphWorkflow } from '../types/graph'
import { computed, useId } from 'vue'
import { createWorkflowGraphViewModel } from '../utils/workflow-graph'
import WorkflowGraphBackground from './WorkflowGraphBackground.vue'
import WorkflowGraphNodeList from './WorkflowGraphNodeList.vue'

const props = defineProps<{
  workflow: WorkflowGraphWorkflow
}>()

const viewModel = computed(() => createWorkflowGraphViewModel(props.workflow))

const backgroundPatternId = `workflow-graph-pattern-${useId()}`
</script>

<template>
  <div class="relative isolate overflow-hidden">
    <WorkflowGraphBackground :pattern-id="backgroundPatternId" />

    <div class="relative grow isolate overflow-hidden px-4 py-16">
      <div class="mx-auto w-max" style="transform: none;">
        <div
          class="relative mx-auto w-fit"
          style="--connector-height: 50px; --color-connector: light-dark(rgb(163 163 163), rgb(82 82 82)); --color-connector-active: light-dark(rgb(115 115 115), rgb(212 212 212)); --color-background: rgb(250 250 250);"
        >
          <div>
            <div class="relative z-30 mx-auto size-3 rounded border border-black/20 bg-white dark:border-neutral-700 dark:bg-neutral-800" />
            <div class="mx-auto h-3 w-0.5 bg-(--color-connector)" />
          </div>

          <WorkflowGraphNodeList :items="viewModel.nodes" />

          <div>
            <div class="mx-auto h-3 w-0.5 bg-(--color-connector)" />
            <div class="relative z-10 mx-auto size-2.5 rounded border border-current bg-current text-(--color-connector)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

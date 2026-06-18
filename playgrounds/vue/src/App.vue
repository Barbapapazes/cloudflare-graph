<script lang="ts" setup>
import graph from 'cloudflare:graph'
import {ScrollableViewport, WorkflowGraph} from '@cloudflare-graph/vue'
</script>

<template>
  <main class="h-dvh overflow-hidden bg-white font-sans text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
    <div class="mx-auto flex h-full w-full max-w-6xl items-center justify-center p-6">
      <section
        class="group relative flex h-full w-full max-h-125 max-w-125 aspect-square flex-none flex-col overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 dark:shadow-none"
      >
        <ScrollableViewport
          class="size-full"
          viewport-class="size-full"
          content-class="min-h-full min-w-full w-max"
        >
          <WorkflowGraph :workflow="graph" />
        </ScrollableViewport>
      </section>
    </div>
  </main>
</template>

# @cloudflare-graph/vue

Vue components for rendering Cloudflare Workflow graphs.

## Install

```bash
pnpm add @cloudflare-graph/vue vue
```

## Tailwind setup

This package is Tailwind-native. Importing components from the package root automatically loads the packaged CSS, including extracted Vue SFC styles.

If you prefer an explicit stylesheet import in your application CSS so the Tailwind source registration is visible in one place, the package still exposes `@cloudflare-graph/vue/style.css`.

```css
@import "tailwindcss";
@import "@cloudflare-graph/vue/style.css";
```

## Usage

Prefer the root package exports.

```vue
<script setup lang="ts">
import type { WorkflowGraphWorkflow } from '@cloudflare-graph/vue'
import { ScrollableViewport, WorkflowGraph } from '@cloudflare-graph/vue'

const workflow: WorkflowGraphWorkflow = {
  class_name: 'deploy-workflow',
  functions: {},
  nodes: [],
  payload: { type: 'unknown' },
}
</script>

<template>
  <ScrollableViewport class="h-[32rem] w-full" viewport-class="size-full" content-class="min-h-full min-w-full w-max">
    <WorkflowGraph :workflow="workflow" />
  </ScrollableViewport>
</template>
```

# @cloudflare-graph/vue

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![pkg.pr.new](https://pkg.pr.new/badge/Barbapapazes/cloudflare-graph)](https://pkg.pr.new/~/Barbapapazes/cloudflare-graph)

Vue components for rendering Cloudflare Workflow graphs.

- ✅ Root exports: `WorkflowGraph` and `ScrollableViewport`
- 🎨 Component styles are bundled with the exported Vue components
- 🧭 Tailwind source registration via the package CSS entry

## Installation

```bash
pnpm add @cloudflare-graph/vue vue
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

## Configuration

This package is Tailwind-native.

- Importing components from `@cloudflare-graph/vue` includes component-scoped styles bundled from Vue SFCs.
- Importing `@cloudflare-graph/vue` in your app CSS registers this package as a Tailwind source.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| Component scoped styles | `automatic` | `enabled` | Styles defined in exported Vue components are bundled and loaded with those components. |
| Tailwind source registration | `css import` | `recommended` | Import `@cloudflare-graph/vue` in your app CSS to register this package with Tailwind. |

### Tailwind CSS import

```css
@import "tailwindcss";
@import "@cloudflare-graph/vue";
```

## Sponsors

<p align="center">
  <a href="https://github.com/sponsors/barbapapazes">
    <img src="https://cdn.jsdelivr.net/gh/barbapapazes/static/sponsors.svg" alt="Sponsor Barbapapazes" />
  </a>
</p>

## License

[MIT](../../../LICENSE) License © 2026-PRESENT [Estéban Soubiran](https://github.com/barbapapazes)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/%40cloudflare-graph%2Fvue/latest.svg?style=flat&colorA=000&colorB=171717
[npm-version-href]: https://npmjs.com/package/@cloudflare-graph/vue

[npm-downloads-src]: https://img.shields.io/npm/dm/%40cloudflare-graph%2Fvue.svg?style=flat&colorA=000&colorB=171717
[npm-downloads-href]: https://npmjs.com/package/@cloudflare-graph/vue

[license-src]: https://img.shields.io/npm/l/%40cloudflare-graph%2Fvue.svg?style=flat&colorA=000&colorB=171717
[license-href]: https://npmjs.com/package/@cloudflare-graph/vue

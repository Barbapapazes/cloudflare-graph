# cloudflare-graph

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![pkg.pr.new](https://pkg.pr.new/badge/Barbapapazes/cloudflare-graph)](https://pkg.pr.new/~/Barbapapazes/cloudflare-graph)

Tailwind-native Vue components for rendering Cloudflare Workflow graphs.

- 📦 Package: [`packages/@cloudflare-graph/vue`](./packages/@cloudflare-graph/vue)
- 🧪 Demo app: [`playgrounds/vue`](./playgrounds/vue)

## Installation

```bash
pnpm add @cloudflare-graph/vue vue
```

## Usage

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

More details (configuration, Tailwind integration, etc.) are in the package README:
[`packages/@cloudflare-graph/vue/README.md`](./packages/@cloudflare-graph/vue/README.md).

## Development

This repo is a pnpm workspace.

- Install: `pnpm install --frozen-lockfile`
- Lint: `pnpm run lint`
- Test: `pnpm run test`
- Build packages: `pnpm run build`
- Build playgrounds: `pnpm run build:playgrounds`
- Run Vue playground: `pnpm --filter vue dev`

## Sponsors

<p align="center">
	<a href="https://github.com/sponsors/barbapapazes">
		<img src="https://cdn.jsdelivr.net/gh/barbapapazes/static/sponsors.svg" alt="Sponsor Barbapapazes" />
	</a>
</p>

## License

[MIT](./LICENSE) License © 2026-PRESENT [Estéban Soubiran](https://github.com/barbapapazes)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/%40cloudflare-graph%2Fvue/latest.svg?style=flat&colorA=000&colorB=171717
[npm-version-href]: https://npmjs.com/package/@cloudflare-graph/vue

[npm-downloads-src]: https://img.shields.io/npm/dm/%40cloudflare-graph%2Fvue.svg?style=flat&colorA=000&colorB=171717
[npm-downloads-href]: https://npmjs.com/package/@cloudflare-graph/vue

[license-src]: https://img.shields.io/npm/l/%40cloudflare-graph%2Fvue.svg?style=flat&colorA=000&colorB=171717
[license-href]: https://npmjs.com/package/@cloudflare-graph/vue

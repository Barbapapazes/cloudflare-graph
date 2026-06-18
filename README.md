# Cloudflare Graph

Tailwind-native Vue components for rendering Cloudflare Workflow graphs, plus a small playground for local development against real workflow data.

## Workspace layout

- `packages/@cloudflare-graph/vue`: the publishable Vue package
- `playgrounds/vue`: a local Vite playground wired to the package

## Development

- `pnpm run lint`: run ESLint across the workspace
- `pnpm run test`: run package test suites in CI mode
- `pnpm run build`: build publishable workspace packages
- `pnpm run build:playgrounds`: build local playground apps

## Package usage

The main library lives in `@cloudflare-graph/vue`. For package-level install and usage details, see `packages/@cloudflare-graph/vue/README.md`.

## Playground usage

The demo app in `playgrounds/vue` can fetch live workflow graph data from Cloudflare. For setup instructions, see `playgrounds/vue/README.md`.

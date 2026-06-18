# Vue playground

This playground runs the local `@cloudflare-graph/vue` package inside a Vite app and can fetch the latest Cloudflare Workflow graph for a real account.

## Setup

Copy `.env.example` to `.env` and fill in these variables:

- `VITE_CLOUDFLARE_ACCOUNT_ID`
- `VITE_CLOUDFLARE_API_TOKEN`
- `VITE_CLOUDFLARE_WORKFLOW_NAME`

## Run

```bash
pnpm install
pnpm --filter vue dev
```

## Tailwind note

The playground imports `@cloudflare-graph/vue/style.css`, which is the same Tailwind-native integration path package consumers should use.

# Vue playground

This playground runs the local `@cloudflare-graph/vue` package inside a Vite app and can fetch the latest Cloudflare Workflow graph for a real account.

## Setup

Copy `.env.example` to `.env` and fill in these variables:

- `VITE_CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID to fetch the workflow graph from
- `VITE_CLOUDFLARE_API_TOKEN`: a Cloudflare API token with permissions to read workflows
- `VITE_CLOUDFLARE_WORKFLOW_NAME`: the name of the workflow to fetch and render

## Run

```bash
pnpm install
```

```bash
pnpm --filter vue dev
```

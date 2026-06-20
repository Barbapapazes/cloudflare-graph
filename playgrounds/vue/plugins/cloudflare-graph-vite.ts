import type { WorkflowGraphWorkflow } from '@cloudflare-graph/vue'
import type { Plugin, ResolvedConfig } from 'vite'
import process from 'node:process'
import Cloudflare from 'cloudflare'
import { loadEnv } from 'vite'
import { fallbackWorkflow } from './_fallback-workflow'

interface WorkflowVersionGraphResponse {
  result: {
    graph: {
      workflow: WorkflowGraphWorkflow
    }
  }
}

export function cloudflareGraphPlugin(): Plugin {
  let resolvedConfig: ResolvedConfig | null = null
  const moduleId = 'cloudflare:graph'

  return {
    name: 'cloudflare-graph',
    configResolved(config) {
      resolvedConfig = config
    },
    resolveId: {
      filter: {
        id: new RegExp(`^${moduleId}$`),
      },
      handler: async () => {
        return `\0${moduleId}`
      },
    },
    load: {
      filter: {
        id: new RegExp(`^\\0${moduleId}$`),
      },
      handler: async () => {
        const env = loadEnv(resolvedConfig?.mode ?? 'development', process.cwd())

        if (!env.VITE_CLOUDFLARE_ACCOUNT_ID || !env.VITE_CLOUDFLARE_API_TOKEN || !env.VITE_CLOUDFLARE_WORKFLOW_NAME)
          return `export default ${JSON.stringify(fallbackWorkflow)}`

        try {
          const client = new Cloudflare({
            apiToken: env.VITE_CLOUDFLARE_API_TOKEN,
          })

          const versions = await client.workflows.versions.list(env.VITE_CLOUDFLARE_WORKFLOW_NAME, {
            account_id: env.VITE_CLOUDFLARE_ACCOUNT_ID,
          })
          const latestVersion = versions.result.find(version => version.has_dag)

          if (!latestVersion)
            return `export default ${JSON.stringify(fallbackWorkflow)}`

          const graph = await client.request({
            method: 'get',
            path: `/accounts/${env.VITE_CLOUDFLARE_ACCOUNT_ID}/workflows/${env.VITE_CLOUDFLARE_WORKFLOW_NAME}/versions/${latestVersion.id}/graph`,
          }) as WorkflowVersionGraphResponse

          return `export default ${JSON.stringify(graph.result.graph.workflow)}`
        }
        catch {
          return `export default ${JSON.stringify(fallbackWorkflow)}`
        }
      },
    },
  }
}

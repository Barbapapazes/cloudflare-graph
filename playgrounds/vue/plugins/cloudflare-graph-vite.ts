import type { WorkflowGraphWorkflow } from '@cloudflare-graph/vue'
import type { Plugin } from 'vite'
import process from 'node:process'
import { exactRegex } from '@rolldown/pluginutils'
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
  const virtualModuleId = 'virtual:cloudflare-graph'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  return {
    name: 'cloudflare-graph',
    resolveId: {
      filter: { id: exactRegex(virtualModuleId) },
      handler: () => {
        return resolvedVirtualModuleId
      },
    },
    load: {
      filter: { id: exactRegex(resolvedVirtualModuleId) },
      handler: async () => {
        const env = loadEnv('', process.cwd(), 'CLOUDFLARE_')

        const client = new Cloudflare({
          apiToken: env.CLOUDFLARE_API_TOKEN,
        })

        const versions = await client.workflows.versions.list(env.CLOUDFLARE_WORKFLOW_NAME!, {
          account_id: env.CLOUDFLARE_ACCOUNT_ID!,
        })
        const latestVersion = versions.result.find(version => version.has_dag)

        if (!latestVersion)
          return `export default ${JSON.stringify(fallbackWorkflow)}`

        const graph = await client.request({
          method: 'get',
          path: `/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/workflows/${env.CLOUDFLARE_WORKFLOW_NAME}/versions/${latestVersion.id}/graph`,
        }) as WorkflowVersionGraphResponse

        return `export default ${JSON.stringify(graph.result.graph.workflow)}`
      },
    },
  }
}

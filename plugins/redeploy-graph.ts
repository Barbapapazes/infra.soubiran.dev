import process from 'node:process'
import { exactRegex } from '@rolldown/pluginutils'
import Cloudflare from 'cloudflare'

export function redeployGraphPlugin() {
  const virtualModuleId = 'virtual:redeploy-graph'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  const workflowName = 'redeploy-soubiran-dev'

  return {
    name: 'redeploy-graph-plugin',
    resolveId: {
      filter: { id: exactRegex(virtualModuleId) },
      handler() {
        return resolvedVirtualModuleId
      },
    },
    load: {
      filter: { id: exactRegex(resolvedVirtualModuleId) },
      async handler() {
        const client = new Cloudflare({
          apiToken: process.env.CLOUDFLARE_API_TOKEN,
        })

        const versions = await client.workflows.versions.list(workflowName, {
          account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
        })
        const latestVersion = versions.result.find(version => version.has_dag)

        if (!latestVersion) {
          throw new Error('No workflow version with a DAG found.')
        }

        const graph = await client.request({
          method: 'get',
          path: `/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/workflows/${workflowName}/versions/${latestVersion.id}/graph`,
        }) as any

        return `export default ${JSON.stringify(graph.result.graph.workflow)}`
      },
    },
  }
}

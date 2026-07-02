export type EcosystemType
  = | 'build'
    | 'ci/cd'
    | 'data'
    | 'deployment'
    | 'domain'
    | 'services'
    | 'database'
    | 'object-storage'
    | 'platform'
    | 'repository'
    | 'stack'
    | 'website'
    | 'realtime'
    | 'auth'
    | 'workflows'
export type EcosystemName
  = | 'Cloudflare Workers'
    | 'Cloudflare Build'
    | 'Cloudflare R2'
    | 'Cloudflare D1'
    | 'Cloudflare Browser Run'
    | 'Cloudflare Domains'
    | 'Cloudflare Workflows'
    | 'Forge'
    | 'Hetzner'
    | 'Authentik'
    | 'GitHub'
    | 'Vite'
    | 'PartyKit'
    | 'Vue'
    | 'Nuxt'
    | 'Hono'
    | 'VitePress'
    | 'Slidev'
    | 'Pinia Colada'
    | 'Inertia.js'
    | 'Laravel'
    | 'SQLite'
    | 'Litestream'
    | ({} & string)

export interface EcosystemDescriptionEntry {
  text: string
  from?: string[]
}

export interface BaseEcosystemItem {
  type?: EcosystemType
  id?: string
  name: EcosystemName
  href?: string
}

export interface EcosystemItem extends BaseEcosystemItem {
  description?: string
  ecosystem?: EcosystemItem[]
}

export interface EcosystemNodeItem extends BaseEcosystemItem {
  descriptionEntries: EcosystemDescriptionEntry[]
}

export type Ecosystem = EcosystemItem[]

export type EcosystemType
  = | 'build'
    | 'ci/cd'
    | 'data'
    | 'deployment'
    | 'domain'
    | 'internal-tool'
    | 'object-storage'
    | 'repository'
    | 'service'
    | 'stack'
    | 'website'
    | 'realtime'
    | 'auth'
    | 'workflows'
export type EcosystemName
  = | 'Cloudflare Workers'
    | 'Cloudflare Build'
    | 'Cloudflare R2'
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
    | 'VitePress'
    | 'Slidev'
    | 'Pinia Colada'
    | 'Inertia.js'
    | 'Laravel'
    | 'SQLite'
    | 'Litestream'
    | ({} & string)

export type EcosystemRelationship = 'consumer' | 'producer'

export interface EcosystemItem {
  type?: EcosystemType
  /** Relationship to the parent node. Defaults to producer. */
  relationship?: EcosystemRelationship
  id?: string
  name: EcosystemName
  description?: string
  descriptions?: string[]
  href?: string
  ecosystem?: EcosystemItem[]
}

export type Ecosystem = EcosystemItem[]

export type EcosystemType
  = | 'build'
    | 'ci/cd'
    | 'data'
    | 'deployment'
    | 'domain'
    | 'object-storage'
    | 'platform'
    | 'repository'
    | 'stack'
    | 'website'
    | 'realtime'
    | 'auth'
export type EcosystemName
  = | 'Cloudflare Workers'
    | 'Cloudflare Build'
    | 'Cloudflare R2'
    | 'Cloudflare Domains'
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

export interface EcosystemItem {
  type?: EcosystemType
  id?: string
  name: EcosystemName
  description?: string
  href?: string
  ecosystem?: EcosystemItem[]
}

export type Ecosystem = EcosystemItem[]

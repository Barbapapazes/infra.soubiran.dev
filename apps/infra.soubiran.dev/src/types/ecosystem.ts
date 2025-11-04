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
export type EcosystemPlatform
  = | 'Cloudflare Workers'
    | 'Cloudflare Build'
    | 'Cloudflare R2'
    | 'Cloudflare Domains'
    | 'GitHub'
    | 'Slidev'
    | 'VitePress'
    | 'Pinia Colada'
    | 'Vite'
    | 'Vue'
    | ({} & string)

export interface EcosystemItem {
  type?: EcosystemType
  name?: string
  platform: EcosystemPlatform
  description?: string
  href?: string
  ecosystem?: EcosystemItem[]
}

export type Ecosystem = EcosystemItem[]

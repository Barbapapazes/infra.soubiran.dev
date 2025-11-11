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
export type EcosystemName
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
    | 'PartyKit'
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

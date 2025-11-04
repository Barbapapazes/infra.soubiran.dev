export type EcosystemType = 'deployment' | 'build' | 'repository' | 'data' | 'object-storage' | 'domain' | 'website' | 'ci/cd'
export type EcosystemPlatform = 'Cloudflare Workers' | 'Cloudflare Build' | 'Cloudflare R2' | 'Cloudflare Domains' | 'GitHub' | ({} & string)

export interface EcosystemItem {
  type: EcosystemType
  platform: EcosystemPlatform
  description?: string
  href?: string
  ecosystem?: EcosystemItem[]
}

export type Ecosystem = EcosystemItem[]

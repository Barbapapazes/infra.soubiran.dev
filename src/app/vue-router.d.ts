import type { Ecosystem } from '@/app/types/ecosystem'
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    frontmatter: {
      page: string
      title: string
      description: string
      url?: string
      repository?: string | {
        url: string
        private?: boolean
      }
      ecosystem?: Ecosystem
    }
  }
}

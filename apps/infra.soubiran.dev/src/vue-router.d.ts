import type { Ecosystem } from '@/types/ecosystem'
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    frontmatter: {
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

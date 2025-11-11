import type { Ecosystem } from '@/types/ecosystem'
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    frontmatter: {
      title: string
      ecosystem?: Ecosystem
    }
  }
}

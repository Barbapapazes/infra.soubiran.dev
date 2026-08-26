import type { BreadcrumbItem, StructuredDataPageConfig } from '@soubiran/vite/types'
import soubiran from '@soubiran/vite'
import { getUri, toUrl } from '@soubiran/vite/utils'
import { defineConfig } from 'vite'
import { generatePagesJson } from './plugins/generate-pages-json'
import { verifyEcosystemLinks } from './plugins/verify-ecosystem-links'

const title = 'Estéban\'s Infra'
const hostname = 'infra.soubiran.dev'

export default defineConfig({
  plugins: [
    verifyEcosystemLinks(),
    generatePagesJson({
      hostname,
      pagesDir: 'src/app/pages',
      outputFile: 'pages.json',
    }),
    soubiran({
      title,
      hostname,
      router: {
        extractPage,
      },
      markdown: {
        extractPage,
        options: {
          transforms: {
            before: (code: string, id: string) => {
              const page = extractPage(id)

              if (page?.endsWith('-show')) {
                return `${code}\n\n## Ecosystem`
              }

              return code
            },
          },
          wrapperComponent: (id) => {
            const page = extractPage(id)

            if (page === 'services-index') {
              return 'WrapperServices'
            }

            if (page === 'websites-index') {
              return 'WrapperWebsites'
            }

            if (page === 'internal-tools-index') {
              return 'WrapperInternalTools'
            }

            return 'WrapperContent'
          },
        },
      },
      seo: {
        assert: {
          rules: (id, frontmatter) => {
          // Check if this is a project page (not index pages)
            const isProject = (id.includes('/services/') || id.includes('/websites/') || id.includes('/internal-tools/'))
              && !id.endsWith('index.md')

            if (isProject && !frontmatter.url) {
              throw new Error(
                `Missing required field 'url' in frontmatter for file: ${id}`,
              )
            }

            if (isProject && !frontmatter.repository) {
              throw new Error(
                `Missing required field 'repository' in frontmatter for file: ${id}`,
              )
            }
          },
        },
        structuredData: {
          pageConfig: (page, frontmatter): StructuredDataPageConfig => {
            if (page === 'services-show' || page === 'websites-show' || page === 'internal-tools-show') {
              const category = page === 'services-show'
                ? 'services'
                : page === 'websites-show'
                  ? 'websites'
                  : 'internal-tools'
              const categoryTitle = page === 'services-show'
                ? 'Services'
                : page === 'websites-show'
                  ? 'Websites'
                  : 'Internal tools'
              const breadcrumbItems: BreadcrumbItem[] = [
                {
                  title,
                  type: 'WebSite',
                  url: toUrl(hostname),
                },
                {
                  title: categoryTitle,
                  type: 'WebPage',
                  url: toUrl(hostname, category),
                },
                {
                  title: frontmatter.title,
                },
              ]

              return {
                type: 'article',
                breadcrumbItems,
              }
            }

            if (page === 'services-index' || page === 'websites-index' || page === 'internal-tools-index') {
              return { type: 'collection' }
            }

            return { type: 'default' }
          },
        },
      },
      api: {
        categories: ['websites', 'services', 'internal-tools'],
      },
    }),
  ],
  optimizeDeps: {
    include: [
      '@dagrejs/dagre',
      '@vue-flow/background',
      '@vue-flow/core',
      'scule',
    ],
  },
})

type Page = 'index' | 'services-index' | 'services-show' | 'websites-index' | 'websites-show' | 'internal-tools-index' | 'internal-tools-show' | 'ecosystem'

function extractPage(id: string): Page | null {
  const uri = getUri(id)

  if (uri === '/') {
    return 'index'
  }

  if (uri === 'services') {
    return 'services-index'
  }

  if (uri.startsWith('services/')) {
    return 'services-show'
  }

  if (uri === 'websites') {
    return 'websites-index'
  }

  if (uri.startsWith('websites/')) {
    return 'websites-show'
  }

  if (uri === 'internal-tools') {
    return 'internal-tools-index'
  }

  if (uri.startsWith('internal-tools/')) {
    return 'internal-tools-show'
  }

  if (uri === 'ecosystem') {
    return 'ecosystem'
  }

  return null
}

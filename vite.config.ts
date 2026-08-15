import type { BreadcrumbItem, StructuredDataPageConfig } from '@soubiran/vite/types'
import ui from '@soubiran/ui/ui'
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
      ui: {
        ui,
      },
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

            if (page === 'platforms-index') {
              return 'WrapperPlatforms'
            }

            if (page === 'websites-index') {
              return 'WrapperWebsites'
            }

            return 'WrapperContent'
          },
        },
      },
      seo: {
        assert: {
          rules: (id, frontmatter) => {
          // Check if this is a platform or website page (not index pages)
            const isPlatformOrWebsite = (id.includes('/platforms/') || id.includes('/websites/'))
              && !id.endsWith('index.md')

            // Validate url field for platform/website pages
            if (isPlatformOrWebsite && !frontmatter.url) {
              throw new Error(
                `Missing required field 'url' in frontmatter for file: ${id}`,
              )
            }

            // Validate repository field for platform/website pages
            if (isPlatformOrWebsite && !frontmatter.repository) {
              throw new Error(
                `Missing required field 'repository' in frontmatter for file: ${id}`,
              )
            }
          },
        },
        structuredData: {
          pageConfig: (page, frontmatter): StructuredDataPageConfig => {
            if (page === 'platforms-show' || page === 'websites-show') {
              const breadcrumbItems: BreadcrumbItem[] = [
                {
                  title,
                  type: 'WebSite',
                  url: toUrl(hostname),
                },
                {
                  title: page === 'platforms-show' ? 'Platforms' : 'Websites',
                  type: 'WebPage',
                  url: toUrl(hostname, page === 'platforms-show' ? 'platforms' : 'websites'),
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

            if (page === 'platforms-index' || page === 'websites-index') {
              return { type: 'collection' }
            }

            return { type: 'default' }
          },
        },
      },
      api: {
        categories: ['websites', 'platforms'],
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

type Page = 'index' | 'platforms-index' | 'platforms-show' | 'websites-index' | 'websites-show' | 'ecosystem'

function extractPage(id: string): Page | null {
  const uri = getUri(id)

  if (uri === '/') {
    return 'index'
  }

  if (uri === 'platforms') {
    return 'platforms-index'
  }

  if (uri.startsWith('platforms/')) {
    return 'platforms-show'
  }

  if (uri === 'websites') {
    return 'websites-index'
  }

  if (uri.startsWith('websites/')) {
    return 'websites-show'
  }

  if (uri === 'ecosystem') {
    return 'ecosystem'
  }

  return null
}

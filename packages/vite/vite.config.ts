/// <reference types="vite-ssg" />
import type MarkdownIt from 'markdown-it'
import type { UserConfig } from 'vite'
import ui from '@nuxt/ui/vite'
import shiki from '@shikijs/markdown-it'
import vue from '@vitejs/plugin-vue'
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'
// @ts-expect-error No declaration file
import implicitFigures from 'markdown-it-image-figures'
import linkAttributes from 'markdown-it-link-attributes'
import { joinURL } from 'ufo'
import fonts from 'unplugin-fonts/vite'
import markdown from 'unplugin-vue-markdown/vite'
import vueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import { canonical } from './src/canonical'
import { og } from './src/og'
import { resolveAll } from './src/promise'
import { routes, sitemap } from './src/sitemap'

const config: UserConfig = {}

export default (hostname: string) => defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),

    ui({
      autoImport: {
        dts: 'src/auto-imports.d.ts',
        imports: [
          'vue',
          {
            from: 'tailwind-variants',
            imports: ['tv'],
          },
        ],

      },
      components: {
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/components.d.ts',
      },
      ui: {
        colors: {
          neutral: 'neutral',
        },
      },
    }),

    vueRouter({
      extensions: ['.vue', '.md'],
      routesFolder: 'pages',
      dts: 'src/typed-router.d.ts',
    }),

    markdown({
      headEnabled: true,
      wrapperClasses: [
        'max-w-none',
        'prose prose-neutral dark:prose-invert',
        'prose-headings:text-default prose-h2:text-[1.125em] prose-h2:mb-[0.5em] prose-h3:text-[1em]',
        'prose-p:my-[1em] dark:prose-p:text-muted prose-p:font-medium',
        'dark:prose-strong:text-default',
        'dark:prose-a:text-muted prose-a:font-semibold prose-a:no-underline prose-a:border-b prose-a:border-muted prose-a:transition-colors prose-a:duration-300 prose-a:ease-out prose-a:hover:border-[var(--ui-text-dimmed)]',
        'prose-hr:max-w-1/2 prose-hr:mx-auto prose-hr:my-[2em]',
        'prose-figure:bg-neutral-100 dark:prose-figure:bg-neutral-800 prose-figure:rounded-lg',
        'prose-img:rounded-lg prose-img:border prose-img:border-accented prose-img:shadow-md',
        'prose-video:rounded-lg prose-video:border prose-video:border-accented prose-video:shadow-md',
        'prose-figcaption:text-center prose-figcaption:py-1 prose-figcaption:m-0',
        '[&_:first-child]:mt-0 [&_:last-child]:mb-0',
      ],
      wrapperComponent: 'WrapperContent',

      async markdownItSetup(md) {
        md.use(MarkdownItGitHubAlerts)

        md.use(implicitFigures, { figcaption: 'alt' })

        md.use(linkAttributes, [
          {
            matcher: (link: string) => /^https?:\/\/soubiran\.dev/.test(link),
            attrs: {
              target: '_blank',
            },
          },
          {
            matcher: (link: string) => /^https?:\/\//.test(link),
            attrs: {
              target: '_blank',
              rel: 'noopener',
            },
          },
        ])
        md.use((md: MarkdownIt) => {
          const linkRule = md.renderer.rules.link_open!
          md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
            const token = tokens[idx]
            const href = token.attrGet('href')

            // Add UTM for internal links
            if (href && /^https?:\/\/soubiran\.dev/.test(href)) {
              token.attrSet('href', `${href}?utm_source=${hostname}&utm_medium=link`)
            }

            return linkRule(tokens, idx, options, env, self)
          }
        })

        md.use((md: MarkdownIt) => {
          const imageRule = md.renderer.rules.image!
          md.renderer.rules.image = (tokens, idx, options, env, self) => {
            const token = tokens[idx]
            const src = token.attrGet('src')

            if (src) {
              const isExternal = src.startsWith('http') || src.startsWith('//')

              if (!isExternal) {
                token.attrSet('width', '768')
                token.attrSet('height', '400')
                token.attrSet('src', joinURL(`https://${hostname}`, 'cdn-cgi/image', 'width=1200,quality=80,format=auto', `https://assets.${hostname}`, src))
              }
            }

            return imageRule(tokens, idx, options, env, self)
          }
        })

        md.use(await shiki({
          defaultColor: false,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
        }))
      },

      frontmatterPreprocess(frontmatter, options, id, defaults) {
        og(id, frontmatter, hostname)
        canonical(id, frontmatter, hostname)

        const head = defaults(frontmatter, options)
        return { head, frontmatter }
      },
    }),

    fonts({
      google: {
        families: [
          {
            name: 'DM Sans',
            styles: 'ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000',
          },
          {
            name: 'DM Mono',
            styles: 'ital,wght@0,300;0,400;0,500;1,300;1,400;1,500',
          },
          {
            name: 'Sofia Sans',
            styles: 'ital,wght@0,1..1000;1,1..1000',
          },
        ],
      },
    }),

    {
      name: 'await',
      async closeBundle() {
        await resolveAll()
      },
    },

    {
      name: 'extract-config',
      configResolved(resolvedConfig) {
        Object.assign(config, resolvedConfig)
      },
    },
  ],

  optimizeDeps: {
    include: ['vue', '@unhead/vue'],
  },

  ssgOptions: {
    formatting: 'minify',
    onPageRendered(route, renderedHTML) {
      routes.add(route)
      return renderedHTML
    },
    onFinished() {
      sitemap(config, hostname, Array.from(routes))
    },
  },
})

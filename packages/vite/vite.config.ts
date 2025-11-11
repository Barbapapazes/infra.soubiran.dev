/// <reference types="vite-ssg" />
import type { UserConfig } from 'vite'
import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import fonts from 'unplugin-fonts/vite'
import icons from 'unplugin-icons/vite'
import markdown from 'unplugin-vue-markdown/vite'
import vueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import { assert } from './src/assert'
import { canonical } from './src/canonical'
import { customImage, customLink, githubAlerts, implicitFiguresRule, linkAttributesRule, shikiHighlight } from './src/markdown-it'
import { og } from './src/og'
import { resolveAll } from './src/promise'
import { routes, sitemap } from './src/sitemap'
import { structuredData } from './src/structured-data'

const config: UserConfig = {}

export default (title: string, hostname: string) => defineConfig({
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
        'prose-p:my-[1em] dark:prose-p:text-muted',
        'dark:prose-ul:text-muted dark:prose-ol:text-muted',
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
        githubAlerts(md)
        implicitFiguresRule(md)
        linkAttributesRule(md)
        customLink(md, hostname)
        customImage(md, hostname)
        await shikiHighlight(md)
      },

      frontmatterPreprocess(frontmatter, options, id, defaults) {
        assert(id, frontmatter)
        og(id, frontmatter, hostname)
        canonical(id, frontmatter, hostname)
        structuredData(id, frontmatter, title, hostname)

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

    icons({
      autoInstall: true,
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

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueRouter from 'unplugin-vue-router/vite'
import shiki from '@shikijs/markdown-it'
import linkAttributes from 'markdown-it-link-attributes'
import markdown from 'unplugin-vue-markdown/vite'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),

    ui({
      autoImport: {
        dts: 'src/auto-imports.d.ts'
      },
      components: {
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/components.d.ts',
      }
    }),

    vueRouter({
      extensions: ['.vue', '.md'],
      routesFolder: 'pages',
      dts: 'src/typed-router.d.ts',
    }),

    markdown({
      headEnabled: true,
      wrapperComponent: 'WrapperContent',

      async markdownItSetup(md) {
        md.use(linkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
        md.use(await shiki({
          defaultColor: false,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
        }))
      },
    }),
  ],

  optimizeDeps: {
    include: ['vue', '@unhead/vue']
  }
})

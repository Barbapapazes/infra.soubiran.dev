import ui from '@nuxt/ui/vue-plugin'
import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

import 'markdown-it-github-alerts/styles/github-colors-light.css'
import 'markdown-it-github-alerts/styles/github-colors-dark-media.css'
import 'markdown-it-github-alerts/styles/github-base.css'
import './style.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
  },
  ({ app }) => {
    if (import.meta.env.SSR) {
      return
    }
    app.use(ui)
  },
)

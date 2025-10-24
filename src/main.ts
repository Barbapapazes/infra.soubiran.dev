import './style.css'
import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import ui from '@nuxt/ui/vue-plugin'

export const createApp = ViteSSG(
  App,
  {
    routes: routes,
  },
  ({ app }) => {
    if (import.meta.env.SSR) {
      return
    }
    app.use(ui)
  }
)

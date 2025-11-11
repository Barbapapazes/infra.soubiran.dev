import type { ComponentResolver } from 'unplugin-vue-components'

const components: string[] = [
  'Socials',
  'ViewersCounter',
]

export default function (): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (components.includes(name)) {
        return {
          name,
          from: '@soubiran/ui',
        }
      }
    },
  }
}

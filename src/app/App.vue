<script lang="ts" setup>
import { App } from '@soubiran/ui'
import { motion } from 'motion-v'
import graph from '~icons/ph/graph-duotone'
import house from '~icons/ph/house-duotone'
import squaresFour from '~icons/ph/squares-four-duotone'
import stack from '~icons/ph/stack-duotone'
import toolbox from '~icons/ph/toolbox-duotone'

const route = useRoute()

const links = [
  { icon: house, label: 'Home', to: '/' },
  { icon: squaresFour, label: 'Websites', to: '/websites' },
  { icon: stack, label: 'Services', to: '/services' },
  { icon: toolbox, label: 'Internal tools', to: '/internal-tools' },
  { icon: graph, label: 'Ecosystem', to: '/ecosystem' },
]
</script>

<template>
  <UApp>
    <motion.div
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1, transition: { delay: 0.8, duration: 0.6 } }"
    >
      <Header v-if="route.meta.frontmatter.page !== 'ecosystem'" :links="links" />
    </motion.div>

    <App>
      <UMain>
        <RouterView />
      </UMain>
    </App>

    <ViewersCounter class="fixed bottom-4 right-4 z-10 bg-white bg-opacity-90 shadow-sm backdrop-blur-sm dark:bg-neutral-900" />
  </UApp>
</template>

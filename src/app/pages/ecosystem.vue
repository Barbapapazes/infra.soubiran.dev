<script lang="ts">
import type { EcosystemItem } from '@/app/types/ecosystem'
import { motion } from 'motion-v'
import graph from '~icons/ph/graph-duotone'
import house from '~icons/ph/house-duotone'
import squaresFour from '~icons/ph/squares-four-duotone'
import stack from '~icons/ph/stack-duotone'
import toolbox from '~icons/ph/toolbox-duotone'
import Ecosystem from '@/app/components/Ecosystem/Ecosystem.vue'

const ecosystemTV = tv({
  slots: {
    base: '',
    link: 'p-0 text-dimmed',
  },
})
</script>

<script lang="ts" setup>
const { track } = useUmami()
function trackClick(label: string) {
  track('ecosystem_header_click', { label })
}

const router = useRouter()
const ecosystem = router.getRoutes()
  .filter(route => (/^\/(?:websites|services|internal-tools)\//).test(route.path) && route.meta.frontmatter?.ecosystem)
  .map((route) => {
    const frontmatter = route.meta.frontmatter!
    const type = route.path.startsWith('/websites/')
      ? 'website'
      : route.path.startsWith('/services/')
        ? 'service'
        : 'internal-tool'

    return {
      type,
      name: frontmatter.title,
      ecosystem: frontmatter.ecosystem!,
    } satisfies EcosystemItem
  })

const ui = computed(() => ecosystemTV())
</script>

<template>
  <div class="relative w-screen h-screen">
    <Ecosystem
      name="Estéban's Infra"
      :ecosystem="ecosystem"
      :ui="{ root: 'w-full h-full' }"
    />
    <motion.div
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1, transition: { delay: 0.2, duration: 0.4 } }"
      class="fixed top-4 right-4 z-10"
    >
      <UCard as="header" :ui="{ body: 'flex flex-row gap-4 px-3 py-2 sm:px-3 sm:py-2' }">
        <UTooltip text="Home">
          <UButton
            to="/"
            variant="link"
            color="neutral"
            aria-label="Home"
            :icon="house"
            :class="ui.link()"
            @click="trackClick('Home')"
          />
        </UTooltip>
        <UTooltip text="Websites">
          <UButton
            to="/websites"
            variant="link"
            color="neutral"
            aria-label="Websites"
            :icon="squaresFour"
            :class="ui.link()"
            @click="trackClick('Websites')"
          />
        </UTooltip>
        <UTooltip text="Services">
          <UButton
            to="/services"
            variant="link"
            color="neutral"
            aria-label="Services"
            :icon="stack"
            :class="ui.link()"
            @click="trackClick('Services')"
          />
        </UTooltip>
        <UTooltip text="Internal tools">
          <UButton
            to="/internal-tools"
            variant="link"
            color="neutral"
            aria-label="Internal tools"
            :icon="toolbox"
            :class="ui.link()"
            @click="trackClick('Internal tools')"
          />
        </UTooltip>
        <UTooltip text="Ecosystem">
          <UButton
            to="/ecosystem"
            variant="link"
            color="neutral"
            aria-label="Ecosystem"
            :icon="graph"
            :class="ui.link()"
            @click="trackClick('Ecosystem')"
          />
        </UTooltip>
      </UCard>
    </motion.div>
  </div>
</template>

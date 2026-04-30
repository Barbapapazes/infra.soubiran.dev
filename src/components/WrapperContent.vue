<script lang="ts" setup>
import type { TableOfContentsItem } from '../../../../packages/ui/src/components/TableOfContents.vue'
import type { Ecosystem } from '@/types/ecosystem'
import { useHead } from '@unhead/vue'
import { motion } from 'motion-v'

interface Repository {
  url: string
  private?: boolean
}

const props = defineProps<{
  frontmatter: {
    id: string
    title: string
    url?: string
    repository?: string | Repository
    ecosystem?: Ecosystem
    page: string
    toc: TableOfContentsItem[]
  }
}>()

const isContentPage = computed(() => props.frontmatter.page.endsWith('show'))

useHead({
  titleTemplate: '%s · Estéban Soubiran',
})
</script>

<template>
  <Page>
    <template #header>
      <PageHeader
        :title="props.frontmatter.title"
      >
        <template #after>
          <PageLinks :url="props.frontmatter.url" :repository="props.frontmatter.repository" />
        </template>
      </PageHeader>
    </template>

    <slot />

    <template v-if="isContentPage" #right>
      <motion.div
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1, transition: { delay: 0.4, duration: 0.4 } }"
      >
        <TableOfContents :toc="props.frontmatter.toc" />

        <USeparator class="my-2" />

        <Feedback :id="props.frontmatter.id" />
      </motion.div>
    </template>

    <template #bottom>
      <Ecosystem
        v-if="frontmatter.ecosystem"
        inline
        class="mt-4"
        :name="frontmatter.title"
        :ecosystem="frontmatter.ecosystem"
        :ui="{ root: 'w-full h-160' }"
      />
    </template>
  </Page>
</template>

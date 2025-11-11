<script lang="ts" setup>
import type { Ecosystem } from '@/types/ecosystem'
import { useHead } from '@unhead/vue'

const { frontmatter } = defineProps<{
  frontmatter: {
    title: string
    ecosystem?: Ecosystem
  }
}>()

useHead({
  titleTemplate: '%s · Estéban Soubiran',
})
</script>

<template>
  <div>
    <!-- TODO: rework the py -->
    <UContainer class="py-12">
      <div class="mx-auto max-w-screen-md space-y-6">
        <h1 class="text-xl font-bold text-highlighted">
          {{ frontmatter.title }}
        </h1>

        <slot />
      </div>
    </UContainer>

    <Ecosystem
      v-if="frontmatter.ecosystem"
      inline
      :name="frontmatter.title"
      :ecosystem="frontmatter.ecosystem"
      :ui="{ root: 'w-full h-140' }"
    />
  </div>
</template>

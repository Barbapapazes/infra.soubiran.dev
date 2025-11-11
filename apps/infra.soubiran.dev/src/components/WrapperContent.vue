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
  <div class="py-12">
    <UContainer>
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
      class="mt-12"
      :name="frontmatter.title"
      :ecosystem="frontmatter.ecosystem"
      :ui="{ root: 'w-full h-160' }"
    />
  </div>
</template>

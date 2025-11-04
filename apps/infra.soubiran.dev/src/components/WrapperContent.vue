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
  <UContainer class="py-12">
    <div class="mx-auto max-w-screen-md space-y-6">
      <h1 class="text-xl font-bold text-highlighted">
        {{ frontmatter.title }}
      </h1>

      <slot />

      <Ecosystem
        v-if="frontmatter.ecosystem"
        :name="frontmatter.title"
        :ecosystem="frontmatter.ecosystem"
      />
    </div>
  </UContainer>
</template>

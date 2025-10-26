<script lang="ts" setup>
import { useHead } from '@unhead/vue'

const { frontmatter } = defineProps<{
  frontmatter: {
    title: string
  }
}>()

useHead({
  titleTemplate: '%s · Estéban Soubiran',
})
</script>

<template>
  <UContainer class="py-12">
    <div class="mx-auto max-w-screen-md space-y-6">
      <h1 class="text-xl font-bold text-neutral-highlighted">
        {{ frontmatter.title }}
      </h1>

      <slot />
    </div>
  </UContainer>
</template>

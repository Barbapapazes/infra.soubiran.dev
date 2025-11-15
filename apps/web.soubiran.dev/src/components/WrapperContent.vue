<script lang="ts" setup>
import { useHead } from '@unhead/vue'

const props = defineProps<{
  frontmatter: {
    title: string
  }
}>()

useHead({
  titleTemplate: '%s · Estéban Soubiran',
})
</script>

<template>
  <WrapperContainer>
    <div>
      <WrapperTitle :title="props.frontmatter.title" />
    </div>

    <slot />
  </WrapperContainer>
</template>

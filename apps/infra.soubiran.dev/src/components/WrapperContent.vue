<script lang="ts" setup>
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
  <WrapperContainer>
    <WrapperTitle :title="frontmatter.title" />

    <slot />
  </WrapperContainer>
</template>

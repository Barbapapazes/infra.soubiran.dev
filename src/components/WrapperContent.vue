<script lang="ts" setup>
const { frontmatter } = defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  {{ frontmatter.title }}

  <slot />
</template>

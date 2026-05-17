<script lang="ts">
const wrapperPlatforms = tv({
  slots: {
    base: '',
  },
})

export interface WrapperPlatformsProps {
  frontmatter: {
    title: string
  }
  class?: any
  ui?: Partial<typeof wrapperPlatforms.slots>
}
export interface WrapperPlatformsEmits {}
export interface WrapperPlatformsSlots {
  default: (props: any) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<WrapperPlatformsProps>()
defineEmits<WrapperPlatformsEmits>()
defineSlots<WrapperPlatformsSlots>()

useHead({
  titleTemplate: '%s · Estéban Soubiran',
})

const ui = computed(() => wrapperPlatforms())
</script>

<template>
  <Page :class="ui.base({ class: [props.ui?.base, props.class] })" :ui="{ content: 'mt-2' }">
    <template #header>
      <PageHeader :title="props.frontmatter.title" />
    </template>

    <PageCardList path-prefix="/platforms" :class="ui.base({ class: [props.ui?.base, props.class] })" />
  </Page>
</template>

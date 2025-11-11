<script lang="ts">
const wrapperWebsites = tv({
  slots: {
    base: '',
  },
})

export interface WrapperWebsitesProps {
  frontmatter: {
    title: string
  }
  class?: any
  ui?: Partial<typeof wrapperWebsites.slots>
}
export interface WrapperWebsitesEmits {}
export interface WrapperWebsitesSlots {
  default: (props: any) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<WrapperWebsitesProps>()
defineEmits<WrapperWebsitesEmits>()
defineSlots<WrapperWebsitesSlots>()

useHead({
  titleTemplate: '%s · Estéban Soubiran',
})

const ui = computed(() => wrapperWebsites())
</script>

<template>
  <WrapperContainer :class="ui.base({ class: [props.ui?.base, props.class] })" :ui="{ content: 'space-y-2' }">
    <WrapperTitle :title="props.frontmatter.title" />

    <PageCardList path-prefix="/websites" :class="ui.base({ class: [props.ui?.base, props.class] })" />
  </WrapperContainer>
</template>

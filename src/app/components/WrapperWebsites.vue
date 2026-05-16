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
  <Page :class="ui.base({ class: [props.ui?.base, props.class] })" :ui="{ content: 'mt-2' }">
    <template #header>
      <PageHeader :title="props.frontmatter.title" />
    </template>

    <PageCardList path-prefix="/websites" :class="ui.base({ class: [props.ui?.base, props.class] })" />
  </Page>
</template>

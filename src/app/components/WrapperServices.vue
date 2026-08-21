<script lang="ts">
const wrapperServices = tv({
  slots: {
    base: '',
  },
})

export interface WrapperServicesProps {
  frontmatter: {
    title: string
  }
  class?: any
  ui?: Partial<typeof wrapperServices.slots>
}
export interface WrapperServicesEmits {}
export interface WrapperServicesSlots {
  default: (props: any) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<WrapperServicesProps>()
defineEmits<WrapperServicesEmits>()
defineSlots<WrapperServicesSlots>()

useHead({
  titleTemplate: '%s · Estéban Soubiran',
})

const ui = computed(() => wrapperServices())
</script>

<template>
  <Page :class="ui.base({ class: [props.ui?.base, props.class] })" :ui="{ content: 'mt-2' }">
    <template #header>
      <PageHeader :title="props.frontmatter.title" />
    </template>

    <PageCardList path-prefix="/services" :class="ui.base({ class: [props.ui?.base, props.class] })" />
  </Page>
</template>

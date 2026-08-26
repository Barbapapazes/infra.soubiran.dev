<script lang="ts">
const wrapperInternalTools = tv({
  slots: {
    base: '',
  },
})

export interface WrapperInternalToolsProps {
  frontmatter: {
    title: string
  }
  class?: any
  ui?: Partial<typeof wrapperInternalTools.slots>
}
export interface WrapperInternalToolsEmits {}
export interface WrapperInternalToolsSlots {
  default: (props: any) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<WrapperInternalToolsProps>()
defineEmits<WrapperInternalToolsEmits>()
defineSlots<WrapperInternalToolsSlots>()

useHead({
  titleTemplate: '%s · Estéban Soubiran',
})

const ui = computed(() => wrapperInternalTools())
</script>

<template>
  <Page :class="ui.base({ class: [props.ui?.base, props.class] })" :ui="{ content: 'mt-2' }">
    <template #header>
      <PageHeader :title="props.frontmatter.title" />
    </template>

    <PageCardList path-prefix="/internal-tools" :class="ui.base({ class: [props.ui?.base, props.class] })" />
  </Page>
</template>

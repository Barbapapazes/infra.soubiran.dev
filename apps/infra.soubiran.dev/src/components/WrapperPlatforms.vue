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
  <WrapperContainer :class="ui.base({ class: [props.ui?.base, props.class] })" :ui="{ content: 'space-y-2' }">
    <WrapperTitle :title="props.frontmatter.title" />

    <PlatformsList />
  </WrapperContainer>
</template>

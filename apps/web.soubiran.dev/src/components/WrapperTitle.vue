<script lang="ts">
const wrapperTitle = tv({
  slots: {
    base: 'text-xl font-bold text-highlighted',
  },
})

export interface WrapperTitleProps {
  title: string
  class?: any
  ui?: Partial<typeof wrapperTitle.slots>
}
export interface WrapperTitleEmits {}
export interface WrapperTitleSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<WrapperTitleProps>()
defineEmits<WrapperTitleEmits>()
defineSlots<WrapperTitleSlots>()

const ui = computed(() => wrapperTitle())
</script>

<template>
  <h1 :class="ui.base({ class: [props.ui?.base, props.class] })">
    {{ title }}
  </h1>
</template>

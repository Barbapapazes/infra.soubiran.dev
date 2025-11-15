<script lang="ts">
const wrapperContainer = tv({
  slots: {
    root: 'py-12',
    base: '',
    content: 'mx-auto max-w-screen-md space-y-6',
  },
})

export interface WrapperContainerProps {
  class?: any
  ui?: Partial<typeof wrapperContainer.slots>
}
export interface WrapperContainerEmits {}
export interface WrapperContainerSlots {
  default: (props: any) => any
  bottom: (props: any) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<WrapperContainerProps>()
defineEmits<WrapperContainerEmits>()
defineSlots<WrapperContainerSlots>()

const ui = computed(() => wrapperContainer())
</script>

<template>
  <div :class="ui.root({ class: props.ui?.root })">
    <UContainer :class="ui.base({ class: [props.ui?.base, props.class] })">
      <div :class="ui.content({ class: [props.ui?.content] })">
        <slot />
      </div>
    </UContainer>

    <slot name="bottom" />
  </div>
</template>

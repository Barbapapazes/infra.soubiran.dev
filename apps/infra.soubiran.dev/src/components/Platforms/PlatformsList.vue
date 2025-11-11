<script lang="ts">
const platformsList = tv({
  slots: {
    base: '',
  },
})

export interface PlatformsListProps {
  class?: any
  ui?: Partial<typeof platformsList.slots>
}
export interface PlatformsListEmits {}
export interface PlatformsListSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<PlatformsListProps>()
defineEmits<PlatformsListEmits>()
defineSlots<PlatformsListSlots>()

const ui = computed(() => platformsList())
</script>

<template>
  <PageCardList path-prefix="/platforms" :class="ui.base({ class: [props.ui?.base, props.class] })" />
</template>

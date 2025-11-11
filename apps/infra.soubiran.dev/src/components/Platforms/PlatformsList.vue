<script lang="ts">
export interface PlatformsListProps {
  class?: any
  ui?: any
}
export interface PlatformsListEmits {}
export interface PlatformsListSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<PlatformsListProps>()
defineEmits<PlatformsListEmits>()
defineSlots<PlatformsListSlots>()
</script>

<template>
  <PageCardList path-prefix="/platforms" :class="props.class" :ui="props.ui" />
</template>

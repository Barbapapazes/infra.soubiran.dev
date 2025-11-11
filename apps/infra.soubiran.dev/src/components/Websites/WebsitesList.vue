<script lang="ts">
export interface WebsitesListProps {
  class?: any
  ui?: any
}
export interface WebsitesListEmits {}
export interface WebsitesListSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<WebsitesListProps>()
defineEmits<WebsitesListEmits>()
defineSlots<WebsitesListSlots>()
</script>

<template>
  <PageCardList path-prefix="/websites" :class="props.class" :ui="props.ui" />
</template>

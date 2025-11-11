<script lang="ts">
const websitesList = tv({
  slots: {
    base: '',
  },
})

export interface WebsitesListProps {
  class?: any
  ui?: Partial<typeof websitesList.slots>
}
export interface WebsitesListEmits {}
export interface WebsitesListSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<WebsitesListProps>()
defineEmits<WebsitesListEmits>()
defineSlots<WebsitesListSlots>()

const ui = computed(() => websitesList())
</script>

<template>
  <PageCardList path-prefix="/websites" :class="ui.base({ class: [props.ui?.base, props.class] })" />
</template>

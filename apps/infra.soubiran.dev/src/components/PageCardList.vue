<script lang="ts">
const pageCardList = tv({
  slots: {
    base: '',
    item: '',
  },
})

export interface PageCardListProps {
  pathPrefix: string
  class?: any
  ui?: Partial<typeof pageCardList.slots>
}
export interface PageCardListEmits {}
export interface PageCardListSlots {}

// Shared card UI configuration
export const cardUI = {
  root: 'ring-0 hover:bg-transparent',
  container: 'p-0 sm:p-0',
  description: 'mt-2',
}
</script>

<script lang="ts" setup>
const props = defineProps<PageCardListProps>()
defineEmits<PageCardListEmits>()
defineSlots<PageCardListSlots>()

const router = useRouter()
const routes = computed(() => {
  const prefix = props.pathPrefix.endsWith('/') ? props.pathPrefix : `${props.pathPrefix}/`
  return router.getRoutes()
    .filter(route => route.path.startsWith(prefix) && route.path !== prefix)
    .map((route) => {
      return {
        path: route.path,
        title: route.meta.frontmatter.title,
        description: route.meta.frontmatter.description,
      }
    })
})

const ui = computed(() => pageCardList())
</script>

<template>
  <ul :class="ui.base({ class: [props.ui?.base, props.class] })">
    <li v-for="item in routes" :key="item.path" :class="ui.item({ class: props.ui?.item })">
      <UPageCard
        :title="item.title"
        :description="item.description"
        :to="item.path"
        :ui="cardUI"
      />
    </li>
  </ul>
</template>

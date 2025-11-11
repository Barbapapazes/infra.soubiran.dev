<script lang="ts">
const websitesList = tv({
  slots: {
    base: '',
    item: '',
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

const router = useRouter()
const routes = router.getRoutes()
  .filter(route => route.path.startsWith('/websites/') && route.path !== '/websites/')
  .map((route) => {
    return {
      path: route.path,
      title: route.meta.frontmatter.title,
      description: route.meta.frontmatter.description,
    }
  })

const ui = computed(() => websitesList())
</script>

<template>
  <ul :class="ui.base({ class: [props.ui?.base, props.class] })">
    <li v-for="website in routes" :key="website.path" :class="ui.item({ class: props.ui?.item })">
      <UPageCard
        :title="website.title"
        :description="website.description"
        :to="website.path"
        :ui="{
          root: 'ring-0 hover:bg-transparent',
          container: 'p-0 sm:p-0',
          description: 'mt-2',
        }"
      />
    </li>
  </ul>
</template>

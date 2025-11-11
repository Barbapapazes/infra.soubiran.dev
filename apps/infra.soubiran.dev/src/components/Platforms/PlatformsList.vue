<script lang="ts">
const platformsList = tv({
  slots: {
    base: '',
    item: '',
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

const router = useRouter()
const routes = router.getRoutes()
  .filter(route => route.path.startsWith('/platforms/') && route.path !== '/platforms/')
  .map((route) => {
    return {
      path: route.path,
      title: route.meta.frontmatter.title,
      description: route.meta.frontmatter.description,
    }
  })

const ui = computed(() => platformsList())
</script>

<template>
  <ul :class="ui.base({ class: [props.ui?.base, props.class] })">
    <li v-for="platform in routes" :key="platform.path" :class="ui.item({ class: props.ui?.item })">
      <UPageCard
        :title="platform.title"
        :description="platform.description"
        :to="platform.path"
        :ui="{
          root: 'ring-0 hover:bg-transparent',
          container: 'p-0 sm:p-0',
          description: 'mt-2',
        }"
      />
    </li>
  </ul>
</template>

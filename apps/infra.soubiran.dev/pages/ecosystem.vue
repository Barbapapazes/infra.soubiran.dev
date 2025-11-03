<script lang="ts" setup>
import type { Options } from 'vis-network/standalone'
import { DataSet, Network } from 'vis-network/standalone'

const router = useRouter()
const routes = router.getRoutes()
  .filter(route => route.path.startsWith('/ecosystem/') || route.path.startsWith('/websites/'))

const nodes = new DataSet([
  ...routes.map((route, index) => ({
    id: index + 1,
    label: route.meta.frontmatter.title,
  })),
])

const edges = new DataSet([
  { from: 1, to: 3 },
  { from: 1, to: 2 },
  { from: 2, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 3 },
])

const container = useTemplateRef('ecosystem')

const data = {
  nodes,
  edges,
}
const options: Options = {
  nodes: {
    shape: 'box',
  },
}

onMounted(() => {
  if (!container.value)
    return

  const network = new Network(container.value, data, options)
})
</script>

<template>
  <div ref="ecosystem" class="w-screen h-screen" />
</template>

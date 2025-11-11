<script lang="ts">
import type { Edge, Node } from '@vue-flow/core'
import type { Ecosystem, EcosystemItem } from '@/types/ecosystem'
import { Background } from '@vue-flow/background'
import { useVueFlow, VueFlow } from '@vue-flow/core'
import { kebabCase } from 'scule'

const ecosystem = tv({
  slots: {
    root: 'relative w-full h-140 bg-white dark:bg-black',
    base: '',
  },
})

export interface EcosystemProps {
  name: string
  ecosystem: Ecosystem
  inline?: boolean
  class?: any
  ui?: Partial<typeof ecosystem.slots>
}
export interface EcosystemEmits {}
export interface EcosystemSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<EcosystemProps>()
defineEmits<EcosystemEmits>()
defineSlots<EcosystemSlots>()

const { fitView } = useVueFlow()

const initialNode = {
  id: kebabCase(props.name),
  type: 'ecosystem',
  data: {
    name: props.name,
  } satisfies EcosystemItem,
  position: { x: 0, y: 0 },
}

const { nodes: initialNodes, edges: initialEdges } = createNodesEdges(initialNode)

const nodes = ref<Node[]>(initialNodes)
const edges = ref<Edge[]>(initialEdges)

const { layout } = useLayout()
onMounted(() => {
  nextTick(() => {
    nodes.value = layout(nodes.value, edges.value)
    fitView({ minZoom: 1 })
  })
})

function createNodesEdges(initialNode: Node) {
  const { nodes, edges } = ecosystemToNodesEdges(props.ecosystem, initialNode)

  return {
    nodes: [initialNode, ...nodes],
    edges,
  }
}

function ecosystemToNodesEdges(ecosystem: Ecosystem, parentNode?: Node) {
  const nodes: Node[] = []
  const edges: Edge[] = []

  for (const item of ecosystem) {
    const id = kebabCase(`${item.name}-${item.type}${item.id ? `-${item.id}` : ''}`.replace(/\s+/g, '-'))

    const currentNode = {
      id,
      type: 'ecosystem',
      position: { x: 0, y: 0 },
      data: item,
    } satisfies Node

    nodes.push(currentNode)

    if (parentNode) {
      edges.push({
        id: `${parentNode.id}-${id}`,
        source: id,
        target: parentNode.id,
        animated: true,
      })
    }

    if (item.ecosystem) {
      const { nodes: childNodes, edges: childEdges } = ecosystemToNodesEdges(item.ecosystem, currentNode)
      nodes.push(...childNodes)
      edges.push(...childEdges)
    }
  }

  return {
    nodes: Array.from(new Set(nodes.map(node => node.id))).map(id => nodes.find(node => node.id === id)) as Node[],
    edges: Array.from(new Set(edges.map(edge => edge.id))).map(id => edges.find(edge => edge.id === id)) as Edge[],
  }
}

const ui = computed(() => ecosystem())
</script>

<template>
  <div :class="ui.root({ class: props.ui?.root })">
    <div v-if="props.inline" class="z-10 absolute top-0 h-2 inset-x-0 bg-linear-to-b from-(--ui-bg) to-(--ui-bg)/0" />
    <div v-if="props.inline" class="z-10 absolute bottom-0 h-2 inset-x-0 bg-linear-to-t from-(--ui-bg) to-(--ui-bg)/0" />
    <VueFlow
      fit-view-on-init
      :default-viewport="{ zoom: 1 }"
      :nodes-draggable="false"
      :min-zoom="0.5"
      :max-zoom="1"
      :nodes="nodes"
      :edges="edges"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
    >
      <template #node-ecosystem="defaultNodeProps">
        <EcosystemNode v-bind="defaultNodeProps" />
      </template>

      <Background />
    </VueFlow>
    <div />
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';

.vue-flow__edge-path {
  stroke: var(--ui-border-muted);
}
</style>

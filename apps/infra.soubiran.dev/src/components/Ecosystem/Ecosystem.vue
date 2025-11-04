<script lang="ts">
import type { Edge, Node } from '@vue-flow/core'
import type { Ecosystem } from '@/types/ecosystem'
import { Background } from '@vue-flow/background'
import { useVueFlow, VueFlow } from '@vue-flow/core'

const ecosystem = tv({
  slots: {
    root: 'w-full h-120 bg-white dark:bg-black',
    base: '',
  },
})

export interface EcosystemProps {
  name: string
  ecosystem: Ecosystem
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

const initialNode = {
  id: globalThis.crypto.randomUUID(),
  type: 'ecosystem',
  data: {
    platform: props.name,
  },
  position: { x: 0, y: 0 },
}

const { fitView } = useVueFlow()

const { nodes: initialNodes, edges: initialEdges } = createNodesEdges(initialNode)

const nodes = ref<Node[]>(initialNodes)
const edges = ref<Edge[]>(initialEdges)

const { layout } = useLayout()
onMounted(() => {
  nodes.value = layout(nodes.value, edges.value)

  nextTick(() => {
    fitView()
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
    const currentNode = {
      id: globalThis.crypto.randomUUID(),
      type: 'ecosystem',
      position: { x: 0, y: 0 },
      data: item,
    }

    nodes.push(currentNode)

    if (parentNode) {
      edges.push({
        id: `${parentNode.id}-${currentNode.id}`,
        source: currentNode.id,
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
    nodes,
    edges,
  }
}

const ui = computed(() => ecosystem())
</script>

<template>
  <div :class="ui.root({ class: props.ui?.root })">
    <VueFlow
      fit-view-on-init
      :default-viewport="{ zoom: 1 }"
      :nodes-draggable="false"
      :min-zoom="1"
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

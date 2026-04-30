<script lang="ts">
import type { Edge, Node } from '@vue-flow/core'
import type { Ecosystem, EcosystemItem } from '@/types/ecosystem'
import { kebabCase } from 'scule'

const ecosystem = tv({
  slots: {
    root: 'h-140',
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

const initialNode = {
  id: kebabCase(props.name),
  type: 'ecosystem',
  data: {
    name: props.name,
  } satisfies EcosystemItem,
  position: { x: 0, y: 0 },
}

const { nodes: initialNodes, edges: initialEdges } = createNodesEdges(initialNode)

const nodes = ref<Node<EcosystemItem>[]>(initialNodes)
const edges = ref<Edge[]>(initialEdges)

function createNodesEdges(initialNode: Node<EcosystemItem>) {
  const { nodes, edges } = ecosystemToNodesEdges(props.ecosystem, initialNode)

  return {
    nodes: [initialNode, ...nodes],
    edges,
  }
}

function ecosystemToNodesEdges(ecosystem: Ecosystem, parentNode?: Node<EcosystemItem>) {
  const nodes: Node<EcosystemItem>[] = []
  const edges: Edge[] = []

  for (const item of ecosystem) {
    const id = kebabCase(`${item.name}-${item.type}${item.id ? `-${item.id}` : ''}`.replace(/\s+/g, '-'))

    const currentNode = {
      id,
      type: 'ecosystem',
      position: { x: 0, y: 0 },
      data: item,
    } satisfies Node<EcosystemItem>

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

  // Deduplicate nodes and edges by ID
  const uniqueNodes = nodes.filter((node, index, self) =>
    index === self.findIndex(n => n.id === node.id),
  )
  const uniqueEdges = edges.filter((edge, index, self) =>
    index === self.findIndex(e => e.id === edge.id),
  )

  return {
    nodes: uniqueNodes,
    edges: uniqueEdges,
  }
}

const ui = computed(() => ecosystem())
</script>

<template>
  <BaseFlow
    direction="RL"
    :nodes="nodes"
    :edges="edges"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    :ui="{ root: ui.root({ class: props.ui?.root }) }"
  >
    <template v-if="props.inline" #overlays>
      <div class="z-10 absolute top-0 h-4 inset-x-0 bg-linear-to-b from-(--ui-bg) to-(--ui-bg)/0" />
      <div class="z-10 absolute bottom-0 h-4 inset-x-0 bg-linear-to-t from-(--ui-bg) to-(--ui-bg)/0" />
    </template>

    <template #node-ecosystem="nodeProps">
      <EcosystemNode v-bind="nodeProps" />
    </template>
  </BaseFlow>
</template>

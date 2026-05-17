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

function getDescriptions(item: EcosystemItem) {
  return Array.from(new Set([
    item.description,
    ...(item.descriptions ?? []),
  ].filter((description): description is string => !!description)))
}

function mergeEcosystemItems(existing: EcosystemItem, incoming: EcosystemItem): EcosystemItem {
  const descriptions = Array.from(new Set([
    ...getDescriptions(existing),
    ...getDescriptions(incoming),
  ]))

  return {
    ...existing,
    ...incoming,
    href: existing.href ?? incoming.href,
    description: descriptions[0],
    descriptions,
  }
}

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
  const nodes = new Map<string, Node<EcosystemItem>>()
  const edges = new Map<string, Edge>()

  ecosystemToNodesEdges(props.ecosystem, nodes, edges, initialNode)

  return {
    nodes: [initialNode, ...nodes.values()],
    edges: [...edges.values()],
  }
}

function ecosystemToNodesEdges(
  ecosystem: Ecosystem,
  nodes: Map<string, Node<EcosystemItem>>,
  edges: Map<string, Edge>,
  parentNode?: Node<EcosystemItem>,
) {
  for (const item of ecosystem) {
    const id = kebabCase(`${item.name}-${item.type}${item.id ? `-${item.id}` : ''}`.replace(/\s+/g, '-'))

    const currentNode = nodes.get(id) ?? {
      id,
      type: 'ecosystem',
      position: { x: 0, y: 0 },
      data: {
        ...item,
        descriptions: getDescriptions(item),
      },
    } satisfies Node<EcosystemItem>

    currentNode.data = mergeEcosystemItems(currentNode.data, item)
    nodes.set(id, currentNode)

    if (parentNode) {
      const edge = {
        id: `${parentNode.id}-${id}`,
        source: id,
        target: parentNode.id,
        animated: true,
      } satisfies Edge

      edges.set(edge.id, edge)
    }

    if (item.ecosystem) {
      ecosystemToNodesEdges(item.ecosystem, nodes, edges, currentNode)
    }
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

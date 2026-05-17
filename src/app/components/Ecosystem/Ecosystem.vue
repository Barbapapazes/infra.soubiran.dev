<script lang="ts">
import type { Edge, Node } from '@vue-flow/core'
import type { Ecosystem, EcosystemDescriptionEntry, EcosystemItem, EcosystemNodeItem } from '@/app/types/ecosystem'
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

function getRootNodeId(name: string) {
  return `root-${kebabCase(name)}`
}

function getNodeId(item: EcosystemItem) {
  return kebabCase(`${item.name}-${item.type}${item.id ? `-${item.id}` : ''}`.replace(/\s+/g, '-'))
}

function mergeDescriptionEntries(entries: EcosystemDescriptionEntry[]): EcosystemDescriptionEntry[] {
  const mergedEntries = new Map<string, EcosystemDescriptionEntry>()

  for (const entry of entries) {
    if (!entry.text) {
      continue
    }

    const existing = mergedEntries.get(entry.text)
    const from = Array.from(new Set([
      ...(existing?.from ?? []),
      ...(entry.from ?? []),
    ]))

    mergedEntries.set(entry.text, {
      text: entry.text,
      from: from.length ? from : undefined,
    })
  }

  return [...mergedEntries.values()]
}

function getDescriptionEntries(item: EcosystemItem, from?: string): EcosystemDescriptionEntry[] {
  if (!item.description) {
    return []
  }

  return [{
    text: item.description,
    from: from ? [from] : undefined,
  }]
}

function toNodeData(item: EcosystemItem, from?: string): EcosystemNodeItem {
  const descriptionEntries = getDescriptionEntries(item, from)
  const { ecosystem: _ecosystem, ...nodeData } = item

  return {
    ...nodeData,
    descriptionEntries,
  }
}

function mergeEcosystemItems(existing: EcosystemNodeItem, incoming: EcosystemItem, from?: string): EcosystemNodeItem {
  const descriptionEntries = mergeDescriptionEntries([
    ...existing.descriptionEntries,
    ...getDescriptionEntries(incoming, from),
  ])

  const { ecosystem: _incomingEcosystem, ...incomingNodeData } = incoming

  return {
    ...existing,
    ...incomingNodeData,
    href: existing.href ?? incoming.href,
    descriptionEntries,
  }
}

const initialNode: Node<EcosystemNodeItem> = {
  id: getRootNodeId(props.name),
  type: 'ecosystem',
  data: {
    name: props.name,
    descriptionEntries: [],
  },
  position: { x: 0, y: 0 },
}

function getDescriptionSource(parentNode?: Node<EcosystemNodeItem>) {
  if (!parentNode || parentNode.id === initialNode.id) {
    return undefined
  }

  return parentNode.data?.name
}

const { nodes: initialNodes, edges: initialEdges } = createNodesEdges(initialNode)

const nodes = shallowRef<Node<EcosystemNodeItem>[]>(initialNodes)
const edges = shallowRef<Edge[]>(initialEdges)

function createNodesEdges(initialNode: Node<EcosystemNodeItem>): { nodes: Node<EcosystemNodeItem>[], edges: Edge[] } {
  const nodes = new Map<string, Node<EcosystemNodeItem>>()
  const edges = new Map<string, Edge>()

  ecosystemToNodesEdges(props.ecosystem, nodes, edges, initialNode)

  return {
    nodes: [initialNode, ...nodes.values()],
    edges: [...edges.values()],
  }
}

function ecosystemToNodesEdges(
  ecosystem: Ecosystem,
  nodes: Map<string, Node<EcosystemNodeItem>>,
  edges: Map<string, Edge>,
  parentNode?: Node<EcosystemNodeItem>,
) {
  for (const item of ecosystem) {
    const id = getNodeId(item)
    const from = getDescriptionSource(parentNode)

    const currentNode: Node<EcosystemNodeItem> = nodes.get(id) ?? {
      id,
      type: 'ecosystem',
      position: { x: 0, y: 0 },
      data: toNodeData(item, from),
    }

    currentNode.data = mergeEcosystemItems(currentNode.data ?? toNodeData(item, from), item, from)
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
      <div class="z-10 absolute top-0 h-4 inset-x-0 bg-linear-to-b from-default to-(--ui-bg)/0" />
      <div class="z-10 absolute bottom-0 h-4 inset-x-0 bg-linear-to-t from-default to-(--ui-bg)/0" />
    </template>

    <template #node-ecosystem="nodeProps">
      <EcosystemNode v-bind="nodeProps" />
    </template>
  </BaseFlow>
</template>

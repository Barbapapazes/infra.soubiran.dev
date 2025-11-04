<script lang="ts">
import type { Edge, Node } from '@vue-flow/core'
import type { Ecosystem } from '@/types/ecosystem'
import { VueFlow } from '@vue-flow/core'

const ecosystem = tv({
  slots: {
    root: 'w-full h-120 border',
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
  type: 'website',
  data: {
    platform: props.name,
  },
  position: { x: 250, y: 25 },
}

const { nodes, edges } = createNodesEdges(initialNode)

function createNodesEdges(initialNode: Node) {
  const nodes = [initialNode]
  const edges = []

  const nodesEdges = ecosystemToNodesEdges(props.ecosystem, initialNode)

  nodes.push(...nodesEdges.nodes)
  edges.push(...nodesEdges.edges)

  return { nodes, edges }
}

function ecosystemToNodesEdges(ecosystem: Ecosystem, parentNode?: Node) {
  const nodes: Node[] = []
  const edges: Edge[] = []

  for (const item of ecosystem) {
    const currentNode = {
      id: globalThis.crypto.randomUUID(),
      type: item.type,
      position: { x: 250, y: 250 },
      data: item,
    }

    nodes.push(currentNode)

    if (parentNode) {
      edges.push({
        id: `${parentNode.id}-${currentNode.id}`,
        source: parentNode.id,
        target: currentNode.id,
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
      :min-zoom="1"
      :max-zoom="1"
      :nodes="nodes"
      :edges="edges"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
    >
      <template #node-build="buildNodeProps">
        <EcosystemBuildNode v-bind="buildNodeProps" />
      </template>
      <template #node-data="dataNodeProps">
        <EcosystemDataNode v-bind="dataNodeProps" />
      </template>
      <template #node-domain="domainNodeProps">
        <EcosystemDomainNode v-bind="domainNodeProps" />
      </template>
      <template #node-object-storage="objectStorageNodeProps">
        <EcosystemObjectStorageNode v-bind="objectStorageNodeProps" />
      </template>
      <template #node-deployment="deploymentNodeProps">
        <EcosystemDeploymentNode v-bind="deploymentNodeProps" />
      </template>
      <template #node-repository="repositoryNodeProps">
        <EcosystemRepositoryNode v-bind="repositoryNodeProps" />
      </template>
      <template #node-website="websiteNodeProps">
        <EcosystemWebsiteNode v-bind="websiteNodeProps" />
      </template>
    </VueFlow>
    <div />
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
</style>

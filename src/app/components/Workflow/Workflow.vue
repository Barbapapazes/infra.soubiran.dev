<script lang="ts">
import type { Edge, Node } from '@vue-flow/core'

const workflow = tv({
  slots: {
    root: 'relative w-full h-80 bg-white dark:bg-black',
    title: 'absolute z-10 text-sm left-2 top-2 text-(--ui-text-muted)',
    base: 'rounded-lg border border-default overflow-hidden',
  },
})

export interface WorkflowStep {
  id?: string
  key: string
  label?: string
  verb?: string
  description?: string
  icon?: string
  children?: WorkflowStep[]
}

export interface WorkflowRelation {
  source: string
  target: string
  label?: string
  animated?: boolean
}

export interface WorkflowStepData {
  key: string
  label?: string
  verb?: string
  description?: string
  icon?: string
}

export interface WorkflowProps {
  title?: string
  steps: WorkflowStep[]
  relations?: WorkflowRelation[]
  class?: any
  ui?: Partial<typeof workflow.slots>
}
export interface WorkflowEmits {}
export interface WorkflowSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<WorkflowProps>()
defineEmits<WorkflowEmits>()
defineSlots<WorkflowSlots>()

function getStepId(step: WorkflowStep, index: number, idPrefix = '') {
  return step.id || (idPrefix ? `${idPrefix}-${index + 1}` : `${index + 1}`)
}

function createNode(step: WorkflowStep, id: string): Node<WorkflowStepData> {
  return {
    id,
    type: 'workflow',
    position: { x: 0, y: 0 },
    data: {
      key: step.key,
      label: step.label,
      verb: step.verb,
      description: step.description,
      icon: step.icon,
    },
  }
}

/**
 * Recursively builds nodes and edges from a steps tree.
 * Sequential steps at each level are connected in order.
 * A step's last descendant leaf connects to the next sibling step.
 * Returns nodes, edges, and the id of the last leaf node in the branch.
 */
function createSequentialGraph(
  steps: WorkflowStep[],
  idPrefix = '',
): { nodes: Node<WorkflowStepData>[], edges: Edge[], lastId: string | undefined } {
  const nodes: Node<WorkflowStepData>[] = []
  const edges: Edge[] = []
  let prevId: string | undefined

  for (let index = 0; index < steps.length; index++) {
    const step = steps[index]
    const id = getStepId(step, index, idPrefix)

    nodes.push(createNode(step, id))

    // Connect from the previous leaf to this node
    if (prevId) {
      edges.push({ id: `edge-${prevId}-${id}`, source: prevId, target: id, animated: true })
    }

    if (step.children?.length) {
      const { nodes: childNodes, edges: childEdges, lastId } = createSequentialGraph(step.children, id)
      nodes.push(...childNodes)
      edges.push(...childEdges)

      // Connect this node to the first child
      const firstChild = step.children[0]
      const firstChildId = getStepId(firstChild, 0, id)
      edges.push({ id: `edge-${id}-${firstChildId}`, source: id, target: firstChildId, animated: true })

      // The next sibling connects from the deepest leaf of this branch
      prevId = lastId
    }
    else {
      prevId = id
    }
  }

  return { nodes, edges, lastId: prevId }
}

function flattenSteps(steps: WorkflowStep[]) {
  const flattened: WorkflowStep[] = []

  function walk(items: WorkflowStep[]) {
    for (const item of items) {
      flattened.push(item)

      if (item.children?.length) {
        walk(item.children)
      }
    }
  }

  walk(steps)

  return flattened
}

function createRelationGraph(steps: WorkflowStep[], relations: WorkflowRelation[]): { nodes: Node<WorkflowStepData>[], edges: Edge[] } {
  const nodes: Node<WorkflowStepData>[] = []
  const edges: Edge[] = []
  const idMap = new Map<string, string>()
  const allSteps = flattenSteps(steps)

  for (let index = 0; index < allSteps.length; index++) {
    const step = allSteps[index]
    const id = getStepId(step, index)

    nodes.push(createNode(step, id))

    if (step.id) {
      idMap.set(step.id, id)
    }

    idMap.set(step.key, id)
  }

  for (const relation of relations) {
    const source = idMap.get(relation.source)
    const target = idMap.get(relation.target)

    if (!source || !target) {
      continue
    }

    edges.push({
      id: `edge-${source}-${target}`,
      source,
      target,
      label: relation.label,
      animated: relation.animated ?? true,
    })
  }

  return { nodes, edges }
}

function createGraph(steps: WorkflowStep[], relations?: WorkflowRelation[]): { nodes: Node<WorkflowStepData>[], edges: Edge[] } {
  if (relations?.length) {
    return createRelationGraph(steps, relations)
  }

  const { nodes, edges } = createSequentialGraph(steps)
  return { nodes, edges }
}

const graph = computed(() => createGraph(props.steps, props.relations))
const nodes = computed(() => graph.value.nodes)
const edges = computed(() => graph.value.edges)

const ui = computed(() => workflow())
</script>

<template>
  <BaseFlow
    :nodes="nodes"
    :edges="edges"
    direction="TB"
    :center-nodes="true"
    :fit-view-options="{ minZoom: 0.5, padding: 0.35 }"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    :ui="{ root: ui.root({ class: props.ui?.root }) }"
  >
    <template #overlays>
      <span v-if="props.title" :class="ui.title({ class: props.ui?.title })">{{ props.title }}</span>
    </template>

    <template #node-workflow="nodeProps">
      <WorkflowNode v-bind="nodeProps" />
    </template>
  </BaseFlow>
</template>

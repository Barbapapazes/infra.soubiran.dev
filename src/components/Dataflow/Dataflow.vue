<script lang="ts">
import type { Edge, Node } from '@vue-flow/core'
import type { Dataflow, DataflowStep } from '@/types/dataflow'

const dataflow = tv({
  slots: {
    root: 'h-50 rounded-lg',
    base: '',
  },
})

export interface DataflowProps {
  steps: Dataflow
  class?: any
  ui?: Partial<typeof dataflow.slots>
}
export interface DataflowEmits {}
export interface DataflowSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<DataflowProps>()
defineEmits<DataflowEmits>()
defineSlots<DataflowSlots>()

const nodes = ref<Node<DataflowStep>[]>(
  props.steps.map(step => ({
    id: step.id,
    type: 'dataflow',
    position: { x: 0, y: 0 },
    data: step,
  })),
)

// Create edges connecting each step
const edges = ref<Edge[]>(
  props.steps.slice(0, -1).map((step, index) => {
    const nextStep = props.steps[index + 1]!
    return {
      id: `${step.id}-${nextStep.id}`,
      source: step.id,
      target: nextStep.id,
      animated: true,
    }
  }),
)

const ui = computed(() => dataflow({ class: props.class, ...props.ui }))
</script>

<template>
  <BaseFlow
    direction="LR"
    :nodes="nodes"
    :edges="edges"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    :ui="{ root: ui.root({ class: props.ui?.root }) }"
  >
    <template #node-dataflow="nodeProps">
      <DataflowNode v-bind="nodeProps" />
    </template>
  </BaseFlow>
</template>

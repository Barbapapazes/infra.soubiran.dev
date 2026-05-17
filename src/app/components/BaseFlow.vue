<script lang="ts" generic="TData">
import type { Edge, Node } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { useVueFlow, VueFlow } from '@vue-flow/core'
import { tv } from 'tailwind-variants'

const baseFlow = tv({
  slots: {
    root: 'relative w-full bg-white dark:bg-black',
    base: '',
  },
})

export interface BaseFlowProps<TData = any> {
  nodes: Node<TData>[]
  edges: Edge[]
  direction?: 'TB' | 'RL' | 'LR'
  class?: any
  ui?: Partial<typeof baseFlow.slots>
}
</script>

<script lang="ts" setup generic="TData">
const props = withDefaults(defineProps<BaseFlowProps<TData>>(), {
  direction: 'RL',
})

const { fitView } = useVueFlow()

const layoutNodes = ref<Node<TData>[]>(props.nodes)
const layoutEdges = ref<Edge[]>(props.edges)

const { layout } = useLayout()

onMounted(() => {
  nextTick(() => {
    layoutNodes.value = layout(layoutNodes.value, layoutEdges.value, props.direction)
    fitView({ minZoom: 1 })
  })
})

const ui = computed(() => baseFlow())
</script>

<template>
  <div :class="ui.root({ class: props.ui?.root })">
    <slot name="overlays" />

    <VueFlow
      fit-view-on-init
      :default-viewport="{ zoom: 1 }"
      :nodes-draggable="false"
      :min-zoom="0.5"
      :max-zoom="1"
      :nodes="layoutNodes"
      :edges="layoutEdges"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
    >
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>

      <Background />
    </VueFlow>
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';

.vue-flow__edge-path {
  stroke: var(--ui-border-muted);
}
</style>

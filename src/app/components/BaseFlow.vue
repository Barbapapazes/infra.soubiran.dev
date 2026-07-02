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
  centerNodes?: boolean
  fitViewOptions?: {
    minZoom?: number
    maxZoom?: number
    padding?: number
  }
  class?: any
  ui?: Partial<typeof baseFlow.slots>
}
</script>

<script lang="ts" setup generic="TData">
const props = withDefaults(defineProps<BaseFlowProps<TData>>(), {
  direction: 'RL',
  centerNodes: false,
})

const { fitView } = useVueFlow()

const layoutNodes = ref<Node<TData>[]>(props.nodes)
const layoutEdges = ref<Edge[]>(props.edges)

const { layout } = useLayout()

function layoutAndFit() {
  layoutNodes.value = layout(props.nodes, props.edges, props.direction, {
    centerNodes: props.centerNodes,
  })
  layoutEdges.value = props.edges

  nextTick(() => {
    fitView({
      padding: props.fitViewOptions?.padding ?? 0.2,
      minZoom: props.fitViewOptions?.minZoom,
      maxZoom: props.fitViewOptions?.maxZoom,
    })
  })
}

watch(
  () => [props.nodes, props.edges, props.direction, props.centerNodes],
  () => {
    layoutAndFit()
  },
  { deep: true },
)

const vueFlowNodes = computed(() => layoutNodes.value as Node[])
const vueFlowEdges = computed(() => layoutEdges.value as Edge[])

const ui = computed(() => baseFlow())
</script>

<template>
  <div :class="ui.root({ class: props.ui?.root })">
    <slot name="overlays" />

    <VueFlow
      :default-viewport="{ zoom: 1 }"
      :nodes-draggable="false"
      :min-zoom="0.5"
      :max-zoom="1"
      :nodes="vueFlowNodes"
      :edges="vueFlowEdges"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
      @nodes-initialized="layoutAndFit()"
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

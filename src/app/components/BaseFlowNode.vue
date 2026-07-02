<script lang="ts" generic="TData">
import type { NodeProps } from '@vue-flow/core'
import { Handle } from '@vue-flow/core'

const baseFlowNode = tv({
  slots: {
    base: '',
    targetHandle: 'opacity-0',
    sourceHandle: 'opacity-0',
  },
})

export interface BaseFlowNodeProps<TData = any> extends NodeProps<TData> {
  reverseHandlePositions?: boolean
  class?: any
  ui?: Partial<typeof baseFlowNode.slots>
}
export interface BaseFlowNodeEmits {}
export interface BaseFlowNodeSlots {
  content: (props: { data: any }) => any
  popover: (props: { data: any }) => any
}
</script>

<script lang="ts" setup generic="TData">
const props = defineProps<BaseFlowNodeProps<TData>>()
defineEmits<BaseFlowNodeEmits>()
defineSlots<BaseFlowNodeSlots>()

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

const ui = computed(() => baseFlowNode())
</script>

<template>
  <div>
    <DefineTemplate>
      <div :class="ui.base({ class: [props.ui?.base, props.class] })">
        <slot name="content" :data="props.data" />

        <Handle
          type="target"
          :position="props.reverseHandlePositions ? props.sourcePosition : props.targetPosition"
          :class="ui.targetHandle({ class: props.ui?.targetHandle })"
        />
        <Handle
          type="source"
          :position="props.reverseHandlePositions ? props.targetPosition : props.sourcePosition"
          :class="ui.sourceHandle({ class: props.ui?.sourceHandle })"
        />
      </div>
    </DefineTemplate>

    <UPopover v-if="$slots.popover" mode="hover" arrow>
      <ReuseTemplate />

      <template #content>
        <slot name="popover" :data="props.data" />
      </template>
    </UPopover>

    <ReuseTemplate v-else />
  </div>
</template>

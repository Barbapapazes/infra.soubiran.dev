<script lang="ts" generic="TData">
import type { NodeProps } from '@vue-flow/core'
import { Handle } from '@vue-flow/core'

const baseFlowNode = tv({
  slots: {
    base: '',
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

        <Handle type="target" :position="props.reverseHandlePositions ? props.sourcePosition : props.targetPosition" style="opacity: 0" />
        <Handle type="source" :position="props.reverseHandlePositions ? props.targetPosition : props.sourcePosition" style="opacity: 0" />
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

<script lang="ts">
import type { NodeProps } from '@vue-flow/core'
import type { WorkflowStepData } from '@/app/components/Workflow/Workflow.vue'

const workflowNode = tv({
  slots: {
    base: 'min-w-52 max-w-72 rounded-lg border border-accented bg-default text-sm shadow-xs',
    header: 'px-3 py-1.5 border-b border-default bg-muted text-muted font-mono text-xs uppercase tracking-wide rounded-t-lg',
    body: 'px-3 py-2 flex items-start gap-2 text-highlighted',
    icon: 'mt-0.5 size-4 shrink-0 text-highlighted',
    label: 'leading-tight',
    popover: 'p-3 max-w-sm space-y-1',
    description: 'text-sm text-toned',
    targetHandle: 'size-3 rounded-xs border border-accented bg-accented -z-1 opacity-100',
    sourceHandle: 'size-3 rounded-xs border border-accented bg-muted opacity-100',
  },
})

export interface WorkflowNodeProps extends NodeProps<WorkflowStepData> {
  class?: any
  ui?: Partial<typeof workflowNode.slots>
}
export interface WorkflowNodeEmits {}
export interface WorkflowNodeSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<WorkflowNodeProps>()
defineEmits<WorkflowNodeEmits>()
defineSlots<WorkflowNodeSlots>()

const icon = computed(() => props.data.icon ?? 'i-ph-check-square-offset')
const label = computed(() => props.data.label ?? props.data.key)
const ui = computed(() => workflowNode())
</script>

<template>
  <BaseFlowNode
    v-bind="props"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    :ui="{
      targetHandle: ui.targetHandle({ class: props.ui?.targetHandle }),
      sourceHandle: ui.sourceHandle({ class: props.ui?.sourceHandle }),
    }"
  >
    <template #content>
      <div :class="ui.header({ class: props.ui?.header })">
        {{ props.data.verb ?? 'do' }}
      </div>
      <div :class="ui.body({ class: props.ui?.body })">
        <UIcon :name="icon" :class="ui.icon({ class: props.ui?.icon })" />
        <span :class="ui.label({ class: props.ui?.label })">{{ label }}</span>
      </div>
    </template>

    <template v-if="props.data.description" #popover>
      <div :class="ui.popover({ class: props.ui?.popover })">
        <p class="font-medium text-sm text-highlighted">
          {{ label }}
        </p>
        <p :class="ui.description({ class: props.ui?.description })">
          {{ props.data.description }}
        </p>
      </div>
    </template>
  </BaseFlowNode>
</template>

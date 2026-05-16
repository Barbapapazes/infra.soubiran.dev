<script lang="ts">
import type { NodeProps } from '@vue-flow/core'
import type { DataflowStep } from '@/types/dataflow'
import arrowRight from '~icons/ph/arrow-right'
import files from '~icons/ph/files-duotone'
import globeSimple from '~icons/ph/globe-simple-duotone'
import lock from '~icons/ph/lock-duotone'
import user from '~icons/ph/user-duotone'
import cloudflare from '~icons/simple-icons/cloudflare'

const dataflowNode = tv({
  slots: {
    base: 'border border-dashed border-primary rounded-xl p-3 flex flex-col items-center gap-2 bg-white dark:bg-black min-w-40',
    icon: 'size-6 text-primary',
    label: 'font-medium text-center',
  },
  variants: {
    color: {
      domain: {
        base: 'border-primary',
        icon: 'text-primary',
      },
      cloudflare: {
        base: 'border-cloudflare',
        icon: 'text-cloudflare',
      },
      worker: {
        base: 'border-cloudflare',
        icon: 'text-cloudflare',
      },
    },
  },
})

export interface DataflowNodeProps extends NodeProps<DataflowStep> {
  class?: any
  ui?: Partial<typeof dataflowNode.slots>
}
export interface DataflowNodeEmits {}
export interface DataflowNodeSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<DataflowNodeProps>()
defineEmits<DataflowNodeEmits>()
defineSlots<DataflowNodeSlots>()

function getIcon(icon?: string) {
  switch (icon) {
    case 'user':
      return user
    case 'domain':
      return globeSimple
    case 'cloudflare':
    case 'worker':
      return cloudflare
    case 'assets':
      return files
    case 'lock':
      return lock
    default:
      return arrowRight
  }
}

function getColorVariant(step: DataflowStep): string {
  if (step.color)
    return step.color
  if (step.icon)
    return step.icon
  return 'default'
}

const icon = computed(() => getIcon(props.data.icon))
const colorVariant = computed(() => getColorVariant(props.data))

const ui = computed(() => dataflowNode({
  color: colorVariant.value as any,
}))
</script>

<template>
  <BaseFlowNode
    v-bind="props"
    :class="ui.base({ class: [props.ui?.base] })"
  >
    <template #content>
      <UIcon :name="icon" :class="ui.icon({ class: props.ui?.icon })" />
      <span :class="ui.label({ class: props.ui?.label })">{{ props.data.label }}</span>
    </template>

    <template v-if="props.data.description" #popover>
      <div class="p-3 max-w-xs">
        <p class="text-sm">
          {{ props.data.description }}
        </p>
      </div>
    </template>
  </BaseFlowNode>
</template>

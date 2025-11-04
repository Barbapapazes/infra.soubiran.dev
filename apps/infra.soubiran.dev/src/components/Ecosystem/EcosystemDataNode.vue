<script lang="ts">
import type { NodeProps } from '@vue-flow/core'
import type { EcosystemItem } from '@/types/ecosystem'

const ecosystemDataNode = tv({
  slots: {
    base: '',
  },
})

export interface EcosystemDataNodeProps extends NodeProps<EcosystemItem> {
  class?: any
  ui?: Partial<typeof ecosystemDataNode.slots>
}
export interface EcosystemDataNodeEmits {}
export interface EcosystemDataNodeSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<EcosystemDataNodeProps>()
defineEmits<EcosystemDataNodeEmits>()
defineSlots<EcosystemDataNodeSlots>()

const ui = computed(() => ecosystemDataNode())
</script>

<template>
  <EcosystemNode
    :platform="props.data.platform"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    {{ props.data.platform }}
  </EcosystemNode>
</template>

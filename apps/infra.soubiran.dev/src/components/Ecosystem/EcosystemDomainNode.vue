<script lang="ts">
import type { NodeProps } from '@vue-flow/core'
import type { EcosystemItem } from '@/types/ecosystem'

const ecosystemDomainNode = tv({
  slots: {
    base: '',
  },
})

export interface EcosystemDomainNodeProps extends NodeProps<EcosystemItem> {
  class?: any
  ui?: Partial<typeof ecosystemDomainNode.slots>
}
export interface EcosystemDomainNodeEmits {}
export interface EcosystemDomainNodeSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<EcosystemDomainNodeProps>()
defineEmits<EcosystemDomainNodeEmits>()
defineSlots<EcosystemDomainNodeSlots>()

const ui = computed(() => ecosystemDomainNode())
</script>

<template>
  <EcosystemNode
    :platform="props.data.platform"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    {{ props.data.platform }}
  </EcosystemNode>
</template>

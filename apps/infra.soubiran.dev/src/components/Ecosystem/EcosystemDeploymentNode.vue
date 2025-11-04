<script lang="ts">
import type { NodeProps } from '@vue-flow/core'
import type { EcosystemItem } from '@/types/ecosystem'

const ecosystemDeploymentNode = tv({
  slots: {
    base: '',
  },
})

export interface EcosystemDeploymentNodeProps extends NodeProps<EcosystemItem> {
  class?: any
  ui?: Partial<typeof ecosystemDeploymentNode.slots>
}
export interface EcosystemDeploymentNodeEmits {}
export interface EcosystemDeploymentNodeSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<EcosystemDeploymentNodeProps>()
defineEmits<EcosystemDeploymentNodeEmits>()
defineSlots<EcosystemDeploymentNodeSlots>()

const ui = computed(() => ecosystemDeploymentNode())
</script>

<template>
  <EcosystemNode
    :platform="props.data.platform"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    {{ props.data.platform }}
  </EcosystemNode>
</template>

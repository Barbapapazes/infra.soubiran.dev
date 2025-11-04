<script lang="ts">
import type { NodeProps } from '@vue-flow/core'
import type { EcosystemItem } from '@/types/ecosystem'

const ecosystemObjectStorageNode = tv({
  slots: {
    base: '',
  },
})

export interface EcosystemObjectStorageNodeProps extends NodeProps<EcosystemItem> {
  class?: any
  ui?: Partial<typeof ecosystemObjectStorageNode.slots>
}
export interface EcosystemObjectStorageNodeEmits {}
export interface EcosystemObjectStorageNodeSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<EcosystemObjectStorageNodeProps>()
defineEmits<EcosystemObjectStorageNodeEmits>()
defineSlots<EcosystemObjectStorageNodeSlots>()

const ui = computed(() => ecosystemObjectStorageNode())
</script>

<template>
  <EcosystemNode
    :platform="props.data.platform"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    {{ props.data.platform }}
  </EcosystemNode>
</template>

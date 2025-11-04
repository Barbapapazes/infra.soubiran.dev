<script lang="ts">
import type { NodeProps } from '@vue-flow/core'
import type { EcosystemItem } from '@/types/ecosystem'

const ecosystemBuildNode = tv({
  slots: {
    base: '',
  },
})

export interface EcosystemBuildNodeProps extends NodeProps<EcosystemItem> {
  class?: any
  ui?: Partial<typeof ecosystemBuildNode.slots>
}
export interface EcosystemBuildNodeEmits {}
export interface EcosystemBuildNodeSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<EcosystemBuildNodeProps>()
defineEmits<EcosystemBuildNodeEmits>()
defineSlots<EcosystemBuildNodeSlots>()

const ui = computed(() => ecosystemBuildNode())
</script>

<template>
  <EcosystemNode
    :platform="props.data.platform"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    {{ props.data.platform }}
  </EcosystemNode>
</template>

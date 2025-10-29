<script lang="ts">
import PartySocket from 'partysocket'

const viewersCounter = tv({
  slots: {
    base: 'flex items-center justify-center gap-[0.375rem] border border-green-400 rounded-full px-[0.375rem] py-[0.125rem] text-xs text-muted font-light leading-3 dark:border-green-700',
    dot: 'inline-block h-[0.375rem] w-[0.375rem] animate-[pulse_4s_cubic-bezier(0.4,_0,_0.6,_1)_infinite] rounded-full bg-green-400 ring ring-2 ring-green-200 dark:bg-green-700 dark:ring-green-500',
  },
})

interface Data {
  count: number
  connections: { [key: string]: number }
}

export interface ViewersCounterProps {
  class?: any
  ui?: Partial<typeof viewersCounter.slots>
}
export interface ViewersCounterEmits {}
export interface ViewersCounterSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<ViewersCounterProps>()
defineEmits<ViewersCounterEmits>()
defineSlots<ViewersCounterSlots>()

const count = ref<number>(0)
const connections = ref<{ [key: string]: number }>({})

function connect() {
  return new PartySocket({
    host: import.meta.env.VITE_PARTYKIT_URL,
    room: 'soubiran-dev',
  })
}

onMounted(() => {
  const ws = connect()

  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data) as Data

    count.value = data.count
    connections.value = data.connections
  })
})

const title = computed(() => {
  return `${count.value} viewer${count.value > 1 ? 's' : ''} currently online (${Object.keys(connections.value)
    .map(host => `${connections.value[host]} from ${host}`)
    .join(', ')})`
})

const ui = computed(() => viewersCounter())
</script>

<template>
  <div
    v-if="count"
    :title
    :class="ui.base({ class: [props.class, props.ui?.base] })"
  >
    <span>{{ count }}</span>
    <span
      :class="ui.dot({ class: props.ui?.dot })"
      aria-hidden="true"
    />
  </div>
</template>

<script lang="ts">
const sponsors = tv({
  slots: {
    base: 'not-prose',
    img: 'border-0',
  },
})

export interface SponsorsProps {
  class?: any
  ui?: Partial<typeof sponsors.slots>
}
export interface SponsorsEmits {}
export interface SponsorsSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<SponsorsProps>()
defineEmits<SponsorsEmits>()
defineSlots<SponsorsSlots>()

const ui = computed(() => sponsors())
</script>

<template>
  <p :class="ui.base({ class: [props.ui?.base, props.class] })">
    <a href="https://soubiran.dev/sponsorship?utm_source=infra.soubiran.dev&utm_medium=link" target="_blank">
      <img src="https://raw.githubusercontent.com/Barbapapazes/static/refs/heads/main/sponsors.svg" alt="Sponsors" :class="ui.img({ class: props.ui?.img })">
    </a>
  </p>
</template>

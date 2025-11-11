<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import github from '~icons/simple-icons/github'
import linkedin from '~icons/simple-icons/linkedin'
import twitch from '~icons/simple-icons/twitch'
import x from '~icons/simple-icons/x'
import youtube from '~icons/simple-icons/youtube'

const socials = tv({
  slots: {
    base: 'flex flex-wrap gap-2',
    link: 'flex items-center gap-1',
    icon: 'size-4',
  },
})

export interface SocialsProps {
  class?: any
  ui?: Partial<typeof socials.slots>
}
export interface SocialsEmits {}
export interface SocialsSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<SocialsProps>()
defineEmits<SocialsEmits>()
defineSlots<SocialsSlots>()

const ui = computed(() => socials())
</script>

<template>
  <p :class="ui.base({ class: [props.ui?.base, props.class] })">
    <a
      href="https://www.linkedin.com/in/esteban25/"
      rel="noopener noreferrer"
      target="_blank"
      :class="ui.link({ class: props.ui?.link })"
    >
      <UIcon :name="linkedin" :class="ui.icon({ class: props.ui?.icon })" />
      <span>LinkedIn</span>
    </a>
    <a
      href="https://x.com/soubiran_"
      rel="noopener noreferrer"
      target="_blank"
      :class="ui.link({ class: props.ui?.link })"
    >
      <UIcon :name="x" :class="ui.icon({ class: props.ui?.icon })" />
      <span>X (Twitter)</span>
    </a>
    <a
      href="https://github.com/barbapapazes"
      rel="noopener noreferrer"
      target="_blank"
      :class="ui.link({ class: props.ui?.link })"
    >
      <UIcon :name="github" :class="ui.icon({ class: props.ui?.icon })" />
      <span>GitHub</span>
    </a>
    <a
      href="https://www.twitch.tv/barbapapazes"
      rel="noopener noreferrer"
      target="_blank"
      :class="ui.link({ class: props.ui?.link })"
    >
      <UIcon :name="twitch" :class="ui.icon({ class: props.ui?.icon })" />
      <span>Twitch</span>
    </a>
    <a
      href="https://www.youtube.com/@barbapapazes"
      target="_blank"
      rel="noopener noreferrer"
      :class="ui.link({ class: props.ui?.link })"
    >
      <UIcon :name="youtube" :class="ui.icon({ class: props.ui?.icon })" />
      <span>YouTube</span>
    </a>
  </p>
</template>

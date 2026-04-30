<script lang="ts">
import check from '~icons/ph/check'
import copy from '~icons/ph/copy'

const heading = tv({
  slots: {
    base: 'relative group',
    copy: 'opacity-0 group-hover:opacity-100 transition-opacity',
  },
})

export interface HeadingProps {
  level: number
  id: string
  class?: any
  ui?: Partial<typeof heading.slots>
}
export interface HeadingEmits {}
export interface HeadingSlots {
  default: (props: any) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<HeadingProps>()
defineEmits<HeadingEmits>()
defineSlots<HeadingSlots>()

const { track } = useUmami()
const router = useRouter()
const { copied, copy: copyToClipboard } = useClipboard()
async function onCopy() {
  await router.push({ hash: `#${props.id}` })

  const el = document.getElementById(props.id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }

  await copyToClipboard(window.location.href)

  track('heading_copy_link', {
    heading_id: props.id,
    heading_level: props.level,
  })
}

const as = computed(() => `h${props.level}`)

const { setActive, unsetActive } = useTableOfContents()
const target = useTemplateRef<HTMLElement>('target')
useIntersectionObserver(
  target,
  ([entry]) => {
    if (entry?.isIntersecting) {
      setActive(props.id)
    }
    else {
      unsetActive(props.id)
    }
  },
  {
    threshold: 0.1,
  },
)

const ui = computed(() => heading())
</script>

<template>
  <component
    :is="as"
    :id="props.id"
    ref="target"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot />
    <UButton
      square
      variant="link"
      size="sm"
      color="neutral"
      aria-label="Copy link to heading"
      tabindex="-1"
      :class="ui.copy({ class: props.ui?.copy })"
      @click="onCopy()"
    >
      <template #leading>
        <Transition name="heading-copy" mode="out-in">
          <UIcon v-if="copied" :name="check" />
          <UIcon v-else :name="copy" />
        </Transition>
      </template>
      <span class="absolute inset-0 cursor-pointer" />
    </UButton>
  </component>
</template>

<style>
.heading-copy-enter-active,
.heading-copy-leave-active {
  transition: opacity 0.2s ease-out, filter 0.2s ease-out;
}

.heading-copy-enter-from,
.heading-copy-leave-to {
  opacity: 0;
  filter: blur(4px);
}

.heading-copy-enter-to,
.heading-copy-leave-from {
  opacity: 1;
  filter: none;
}
</style>

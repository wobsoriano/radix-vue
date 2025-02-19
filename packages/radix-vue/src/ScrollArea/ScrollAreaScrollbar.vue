<script lang="ts">
import { type Ref } from "vue";
export interface ScrollAreaScrollbarProps {
  orientation: "vertical" | "horizontal";
  forceMount?: boolean;
}

export interface ScrollAreaScollbarProvideValue {
  orientation: Ref<"vertical" | "horizontal">;
  forceMount?: Ref<boolean>;
  isHorizontal: Ref<boolean>;
  visible: Ref<boolean>;
}

export const SCROLL_AREA_SCROLLBAR_INJECTION_KEY =
  "ScrollAreaScrollbar" as const;

export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed, inject, onUnmounted, watch, provide, toRef, ref } from "vue";
import {
  type ScrollAreaProvideValue,
  SCROLL_AREA_INJECTION_KEY,
} from "./ScrollAreaRoot.vue";
import ScrollAreaScrollbarHover from "./ScrollAreaScrollbarHover.vue";
import ScrollAreaScrollbarScroll from "./ScrollAreaScrollbarScroll.vue";
import ScrollAreaScrollbarAuto from "./ScrollAreaScrollbarAuto.vue";
import ScrollAreaScrollbarVisible from "./ScrollAreaScrollbarVisible.vue";

const injectedValue = inject<ScrollAreaProvideValue>(SCROLL_AREA_INJECTION_KEY);

const props = withDefaults(defineProps<ScrollAreaScrollbarProps>(), {
  orientation: "vertical",
  forceMount: undefined,
});

const visible = ref(false);
const isHorizontal = computed(() => props.orientation === "horizontal");

watch(
  isHorizontal,
  () => {
    if (isHorizontal.value) {
      injectedValue?.onScrollbarXEnabledChange(true);
    } else {
      injectedValue?.onScrollbarYEnabledChange(true);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  injectedValue?.onScrollbarXEnabledChange(false);
  injectedValue?.onScrollbarYEnabledChange(false);
});

provide<ScrollAreaScollbarProvideValue>(SCROLL_AREA_SCROLLBAR_INJECTION_KEY, {
  orientation: toRef(() => props.orientation),
  forceMount: toRef(() => props.forceMount),
  isHorizontal,
  visible,
});
</script>

<template>
  <ScrollAreaScrollbarHover
    v-bind="$attrs"
    v-if="injectedValue?.type === 'hover'"
    :forceMount="forceMount"
  >
    <slot></slot>
  </ScrollAreaScrollbarHover>
  <ScrollAreaScrollbarScroll
    v-bind="$attrs"
    v-else-if="injectedValue?.type === 'scroll'"
    :forceMount="forceMount"
  >
    <slot></slot>
  </ScrollAreaScrollbarScroll>
  <ScrollAreaScrollbarAuto
    v-bind="$attrs"
    v-else-if="injectedValue?.type === 'auto'"
    :forceMount="forceMount"
  >
    <slot></slot>
  </ScrollAreaScrollbarAuto>
  <ScrollAreaScrollbarVisible
    v-bind="$attrs"
    v-else-if="injectedValue?.type === 'always'"
    :forceMount="forceMount"
  >
    <slot></slot>
  </ScrollAreaScrollbarVisible>
</template>

<script lang="ts">
export interface TabsContentProps {
  asChild?: boolean;
  value?: string;
  forceMount?: boolean;
}
</script>

<script setup lang="ts">
import { inject, computed } from "vue";
import { PrimitiveDiv } from "@/Primitive";
import { TABS_INJECTION_KEY } from "./TabsRoot.vue";
import type { TabsProvideValue } from "./TabsRoot.vue";

const injectedValue = inject<TabsProvideValue>(TABS_INJECTION_KEY);

const props = withDefaults(defineProps<TabsContentProps>(), {
  asChild: false,
});

const dataState = computed<"active" | "inactive">(() => {
  return injectedValue?.modelValue?.value === props.value
    ? "active"
    : "inactive";
});
</script>

<template>
  <PrimitiveDiv
    v-if="injectedValue?.modelValue?.value === props.value"
    role="tabpanel"
    :data-state="dataState"
    :data-orientation="injectedValue?.orientation"
    tabindex="0"
  >
    <slot />
  </PrimitiveDiv>
</template>

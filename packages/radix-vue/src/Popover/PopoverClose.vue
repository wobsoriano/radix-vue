<script lang="ts">
export interface PopoverCloseProps {
  asChild?: boolean;
}
</script>

<script setup lang="ts">
import { inject } from "vue";
import { PrimitiveButton } from "@/Primitive";
import {
  POPOVER_INJECTION_KEY,
  type PopoverProvideValue,
} from "./PopoverRoot.vue";

const injectedValue = inject<PopoverProvideValue>(POPOVER_INJECTION_KEY);
</script>

<template>
  <PrimitiveButton
    type="button"
    :aria-expanded="injectedValue?.open.value || false"
    :data-state="injectedValue?.open.value ? 'open' : 'closed'"
    @click="injectedValue?.hidePopover"
  >
    <slot />
  </PrimitiveButton>
</template>

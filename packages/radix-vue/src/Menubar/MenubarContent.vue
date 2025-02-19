<script lang="ts">
export type Boundary = Element | null | Array<Element | null>;

export interface MenubarContentProps extends PopperContentProps {
  asChild?: boolean;
  loop?: boolean; //false
  //onOpenAutoFocus?: void;
  //onCloseAutoFocus?: void;
  //onEscapeKeyDown?: void;
  //onPointerDownOutside?: void;
  //onInteractOutside?: void;
}
</script>

<script setup lang="ts">
import { inject, watchEffect, watch, computed } from "vue";
import { PrimitiveDiv, usePrimitiveElement } from "@/Primitive";
import {
  MENUBAR_INJECTION_KEY,
  type MenubarProvideValue,
} from "./MenubarRoot.vue";
import {
  MENUBAR_MENU_INJECTION_KEY,
  type MenubarMenuProvideValue,
} from "./MenubarMenu.vue";
import { PopperContent, type PopperContentProps } from "@/Popper";
import { useCollection } from "@/shared";
import { onClickOutside } from "@vueuse/core";

const rootInjectedValue = inject<MenubarProvideValue>(MENUBAR_INJECTION_KEY);

const injectedValue = inject<MenubarMenuProvideValue>(
  MENUBAR_MENU_INJECTION_KEY
);

const props = withDefaults(defineProps<MenubarContentProps>(), {
  side: "bottom",
  align: "start",
  orientation: "horizontal",
  avoidCollisions: true,
});

const { primitiveElement, currentElement: tooltipContentElement } =
  usePrimitiveElement();

const { createCollection } = useCollection();
createCollection(tooltipContentElement);

watchEffect(() => {
  if (tooltipContentElement.value) {
    if (injectedValue?.isOpen.value) {
      fillItemsArray();
    }
  }
});

watch(
  () => rootInjectedValue?.selectedElement.value,
  (n) => {
    if (!injectedValue?.isOpen.value) return;
    const siblingsElement = Array.from(
      n
        ?.closest('[role="tooltip"]')
        ?.querySelectorAll(
          "[data-radix-vue-collection-item]:not([data-disabled])"
        ) ?? []
    ) as HTMLElement[];

    if (!siblingsElement?.length) return;
    if (
      siblingsElement.includes(
        injectedValue!.triggerElement.value as HTMLElement
      )
    ) {
      if (
        rootInjectedValue?.selectedElement.value !==
        injectedValue?.triggerElement.value
      ) {
        rootInjectedValue?.changeValue(undefined);
      }
    }
  }
);

function fillItemsArray() {
  const allToggleItem = Array.from(
    tooltipContentElement.value!.querySelectorAll(
      "[data-radix-vue-collection-item]:not([data-disabled])"
    )
  ) as HTMLElement[];
  injectedValue!.itemsArray = allToggleItem;
  return allToggleItem;
}

onClickOutside(tooltipContentElement, (event) => {
  const target = event.target as HTMLElement;
  if (target.closest('[role="menuitem"]')) return;
  rootInjectedValue?.changeValue(undefined);
  rootInjectedValue!.selectedElement.value = undefined;
});

const dataState = computed(() => {
  return injectedValue?.isOpen ? "open" : "false";
});
</script>

<template>
  <PopperContent v-bind="props" v-if="injectedValue?.isOpen.value">
    <PrimitiveDiv
      ref="primitiveElement"
      :data-state="dataState"
      :data-side="props.side"
      :data-align="props.align"
      :aria-labelledby="injectedValue?.triggerId"
      :data-orientation="injectedValue?.orientation"
      role="tooltip"
      :asChild="props.asChild"
      style="pointer-events: auto"
    >
      <slot />
    </PrimitiveDiv>
  </PopperContent>
</template>

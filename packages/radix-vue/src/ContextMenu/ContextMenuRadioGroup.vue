<script lang="ts">
import type { Ref } from "vue";

export interface RadioGroupRootProps {
  value?: string;
  defaultValue?: string;
  //disabled?: boolean;
  modelValue?: string | string[];
}

export const RADIO_GROUP_INJECTION_KEY = "RadioGroup" as const;

export interface RadioGroupProvideValue {
  modelValue?: Readonly<Ref<string | string[] | undefined>>;
  changeModelValue: (value?: string) => void;
  parentElement: Ref<HTMLElement | undefined>;
}
</script>

<script setup lang="ts">
import { PrimitiveDiv, usePrimitiveElement } from "@/Primitive";
import { toRef, provide } from "vue";

const props = defineProps<RadioGroupRootProps>();

const emits = defineEmits(["update:modelValue"]);

const { primitiveElement, currentElement: parentElement } =
  usePrimitiveElement();

provide<RadioGroupProvideValue>(RADIO_GROUP_INJECTION_KEY, {
  modelValue: toRef(() => props.modelValue),
  changeModelValue: (value?: string) => {
    emits("update:modelValue", value);
  },
  parentElement,
});
</script>

<template>
  <PrimitiveDiv
    ref="primitiveElement"
    role="radiogroup"
    aria-label="radiogroup"
  >
    <slot />
  </PrimitiveDiv>
</template>

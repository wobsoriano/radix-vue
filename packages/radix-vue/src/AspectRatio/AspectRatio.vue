<script lang="ts">
interface AspectRatioProps {
  asChild?: boolean;
  ratio?: number;
}
</script>

<script setup lang="ts">
import { PrimitiveDiv } from "@/Primitive";
import { computed } from "vue";

const props = withDefaults(defineProps<AspectRatioProps>(), {
  ratio: 1,
});

const aspect = computed(() => {
  return (1 / props.ratio) * 100;
});
</script>

<template>
  <div :style="`position: relative; width: 100%; padding-bottom: ${aspect}%`">
    <PrimitiveDiv :asChild="asChild" style="position: absolute; inset: 0px">
      <slot />
    </PrimitiveDiv>
  </div>
</template>

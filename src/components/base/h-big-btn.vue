<template>
  <button
    :type="type"
    :class="buttonClasses"
    class="tracking-tight relative overflow-hidden flex justify-center items-center transition-all duration-700 ease-in-out group active:scale-95 rounded-full border-[1.5px]"
  >
    <!-- Initial text, fades to transparent on hover -->
    <span
      :class="textClasses"
      class="mx-10 my-2 transition-colors duration-100 ease-out relative z-10"
    >
      <slot>Button</slot>
    </span>

    <!-- Sliding background element on hover -->
    <span
      :class="hoverBgClasses"
      class="aspect-square flex items-center rounded-full w-full h-auto absolute hover-element"
    >
    </span>

    <!-- Text that appears on hover -->
    <span :class="hoverTextClasses" class="absolute z-10 hover-text">
      <slot>Button</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Define the component's props with TypeScript for type safety
interface Props {
  type?: "button" | "submit" | "reset";
  bg?: string;
  textColor?: string;
  hoverBg?: string;
  hoverTextColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  textSize?: string;
}

// Set default values for the props
const props = withDefaults(defineProps<Props>(), {
  type: "button",
  bg: "bg-primary",
  textColor: "text-white",
  hoverBg: "bg-secondary",
  hoverTextColor: "text-primary",
  borderColor: "border-primary",
  hoverBorderColor: "hover:border-secondary",
  textSize: "text-base"
});

// Computed property to dynamically generate the main button classes
const buttonClasses = computed(() => {
  return [props.bg, props.borderColor, props.hoverBorderColor, props.textSize];
});

// Computed property for the initial text classes
const textClasses = computed(() => {
  return [props.textColor, "group-hover:text-transparent"];
});

// Computed property for the sliding background element's classes
const hoverBgClasses = computed(() => {
  return [props.hoverBg];
});

// Computed property for the text that appears on hover
const hoverTextClasses = computed(() => {
  return [props.hoverTextColor];
});
</script>

<style scoped>
/* Keyframes for the slide-up animation */
@keyframes slideUpFromBottom {
  0% {
    transform: translateY(100%);
  }
  50% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
}

/* Keyframes for the slide-back-up animation when hover is lost */
@keyframes slideBackUp {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}

/* Initial state for the sliding background element */
.hover-element {
  transform: translateY(100%);
  transition: none; /* Disable transition to let animation control it */
}

/* Trigger the slide-up animation on group hover */
.group:hover .hover-element {
  animation: slideUpFromBottom 0.7s ease-in-out forwards;
}

/* Initial state for the hover text */
.hover-text {
  transform: translateY(120%);
  transition: none;
}

/* Trigger the hover text animation on group hover */
.group:hover .hover-text {
  /* A slight delay to let the background slide in first */
  animation: slideUpFromBottom 1s ease-in-out forwards;
}

/* This part is commented out because the animation should only run on hover.
  If we enable this, the element will animate out even on page load.
  The hover state is managed by the group-hover selector.
*/
.group:not(:hover) .hover-element {
  animation: slideBackUp 0.7s ease-in-out forwards;
}
</style>

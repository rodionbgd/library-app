<template>
  <div>
    <a
      target="_blank"
      rel="noopener"
      class="external-link"
      v-if="isExternal"
      :href="props.to"
    >
      <slot />
    </a>
    <router-link v-else v-bind="props">
      <slot />
    </router-link>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { computed } from "vue";

const props = defineProps({ ...RouterLink.props });
const isExternal = computed(
  () => typeof props.to === "string" && props.to.startsWith("http")
);
</script>

<style scoped></style>

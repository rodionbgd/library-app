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
    <router-link v-else v-bind="props" @keypress.enter.prevent>
      <slot />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { computed } from "vue";

// @ts-ignore
const props = defineProps({ ...RouterLink.props });
const isExternal = computed(
  () => typeof props.to === "string" && props.to.startsWith("http")
);
</script>

<style scoped></style>

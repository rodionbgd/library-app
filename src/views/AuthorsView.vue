<template>
  <div>
    <h2 v-for="(author, index) in authors" :key="index">{{ author }}</h2>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const authors = computed(() => store.state.authors);
</script>

<style scoped></style>

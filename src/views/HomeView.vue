<template>
  <BookList>
    <p>{{ title }}</p>
  </BookList>
</template>

<script setup>
import BookList from "@/components/BookList.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const title = computed(() => {
  const titleQuery = route.query.title;
  if (titleQuery) {
    return `Title contains "${titleQuery}"`;
  }
  return "";
});
</script>

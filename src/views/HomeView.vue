<template>
  <BookList>
    <div v-if="filter.length">
      <p>Filter</p>
      <h6 v-for="(item, index) of filter" :key="index">{{ item }}</h6>
    </div>
  </BookList>
</template>

<script setup>
import BookList from "@/components/BookList.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const filter = computed(() => {
  const { title, author, rate, from, to } = route.query;
  let composedFilter = [];
  if (title) {
    composedFilter.push(`title: "${title}"`);
  }
  if (author) {
    composedFilter.push(`author name: "${author}"`);
  }
  if (rate) {
    composedFilter.push(`rate: ${rate}`);
  }
  if (from) {
    composedFilter.push(`price from: ${from}`);
  }
  if (to) {
    composedFilter.push(`price to: ${to}`);
  }
  return composedFilter;
});
</script>

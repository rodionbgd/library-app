<template>
  <div>
    <router-view />
    <BookList :authorId="props.authorId">
      <p>Books by {{ author }}</p>
    </BookList>
  </div>
</template>

<script setup>
import BookList from "@/components/BookList.vue";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const props = defineProps({
  authorId: {
    type: Number,
  },
});

const author = computed(() => {
  return store.getters["authorById"](props.authorId)[0];
});
</script>

<style scoped></style>

<template>
  <div class="row tm-row book-list">
    <BookItem v-for="book in booksByAuthor" :key="book.id" :book="book" />
  </div>
</template>

<script setup>
import BookItem from "@/components/BookItem.vue";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const books = computed(() => store.state.books);

const booksByAuthor = computed(() => {
  return books.value.filter((book) =>
    book.authors.find((author) => author.name === props.name)
  );
});
</script>

<style scoped></style>

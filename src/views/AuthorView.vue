<template>
  <div>
    <router-view />
    <p>Books by {{ author?.name }}</p>
    <div class="row tm-row book-list">
      <BookItem
        v-for="book in booksByAuthor"
        :key="book.id"
        :book="book"
        routeName="edit-book-author"
      />
    </div>
  </div>
</template>

<script setup>
import BookItem from "@/components/BookItem.vue";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const props = defineProps({
  authorId: {
    type: Number,
    required: true,
  },
});

const author = computed(() => store.getters.getAuthorById(props.authorId));
const booksByAuthor = computed(() =>
  store.getters.getAuthorBookById(props.authorId)
);
</script>

<style scoped></style>

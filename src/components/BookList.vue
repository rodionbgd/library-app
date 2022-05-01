<template>
  <div>
    <router-view />
    <div v-if="filteredBooks.length">
      <div class="position-fixed row tm-row page-nav">
        <div class="tm-prev-next-wrapper">
          <button
            @click="showPrev"
            :class="{ disabled: !hasPrev }"
            class="mb-2 tm-btn tm-btn-primary tm-prev-next tm-mr-20"
          >
            prev
          </button>
          <button
            @click="showNext"
            :class="{ disabled: !hasNext }"
            class="mb-2 tm-btn tm-btn-primary tm-prev-next"
          >
            next
          </button>
        </div>
      </div>
      <div class="row tm-row book-list tm-mt-4r">
        <slot></slot>
      </div>
      <div class="row tm-row book-list tm-mt-2r">
        <BookItem
          v-for="book in booksCurrentPage"
          :key="book.id"
          :book="book"
          @remove-book="removeBook"
        />
      </div>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup>
import BookItem from "@/components/BookItem.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed, onMounted, reactive, watch } from "vue";

const booksPerPage = 6;
const router = useRouter();
const route = useRoute();
const store = useStore();

const props = defineProps({
  authorId: {
    type: Number,
  },
});
const data = reactive({
  currentPage: 0,
});

const updateCurrentPage = () => {
  data.currentPage = parseInt(route.query.page ?? 1);
};

onMounted(() => {
  updateCurrentPage();
});

const booksByAuthor = computed(() =>
  store.getters.authorBookById(props.authorId)
);

const books = computed(() => {
  if (props.authorId) {
    return booksByAuthor.value;
  }
  return store.state.books;
});

const filteredBooks = computed(() => {
  const titleQuery = route.query.title;
  if (!titleQuery) {
    return books.value;
  }
  return books.value.filter((book) => book.title.includes(titleQuery));
});

watch(() => route.query.page, updateCurrentPage);

const maxPage = computed(
  () => Math.ceil(filteredBooks.value.length / booksPerPage) || 1
);

const booksCurrentPage = computed(() => {
  const start = (data.currentPage - 1) * booksPerPage;
  const end = data.currentPage * booksPerPage;
  return [...filteredBooks.value]?.slice(start, end);
});

const updateRoute = () => {
  router.push({
    ...route,
    query: {
      ...route.query,
      page: data.currentPage,
    },
  });
};

const showNext = () => {
  if (hasNext.value) {
    data.currentPage += 1;
  }
  updateRoute();
};

const showPrev = () => {
  if (hasPrev.value) {
    data.currentPage -= 1;
  }
  updateRoute();
};

const hasNext = computed(() => {
  return data.currentPage < maxPage.value;
});

const hasPrev = computed(() => {
  return data.currentPage > 1;
});

const removeBook = (book) => {
  store.dispatch("removeBook", book);
  if (maxPage.value < data.currentPage) {
    data.currentPage = maxPage.value;
    updateRoute();
  }
};
</script>

<style scoped>
.page-nav {
  top: 4rem;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  background: white;
  z-index: 5;
  padding-top: 1rem;
}
</style>

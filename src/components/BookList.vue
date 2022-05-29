<template>
  <div>
    <router-view />
    <div
      data-test="loading"
      v-if="!filteredBooks.length && !Object.keys(route.query).length"
    >
      Loading...
    </div>
    <div v-else>
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
            data-test="next-page"
            @click="showNext"
            :class="{ disabled: !hasNext }"
            class="mb-2 tm-btn tm-btn-primary tm-prev-next"
          >
            next
          </button>
        </div>
      </div>
      <div class="row tm-row tm-mt-4r">
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
  </div>
</template>

<script setup>
import BookItem from "@/components/BookItem.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed, reactive, watchEffect } from "vue";

const BOOKS_PER_PAGE = 6;
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
  if (props.authorId && !booksByAuthor.value.length) {
    router.back();
    return;
  }
  data.currentPage = parseInt(route.query?.page ?? 1);
};

const booksByAuthor = computed(() => {
  return store.getters["authorBookById"](props.authorId);
});

const books = computed(() => {
  if (props.authorId) {
    return booksByAuthor.value;
  }
  return store.state.books;
});

const filteredBooks = computed(() => {
  let initialBooks = [...books.value];
  const { title, author, rate, from, to } = route.query;
  if (author) {
    const books = new Set();
    Object.entries(store.state.authors).forEach(([name, a]) => {
      if (name.toLowerCase().includes(`${author}`)) {
        a.books.forEach((book) => {
          books.add(book);
        });
      }
    });
    initialBooks = [...books];
  }
  if (title) {
    initialBooks = initialBooks.filter((book) =>
      book.title.toLowerCase().includes(`${title}`)
    );
  }
  if (rate) {
    initialBooks = initialBooks.filter((book) => book.rate === +rate);
  }
  if (from && !Number.isNaN(from)) {
    initialBooks = initialBooks.filter((book) => book.price >= +from);
  }
  if (to && !Number.isNaN(to)) {
    initialBooks = initialBooks.filter((book) => book.price <= +to);
  }
  return initialBooks;
});

watchEffect(updateCurrentPage);

const maxPage = computed(
  () => Math.ceil(filteredBooks.value.length / BOOKS_PER_PAGE) || 1
);

const booksCurrentPage = computed(() => {
  const start = (data.currentPage - 1) * BOOKS_PER_PAGE;
  const end = data.currentPage * BOOKS_PER_PAGE;
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
  z-index: 4;
  padding-top: 1rem;
}
</style>

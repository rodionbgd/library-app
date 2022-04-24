<template>
  <div>
    <router-view />
    <div v-if="books.length">
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
      <div class="row tm-row book-list tm-mt-6r">
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
import { computed, onMounted, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const booksPerPage = 6;
const router = useRouter();
const route = useRoute();
const store = useStore();

const data = reactive({
  currentPage: 0,
});

const updateCurrentPage = () => {
  data.currentPage = parseInt(route.query.page ?? 1);
};

onMounted(updateCurrentPage);

const books = computed(() => {
  return store.state.books;
});

watch(() => route.query.page, updateCurrentPage);

const maxPage = computed(() => Math.ceil(books.value.length / booksPerPage));

const booksCurrentPage = computed(() => {
  const start = (data.currentPage - 1) * booksPerPage;
  const end = data.currentPage * booksPerPage;
  return [...books.value].slice(start, end);
});

const updateRoute = () => {
  router.push({
    name: "home",
    query: {
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

<template>
  <div class="search-input-wrapper">
    <form
      class="form-inline tm-search-form search-input"
      @submit.prevent="showBookByQuery"
    >
      <input
        class="form-control tm-search-input"
        v-model="titleQuery"
        type="text"
        placeholder="Search..."
        aria-label="Search"
      />
      <ButtonUI type="submit">
        <font-awesome-icon
          icon="magnifying-glass"
          class="tm-search-icon"
          aria-hidden="true"
        ></font-awesome-icon>
      </ButtonUI>
      <app-link
        :to="{
          name: 'add-book',
          params: { bookId: store.state.books.lastBookId + 1 },
        }"
      >
        <ButtonUI type="button">
          <font-awesome-icon
            icon="plus"
            class="tm-search-icon"
            aria-hidden="true"
          ></font-awesome-icon>
        </ButtonUI>
      </app-link>
    </form>
  </div>
</template>

<script setup lang="ts">
import ButtonUI from "@/components/UI/ButtonUI.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
const titleQuery = ref();

const showBookByQuery = () => {
  if (!titleQuery.value) {
    return;
  }
  router.push({ name: "home", query: { title: titleQuery.value } });
  titleQuery.value = "";
};
</script>

<style scoped>
.search-input-wrapper {
  width: 100%;
  left: 30%;
  margin-left: 5rem;
  position: fixed;
  z-index: 5;
  background: white;
  display: inline-block;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
}

.search-input {
  width: 40%;
}
</style>

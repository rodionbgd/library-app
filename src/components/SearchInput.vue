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
        <i class="fas fa-search tm-search-icon" aria-hidden="true"></i>
      </ButtonUI>
      <app-link
        :to="{
          name: 'add-book',
          params: { bookId: store.state.lastBookId + 1 },
        }"
      >
        <ButtonUI type="button" disabled>
          <i class="fa-solid fa-plus tm-search-icon" aria-hidden="true"></i>
        </ButtonUI>
      </app-link>
    </form>
  </div>
</template>

<script setup>
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

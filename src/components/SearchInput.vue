<template>
  <div class="search-input">
    <form class="form-inline tm-search-form" @submit.prevent="showBookByQuery">
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
      <app-link :to="{ name: 'add-book' }">
        <ButtonUI type="button">
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

const router = useRouter();

const titleQuery = ref();

const showBookByQuery = () => {
  router.push({ name: "home", query: { title: titleQuery.value } });
  titleQuery.value = "";
};
</script>

<style scoped>
.search-input {
  width: 100%;
  position: fixed;
  z-index: 5;
  background: white;
  display: inline-block;
  padding-right: 20%;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
}
</style>

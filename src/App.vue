<template>
  <SearchInput />
  <AppHeader />
  <div class="container-fluid">
    <main class="tm-main">
      <router-view :key="route.path"></router-view>
    </main>
  </div>
</template>

<script setup>
import AppHeader from "@/components/AppHeader.vue";
import SearchInput from "@/components/SearchInput.vue";
import { useStore } from "vuex";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();
onMounted(() => {
  store.dispatch("getBooks");
});
</script>

<style>
html {
  overflow-x: hidden;
}

body {
  margin: 0;
  padding: 0;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 19px;
  line-height: 2em;
  overflow-x: hidden;
}

p {
  color: #999;
}
</style>

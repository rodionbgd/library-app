<template>
  <SearchInput />
  <AppHeader />
  <div class="container-fluid">
    <main class="tm-main">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import AppHeader from "@/components/AppHeader.vue";
import SearchInput from "@/components/SearchInput.vue";
import { useStore } from "vuex";
import { onMounted } from "vue";

const store = useStore();
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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

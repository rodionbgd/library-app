<template>
  <header class="tm-header" id="tm-header">
    <div class="tm-header-wrapper">
      <app-link :to="{ name: 'home' }">
        <div class="d-flex p-2 align-items-center">
          <div class="mb-3 tm-site-logo">
            <img
              src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-bookshelf-home-and-living-justicon-flat-justicon.png"
              alt="library"
            />
          </div>
          <h1 class="text-center">Library</h1>
        </div>
      </app-link>
      <transition name="fade" mode="out-in">
        <div v-if="!data.toggleMenu" class="tm-h-15rem">
          <nav class="tm-nav">
            <ul>
              <MenuItem
                v-for="item in data.menuItems"
                :key="item.title"
                :item="item"
              />
            </ul>
          </nav>
        </div>
        <div v-else class="d-flex flex-column tm-h-15rem">
          <BookFilter @update-filter="updateFilter" />
        </div>
      </transition>
      <div class="d-flex justify-content-center">
        <transition name="fade" mode="out-in">
          <ButtonUI
            v-if="!data.toggleMenu"
            class="tm-search-icon border border-white px-0"
            @click="data.toggleMenu = !data.toggleMenu"
            >Filter
          </ButtonUI>
          <ButtonUI
            v-else
            class="tm-search-icon border border-white px-0"
            @click="data.toggleMenu = !data.toggleMenu"
            >Menu
          </ButtonUI>
        </transition>
      </div>
      <div class="d-flex justify-content-center mt-5">
        <app-link
          rel="nofollow"
          to="https://github.com/rodionbgd"
          class="tm-social-link"
        >
          <font-awesome-icon
            class="tm-social-icon"
            :icon="['fab', 'github']"
          ></font-awesome-icon>
        </app-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import ButtonUI from "@/components/UI/ButtonUI.vue";
import BookFilter from "@/components/BookFilter.vue";
import MenuItem from "@/components/MenuItem.vue";

import type { Filter } from "@/components/BookFilter.vue";

type Data = {
  menuItems: MenuItemT[];
  toggleMenu: boolean;
};

export type MenuItemT = {
  title: string;
  link: string;
  iconClass: string;
};

const router = useRouter();
const route = useRoute();
const data = reactive<Data>({
  menuItems: [
    {
      title: "Books",
      link: "/",
      iconClass: "book",
    },
    {
      title: "Authors",
      link: "/authors",
      iconClass: "feather-pointed",
    },
  ],
  toggleMenu: false,
});

const updateFilter = (filter: Filter) => {
  router.push({
    ...route,
    name: "home",
    query: {
      ...filter,
    },
  });
};
</script>

<style scoped>
@import "@/assets/flipper.css";

.tm-header {
  background-color: #0cc;
  color: white;

  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 5;
  width: 30%;
  overflow-y: visible;
}

.tm-header-wrapper {
  overflow-y: scroll;
  -ms-overflow-style: none;
  padding: 30px;
  width: 100%;
}

.tm-header-wrapper::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.tm-site-logo {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  /*background-color: white;    */
  display: flex;
  align-items: center;
  justify-content: center;
}

.tm-site-logo i {
  color: #0cc;
}

.tm-nav {
  margin-left: -30px;
}

.tm-social-link {
  display: inline-block;
  text-align: center;
  background-color: white;
  font-size: 1.9rem;
  width: 50px;
  height: 50px;
  padding-top: 0.5rem;
  margin-bottom: 15px;
  border-radius: 50%;
}

.tm-social-icon {
  color: #0cc;
  transition: all 0.3s ease;
}
</style>

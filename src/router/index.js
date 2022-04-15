import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/authors",
    name: "authors",
    component: () => import("@/views/AuthorsView.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/AuthorsView.vue"),
  },
];

export const path =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === "production" ? "/library-app/" : "./";

const router = createRouter({
  history: createWebHistory(path),
  routes,
});

export default router;

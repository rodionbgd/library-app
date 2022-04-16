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
    path: "/author/:id",
    name: "author",
    component: () => import("@/views/AuthorView.vue"),
    props: (route) => ({ ...route.params, id: parseInt(route.params.id) }),
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
  scrollBehavior(to, from, savedPosition) {
    return (
      savedPosition ||
      (to.fullPath !== from.fullPath &&
        new Promise((resolve) =>
          setTimeout(() => resolve({ top: 0, behavior: "smooth" }), 200)
        ))
    );
  },
});

export default router;

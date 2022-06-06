import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocation } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { transition: "" },
    children: [
      {
        path: "edit/:bookId",
        name: "edit-book",
        component: () => import("@/views/EditBook.vue"),
        props: (route: RouteLocation) => ({
          ...route.params,
          bookId: parseInt(`${route.params.bookId}`),
        }),
      },
    ],
  },
  {
    path: "/add",
    name: "add-book",
    component: () => import("@/views/EditBook.vue"),
    props: (route: RouteLocation) => ({
      ...route.params,
      bookId: parseInt(`${route.params.bookId}`),
    }),
    meta: { transition: "" },
  },
  {
    path: "/authors",
    name: "authors",
    component: () => import("@/views/AuthorsView.vue"),
  },
  {
    path: "/author/:authorId",
    name: "author",
    component: () => import("@/views/AuthorView.vue"),
    props: (route: RouteLocation) => ({
      ...route.params,
      authorId: parseInt(`${route.params.authorId}`),
    }),
    meta: { transition: "" },
    children: [
      {
        path: "edit/:bookId",
        name: "edit-book-author",
        component: () => import("@/views/EditBook.vue"),
        props: (route: RouteLocation) => ({
          ...route.params,
          bookId: parseInt(`${route.params.bookId}`),
        }),
      },
    ],
  },
];

export const path = process.env.NODE_ENV === "production" ? "/library-app/" : "./";

const router = createRouter({
  history: createWebHistory(path),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (
      to.fullPath !== from.fullPath &&
      from.name !== "edit-book" &&
      to.name !== "edit-book"
    )
      return new Promise((resolve) =>
        setTimeout(() => resolve({ top: 0, behavior: "smooth" }), 200)
      );
    return savedPosition || undefined;
  },
});

export { routes };
export default router;

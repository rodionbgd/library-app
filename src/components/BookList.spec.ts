import BookItem from "@/components/BookItem.vue";
import BookList from "@/components/BookList.vue";

import { useRoute, useRouter } from "vue-router";

import { describe, test, expect, vi, beforeEach } from "vitest";
import type { SpyInstance, SpyInstanceFn } from "vitest";
import { mount } from "@vue/test-utils";
import store from "@/store";
import { AllActionTypes } from "@/store/action-types";
import type { AuthorBase, AuthorObj } from "@/types";
import type Filter from "@/components/BookFilter.vue";

const BOOKS_PER_PAGE = 6;

vi.mock("vue-router", () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  createWebHistory: vi.fn(),
  createRouter: vi.fn(),
}));

vi.mock("@/api", () => {
  const AUTHORS_NUMBER = 50;
  const authors: AuthorObj = {};
  for (let i = 0; i < AUTHORS_NUMBER; i += 1) {
    authors[`author_${i}_0`] = {
      id: i,
      birth_year: Math.ceil(Math.random() * 2000),
      death_year: Math.ceil(Math.random() * 2000) + 2000,
      books: [
        {
          title: `title_${i}`,
          id: i,
          authors: [{ name: `author_${i}_0`, birth_year: "", death_year: "" }],
          rate: i % 5,
          formats: { "image/jpeg": "" },
          price: 0,
        },
      ],
    };
  }
  return { getAuthors: () => authors };
});

async function getBookItems(query: Filter) {
  const wrapper = getWrapper(query);
  await store.dispatch(AllActionTypes.GET_AUTHORS);
  return wrapper.findAllComponents(BookItem);
}

function getWrapper(query: Filter) {
  (useRoute as unknown as SpyInstance).mockImplementationOnce(() => ({
    query,
  }));
  return mount(BookList, {
    global: {
      plugins: [store],
      stubs: {
        AppLink: true,
        BookItem: true,
        FontAwesomeIcon: true,
        "router-view": true,
      },
    },
  });
}

describe("BookList test", () => {
  let wrapper: ReturnType<typeof getWrapper>;
  beforeEach(() => {
    wrapper = getWrapper({});
  });
  test("Showing books after loading", async () => {
    const getLoadingEl = () => wrapper.find('[data-test="loading"]');
    expect(getLoadingEl().isVisible()).toBeTruthy();
    await store.dispatch(AllActionTypes.GET_AUTHORS);
    expect(getLoadingEl().exists()).toBeFalsy();
  });
  describe("Filtering books", () => {
    test("Filtering books by title", async () => {
      const query = { title: "3" };
      const bookItems = await getBookItems(query);
      bookItems.forEach((book) => {
        expect(book.vm.$props.book.title.toLowerCase()).toContain(
          `${query.title}`.toLowerCase()
        );
      });
    });
    test("Filtering books by author", async () => {
      const query = { author: "3" };
      const bookItems = await getBookItems(query);
      bookItems.forEach((book) => {
        const authors = (book.vm.$props.book.authors as AuthorBase[]).map(
          (author) => author.name.toLowerCase()
        );
        expect(
          authors.find((author) => author.includes(query.author))
        ).toBeTruthy();
      });
    });
    test("Filtering books by rate", async () => {
      const query: Filter = { rate: "4" };
      const bookItems = await getBookItems(query);
      bookItems.forEach((book) => {
        expect(book.vm.$props.book.rate).toBe(parseInt(`${query.rate}`));
      });
    });
  });
  describe("Updating routes", () => {
    let push: SpyInstanceFn;
    beforeEach(async () => {
      push = vi.fn();
      (useRouter as unknown as SpyInstance).mockImplementationOnce(() => ({
        push,
      }));
      await store.dispatch(AllActionTypes.GET_AUTHORS);
    });
    test("Removing books", async () => {
      if (!store.state.books) {
        return;
      }
      const booksNumber = store.state.books.books.length;
      const booksToRemove = booksNumber % BOOKS_PER_PAGE;
      const maxPage = Math.ceil(booksNumber / BOOKS_PER_PAGE);
      const query: Filter = { page: `${maxPage}` };
      const bookItems = await getBookItems(query);

      for (let i = 0; i < booksToRemove; i += 1) {
        const bookToRemove = store.state.books.books.at(-1);
        bookItems.at(-1)?.vm.$emit("remove-book", bookToRemove);
        expect(store.state.books.books).not.toContain(bookToRemove);
      }
      if (query.page !== undefined) {
        query.page = (parseInt(`${query.page}`) - 1) as unknown as string;
      }
      expect(push).toHaveBeenCalledWith({ query });
    });

    test("Updating route", async () => {
      const query: Filter = { page: "1" };
      wrapper = getWrapper(query);
      const nextPageBtn = wrapper.get('[data-test="next-page"]');
      await nextPageBtn.trigger("click");
      if (query.page !== undefined) {
        query.page = (parseInt(`${query.page}`) + 1) as unknown as string;
      }
      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({ query });
    });
  });
});

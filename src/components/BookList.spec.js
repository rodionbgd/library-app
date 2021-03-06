import BookItem from "@/components/BookItem.vue";
import BookList from "@/components/BookList.vue";

import { useRoute, useRouter } from "vue-router";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import store from "@/store";

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
  const BOOKS_NUMBER = 50;
  const books = [];
  for (let i = 0; i < BOOKS_NUMBER; i += 1) {
    books.push({
      title: `title_${i}`,
      id: i,
      authors: [{ name: `author_${i}_0` }, { name: `author_${i}_1` }],
      rate: i % 5,
    });
  }
  return { getBooks: () => books };
});

async function getBookItems(query) {
  const wrapper = getWrapper(query);
  await store.dispatch("getBooks");
  return wrapper.findAllComponents(BookItem);
}

function getWrapper(query) {
  useRoute.mockImplementationOnce(() => ({
    query,
  }));
  return mount(BookList, {
    global: {
      plugins: [store],
      stubs: {
        AppLink: true,
        BookItem: true,
        "router-view": true,
      },
    },
  });
}

describe("BookList test", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = getWrapper({});
  });
  test("Showing books after loading", async () => {
    const getLoadingEl = () => wrapper.find('[data-test="loading"]');
    expect(getLoadingEl().isVisible()).toBeTruthy();
    await store.dispatch("getBooks");
    expect(getLoadingEl().exists()).toBeFalsy();
  });
  describe("Filtering books", () => {
    test("Filtering books by title", async () => {
      const query = { title: "3" };
      const bookItems = await getBookItems(query);
      bookItems.forEach((book) => {
        expect(book.vm.$props.book.title.toLowerCase()).toContain(
          query.title.toLowerCase()
        );
      });
    });
    test("Filtering books by author", async () => {
      const query = { author: "3" };
      const bookItems = await getBookItems(query);
      bookItems.forEach((book) => {
        const authors = book.vm.$props.book.authors.map((author) =>
          author.name.toLowerCase()
        );
        expect(
          authors.find((author) => author.includes(query.author))
        ).toBeTruthy();
      });
    });
    test("Filtering books by rate", async () => {
      const query = { rate: "4" };
      const bookItems = await getBookItems(query);
      bookItems.forEach((book) => {
        expect(`${book.vm.$props.book.rate}`).toBe(query.rate);
      });
    });
  });
  describe("Updating routes", () => {
    let push;
    beforeEach(async () => {
      push = vi.fn();
      useRouter.mockImplementationOnce(() => ({
        push,
      }));
      await store.dispatch("getBooks");
    });
    test("Removing books", async () => {
      const booksNumber = store.state.books.length;
      const booksToRemove = booksNumber % BOOKS_PER_PAGE;
      const maxPage = Math.ceil(booksNumber / BOOKS_PER_PAGE);
      const query = { page: maxPage };
      const bookItems = await getBookItems(query);

      for (let i = 0; i < booksToRemove; i += 1) {
        const bookToRemove = store.state.books.at(-1);
        bookItems.at(-1)?.vm.$emit("remove-book", bookToRemove);
        expect(store.state.books).not.toContain(bookToRemove);
      }

      query.page -= 1;
      expect(push).toHaveBeenCalledWith({ query });
    });

    test("Updating route", async () => {
      const query = { page: 1 };
      wrapper = getWrapper(query);
      const nextPageBtn = wrapper.get('[data-test="next-page"]');
      await nextPageBtn.trigger("click");
      query.page += 1;
      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({ query });
    });
  });
});

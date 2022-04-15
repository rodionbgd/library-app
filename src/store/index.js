import { createStore } from "vuex";
import { getBooks } from "@/api";

const store = createStore({
  state() {
    return {
      books: [],
      search: "",
      authors: new Set(),
    };
  },
  mutations: {
    GET_BOOKS(state, payload) {
      state.books = payload;
      state.books.forEach((book) =>
        book.authors.forEach((author) => state.authors.add(author.name))
      );
    },
  },

  actions: {
    async getBooks({ commit, state }) {
      if (!state.books.length) {
        const books = await getBooks();
        commit("GET_BOOKS", books);
      }
    },
  },
});

export default store;

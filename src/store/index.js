import { createStore } from "vuex";
import { getBooks } from "@/api";

const store = createStore({
  state() {
    return {
      books: [],
      search: "",
      authors: [],
    };
  },
  mutations: {
    GET_BOOKS(state, payload) {
      state.books = [...state.books, ...payload];
    },
    GET_AUTHORS(state) {
      let id = 1;
      state.authors = [];
      state.books?.forEach((book) =>
        book.authors?.forEach((author) => {
          const hasAuthor = state.authors.find(
            ({ name }) => name === author.name
          );
          if (hasAuthor) {
            hasAuthor.books += 1;
            return;
          }
          const newAuthor = { ...author, books: 1, id };
          id++;
          state.authors.push(newAuthor);
        })
      );
      state.authors = state.authors?.sort((author1, author2) =>
        author1.name.localeCompare(author2.name)
      );
    },
    REMOVE_BOOK(state, payload) {
      state.books = state.books.filter((book) => book.id !== payload.id);
    },
  },

  actions: {
    async getBooks({ commit }) {
      let books;
      const pages = [1, 2];
      for (let i of pages) {
        books = await getBooks(i);
        commit("GET_BOOKS", books);
      }
      commit("GET_AUTHORS");
    },
    removeBook({ commit }, book) {
      if (!book) {
        return;
      }
      commit("REMOVE_BOOK", book);
      commit("GET_AUTHORS");
    },
  },
});

export default store;

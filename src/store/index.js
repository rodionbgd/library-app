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
  getters: {
    getAuthorBookById: (state, getters) => (id) => {
      const authorById = getters.getAuthorById(id);
      return state.books.filter((book) =>
        book.authors.find((author) => author.name === authorById?.name)
      );
    },
    getAuthorById: (state) => (id) => {
      return state.authors.find((author) => author.id === id);
    },
  },
  mutations: {
    GET_BOOKS(state, payload) {
      state.books = [...state.books, ...payload];
    },
    UPDATE_BOOK(state, payload) {
      let indexToUpdate = state.books.findIndex(
        (book) => book.id === payload.id
      );
      if (indexToUpdate !== -1) {
        state.books[indexToUpdate] = payload;
      }
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
    updateBook({ commit }, book) {
      if (!book) {
        return;
      }
      commit("UPDATE_BOOK", book);
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

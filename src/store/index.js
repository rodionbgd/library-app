import { createStore } from "vuex";
import { getBooks } from "@/api";
import { path } from "@/router";

const store = createStore({
  state() {
    return {
      books: [],
      search: "",
      authors: [],
    };
  },
  getters: {
    authorBookById: (state, getters) => (id) => {
      const authorById = getters.authorById(id);
      return state.books.filter((book) =>
        book.authors.find((author) => author.name === authorById?.name)
      );
    },
    authorById: (state) => (id) => {
      return state.authors.find((author) => author.id === id);
    },
    lastBookId(state) {
      const booksId = state.books.map((book) => book.id);
      booksId.sort((a, b) => a - b);
      return booksId.at(-1);
    },
  },
  mutations: {
    GET_BOOKS(state, payload) {
      if (Array.isArray(payload)) {
        state.books = [...state.books, ...payload];
        return;
      }
      state.books.push(payload);
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
    async getBooks({ commit, state }) {
      if (state.books.length) {
        return;
      }
      let books;
      const pages = [1, 2];
      for (let i of pages) {
        books = await getBooks(i);
        commit("GET_BOOKS", books);
        commit("GET_AUTHORS");
      }
    },
    updateBook({ commit }, book) {
      if (!book) {
        return;
      }
      commit("UPDATE_BOOK", book);
      commit("GET_AUTHORS");
    },
    addBook({ commit, getters }, book) {
      if (!book) {
        return;
      }
      book.id = getters.lastBookId + 1;
      book.formats = {};
      book.formats["image/jpeg"] = `${path}images/default_book.jpeg`;
      commit("GET_BOOKS", book);
      commit("GET_AUTHORS");
    },
    removeBook({ commit }, book) {
      if (!book) {
        return;
      }
      commit("REMOVE_BOOK", book);
      commit("GET_AUTHORS");
    },
    updateAuthors({ commit }) {
      commit("GET_AUTHORS");
    },
  },
});

export default store;

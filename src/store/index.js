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
  },

  actions: {
    async getBooks({ commit, state }) {
      if (!state.books.length) {
        let books = await getBooks(1);
        commit("GET_BOOKS", books);
        books = await getBooks(2);
        commit("GET_BOOKS", books);
        commit("GET_AUTHORS");
      }
    },
  },
});

export default store;

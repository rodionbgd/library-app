import type { MutationTree } from "vuex";
import type { BookStateTypes, BookMutationsTypes } from "@/store/interfaces";
import { MutationTypes } from "@/store/modules/books/mutation-types";
import type { AuthorObj, Book } from "@/types";

export const mutations: MutationTree<BookStateTypes> & BookMutationsTypes = {
  [MutationTypes.GET_BOOKS](state, authors: AuthorObj) {
    const books = new Set<Book>();
    Object.values(authors).forEach((author) => {
      author.books.forEach((book) => {
        books.add(book);
      });
    });
    state.books = [...books];
  },
  [MutationTypes.GET_LAST_BOOK_ID](state: BookStateTypes) {
    if (state.books.length) {
      state.lastBookId = Math.max(...state.books.map((book) => book.id));
    }
  },
  [MutationTypes.UPDATE_BOOK](state, payload) {
    const indexToUpdate = state.books.findIndex(
      (book) => book.id === payload.id
    );
    if (indexToUpdate === -1) {
      state.books = [...state.books, payload];
    } else {
      state.books[indexToUpdate] = payload;
      state.books = [...state.books];
    }
  },
  [MutationTypes.REMOVE_BOOK](state, { id }) {
    state.books = state.books.filter((book) => book.id !== id);
  },
};

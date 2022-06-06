import type { Book } from "@/types";
import type { BookState } from "@/store/types";
import type { Module } from "vuex";
import type { IRootState } from "@/store/types";
import { actions } from "@/store/modules/books/actions";
import { mutations } from "@/store/modules/books/mutations";

const bookList = JSON.parse(localStorage.getItem("books") as string) || [];

export function getBookById(books: Book[], id: number) {
  if (!Array.isArray(books)) {
    return -1;
  }
  return books?.findIndex((b) => b.id === id);
}

export const state: BookState = {
  books: bookList,
  lastBookId: 0,
};

const books: Module<BookState, IRootState> = {
  state,
  mutations,
  actions,
  namespaced: true,
};

export default books;

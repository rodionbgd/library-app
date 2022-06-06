import type { ActionTree } from "vuex";
import type { BookActionsTypes, BookStateTypes } from "@/store/interfaces";
import { ActionTypes } from "@/store/modules/books/action-types";
import { MutationTypes } from "@/store/modules/books/mutation-types";
import { MutationTypes as AuthorsMutationTypes } from "@/store/modules/authors/mutation-types";
import type { IRootState } from "@/store/types";

export const actions: ActionTree<BookStateTypes, IRootState> &
  BookActionsTypes = {
  [ActionTypes.UPDATE_BOOK]({ commit }, book) {
    if (!book) {
      return;
    }
    commit(AuthorsMutationTypes.UPDATE_AUTHORS, book, { root: true });
    commit(MutationTypes.UPDATE_BOOK, book);
  },
  async [ActionTypes.ADD_BOOK]({ dispatch, state }, book) {
    if (!book) {
      return;
    }
    state.lastBookId += 1;
    book.id = state.lastBookId;
    book.formats = { "image/jpeg": "" };
    await dispatch(ActionTypes.UPDATE_BOOK, book);
  },
  [ActionTypes.REMOVE_BOOK]({ commit }, book) {
    if (!book) {
      return;
    }
    commit(AuthorsMutationTypes.REMOVE_AUTHOR, book, { root: true });
    commit(MutationTypes.REMOVE_BOOK, book);
  },
};

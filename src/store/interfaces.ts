import type { ActionContext } from "vuex";

import { MutationTypes as BookMTypes } from "@/store/modules/books/mutation-types";
import { MutationTypes as AuthorsMTypes } from "@/store/modules/authors/mutation-types";
import { ActionTypes as BookATypes } from "@/store/modules/books/action-types";
import type { AuthorObj, Book } from "@/types";
import type { IRootState } from "@/store/types";
import type { AuthorData } from "@/views/AuthorsView.vue";

export interface BookStateTypes {
  books: Book[];
  lastBookId: number;
  rootDispatch?: boolean;
}

export type BookMutationsTypes<S = BookStateTypes> = {
  [BookMTypes.GET_BOOKS](state: S, authors: AuthorObj): void;
  [BookMTypes.GET_LAST_BOOK_ID](state: S): void;
  [BookMTypes.UPDATE_BOOK](state: S, payload: Book): void;
  [BookMTypes.REMOVE_BOOK](state: S, { id }: Pick<Book, "id">): void;
};

export type AuthorsMutationsTypes<S = IRootState> = {
  [AuthorsMTypes.UPDATE_AUTHOR_DATA](state: S, payload: AuthorData): void;
  [AuthorsMTypes.UPDATE_AUTHOR_BOOK](state: S, payload: AuthorData): void;
  [AuthorsMTypes.UPDATE_AUTHORS](state: S, bookToUpdate: Book): void;
  [AuthorsMTypes.REMOVE_AUTHOR](state: S, book: Book): void;
  [AuthorsMTypes.GET_AUTHORS](state: S, authors: AuthorObj): void;
  [AuthorsMTypes.GET_LAST_AUTHOR_ID](state: S): void;
};

export type AllMutationsTypes = BookMutationsTypes & AuthorsMutationsTypes;
export type BooksAugmentedActionContext = {
  commit<K extends keyof AllMutationsTypes>(
    key: K,
    payload?: Parameters<AllMutationsTypes[K]>[1],
    { root }?: { root: boolean }
  ): ReturnType<AllMutationsTypes[K]>;
} & Omit<ActionContext<BookStateTypes, IRootState>, "commit">;

export interface BookActionsTypes {
  [BookATypes.UPDATE_BOOK](
    { commit }: BooksAugmentedActionContext,
    book: Book
  ): void;
  [BookATypes.ADD_BOOK](
    { dispatch, state }: BooksAugmentedActionContext,
    book: Book
  ): void;
  [BookATypes.REMOVE_BOOK](
    { commit }: BooksAugmentedActionContext,
    book: Book
  ): void;
}

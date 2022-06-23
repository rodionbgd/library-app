import type { AuthorObj, Book } from "@/types";
import type { BookStateTypes } from "@/store/interfaces";

export type BookState = {
  books: Book[];
  lastBookId: number;
};

export type AuthorState = {
  authors: AuthorObj;
  lastAuthorId: number;
};

export interface IRootState {
  books?: BookStateTypes;
  authors: AuthorObj;
  lastAuthorId: number;
}

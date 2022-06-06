import { ActionTypes as authorsATypes } from "@/store/modules/authors/action-types";
import { ActionTypes as booksATypes } from "@/store/modules/books/action-types";

export const AllActionTypes = { ...authorsATypes, ...booksATypes };

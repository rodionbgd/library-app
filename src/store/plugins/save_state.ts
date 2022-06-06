import type { IRootState } from "@/store/types";
import type { Store, Plugin } from "vuex";

export const saveStatePlugin: Plugin<IRootState> = (
  store: Store<IRootState>
) => {
  store.subscribe((mutation, state) => {
    if (state.books) {
      localStorage.setItem("books", JSON.stringify(state.books.books));
    }
    localStorage.setItem("authors", JSON.stringify(state.authors));
  });
};

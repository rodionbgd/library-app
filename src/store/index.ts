import { createStore } from "vuex";
import { getAuthors } from "@/api";

import { saveStatePlugin } from "@/store/plugins/save_state";

import books, { getBookById } from "@/store/modules/books";
import type { Author, AuthorBase, AuthorObj, Book } from "@/types";
import type { AuthorState, IRootState } from "@/store/types";
import { MutationTypes } from "@/store/modules/authors/mutation-types";
import { ActionTypes } from "@/store/modules/authors/action-types";
import { MutationTypes as BookMutationTypes } from "@/store/modules/books/mutation-types";
import type { AuthorData } from "@/views/AuthorsView.vue";

const authors = JSON.parse(localStorage.getItem("authors") as string) || [];

function removeAuthor(authors: AuthorObj, authorToRemove: string, book: Book) {
  const prevAuthor = authors[authorToRemove];
  const bookIndex = getBookById(prevAuthor.books, book.id);
  if (bookIndex !== -1) {
    prevAuthor.books.splice(bookIndex, 1);
    if (!prevAuthor.books.length) {
      delete authors[authorToRemove];
    }
  }
}

function updateNewAuthor(
  state: AuthorState,
  name: string,
  newData: Partial<Author>,
  book: Book
) {
  state.authors[name] = { ...state.authors[name], ...newData };
  const authorToUpdate = state.authors[name];
  if (authorToUpdate.id === undefined) {
    state.lastAuthorId += 1;
    authorToUpdate.id = state.lastAuthorId;
  }
  const prevBooks = authorToUpdate.books ?? [];
  authorToUpdate.books = [...prevBooks, book];
}

function updateAuthorData(
  author: Author,
  {
    prevName,
    name,
    book,
    field,
    value,
  }: AuthorData & { prevName: string; book: Book }
) {
  const authorsIndex = <number[]>book?.authors
    ?.map((author, index) => {
      if (author.name === prevName || author.name === name) {
        return index;
      }
    })
    .filter((index) => index !== undefined);
  if (!authorsIndex.length || !author) {
    return;
  }
  const { books, id, ...authorsData } = author;
  book.authors[authorsIndex[0]] = { ...authorsData, name, [field]: value };
  authorsIndex.slice(1).forEach((index) => {
    book.authors[index] = {} as AuthorBase;
  });
  book.authors = book.authors.filter((author) => Object.keys(author).length);
}

const store = createStore<IRootState>({
  plugins: [saveStatePlugin],
  modules: { books },
  state(): IRootState {
    return {
      authors,
      lastAuthorId: 0,
    };
  },
  getters: {
    authorBookById:
      (state, getters) =>
      (id: number): Book[] => {
        const authorObj = getters.authorById(id);
        if (!authorObj) {
          return [];
        }
        return authorObj[1]?.books;
      },
    authorById:
      (state: AuthorState) =>
      (
        id: number
      ): [keyof AuthorObj, AuthorObj[keyof AuthorObj]] | undefined => {
        return Object.entries(state.authors).find((obj) => obj[1].id === id);
      },
  },
  mutations: {
    [MutationTypes.UPDATE_AUTHOR_DATA](
      state: IRootState,
      payload: AuthorData & { prevName: string }
    ) {
      const { prevName } = payload;
      if (state.books) {
        state.books.books.forEach((book) => {
          updateAuthorData(state.authors[prevName], { book, ...payload });
        });
      }
    },
    [MutationTypes.UPDATE_AUTHOR_BOOK](
      state: IRootState,
      payload: AuthorData & { prevName: string }
    ) {
      const { prevName, field, value, name } = payload;
      if (!prevName) {
        return;
      }
      // Merge authors
      if (prevName !== payload.name && payload.name in state.authors) {
        const coauthors = new Set<keyof AuthorObj>();
        state.authors[prevName].books.forEach((book) => {
          book.authors.forEach((author) => {
            coauthors.add(author.name);
          });
        });
        coauthors.forEach((key) => {
          state.authors[key].books.forEach((book) => {
            updateAuthorData(state.authors[key], { book, ...payload });
          });
        });
        const bookSet = new Set([
          ...state.authors[payload.name].books,
          ...state.authors[prevName].books,
        ]);
        state.authors[payload.name].books = [...bookSet];
        delete state.authors[prevName];
        return;
      }
      state.authors[prevName].books.forEach((book) => {
        const authorIndex = book.authors.findIndex(
          (author) => author.name === prevName
        );
        if (authorIndex !== -1) {
          (book.authors[authorIndex][field as keyof AuthorBase] as
            | string
            | number) = value;
        }
      });
      if (prevName === name) {
        (state.authors[prevName][field as keyof Author] as string | number) =
          value;
      } else {
        state.authors[name] = { ...state.authors[prevName] };
        delete state.authors[prevName];
      }
      state.authors = { ...state.authors };
    },
    [MutationTypes.UPDATE_AUTHORS](state: IRootState, bookToUpdate: Book) {
      debugger;
      bookToUpdate.authors = bookToUpdate.authors?.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      const bookAuthorsPrev = Object.keys(state.authors)
        .filter((author) => {
          return state.authors[author].books.find(
            (b) => b.id === bookToUpdate.id
          );
        })
        .sort((a, b) => a.localeCompare(b));
      const minLength = Math.min(
        bookAuthorsPrev.length,
        bookToUpdate.authors.length
      );
      for (let i = 0; i < minLength; i += 1) {
        const { name, ...authorData } = bookToUpdate.authors[i];
        const authorToUpdate = state.authors[name];
        // Если автор не изменился
        if (bookAuthorsPrev[i] === name) {
          const bookIndex = getBookById(authorToUpdate.books, bookToUpdate.id);
          if (bookIndex !== -1) {
            authorToUpdate.books[bookIndex] = bookToUpdate;
          }
          state.authors[name] = { ...authorToUpdate, ...authorData };
        } else {
          const authorToRemove = bookAuthorsPrev[i];
          removeAuthor(state.authors, authorToRemove, bookToUpdate);
          updateNewAuthor(state, name, authorData, bookToUpdate);
        }
      }
      if (bookAuthorsPrev.length < bookToUpdate.authors.length) {
        for (let i = minLength; i < bookToUpdate.authors.length; i += 1) {
          const { name, ...authorData } = bookToUpdate.authors[i];
          updateNewAuthor(state, name, authorData, bookToUpdate);
        }
      } else if (bookAuthorsPrev.length > bookToUpdate.authors.length) {
        for (let i = minLength; i < bookAuthorsPrev.length; i += 1) {
          const authorToRemove = bookAuthorsPrev[i];
          removeAuthor(state.authors, authorToRemove, bookToUpdate);
        }
      }
    },
    [MutationTypes.REMOVE_AUTHOR](state: IRootState, book: Book) {
      book.authors?.forEach((author) => {
        removeAuthor(state.authors, author.name, book);
      });
    },
    [MutationTypes.GET_AUTHORS](state: IRootState, authors: AuthorObj) {
      state.authors = authors;
    },
    [MutationTypes.GET_LAST_AUTHOR_ID](state: IRootState) {
      const authorsData = Object.values(state.authors);
      if (authorsData.length) {
        state.lastAuthorId = Math.max(
          ...authorsData.map((author) => author.id)
        );
      }
    },
  },
  actions: {
    async [ActionTypes.GET_AUTHORS]({ commit, state }) {
      if (
        (state.books && !state.books.books.length) ||
        !Object.keys(state.authors).length
      ) {
        const authors = await getAuthors();
        commit(MutationTypes.GET_AUTHORS, authors);
        commit(`books/${BookMutationTypes.GET_BOOKS}`, authors);
      }
      commit(MutationTypes.GET_LAST_AUTHOR_ID);
      commit(`books/${BookMutationTypes.GET_LAST_BOOK_ID}`);
    },
    [ActionTypes.UPDATE_AUTHOR_DATA]({ commit, getters }, payload) {
      if (!payload) {
        return;
      }
      const [name] = getters.authorById(payload.id);
      commit(MutationTypes.UPDATE_AUTHOR_DATA, { prevName: name, ...payload });
      commit(MutationTypes.UPDATE_AUTHOR_BOOK, { prevName: name, ...payload });
    },
  },
});

export default store;

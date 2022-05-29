import { createStore } from "vuex";
import { getAuthors } from "@/api";
import { path } from "@/router";

import { saveStatePlugin } from "@/store/plugins/save_state";

const books = JSON.parse(localStorage.getItem("books")) || [];
const authors = JSON.parse(localStorage.getItem("authors")) || [];

function getBookById(books, id) {
  if (!Array.isArray(books)) {
    return;
  }
  return books?.findIndex((b) => b.id === id);
}

function removeAuthor(authors, authorToRemove, book) {
  const prevAuthor = authors[authorToRemove];
  const bookIndex = getBookById(prevAuthor.books, book.id);
  if (bookIndex !== -1) {
    prevAuthor.books.splice(bookIndex, 1);
    if (!prevAuthor.books.length) {
      delete authors[authorToRemove];
    }
  }
}

function updateNewAuthor(state, name, newData, book) {
  state.authors[name] = { ...state.authors[name], ...newData };
  const authorToUpdate = state.authors[name];
  if (authorToUpdate.id === undefined) {
    state.lastAuthorId += 1;
    authorToUpdate.id = state.lastAuthorId;
  }
  const prevBooks = authorToUpdate.books ?? [];
  authorToUpdate.books = [...prevBooks, book];
}

function updateAuthorData(author, { prevName, name, book, field, value }) {
  const authorsIndex = book?.authors
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
    book.authors[index] = null;
  });
  book.authors = book.authors.filter((author) => author);
}

const store = createStore({
  plugins: [saveStatePlugin],
  state() {
    return {
      books,
      authors,
      lastAuthorId: 0,
      lastBookId: 0,
    };
  },
  getters: {
    authorBookById: (state, getters) => (id) => {
      const authorObj = getters.authorById(id);
      if (!authorObj) {
        return [];
      }
      return authorObj[1]?.books;
    },
    authorById: (state) => (id) => {
      return Object.entries(state.authors).find((obj) => obj[1].id === id);
    },
  },
  mutations: {
    GET_BOOKS(state) {
      const books = new Set();
      Object.values(state.authors).forEach((author) => {
        author.books.forEach((book) => {
          books.add(book);
        });
      });
      state.books = JSON.parse(JSON.stringify([...books]));
    },
    GET_LAST_BOOK_ID(state) {
      if (state.books.length) {
        state.lastBookId = Math.max(...state.books.map((book) => book.id));
      }
    },
    UPDATE_BOOK(state, payload) {
      let indexToUpdate = state.books.findIndex(
        (book) => book.id === payload.id
      );
      if (indexToUpdate !== -1) {
        state.books[indexToUpdate] = payload;
        state.books = [...state.books];
      }
    },
    UPDATE_AUTHOR_DATA(state, payload) {
      const { prevName } = payload;
      state.books.forEach((book) => {
        updateAuthorData(state.authors[prevName], { book, ...payload });
      });
    },
    REMOVE_BOOK(state, { id }) {
      state.books = state.books.filter((book) => book.id !== id);
    },
    REMOVE_AUTHOR(state, book) {
      book.authors?.forEach((author) => {
        removeAuthor(state.authors, author.name, book);
      });
    },
    GET_AUTHORS(state, authors) {
      state.authors = authors;
    },
    GET_LAST_AUTHOR_ID(state) {
      const authorsData = Object.values(state.authors);
      if (authorsData.length) {
        state.lastAuthorId = Math.max(
          ...authorsData.map((author) => author.id)
        );
      }
    },
    UPDATE_AUTHOR_BOOK(state, payload) {
      const { prevName, field, value, name } = payload;
      if (!prevName) {
        return;
      }
      // Merge authors
      if (prevName !== payload.name && payload.name in state.authors) {
        let coauthors = new Set();
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
        book.authors[authorIndex][field] = value;
      });
      if (prevName === name) {
        state.authors[prevName][field] = value;
      } else {
        state.authors[name] = { ...state.authors[prevName] };
        delete state.authors[prevName];
      }
      state.authors = { ...state.authors };
    },
    UPDATE_AUTHORS(state, bookToUpdate) {
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
  },

  actions: {
    async getAuthors({ commit, state }) {
      if (state.books.length && Object.keys(state.authors).length) {
        commit("GET_LAST_AUTHOR_ID");
        commit("GET_LAST_BOOK_ID");
        return;
      }
      const authors = await getAuthors();
      commit("GET_AUTHORS", authors);
      commit("GET_LAST_AUTHOR_ID");
      commit("GET_BOOKS", authors);
      commit("GET_LAST_BOOK_ID");
    },
    updateBook({ commit }, book) {
      if (!book) {
        return;
      }
      commit("UPDATE_AUTHORS", book);
      commit("UPDATE_BOOK", book);
    },
    updateAuthorData({ commit, getters }, payload) {
      if (!payload) {
        return;
      }
      const [name] = getters.authorById(payload.id);
      commit("UPDATE_AUTHOR_DATA", { prevName: name, ...payload });
      commit("UPDATE_AUTHOR_BOOK", { prevName: name, ...payload });
    },
    addBook({ commit, state }, book) {
      if (!book) {
        return;
      }
      state.lastBookId += 1;
      book.id = state.lastBookId;
      book.formats = {};
      book.formats["image/jpeg"] = `${path}/logo.png`;
      commit("GET_BOOKS", book);
      commit("GET_AUTHORS", state.books);
    },
    removeBook({ commit }, book) {
      if (!book) {
        return;
      }
      commit("REMOVE_AUTHOR", book);
      commit("REMOVE_BOOK", book);
    },
  },
});

export default store;

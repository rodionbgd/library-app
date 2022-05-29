export function saveStatePlugin(store) {
  store.subscribe((mutation, state) => {
    localStorage.setItem("books", JSON.stringify(state.books));
    localStorage.setItem("authors", JSON.stringify(state.authors));
  });
}

<template>
  <div class="box">
    <div class="modal-container" @click="close">
      <div class="modal-custom" @click.stop>
        <div class="modal__text">
          <form>
            <div class="form-group">
              <p class="modal__title">Title</p>
              <input
                data-test="title"
                type="text"
                class="form-control"
                v-model="data.title"
              />
              <p>Price</p>
              <input
                data-test="price"
                type="text"
                class="form-control"
                v-model="data.price"
              />
              <p class="modal__title">Authors</p>
              <EditAuthor
                class="d-flex"
                v-for="(author, authorIndex) of data.authors"
                :author="author"
                :authors="authors"
                :key="author.name"
                @update-author="
                  (updatedAuthor) => updateAuthor(updatedAuthor, authorIndex)
                "
                @remove-author="removeAuthor(author.name)"
              />
              <EditAuthor
                class="d-flex"
                type="text"
                :authors="authors"
                @update-author="addAuthor"
              />
            </div>
            <div>
              <rate-stars @update-rate="updateRate" :rate="data.rate" />
            </div>
          </form>
        </div>
        <div class="d-flex justify-content-center mt-2">
          <button
            class="modal__btn"
            @click="saveBook"
            :class="{ 'opacity-50': !isValidBook }"
            :disabled="!isValidBook"
          >
            Save book
          </button>
        </div>
        <button class="modal__btn link-2 mt-3rem" @click="close"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import RateStars from "@/components/UI/RateStars.vue";
import EditAuthor from "@/components/EditAuthor.vue";

import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const props = defineProps({
  bookId: {
    type: Number,
    required: true,
  },
});

const initialBook = {
  title: "",
  price: "",
  rate: 0,
  authors: [],
};

const data = reactive(initialBook);
const book = computed(
  () =>
    store.state.books.find((book) => book.id === props.bookId) ?? initialBook
);
const bookSaved = ref(false);
const setInitialBook = () => {
  data.title = book.value.title;
  data.price = book.value.price;
  data.rate = book.value.rate ?? 1;
  if (book.value.authors) {
    data.authors = [...book.value.authors];
  }
};

const saveBook = () => {
  const newBook = {
    authors: data.authors,
    title: data.title,
    price: data.price,
    rate: data.rate,
  };
  if (props.bookId > store.state.lastBookId) {
    store.dispatch("addBook", newBook);
  } else {
    store.dispatch("updateBook", {
      ...book.value,
      ...newBook,
    });
  }
  bookSaved.value = true;
  close();
};
const isValidBook = computed(() => {
  return (
    data.title &&
    data.price &&
    !Number.isNaN(+data.price) &&
    data.authors.length
  );
});
const authors = computed(() => data.authors?.map((author) => author.name));

const updateAuthor = (author, authorIndex) => {
  if (authorIndex !== undefined) {
    data.authors[authorIndex] = author;
  }
};

const removeAuthor = (name) => {
  data.authors = data.authors.filter((author) => author.name !== name);
};
const addAuthor = (newAuthor) => {
  if (!Object.keys(newAuthor).length) {
    return;
  }
  data.authors = [...data.authors, newAuthor];
};

const updateRate = (rate) => {
  data.rate = rate;
};

onMounted(() => {
  document.body.addEventListener("keydown", closeByEsc);
  setInitialBook();
});

onUnmounted(() => {
  document.body.removeEventListener("keydown", closeByEsc);
});

const close = () => {
  if (!bookSaved.value) {
    setInitialBook();
  }
  router.back();
};

const closeByEsc = (e) => {
  if (e.code === "Escape") {
    close();
    e.preventDefault();
  }
};
</script>

<style scoped>
*,
*::after,
*::before {
  margin: 0;
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
}

:root {
  --light: hsl(220, 50%, 90%);
  --primary: hsl(255, 30%, 55%);
  --focus: hsl(210, 15%, 34%);
  --border-color: #099;
  --global-background: hsl(220, 25%, 10%);
  --background: linear-gradient(
    to right,
    hsl(210, 30%, 20%),
    hsl(255, 30%, 25%)
  );
  --shadow-1: hsla(236, 50%, 50%, 0.3);
  --shadow-2: hsla(236, 50%, 50%, 0.4);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Open Sans",
    sans-serif;
  color: var(--light);
  background: var(--global-background);
}

.opacity-50 {
  opacity: 0.5;
}
button::-moz-focus-inner {
  border: 0;
}

.mt-3rem {
  margin-top: 3rem;
}

.modal__btn {
  /*margin-top: 4rem;*/
  padding: 1rem 1.6rem;
  border: 1px solid #099;
  border-radius: 100rem;

  color: inherit;
  background: transparent;
  font-size: 1.4rem;
  font-family: inherit;
  letter-spacing: 0.2rem;

  transition: 0.2s;
  cursor: pointer;
}

.modal__btn:hover,
.modal__btn:focus {
  background: var(--focus);
  border-color: var(--focus);
  transform: translateY(-0.2rem);
}

.link-2 {
  width: 4rem;
  height: 4rem;
  border: 1px solid var(--border-color);
  border-radius: 100rem;

  color: inherit;
  font-size: 2.2rem;

  position: absolute;
  top: -2rem;
  right: 2rem;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: 0.2s;
}

.link-2::before {
  content: "×";
  transform: translateY(-0.1rem);
}

.link-2:hover,
.link-2:focus {
  background: var(--focus);
  border-color: var(--focus);
  transform: translateY(-0.2rem);
}

.box {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 4rem 2rem;
  z-index: 15;
}

.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 15;

  display: block;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  backdrop-filter: blur(2px);
  background: transparent;
}

.modal-container:target {
  display: flex;
}

.modal-custom {
  z-index: 15;
  width: 50%;
  max-height: 90vh;
  padding: 2rem 2rem;
  border-radius: 0.8rem;
  margin: 2rem auto;
  color: #099;
  background: white;
  box-shadow: var(--m-shadow, 0.4rem 0.4rem 10.2rem 0.2rem) var(--shadow-1);
  border: 1px solid #099;
  position: relative;
  overflow-y: scroll;
}

@media (max-width: 640px) {
  .modal-custom {
    width: 90%;
  }
}

.modal__title {
  font-size: 2rem;
}

.modal__text {
  padding: 0 4rem;
  margin-top: 1rem;

  font-size: 1.6rem;
  line-height: 2;
}
</style>

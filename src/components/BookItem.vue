<template>
  <section>
    <div class="card">
      <div class="d-flex position-relative edit-bar">
        <app-link
          :to="{
            name: routeName,
            params: { bookId: props.book.id },
          }"
        >
          <button class="edit-btn">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
        </app-link>
        <button class="edit-btn" @click="removeBook">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
      <img
        class="image cover"
        :src="props.book.formats['image/jpeg']"
        alt="Image"
      />
      <div class="book-info">
        <div class="title">{{ props.book.title }}</div>
        <div
          class="byline"
          v-for="author in props.book.authors"
          :key="author.name"
        >
          {{ author.name }}
        </div>
        <div class="bookshelf">
          <div v-for="bookshelf in props.book.bookshelves" :key="bookshelf">
            #{{ bookshelf }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useStore } from "vuex";

const store = useStore();
const props = defineProps({
  book: {
    type: Object,
    required: true,
    default: () => ({
      authors: [],
      bookshelves: [],
      title: "",
    }),
  },
  routeName: {
    type: String,
    default: "edit-book",
  },
});

const events = defineEmits({
  "remove-book": null,
});

const removeBook = () => {
  events("remove-book", props.book);
  store.dispatch("removeBook", props.book);
};
</script>

<style scoped>
section {
  padding: 1.5em 0.5rem;
}

section .edit-bar {
  visibility: hidden;
  top: 7rem;
  margin: 0 auto;
  z-index: 1;
}

section:hover .edit-bar {
  visibility: visible;
}

.edit-btn {
  font-size: 1.5rem;
  text-align: center;
  text-decoration: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  padding: 0.5rem 10px 10px;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  background: #099;
  color: white;
  border: none;
  opacity: 0.7;
}

.edit-btn + .edit-btn {
  margin-left: 0.25rem;
}

.edit-btn:hover {
  display: inline-block;
  opacity: 1;
}

img {
  max-width: 100%;
}

.card {
  position: relative;
  max-width: 320px;
  margin-right: auto;
  margin-left: auto;
  background-color: #fff;
  color: #333;
  box-shadow: 0.125em 0.25em 0.325em rgba(0, 0, 0, 0.2);
}

@media (min-width: 600px) {
  .card {
    max-width: 400px;
    padding-right: 1em;
    padding-left: 1em;
  }
}

.card .book-info {
  padding-top: 1em;
  padding-right: 1em;
  padding-left: 1em;
  background: #fff;
}

@media (min-width: 600px) {
  .card .book-info {
    display: inline-block;
    padding-right: 0;
    padding-left: 0;
    box-shadow: none;
  }
}

.card .title {
  margin-bottom: 0.125em;
  font-size: 1.5em;
  font-weight: 700;
  line-height: 1.1;
}

.card .bookshelf {
  font-size: 0.75rem;
}

.card .byline,
.card {
  /*color: #666;*/
  font-size: 1rem;
  line-height: 1.4;
}

.card .byline {
  margin-bottom: 0.5em;
}

.card .image {
  background: cyan;
  border: 0;
}

.card .image.cover {
  position: relative;
  display: block;
  height: 15rem;
  width: 10rem;
  margin: 0 auto;
  box-shadow: 0.25em 0.35em 1em rgba(0, 0, 0, 0.6);
}

@media (min-width: 600px) {
  .card .image.cover {
    display: inline-block;
    margin: -4em auto 0;
    vertical-align: top;
  }
}
</style>

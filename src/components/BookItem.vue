<template>
  <section>
    <div class="card">
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
});
</script>

<style scoped>
img {
  max-width: 100%;
}

section {
  padding: 2.5em 0.5rem;
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
  height: 225px;
  width: 150px;
  margin-right: auto;
  margin-left: auto;
  box-shadow: 0.25em 0.35em 1em rgba(0, 0, 0, 0.6);
}

@media (min-width: 600px) {
  .card .image.cover {
    display: inline-block;
    margin-top: -2em;
    margin-right: 0.825em;
    vertical-align: top;
  }
}
</style>

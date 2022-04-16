<template>
  <div class="tableWrapper">
    <table>
      <thead>
        <tr>
          <th @click="sortType = 'author'">Author</th>
          <th @click="sortType = 'birth'">Year of birth</th>
          <th @click="sortType = 'death'">Year of death</th>
          <th @click="sortType = 'books'">Books</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="author in sortedAuthors" :key="author.name">
          <app-link
            :to="{
              name: 'author',
              params: { id: author.id, name: author.name },
            }"
          >
            <td>{{ author.name }}</td>
          </app-link>
          <td>{{ author.birth_year ? author.birth_year : "-" }}</td>
          <td>{{ author.death_year ? author.death_year : "-" }}</td>
          <td>{{ author.books }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const authors = computed(() => store.state.authors);
const sortType = ref("author");

const sortedAuthors = computed(() => {
  switch (sortType.value) {
    case "author":
      return [...authors.value]?.sort((author1, author2) =>
        author1.name.localeCompare(author2.name)
      );
    case "birth":
      return [...authors.value]?.sort((author1, author2) => {
        return author1.birth_year - author2.birth_year;
      });
    case "death":
      return [...authors.value]?.sort((author1, author2) => {
        return author1.death_year - author2.death_year;
      });
    case "books":
      return [...authors.value]?.sort((author1, author2) => {
        return author1.books - author2.books;
      });
    default:
      return [];
  }
});
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  background: #fff;
  padding: 8px 16px;
}

th:hover {
  color: #00ccccaa;
  cursor: pointer;
}
tbody tr {
  border-top: 1px solid gray;
}
.tableWrapper {
  overflow: auto;
  height: 80vh;
}

.tableWrapper thead th {
  position: sticky;
  top: 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.tableWrapper::-webkit-scrollbar {
  display: none;
}

td:not(:first-child) {
  text-align: center;
}
</style>

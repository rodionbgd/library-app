<template>
  <div>
    <div class="tableWrapper">
      <table>
        <thead>
          <tr>
            <th @click="sortType = SortType.AUTHOR">Author</th>
            <th @click="sortType = SortType.BIRTH">Year of birth</th>
            <th @click="sortType = SortType.DEATH">Year of death</th>
            <th @click="sortType = SortType.BOOKS">Books</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="author in sortedAuthors" :key="author.id">
            <td>
              <app-link
                :to="{
                  name: 'author',
                  params: { authorId: author.id },
                }"
              >
                <AuthorField
                  @update-field="(value) => updateField(value, author, 'name')"
                  field="name"
                  :author="author"
                />
              </app-link>
            </td>
            <td>
              <AuthorField
                @update-field="
                  (value) => updateField(value, author, 'birth_year')
                "
                field="birth_year"
                :author="author"
              />
            </td>
            <td>
              <AuthorField
                @update-field="
                  (value) => updateField(value, author, 'death_year')
                "
                field="death_year"
                :author="author"
              />
            </td>
            <td>{{ author.books.length }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="tip">
      <div>
        To edit
        <img
          src="https://img.icons8.com/fluency/48/000000/mouse-right-click.png"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthorField from "@/components/AuthorField.vue";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import type { Author, AuthorBase, AuthorObj } from "@/types";
import { AllActionTypes } from "@/store/action-types";

export type AuthorData = AuthorBase &
  Author &
  Omit<Author, "books"> & {
    field: keyof AuthorBase;
    value: AuthorBase[keyof AuthorBase];
  };

enum SortType {
  AUTHOR = "author",
  BIRTH = "birth",
  DEATH = "death",
  BOOKS = "books",
}

const store = useStore();
const authors = computed(() => store.state.authors as AuthorObj);
const sortType = ref<SortType>(SortType.AUTHOR);

const updateField = (
  value: AuthorBase[keyof AuthorBase],
  author: AuthorBase & Author,
  field: keyof AuthorBase
) => {
  author[field] = value as string;
  store.dispatch(AllActionTypes.UPDATE_AUTHOR_DATA, {
    id: author.id,
    name: author.name,
    field,
    value,
  } as AuthorData);
};
const sortedAuthors = computed(() => {
  const authorsEntries = Object.entries(authors.value).map(
    ([key, value]: [string, AuthorObj[keyof AuthorObj]]) => ({
      ...value,
      name: key,
    })
  );
  switch (sortType.value) {
    case SortType.AUTHOR:
      return authorsEntries?.sort((author1, author2) =>
        author1.name?.localeCompare(author2.name)
      );
    case SortType.BIRTH:
      return authorsEntries?.sort((author1, author2) => {
        return +author1.birth_year - +author2.birth_year;
      });
    case SortType.DEATH:
      return (authorsEntries as AuthorBase[])?.sort((author1, author2) => {
        if (
          typeof author1.death_year === "number" &&
          typeof author2.death_year === "number"
        ) {
          return author1.death_year - author2.death_year;
        }
        return 0;
      });
    case SortType.BOOKS:
      return authorsEntries?.sort((author1, author2) => {
        return author1.books.length - author2.books.length;
      });
    default:
      return [];
  }
});
</script>

<style scoped>
input {
  width: 20%;
  padding: 0;
  margin: 0;
  font-size: 1rem;
  border: none;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  background: #fff;
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
  max-width: 10%;
}

td {
  padding: 8px 16px 8px 0;
}

.tip {
  margin-left: 3rem;
  padding-top: 1rem;
  position: fixed;
  top: 0;
  right: 10rem;
  z-index: 10;
}

.tip div {
  font-size: 0.9rem;
  border: 1px solid grey;
  padding: 0 0.25rem;
  opacity: 0.8;
}
</style>

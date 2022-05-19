<template>
  <section>
    <div class="d-flex w-90percent">
      <input
        ref="authorEl"
        type="text"
        class="form-control"
        placeholder="+Add Author name"
        :class="{ error: !isValidName }"
        v-model="data.name"
        @keyup.enter="editAuthor"
      />
      <input
        type="text"
        class="form-control"
        placeholder="+Add Birth year"
        :class="{ error: !isValidYear(data.birth_year) }"
        v-model="data.birth_year"
        @keyup.enter="editAuthor"
      />
      <input
        type="text"
        class="form-control"
        placeholder="+Add Death year"
        :class="{ error: !isValidYear(data.death_year) }"
        v-model="data.death_year"
        @keyup.enter="editAuthor"
      />
    </div>
    <div class="d-flex flex-auto">
      <button
        type="button"
        v-show="Object.keys(props.author).length"
        class="edit-btn tm-social-link"
        @click="removeAuthor"
        @keyup.enter.prevent
      >
        <i class="fa-regular fa-trash-can"></i>
      </button>
      <button
        type="button"
        v-show="isEdited && isValidForm"
        class="edit-btn"
        @click="editAuthor"
      >
        <i class="fa-regular fa-pen-to-square"></i>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

const props = defineProps({
  author: {
    type: Object,
    default: () => ({}),
  },
  authors: {
    type: Array,
    default: () => [],
  },
});

const events = defineEmits({
  "update-author": null,
  "remove-author": null,
});

const data = reactive({
  name: props.author.name,
  birth_year: props.author.birth_year,
  death_year: props.author.death_year,
});

const authorEl = ref(null);

const isEdited = computed(() => {
  return (
    data.name &&
    (data.name !== props.author.name ||
      data.birth_year !== props.author.birth_year ||
      data.death_year !== props.author.death_year)
  );
});

const isValidName = ref(true);
watch(
  () => data.name,
  () => {
    isValidName.value =
      !data.name || !props.authors.find((author) => author === data.name);
  }
);

const isValidYear = (year) => !year || Number.isInteger(Number(year));

const isValidForm = computed(() => {
  return (
    isValidName.value &&
    isValidYear(data.birth_year) &&
    isValidYear(data.death_year)
  );
});

const editAuthor = () => {
  if (!isEdited.value) {
    return;
  }
  const { name, birth_year, death_year } = data;
  const updatedAuthor = {
    name,
    birth_year,
    death_year,
  };
  events("update-author", updatedAuthor);
  if (!Object.keys(props.author).length) {
    Object.keys(data).forEach((key) => {
      data[`${key}`] = "";
      authorEl.value.focus();
    });
  }
};

const removeAuthor = () => {
  events("remove-author");
};
</script>

<style scoped>
input {
  margin: 0.25rem;
}

.w-90percent {
  max-width: 90%;
  min-width: 90%;
}

.error {
  border: 1px solid red;
}
.edit-btn {
  font-size: 1.5rem;
  text-align: center;
  text-decoration: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  background: #099;
  color: white;
  border: none;
  opacity: 0.7;
  padding: 0.1rem 10px 10px;
}
</style>

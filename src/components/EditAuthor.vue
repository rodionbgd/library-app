<template>
  <div class="d-flex">
    <div class="d-flex mw-90 author-input">
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
        class="form-control author-date"
        placeholder="+Add Birth year"
        :disabled="isDisabledDate"
        :class="{ error: !isValidBirth }"
        v-model="data.birth_year"
        @keyup.enter="editAuthor"
      />
      <input
        type="text"
        class="form-control author-date"
        placeholder="+Add Death year"
        :disabled="isDisabledDate"
        :class="{ error: !isValidDeath }"
        v-model="data.death_year"
        @keyup.enter="editAuthor"
      />
    </div>
    <div class="d-flex">
      <button
        type="button"
        class="edit-btn"
        v-if="
          props.author &&
          Object.keys(props.author).length &&
          props.authors.length > 1
        "
        @click="removeAuthor"
        @keyup.enter.prevent
      >
        -
      </button>
      <button
        type="button"
        class="edit-btn"
        v-if="isEdited && isValidForm"
        @click="editAuthor"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import type { AuthorBase } from "@/types";

const props = defineProps<{
  author?: AuthorBase;
  authors: string[];
}>();

const events = defineEmits<{
  (e: "update-author", updatedAuthor: AuthorBase): void;
  (e: "remove-author"): void;
}>();

const store = useStore();

const data = reactive<AuthorBase>({
  name: props.author?.name ?? "",
  birth_year: props.author?.birth_year ?? "",
  death_year: props.author?.death_year ?? "",
});

const authorEl = ref<HTMLInputElement>();

const isValidName = ref(true);
const isValidBirth = ref(true);
const isValidDeath = ref(true);
const isDisabledDate = ref(false);

// name
const isEdited = computed(() => {
  return (
    data.name &&
    (data.name !== props.author?.name ||
      data.birth_year !== props.author?.birth_year ||
      data.death_year !== props.author?.death_year)
  );
});
watch(
  () => data.name,
  () => {
    isValidName.value = !!(
      (!data.name && !data.birth_year && !data.death_year) ||
      (data.name && !props.authors?.find((author) => author === data.name))
    );
    isDisabledDate.value = false;
    if (
      isValidName.value &&
      data.name !== props.author?.name &&
      data.name in store.state.authors
    ) {
      data.birth_year = store.state.authors[data.name]?.birth_year;
      data.death_year = store.state.authors[data.name]?.death_year;
      isDisabledDate.value = true;
    }
  }
);

// date
const isNumber = (value: string) => value !== "" && !Number.isNaN(+value);

const emptyDates = computed(
  () => data.birth_year === "" && data.death_year === ""
);

watchEffect(() => {
  isValidBirth.value =
    emptyDates.value ||
    (isNumber(`${data.birth_year}`) &&
      ((data.death_year !== "" &&
        (!isNumber(`${data.death_year}`) ||
          +data.birth_year < data.death_year)) ||
        data.death_year === ""));
  isValidDeath.value =
    (data.birth_year !== "" &&
      (data.death_year === "" ||
        (isNumber(`${data.death_year}`) &&
          +data.death_year >= data.birth_year))) ||
    emptyDates.value;
});

// form
const isValidValue = (type: keyof AuthorBase) => {
  switch (type) {
    case "birth_year":
      return isValidBirth.value;
    case "death_year":
      return isValidDeath.value;
    case "name":
      return isValidName.value;
    default:
      return true;
  }
};

const isValidForm = computed(() => {
  return !Object.keys(data).some(
    (key: string) => !isValidValue(key as keyof AuthorBase)
  );
});

const editAuthor = () => {
  if (!isEdited.value || !isValidForm.value) {
    return;
  }

  const updatedAuthor: AuthorBase = {
    name: data.name,
    birth_year: data.birth_year,
    death_year: data.death_year,
  };
  events("update-author", updatedAuthor);
  if (props.author && !Object.keys(props.author).length) {
    Object.keys(data).forEach((key) => {
      data[key as keyof AuthorBase] = "";
      if (authorEl.value) {
        authorEl.value.focus();
      }
    });
  }
};
const removeAuthor = () => {
  events("remove-author");
};
</script>

<style scoped>
.mw-90 {
  min-width: 90%;
}

.author-input {
  margin: 0.25rem;
}

.author-date {
  width: 6rem;
}

.author-date::placeholder {
  font-size: 0.7rem;
}

.error {
  border: 1px solid red;
}

.edit-btn {
  display: block;
  font-size: 1.5rem;
  text-align: center;
  text-decoration: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  /*padding: 0.5rem 10px 10px;*/
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  background: #099;
  color: white;
  border: none;
  opacity: 0.7;
}

.edit-btn:hover {
  display: inline-block;
  opacity: 1;
}
</style>

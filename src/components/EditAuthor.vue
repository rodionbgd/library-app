<template>
  <div class="d-flex">
    <div class="d-flex mw-100 author-input">
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
        :class="{ error: !isValidValue('birth_year') }"
        v-model="data.birth_year"
        @keyup.enter="editAuthor"
      />
      <input
        type="text"
        class="form-control author-date"
        placeholder="+Add Death year"
        :disabled="isDisabledDate"
        :class="{ error: !isValidValue('death_year') }"
        v-model="data.death_year"
        @keyup.enter="editAuthor"
      />
    </div>
    <div class="mh-0">
      <button
        type="button"
        class="edit-btn"
        v-if="Object.keys(props.author).length && props.authors.length > 1"
        @click="removeAuthor"
        @keyup.enter.prevent
      >
        <i class="fa-regular fa-trash-can"></i>
      </button>
      <button
        class="edit-btn"
        v-if="isEdited && isValidForm"
        @click="editAuthor"
      >
        <i class="fa-regular fa-pen-to-square"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useStore } from "vuex";

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

const store = useStore();

const data = reactive({
  name: props.author.name ?? "",
  birth_year: props.author.birth_year ?? "",
  death_year: props.author.death_year ?? "",
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
const isDisabledDate = ref(false);
const isValidForm = computed(() => {
  return !Object.keys(data).some((key) => !!isValidValue(key) === false);
});
watch(
  () => data.name,
  () => {
    isValidName.value =
      (!data.name && !data.birth_year && !data.death_year) ||
      (data.name && !props.authors.find((author) => author === data.name));
    isDisabledDate.value = false;
    if (
      isValidName.value &&
      data.name !== props.author.name &&
      data.name in store.state.authors
    ) {
      data.birth_year = store.state.authors[data.name].birth_year;
      data.death_year = store.state.authors[data.name].death_year;
      isDisabledDate.value = true;
    }
  }
);

const emptyDates = computed(
  () => data.birth_year === "" && data.death_year === ""
);
const isNumber = (value) => value !== "" && !Number.isNaN(+value);

const isValidValue = (type) => {
  switch (type) {
    case "birth_year":
      return (
        emptyDates.value ||
        (isNumber(data.birth_year) &&
          ((data.death_year !== "" &&
            (!isNumber(data.death_year) ||
              +data.birth_year < data.death_year)) ||
            data.death_year === ""))
      );
    case "death_year":
      return (
        (data.birth_year !== "" &&
          (data.death_year === "" ||
            (isNumber(+data.death_year) &&
              data.death_year >= data.birth_year))) ||
        (data.birth_year === "" && data.death_year === "")
      );
    case "name":
      return isValidName.value;
    default:
      return true;
  }
};

const editAuthor = () => {
  if (!isEdited.value) {
    return;
  }

  const updatedAuthor = {
    name: data.name,
    birth_year: data.birth_year,
    death_year: data.death_year,
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
.mw-100 {
  min-width: 100%;
}

.mh-0 {
  max-height: 0;
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

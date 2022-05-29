<template>
  <div v-if="!isEdited" @click.right.prevent="editField">
    {{
      fieldValue !== "" && fieldValue !== null && fieldValue !== undefined
        ? fieldValue
        : "-"
    }}
  </div>
  <div v-else>
    <input
      type="text"
      :class="{ error: !isValid }"
      v-model="fieldValue"
      id="author-field"
      @keyup.enter="updateValue"
      @focusout="updateValue"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";

const props = defineProps({
  author: {
    type: Object,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
});

const fieldValue = ref(props.author[props.field]);
const emptyDates = computed(
  () => fieldValue.value === "" && props.author.death_year === ""
);
const isNumberValue = computed(
  () => fieldValue.value !== "" && !Number.isNaN(+fieldValue.value)
);

const isValid = computed(() => {
  switch (props.field) {
    case "birth_year":
      return (
        emptyDates.value ||
        (isNumberValue.value &&
          ((props.author.death_year !== "" &&
            +fieldValue.value < props.author.death_year) ||
            props.author.death_year === ""))
      );
    case "death_year":
      return (
        (props.author.birth_year !== "" &&
          (fieldValue.value === "" ||
            (isNumberValue.value &&
              fieldValue.value >= props.author.birth_year))) ||
        (props.author.birth_year === "" && fieldValue.value === "")
      );
    case "name":
      return fieldValue.value;
    default:
      return true;
  }
});

const events = defineEmits({
  "update-field": null,
});

const isEdited = ref(false);

const editField = () => {
  isEdited.value = true;
  nextTick().then(() => {
    document.getElementById("author-field").focus();
  });
};

const updateValue = () => {
  if (fieldValue.value !== props.author[props.field]) {
    if (!isValid.value) {
      fieldValue.value = props.author[props.field];
    } else {
      if (
        fieldValue.value !== "" &&
        (props.field === "birth_year" || props.field === "death_year")
      ) {
        fieldValue.value = parseInt(fieldValue.value);
      }
      events("update-field", fieldValue.value);
    }
  }
  isEdited.value = false;
};
</script>

<style scoped>
input {
  border: none;
  padding: 0;
  margin: 0;
  width: 10rem;
}
.error {
  background-color: red;
}
</style>

<template>
  <form>
    <div class="form-group row">
      <label for="title-filter" class="col-sm-2 col-form-label">Title</label>
      <div class="col-sm-10">
        <input
          type="text"
          class="form-control"
          id="title-filter"
          v-model="data.title"
          @input="updateFilter"
        />
      </div>
    </div>
    <div class="form-group row">
      <label for="author-filter" class="col-sm-2 col-form-label">Author</label>
      <div class="col-sm-10">
        <input
          type="text"
          class="form-control"
          id="author-filter"
          v-model="data.author"
          @input="updateFilter"
        />
      </div>
    </div>
    <div class="d-flex justify-content-center mt-3">
      <RateStars :rate="data.rate" :isEdit="true" @update-rate="updateRate" />
      <ButtonUI
        class="tm-search-icon border border-white"
        type="button"
        @click="resetFilter"
        >reset
      </ButtonUI>
    </div>
    <div class="d-flex justify-content-center"></div>
  </form>
</template>

<script setup>
import RateStars from "@/components/UI/RateStars.vue";
import ButtonUI from "@/components/UI/ButtonUI.vue";

import { reactive, watch } from "vue";
import { useRoute } from "vue-router";

const events = defineEmits({
  "update-filter": null,
});

const route = useRoute();
const data = reactive({
  title: route.query.title,
  author: route.query.author,
  rate: parseInt(`${route.query.rate}`),
});

const updateRate = (newRate) => {
  data.rate = newRate;
  updateFilter();
};
const updateFilter = () => {
  const filter = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      filter[key] = value;
    }
  });
  events("update-filter", filter);
};

const resetFilter = () => {
  Object.keys(data).forEach((filterKey) => {
    data[filterKey] = null;
  });
  updateFilter();
};

watch(
  () => route.query,
  () => {
    Object.keys(data).forEach((filterKey) => {
      data[filterKey] = route.query[filterKey];
    });
  }
);
</script>

<style scoped></style>

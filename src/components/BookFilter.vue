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
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Price</label>
      <div class="col-sm-10 d-flex">
        <input
          type="text"
          class="form-control"
          placeholder="from"
          v-model.number="data.from"
          @input="updateFilter"
        />
        <input
          type="text"
          class="form-control"
          placeholder="to"
          v-model.number="data.to"
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

<script setup lang="ts">
import RateStars from "@/components/UI/RateStars.vue";
import ButtonUI from "@/components/UI/ButtonUI.vue";

import { reactive, watch } from "vue";
import { useRoute } from "vue-router";
import type { LocationQuery } from "vue-router";

export type Filter = {
  title: LocationQuery[0];
  author: LocationQuery[0];
  from: LocationQuery[0];
  to: LocationQuery[0];
  rate: LocationQuery[0];
};

const events = defineEmits<{
  (e: "update-filter", filter: Filter): void;
}>();

const route = useRoute();
const data = reactive<Filter>({
  title: route?.query.title,
  author: route?.query.author,
  from: route?.query?.from ? `${parseFloat(`${route?.query?.from}`)}` : null,
  to: route?.query?.to ? `${parseFloat(`${route?.query?.to}`)}` : null,
  rate: route?.query.rate ? `${parseInt(`${route?.query.rate}`)}` : null,
});

const updateRate = (newRate: Filter["rate"]) => {
  data.rate = newRate;
  updateFilter();
};
const updateFilter = () => {
  const filter = {} as Filter;
  Object.entries(data).forEach(
    ([key, value]: [string, Filter[keyof Filter]]) => {
      if (value) {
        filter[key as keyof Filter] = value;
      }
    }
  );
  events("update-filter", filter);
};

const resetFilter = () => {
  Object.keys(data).forEach((filterKey: string) => {
    data[filterKey as keyof Filter] = "";
  });
  updateFilter();
};

watch(
  () => route?.query,
  () => {
    Object.keys(data).forEach((filterKey: string) => {
      data[filterKey as keyof Filter] = route?.query[
        filterKey
      ] as LocationQuery[0] & number;
    });
  }
);
</script>

<style scoped></style>

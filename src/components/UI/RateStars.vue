<template>
  <div class="rate-stars-wrapper" :class="{ 'no-pointer-events': !isEditMode }">
    <div class="rating-group">
      <template v-for="star in 5" :key="star">
        <div :aria-label="`${star} star`" class="rating__label">
          <i
            :class="{ 'rating__icon--star': star <= props.rate }"
            class="rating__icon fa fa-star"
            @click="updateRate(star)"
          ></i>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  rate: {
    type: Number,
    required: true,
  },
});
const events = defineEmits({
  "update-rate": null,
});

const isEditMode = computed(() => {
  return route.name.includes("edit-book") || route.name.includes("add-book");
});

const updateRate = (newRate) => {
  events("update-rate", newRate);
};
</script>

<style scoped>
.rate-stars-wrapper .rating-group {
  display: inline-flex;
}

.no-pointer-events {
  pointer-events: none;
}

.rate-stars-wrapper .rating__label {
  cursor: pointer;
  padding: 0 0.1em;
  font-size: 2rem;
  color: #ddd;
}

.rate-stars-wrapper .rating__icon--star {
  color: orange;
}

.rate-stars-wrapper ~ .rating__label .rating__icon--star {
  color: #ddd;
}

.rate-stars-wrapper .rating__label:hover .rating__icon--star {
  color: orange;
}

body {
  padding: 1rem;
  text-align: center;
}
</style>

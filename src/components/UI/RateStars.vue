<template>
  <div class="rate-stars-wrapper" :class="{ 'no-pointer-events': !isEditMode }">
    <div class="rating-group">
      <input
        disabled
        checked
        class="rating__input rating__input--none"
        name="rating3"
        value="0"
        type="radio"
      />
      <template v-for="star in 5" :key="star">
        <label
          :aria-label="`${star} star`"
          class="rating__label"
          :for="`rating3-${star}`"
          ><i
            :class="{ 'rating__icon--star': star <= props.rate }"
            class="rating__icon no-pointer-events fa fa-star"
          ></i
        ></label>
        <input
          class="rating__input"
          name="rating3"
          type="radio"
          :id="`rating3-${star}`"
          :value="`${star}`"
          :checked="star <= props.rate"
          @change="updateRate(star)"
        />
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
    default: 0,
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

.rate-stars-wrapper .rating__input {
  position: absolute !important;
  left: -9999px !important;
}

.rate-stars-wrapper .rating__input--none {
  display: none;
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

.rate-stars-wrapper
  .rating__input:checked
  ~ .rating__label
  .rating__icon--star {
  color: #ddd;
}

.rate-stars-wrapper .rating-group:hover .rating__label .rating__icon--star {
  color: orange;
}

.rate-stars-wrapper .rating__input:hover ~ .rating__label .rating__icon--star {
  color: #ddd;
}

body {
  padding: 1rem;
  text-align: center;
}
</style>

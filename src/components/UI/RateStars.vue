<template>
  <div class="rate-stars-wrapper">
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
      <div
        v-if="props.isEdit"
        aria-label="0 star"
        class="rating__label opacity-25"
      >
        <i class="rating__icon fa fa-star" @click="updateRate(0)"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  rate: {
    type: Number,
    default: 0,
  },
  isEdit: {
    type: Boolean,
  },
});
const events = defineEmits({
  "update-rate": null,
});

const updateRate = (newRate) => {
  events("update-rate", newRate);
};
</script>

<style scoped>
.rate-stars-wrapper .rating-group {
  display: inline-flex;
}

.rate-stars-wrapper .rating__label {
  cursor: pointer;
  padding: 0 0.1em;
  font-size: 2rem;
  color: whitesmoke;
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

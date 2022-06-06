<template>
  <div class="rate-stars-wrapper">
    <div class="rating-group">
      <template v-for="star in 5" :key="star">
        <div :aria-label="`${star} star`" class="rating__label">
          <font-awesome-icon
            icon="star"
            class="rating__icon"
            :class="{ 'rating__icon--star': star <= props.rate }"
            @click="updateRate(star)"
          ></font-awesome-icon>
        </div>
      </template>
      <div
        v-if="props.isEdit"
        aria-label="0 star"
        class="rating__label opacity-25"
      >
        <font-awesome-icon
          class="rating__icon"
          icon="star"
          @click="updateRate(0)"
        ></font-awesome-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  rate?: 0;
  isEdit?: boolean;
}>();
const events = defineEmits<{
  (e: "update-rate", rate: number): void;
}>();

const updateRate = (newRate: number) => {
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

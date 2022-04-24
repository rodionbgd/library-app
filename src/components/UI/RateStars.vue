<template>
  <div id="full-stars-example-two">
    <div class="rating-group">
      <input
        disabled
        checked
        class="rating__input rating__input--none"
        name="rating3"
        id="rating3-none"
        value="0"
        type="radio"
      />
      <template v-for="star in 5" :key="star">
        <label
          :aria-label="`${star} star`"
          class="rating__label"
          :for="`rating3-${star}`"
          ><i class="rating__icon rating__icon--star fa fa-star"></i
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
const props = defineProps({
  rate: {
    type: Number,
    default: 0,
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
#full-stars-example .rating-group {
  display: inline-flex;
}

#full-stars-example .rating__icon {
  pointer-events: none;
}

#full-stars-example .rating__input {
  position: absolute !important;
  left: -9999px !important;
}

#full-stars-example .rating__label {
  cursor: pointer;
  padding: 0 0.1em;
  font-size: 2rem;
}

#full-stars-example .rating__icon--star {
  color: orange;
}

#full-stars-example
  .rating__input:checked
  ~ .rating__label
  .rating__icon--star {
  color: #ddd;
}

#full-stars-example .rating-group:hover .rating__label .rating__icon--star {
  color: orange;
}

#full-stars-example .rating__input:hover ~ .rating__label .rating__icon--star {
  color: #ddd;
}

#half-stars-example .rating-group {
  display: inline-flex;
}

#half-stars-example .rating__icon {
  pointer-events: none;
}

#half-stars-example .rating__input {
  position: absolute !important;
  left: -9999px !important;
}

#half-stars-example .rating__label {
  cursor: pointer;
  padding: 0 0.1em;
  font-size: 2rem;
}

#half-stars-example .rating__icon--star {
  color: orange;
}

#half-stars-example
  .rating__input:checked
  ~ .rating__label
  .rating__icon--star {
  color: #ddd;
}

#half-stars-example .rating-group:hover .rating__label .rating__icon--star,
#half-stars-example
  .rating-group:hover
  .rating__label--half
  .rating__icon--star {
  color: orange;
}

#half-stars-example .rating__input:hover ~ .rating__label .rating__icon--star,
#half-stars-example
  .rating__input:hover
  ~ .rating__label--half
  .rating__icon--star {
  color: #ddd;
}

#full-stars-example-two {
  /* use display:inline-flex to prevent whitespace issues. alternatively, you can put all the children of .rating-group on a single line */
  /* make hover effect work properly in IE */
  /* hide radio inputs */
  /* hide 'none' input from screenreaders */
  /* set icon padding and size */
  /* set default star color */
  /* if any input is checked, make its following siblings grey */
  /* make all stars orange on rating group hover */
  /* make hovered input's following siblings grey on hover */
}

#full-stars-example-two .rating-group {
  display: inline-flex;
}

#full-stars-example-two .rating__icon {
  pointer-events: none;
}

#full-stars-example-two .rating__input {
  position: absolute !important;
  left: -9999px !important;
}

#full-stars-example-two .rating__input--none {
  display: none;
}

#full-stars-example-two .rating__label {
  cursor: pointer;
  padding: 0 0.1em;
  font-size: 2rem;
}

#full-stars-example-two .rating__icon--star {
  color: orange;
}

#full-stars-example-two
  .rating__input:checked
  ~ .rating__label
  .rating__icon--star {
  color: #ddd;
}

#full-stars-example-two .rating-group:hover .rating__label .rating__icon--star {
  color: orange;
}

#full-stars-example-two
  .rating__input:hover
  ~ .rating__label
  .rating__icon--star {
  color: #ddd;
}

body {
  padding: 1rem;
  text-align: center;
}
</style>

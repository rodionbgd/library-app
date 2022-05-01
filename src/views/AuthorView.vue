<template>
  <div>
    <router-view />
    <BookList :authorId="props.authorId">
      <p>Books by {{ author?.name }}</p>
    </BookList>
  </div>
</template>

<script setup>
import BookList from "@/components/BookList.vue";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const props = defineProps({
  authorId: {
    type: Number,
    required: true,
  },
});

const author = computed(() => store.getters.authorById(props.authorId));
</script>

<style scoped></style>

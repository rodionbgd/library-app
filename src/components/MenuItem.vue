<template>
  <li class="tm-nav-item active">
    <app-link :to="props.item.link" class="tm-nav-link">
      <font-awesome-icon
        :icon="props.item.iconClass"
        aria-hidden="true"
      ></font-awesome-icon>
      {{ props.item.title }}
    </app-link>
  </li>
</template>

<script setup lang="ts">
import type { MenuItemT } from "@/components/AppHeader.vue";

const props = defineProps<{
  item: MenuItemT;
}>();
</script>

<style scoped>
.tm-nav-item {
  list-style: none;
  margin-bottom: 1rem;
}

.tm-nav-link {
  color: white;
  background-color: transparent;
  height: 75px;
  width: 100%;
  max-width: 300px;
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  padding: 30px;
}

.tm-nav-item:hover .tm-nav-link,
.tm-nav-item.active .tm-nav-link {
  color: #0cc;
  background-color: white;
  text-decoration: none;
}

.tm-nav ul {
  position: relative;
}

.tm-nav-item:hover:after,
.tm-nav-item.active:after {
  content: "";
  width: 100%;
  max-width: 300px;
  height: 75px;
  display: block;
  border: 1px solid white;
  margin-left: 10px;
  margin-top: -65px;
  position: absolute;
  z-index: -1000;
}

.tm-nav-link i {
  margin-right: 37px;
}

ul {
  margin: 0;
  padding: 0;
}
</style>

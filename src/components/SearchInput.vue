<template>
  <div class="search-input">
    <form method="GET" class="form-inline tm-search-form">
      <input
        class="form-control tm-search-input"
        name="query"
        type="text"
        placeholder="Search..."
        aria-label="Search"
      />
      <button class="tm-search-button" type="submit">
        <i class="fas fa-search tm-search-icon" aria-hidden="true"></i>
      </button>
    </form>
  </div>
</template>

<script setup></script>

<style scoped>
.search-input {
  width: 100%;
  position: fixed;
  z-index: 1;
  background: white;
  display: inline-block;
  padding-right: 20%;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
}
</style>

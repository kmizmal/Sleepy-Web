<template>
  <div class="container">
    <StatusCard />
    <HitokotoCard />
  </div>
</template>

<script setup>
import StatusCard from "./components/StatusCard.vue";
import HitokotoCard from "./components/HitokotoCard.vue";
</script>

<style>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>

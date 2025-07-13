<template>
  <div class="container">
    <StatusCard />
    <HitokotoCard />
  </div>
</template>

<script setup>
import StatusCard from "./components/StatusCard.vue";
import HitokotoCard from "./components/HitokotoCard.vue";
if(import.meta.env.VITE_Background_Canvas === "true") {
  import("./stores/canvas.js").then((module) => {
    const ParticleBackground = module.default;
    const particleBg = new ParticleBackground({
      opacity: import.meta.env.VITE_Background_Canvas_Opacity || 0.9,
      count: import.meta.env.VITE_Background_Canvas_Count || 100,

    });
  });
}

</script>

<style>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>

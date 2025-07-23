<template>
  <div class="container">
    <StatusCard />
    <div class="more">
      <HitokotoCard />
      <SteamCard v-if="showSteamCard" />
    </div>
  </div>
  <Footer />
</template>

<script setup>
import StatusCard from "./components/StatusCard.vue";
import HitokotoCard from "./components/HitokotoCard.vue";
import SteamCard from "./components/SteamCard.vue";
import Footer from "./components/Footer.vue";
if (import.meta.env.VITE_Background_Canvas == "true") {
  import("./stores/canvas.js").then((module) => {
    const ParticleBackground = module.default;
    const particleBg = new ParticleBackground({
      opacity: import.meta.env.VITE_Background_Canvas_Opacity || 0.9,
      count: import.meta.env.VITE_Background_Canvas_Count || 100,
    });
  });
}
const showSteamCard = import.meta.env.VITE_STEAM_Enabled == "true";
</script>

<style>
#app {
  overflow: hidden;

  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.more {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
}
</style>

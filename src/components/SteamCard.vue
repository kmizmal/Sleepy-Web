<template>
  <div
    class="steam-card card"
    v-if="data"
    :style="{ backgroundImage: `url(${data.background})` }"
  >
    <video
      v-if="data.backgroundVideo"
      class="background-video"
      :src="data.backgroundVideo"
      autoplay
      muted
      loop
      playsinline
    ></video>
    <div class="card-header">
      <img :src="data.avatar" alt="Avatar" class="avatar" />
      <div class="user-info">
        <h2>{{ data.name }}</h2>
        <p>{{ data.secondaryName }}</p>
        <p
          :class="{
            online: data.status == 1,
            offline: data.status == 0,
            play: data.status == 2,
          }"
        >
          {{ getStatusText(data.status) }}
        </p>
      </div>
    </div>
    <div class="card-body">
      <div v-if="data.game" class="game-info">
        <img :src="data.game.logo" alt="Game Logo" class="game-logo" />
        <p>{{ data.game.name }}</p>
      </div>
      <div v-if="data.badge" class="badge-info">
        <img :src="data.badge.icon" alt="Badge Icon" class="badge-icon" />
        <p>{{ data.badge.name }} - {{ data.badge.xp }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
const steamid = import.meta.env.VITE_SteamID;
// const steamid = "76561198066238567";
const apiUrl = import.meta.env.VITE_SteamAPI_URL;

export default {
  name: "SteamCard",
  setup() {
    const data = ref(null);

    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/?steamid=${steamid}`);
        data.value = await response.json();
        // console.log("Fetched Steam data:", data.value);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 1:
          return "在线";
        case 0:
          return "离线";
        case 2:
          return status;
        default:
          return status;
      }
    };

    onMounted(() => {
      fetchData();
      setInterval(fetchData, 60000); // Fetch data every 60 seconds
    });

    return { data, getStatusText };
  },
};
</script>
<style scoped lang="scss">
.steam-card {
  position: relative;
  opacity: 0.9;
  width: 300px;
  padding: 20px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  font-family: Arial, sans-serif;
  overflow: hidden;

  .background-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }
}

.card-header {
  display: flex;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info {
  h2,
  p {
    margin: 0;
    mix-blend-mode: difference;
    color: white;
  }
}

.online {
  color: #00ff7f;
}

.offline {
  color: #ff4d4f;
}

.play {
  color: #ffd700;
}

.card-body {
  margin-top: 20px;
}

.game-info,
.badge-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  line-height: 1rem;
  p{
    mix-blend-mode: difference;
  }
  .game-logo{
    width: 100%;
}
  .badge-icon {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
}

</style>

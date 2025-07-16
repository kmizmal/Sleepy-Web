<template>
  <div class="card floating">
    <div class="card-header">
      <h1>
        <ruby>似<rt>sǐ</rt></ruby
        >了吗?
      </h1>
      <div
        class="connection-status"
        :class="isConnected ? 'connected' : 'disconnected'"
      >
        <i
          :class="isConnected ? 'fas fa-plug' : 'fas fa-plug-circle-xmark'"
        ></i>
        {{ isConnected ? "" : "连接断开，重连中..." }}
      </div>
    </div>

    <div class="user-info">
      <div class="avatar"><img :src="userAvatar" alt="" /></div>
      <div class="user-details">
        <div class="user-name">{{ userName }}'s Status</div>
        <div
          class="status-badge"
          :style="{ color: statusStore.statusInfo.color }"
        >
          {{ statusStore.statusInfo.name }}
        </div>
      </div>
    </div>

    <div class="status-info">
      <p>{{ statusStore.statusInfo.desc }}</p>
    </div>

    <div class="devices-container">
      <div class="devices-title"><i class="fas fa-laptop"></i> 设备状态</div>
      <div class="devices-grid">
        <div
          class="device-card"
          v-for="device in statusStore.devices"
          :key="device.id"
        >
          <div class="device-icon">
            <i :class="device.icon"></i>
          </div>
          <div class="device-name" :title="device.name">{{ device.name }}</div>
          <div
            class="device-status"
            :class="device.status ? 'online' : 'offline'"
            :title="device.statusText"
          >
            {{ device.statusText }}
          </div>
        </div>
      </div>
    </div>

    <div class="last-updated">最后更新: {{ statusStore.lastUpdated }}</div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from "vue";
import { useStatusStore } from "../stores/status.js";

const statusStore = useStatusStore();
const isConnected = computed(() => statusStore.isConnected);
const userName = import.meta.env.VITE_USER_NAME;
const userAvatar = import.meta.env.VITE_USER_AVATAR;
onMounted(() => {
  statusStore.initSSEConnection();
});

onUnmounted(() => {
  statusStore.closeSSEConnection();
});
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  opacity: 0.9;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  /* 优化后的渐变背景 - 更柔和的蓝紫过渡 */
  background: linear-gradient(
    135deg,
    rgba(141, 68, 173, 0.7) 0%,
    rgba(57, 197, 188, 0.7) 35%,
    rgba(52, 152, 219, 0.7) 70%,
    rgba(102, 204, 255, 0.7) 100%
  );

  border-radius: 16px;
  padding: 25px;
  color: white;
  margin-bottom: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);

  .card-header {
    h1 {
      font-size: 2.2rem;
      margin: 0 0 20px;
      text-align: center;
      font-weight: 700;

      background: linear-gradient(45deg, #39c5bb, #66ccff, #8e44ad);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .connection-status {
      text-align: center;
      margin-top: 10px;
      font-weight: 500;

      &.connected {
        color: #2ecc71;
      }

      &.disconnected {
        color: #ff6b6b;
      }
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    padding: 15px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);

    .avatar {
      width: 70px;
      height: 70px;
      overflow: hidden;
      border-radius: 50%;
      align-items: center;
      font-size: 2.5rem;
      font-weight: bold;
      margin-right: 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.15);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-details {
      flex: 1;

      .user-name {
        font-style: italic;
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 5px;
        color: #e0f7ff;
      }

      .status-badge {
        display: inline-block;
        padding: 5px 15px;
        background: linear-gradient(
          135deg,
          rgba(79, 154, 149, 0.5) 0%,
          rgba(110, 42, 156, 0.5) 100%
        );
        box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        border: 1px solid rgba(255, 255, 255, 0.15);
      }
    }
  }

  .status-info {
    p {
      background: rgba(255, 255, 255, 0.08);
      padding: 15px;
      border-radius: 12px;
      font-size: 1.1rem;
      line-height: 1.6;
      border-left: 4px solid #39c5bb;
      color: #f0f8ff;
    }
  }

  .devices-container {
    margin-top: 25px;
    padding: 15px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);

    .devices-title {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      color: #a6e1fa;

      i {
        margin-right: 10px;
        color: #66ccff;
      }
    }

    .devices-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;

      .device-card {
        background: rgba(72, 64, 107, 0.4);
        border-radius: 12px;
        padding: 15px;
        text-align: center;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);

        &:hover {
          background: rgba(72, 64, 107, 0.6);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .device-icon {
          font-size: 2rem;
          margin-bottom: 10px;
          color: #66ccff;
        }

        .device-name {
          font-size: 0.95rem;
          overflow: hidden;
          margin-bottom: 8px;
          font-weight: 500;
          color: #e0f7ff;
        }

        .device-status {
          width: 100%;
          overflow: hidden;
          line-height: 2.2rem;
          font-size: 0.85rem;
          padding: 3px 10px;
          border-radius: 12px;
          display: inline-block;
          font-weight: 500;

          &.online {
            background: rgba(46, 204, 113, 0.15);
            color: #a8ffc9;
            border: 1px solid #2ecc71;
          }

          &.offline {
            background: rgba(128, 128, 128, 0.15);
            color: #d1d1d1;
            border: 1px solid #888888;
          }
        }
      }
    }
  }

  .last-updated {
    margin-top: 20px;
    text-align: right;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
  }
}
</style>

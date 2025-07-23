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
      <div
        class="observe-badge"
        v-if="userobserve === 'true'"
        :title="`当前在线人数: ${statusStore.observer}`">
        当前在线人数:{{ statusStore.observer }}
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
          :title="convertToTimeZone(device.time)"
        >
          <div class="device-icon">
            <i :class="device.icon"></i>
            <!-- {{device.icon}} -->
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

    <div class="last-updated">
      最后更新: {{ convertToTimeZone(statusStore.lastUpdated) }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from "vue";
import { useStatusStore } from "../stores/status.js";

const statusStore = useStatusStore();
const isConnected = computed(() => statusStore.isConnected);
const userName = import.meta.env.VITE_USER_NAME;
const userAvatar = import.meta.env.VITE_USER_AVATAR;
const userobserve = import.meta.env.VITE_USER_OBSERVE || "false";

const timeZone = import.meta.env.VITE_TIME_ZONE || "Asia/Shanghai";
function convertToTimeZone(timeInput, tz = timeZone) {
  let date;

  // 处理不同类型的输入
  if (timeInput instanceof Date) {
    date = timeInput;
  } else if (typeof timeInput === "string") {
    const cleanedTimeStr = timeInput.replace(/[^\dTZ:.-]/g, "").trim();

    if (!cleanedTimeStr) {
      console.warn("空的时间字符串");
      return "未知时间";
    }

    date = new Date(cleanedTimeStr);
  } else {
    console.warn("无效的时间输入:", timeInput);
    return "未知时间";
  }

  if (isNaN(date)) {
    console.warn("无法解析的时间输入:", timeInput);
    return "未知时间";
  }

  // 使用 formatToParts 格式化为 yyyy-MM-dd:hh:mm:ss
  try {
    const parts = new Intl.DateTimeFormat("sv-SE", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(date);

    const get = (type) => parts.find((p) => p.type === type)?.value;

    return `${get("month")}-${get("day")}/${get("hour")}:${get("minute")}:${get(
      "second"
    )}`;
  } catch (error) {
    console.error("时间格式化失败:", error);
    return "格式化失败";
  }
}

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

  border-radius: 16px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);

  .card-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    h1 {
      font-size: 2.2rem;
      text-align: center;
      background: linear-gradient(35deg, #39c5bb, #66ccff, #8e44ad);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .connection-status {
      text-align: center;

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
        mix-blend-mode: difference;
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
    @media screen and (min-width: 768px) {
      text-align: center;
      max-width: 70%;
    }
    
    p {
      background: rgba(255, 255, 255, 0.08);
      padding: 15px;
      border-radius: 12px;
      font-size: 1.1rem;
      line-height: 1.6;
      border-left: 4px solid #39c5bb;
      mix-blend-mode: overlay;
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

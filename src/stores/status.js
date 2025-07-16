import { defineStore } from 'pinia'

import iconMap from '@/assets/icon-map.json'
import statusData from '@/assets/status.json'

export const useStatusStore = defineStore('status', {
  state: () => ({
    statusInfo: statusData[0] ,
    devices: [],
    lastUpdated: '很久以前',
    sseConnection: null,
    isConnected: false,
    retryCount: 0, // 新增：连接重试次数
    maxRetries: 5  // 新增：最多重连次数
  }),

  actions: {
    // 初始化 SSE 连接
    initSSEConnection() {
      // 防止重复连接
      if (this.isConnected && this.sseConnection?.readyState === 1) return

      // 关闭旧连接
      if (this.sseConnection) {
        this.sseConnection.close()
      }

      try {
        const url = `${import.meta.env.VITE_SERVER_URL}/events`
        this.sseConnection = new EventSource(url)
        this.isConnected = true
        this.retryCount = 0

        // 接收更新事件
        this.sseConnection.addEventListener('update', (event) => {
          try {
            const data = JSON.parse(event.data)
            this.processUpdate(data)
          } catch (error) {
            console.error('Error parsing update event:', error)
          }
        })

        // 接收心跳事件
        this.sseConnection.addEventListener('heartbeat', (event) => {
          this.lastUpdated = event.data || '刚刚'
        })

        // 错误处理与重连
        this.sseConnection.onerror = () => {
          console.error('SSE connection error')
          this.isConnected = false

          if (++this.retryCount <= this.maxRetries) {
            setTimeout(() => {
              this.initSSEConnection()
            }, Math.min(1000 * 2 ** this.retryCount, 30000)) // 指数退避最大30秒
          } else {
            console.warn('SSE 已超过最大重连次数')
          }
        }

      } catch (err) {
        console.error('SSE 初始化失败：', err)
      }
    },

    // 处理更新数据
    processUpdate(data) {
      // 状态信息更新
      // console.log('接收到更新数据:', data)
      if (data.info) {
        this.statusInfo = statusData[data.status]
        // console.log('状态信息更新:', this.statusInfo)
      }

      // 设备列表更新
      if (data.device && typeof data.device === 'object') {
        // console.log('设备数据:', data.device)
        this.devices = Object.entries(data.device).map(([name, device]) => ({
          id: name,
          name: device?.show_name,
          icon: this.getDeviceIcon(name),
          status: device?.using ?? 'unknown',
          statusText: device?.app_name ?? '未知状态'
        }))
        // const allFalse = this.devices.every(device => device.status === false)

      }

      // 更新时间
      if (data.time) {
        this.lastUpdated = data.last_updated
      }
    },

    // 获取设备图标
    getDeviceIcon(deviceName) {
      return iconMap[deviceName] || 'fas fa-question-circle'
    },

    // 关闭连接
    closeSSEConnection() {
      if (this.sseConnection) {
        this.sseConnection.close()
        this.sseConnection = null
        this.isConnected = false
      }
    }
  }
})

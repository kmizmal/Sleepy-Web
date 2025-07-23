import { defineStore } from 'pinia'

import iconMap from '@/assets/icon-map.json'
import statusData from '@/assets/status.json'

export const useStatusStore = defineStore('status', {
  state: () => ({
    statusInfo: statusData[0],
    devices: [],
    lastUpdated: '很久以前',
    sseConnection: null,
    isConnected: false,
    retryCount: 0,
    maxRetries: 5,
    observer: 0,
  }),

  actions: {
    initSSEConnection() {
      if (this.isConnected && this.sseConnection?.readyState === 1) return

      if (this.sseConnection) {
        this.sseConnection.close()
      }

      try {
        const secret = import.meta.env.VITE_SERVER_SECRET || ''

        const url = new URL(`${import.meta.env.VITE_SERVER_URL}/events`)
        if (secret) {
          url.searchParams.append('secret', secret)
        }

        this.sseConnection = new EventSource(url.toString())
        this.isConnected = true
        this.retryCount = 0

        this.sseConnection.addEventListener('update', (event) => {
          try {
            const data = JSON.parse(event.data)
            this.processUpdate(data)
          } catch (error) {
            console.error('Error parsing update event:', error)
          }
        })

        this.sseConnection.addEventListener('heartbeat', (event) => {
          this.lastUpdated = event.data || '刚刚'
        })

        this.sseConnection.onerror = () => {
          console.error('SSE connection error')
          this.isConnected = false

          if (++this.retryCount <= this.maxRetries) {
            setTimeout(() => {
              this.initSSEConnection()
            }, Math.min(1000 * 2 ** this.retryCount, 30000))
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
      // console.log('接收到更新数据:', data)
      // 状态信息更新
      if (typeof data.status === 'number') {
        this.statusInfo = statusData[data.status]
        // console.log('状态信息更新:', this.statusInfo)
      }

      // 设备列表更新
      if (data.device && typeof data.device === 'object') {
        this.devices = Object.entries(data.device).map(([name, device]) => ({
          id: name,
          name: device?.show_name || name,
          icon: this.getDeviceIcon(name),
          status: device?.using ?? 'unknown',
          statusText: device?.app_name ?? '未知状态',
          time: device?.time || '未知时间',
          media: device?.media ?? 'false',
          media_content: device?.media_content ?? ''
        }))
      }

      // 更新时间
      if (data.last_updated) {
        this.lastUpdated = data.last_updated
      } else if (data.time) {
        this.lastUpdated = data.time
      }

      if (data.observer) {
        this.observer = data.observer
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

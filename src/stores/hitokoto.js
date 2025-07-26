import { defineStore } from 'pinia'

export const useHitokotoStore = defineStore('hitokoto', {
  state: () => ({
    hitokoto: {
      text: '代码如诗，岁月如歌',
      from: '开发者日记',
      link: 'https://github.com/kmizmal'
    }
  }),
  actions: {
    async updateHitokoto() {
      const categories = ['a', 'd', 'e'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      try {
        const response = await fetch(`https://v1.hitokoto.cn/?c=${randomCategory}`);
        const data = await response.json()
        this.hitokoto = {
          text: data.hitokoto,
          from: data.from || '未知',
          link: `https://hitokoto.cn/?uuid=${data.uuid}`
        }
      } catch (error) {
        console.error('获取一言失败:', error)
        this.hitokoto = {
          text: '总愿在平凡的日子里发现无数温暖的惊喜',
          from: 'kmizmal',
          link: 'https://home.zmal.top'
        }
      }
    }
  }
})
<template>
  <div class="card quote-card">
    <a class="quote-content" :href="hitokotoStore.hitokoto.link" target="_blank" rel="noopener noreferrer">
      <i class="fas fa-quote-left"></i> {{ hitokotoStore.hitokoto.text }}
      <i class="fas fa-quote-right"></i>
    </a>
    <div class="quote-author">—— {{ hitokotoStore.hitokoto.from }}</div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useHitokotoStore } from '@/stores/hitokoto.js'

const hitokotoStore = useHitokotoStore()

// 每小时更新一次一言
let hitokotoInterval

onMounted(() => {
  hitokotoStore.updateHitokoto()
  hitokotoInterval = setInterval(() => {
    hitokotoStore.updateHitokoto()
  }, 3600000)
})

onUnmounted(() => {
  clearInterval(hitokotoInterval)
})
</script>

<style scoped>
/* 容器卡片样式 */
.quote-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 30px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3498db, #8e44ad);
  /* color: #fff; */
  /* box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); */
  @media screen and (min-width: 900px) {
   width: 50%;
  }
}

/* 背景发光效果 */
.quote-card::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  z-index: 0;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 70%
  );
}

/* 引用文本样式 */
.quote-content {
  position: relative;
  z-index: 1;
  padding: 0 20px;
  font-size: 1.5rem;
  line-height: 1.6;
  font-weight: 500;
  text-align: center;
  user-select: none;
  mix-blend-mode: overlay;
}

.quote-content i {
  font-size: 1.2rem;
  margin: 0 10px;
  opacity: 0.7;
}

/* 作者署名样式 */
.quote-author {
  position: relative;
  z-index: 1;
  text-align: right;
  font-size: 1.1rem;
  font-style: italic;
  opacity: 0.9;
}
</style>

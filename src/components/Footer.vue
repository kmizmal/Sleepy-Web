<template>
  <footer
    class="footer"
    ref="footerRef"
    @mouseenter="resetFooter"
    @mouseleave="hideFooter"
  >
    <nav class="footer-nav">
      <a v-if="ICPEnabled" :href="ICPLink" target="_blank" rel="noopener">{{
        ICPCode
      }}</a>
      <a
        href="https://github.com/kmizmal/Sleepy-Web"
        target="_blank"
        rel="noopener"
        >@Github</a
      >
    </nav>
  </footer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const ICPCode = import.meta.env.VITE_ICP_code || "";
const ICPLink = import.meta.env.VITE_ICP_link || "";
const ICPEnabled = Boolean(ICPCode && ICPLink);

const footerRef = ref(null);
let hideTimer = null;

const hideFooter = () => {
  if (footerRef.value) {
    footerRef.value.style.transform = "translateY(15px)";
  }
};

const resetFooter = () => {
  if (footerRef.value) {
    footerRef.value.style.transform = "translateY(0)";
  }
};

onMounted(() => {
  hideTimer = setTimeout(() => {
    hideFooter();
  }, 10000); // 初始化后10秒隐藏
});

onBeforeUnmount(() => {
  clearTimeout(hideTimer);
});
</script>

<style scoped lang="scss">
.footer {
  margin-top: 1rem;
  margin-bottom: -1.5rem;
  border-radius: 15px;
  opacity: 0.95;
  position: relative;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #eee;
  padding: 20px 0;
  font-size: 14px;
//   text-align: center;
  transition: transform 0.3s ease;

  .footer-nav {
    display: flex;
    justify-content: center;
    gap: 20px;

    a {
      color: #aaa;
      transition: color 0.3s ease;
      &:hover {
        color: #fff;
      }
    }
  }
}
</style>

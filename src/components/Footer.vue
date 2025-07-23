<template>
  <footer class="footer">
    <div class="container">
      <nav class="footer-nav">
        <a href="https://github.com/kmizmal/Sleepy-Web" target="_blank" rel="noopener">Github</a>
      </nav>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped lang="scss">
.footer {
  background-color: #222;
  color: #eee;
  padding: 20px 0;
  font-size: 14px;
  text-align: center;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.footer-nav a {
  color: #aaa;
  margin: 0 10px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-nav a:hover {
  color: #fff;
}
</style>

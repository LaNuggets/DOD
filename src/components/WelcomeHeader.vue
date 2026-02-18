<script setup lang="ts"></script>

<template>
  <header class="welcome-header">
    <h1>Welcome to DOD!</h1>
    <p>The dataprospector free communication app!</p>
  </header>
</template>

<style scoped>
.welcome-header {
  text-align: center;
}

.welcome-header h1 {
  font-size: 2rem;
  color: var(--gold);
  letter-spacing: 3px;
  text-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.welcome-header p {
  font-size: 0.9rem;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-top: 6px;
}
</style>

<script setup lang="ts">
import WelcomeHeader from '@/components/WelcomeHeader.vue'
import Login from '@/components/Login.vue'
</script>

<template>
  <div class="login-page">
    <WelcomeHeader />
    <Login />
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: linear-gradient(to bottom, var(--sky), var(--white-marble));
  padding: 24px 16px;
}
</style>

<script setup lang="ts">
import ChannelList from '@/components/ChannelList.vue';
</script>

<template>
  <div class="app-layout">
    <!-- Navbar channels en haut, hauteur naturelle -->
    <ChannelList />

    <!-- Contenu de la route (Message.vue) prend le reste -->
    <div class="app-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* le scroll se gère dans les enfants */
}

/* La zone contenu prend tout ce qui reste après la navbar */
.app-content {
  flex: 1;
  overflow: hidden; /* Message.vue gère son propre scroll */
  display: flex;
  flex-direction: column;
}
</style>
<script setup lang="ts">
import ChannelList from '@/components/ChannelList.vue'
import UserProfile from '@/components/UserProfile.vue'
</script>

<template>
  <div class="app-layout">
    <!-- Navbar channels en haut -->
    <ChannelList />

    <!-- Corps : sidebar profil + contenu -->
    <div class="app-body">
      <!-- Sidebar profil à gauche -->
      <aside class="app-sidebar">
        <UserProfile />
      </aside>

      <!-- Contenu de la route (Message.vue) -->
      <div class="app-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.app-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ── Sidebar profil ── */
.app-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: linear-gradient(to bottom, #faf8f2, #f5f2e8);
  border-right: 2px solid #d4af37;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.app-sidebar::-webkit-scrollbar { width: 4px; }
.app-sidebar::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 10px;
}

/* ── Zone message ── */
.app-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
<script setup lang="ts">
import ChannelList from '@/components/ChannelList.vue'
import UserProfile from '@/components/UserProfile.vue'
import Message from '@/components/Message.vue'
import { ref } from 'vue'

const secondChannelId = ref<string | null>(null)

const openSplit = (id: string) => { secondChannelId.value = id }
const closeSplit = () => { secondChannelId.value = null }
</script>

<template>
  <div class="app-layout">

    <!-- Navbar channels en haut -->
    <ChannelList @open-split="openSplit" />

    <!-- Corps : sidebar profil + contenu -->
    <div class="app-body">

      <!-- Sidebar profil à gauche -->
      <aside class="app-sidebar">
        <UserProfile />
      </aside>

      <!-- Zone principale -->
      <div class="app-content">

        <!-- Vue principale (router) -->
        <div class="pane">
          <router-view :key="$route.fullPath" />
        </div>

        <!-- Vue split (optionnelle) -->
        <div class="pane pane--secondary" v-if="secondChannelId">
          <button class="close-split" @click="closeSplit" title="Fermer la vue split">✕</button>
          <Message :forced-channel-id="secondChannelId" :key="secondChannelId" />
        </div>

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
  flex-direction: row;
}

.pane {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.pane--secondary {
  border-left: 2px solid #d4af37;
}

.close-split {
  position: absolute;
  top: 16px;
  right: 1px;
  z-index: 10;
  background: none;
  border: 1px solid #d4af37;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 0.85rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.close-split:hover {
  opacity: 1;
}
</style>
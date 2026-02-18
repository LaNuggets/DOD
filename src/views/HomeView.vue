<script setup lang="ts">
import ChannelList from '@/components/ChannelList.vue';
import Message from '@/components/Message.vue';
import { ref } from 'vue';

const secondChannelId = ref<string | null>(null)

const openSplit = (id: string) => {
  secondChannelId.value = id
}

const closeSplit = () => {
  secondChannelId.value = null
}
</script>

<template>
  <div class="app-layout">
    <ChannelList @open-split="openSplit" />
    <div class="app-content">
      <!-- Main view -->
      <div class="pane">
        <router-view :key="$route.fullPath"/>
      </div>

      <!-- split view -->
      <div class="pane pane--secondary" v-if="secondChannelId">
        <button class="close-split" @click="closeSplit" title="Close split view">✕</button>
        <Message :forced-channel-id="secondChannelId" :key="secondChannelId" />
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
  right: 16px;
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
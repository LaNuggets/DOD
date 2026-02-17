<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ConfirmModal from '@/modals/ConfirmModal.vue'
import type { Channel }  from '@/types/channel';
import { useStore } from '@/ts/store'

const tokenStore = useStore()
// const channels = ref<Channel[]>([])
const channels = computed(() => channelStore.channels);
const loading = ref(false)
const error = ref<string | null>(null)
const deletingId = ref<number | null>(null)
const showDeleteChannel = ref<number | null>(null)
import { useChannelStore } from '@/ts/channelStore';

const channelStore = useChannelStore();

const fetchChannels = async () => {
  loading.value = true
  error.value = null
  try {
    const token = tokenStore.getToken()
    const response = await fetch('https://edu.tardigrade.land/msg/protected/user/channels', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error(`Error ${response.status}: Failed to fetch channels`)
    // channels.value = await response.json()
    const fetchedChannels = (await response.json()) as Channel[];
    channelStore.setChannels(fetchedChannels);

  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error fetching channels'
  } finally {
    loading.value = false
  }
}

const openDeleteConfirm = (channelId: number, event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  showDeleteChannel.value = channelId
}

const deleteChannel = async (channelId: number) => {
  deletingId.value = channelId
  showDeleteChannel.value = null
  try {
    const token = tokenStore.getToken()
    const response = await fetch(`https://edu.tardigrade.land/msg/protected/channel/${channelId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) {
      throw new Error(response.status === 401
        ? 'You do not have permission to delete this channel'
        : `Error ${response.status}: Failed to delete channel`)
    }
    // channels.value = channels.value.filter(c => c.id !== channelId)
    channelStore.removeChannel(channelId);
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error deleting channel'
  } finally {
    deletingId.value = null
  }
}

onMounted(() => { fetchChannels() })
</script>

<template>
  <div class="channel-list">
    <p v-if="loading" class="status">Loading channels...</p>
    <p v-if="error" class="status error">{{ error }}</p>

    <div v-if="!loading && channels.length === 0" class="status empty">
      No channels found. Create or join one to get started!
    </div>

    <div v-if="!loading && channels.length > 0" class="channels">
      <div
        v-for="channel in channels"
        :key="channel.id"
        class="channel-item-wrapper"
      >
        <RouterLink :to="`/channel/${channel.id}`" class="channel-item">
          <div class="channel-img">
            <img
              :src="channel.img || '/src/assets/Olympians.webp'"
              :alt="channel.name"
            />
          </div>
          <span class="channel-name">{{ channel.name }}</span>
        </RouterLink>

        <button
          class="delete-btn"
          @click="openDeleteConfirm(channel.id, $event)"
          :disabled="deletingId === channel.id"
          title="Delete channel"
        >
          {{ deletingId === channel.id ? '…' : '🗑️' }}
        </button>
      </div>
    </div>
  </div>

  <ConfirmModal
    v-if="showDeleteChannel !== null"
    :message="'Are you sure you want to delete this channel?'"
    @confirm="deleteChannel(showDeleteChannel!)"
    @close="showDeleteChannel = null"
  />
</template>

<style scoped>
/* =========================================
   VARIABLES
   ========================================= */
.channel-list {
  --gold: #d4af37;
  --gold-light: #f5d76e;
  --white-marble: #f8f8f8;
  --sky: #dff0ff;
  --black: #111;

  width: 100%;
  flex-shrink: 0;   /* ne compresse jamais la navbar */
  background: linear-gradient(to bottom, var(--sky), var(--white-marble));
  border-bottom: 3px solid var(--gold);
  font-family: 'Cinzel', serif;
}

/* =========================================
   BARRE DE CHANNELS (scroll horizontal)
   ========================================= */
.channels {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 16px 24px;
  scroll-behavior: smooth;
}

.channels::-webkit-scrollbar { height: 6px; }
.channels::-webkit-scrollbar-thumb {
  background: linear-gradient(to right, var(--gold), var(--gold-light));
  border-radius: 10px;
}

/* =========================================
   CHANNEL ITEM
   ========================================= */
.channel-item-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.channel-item {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--black);
  padding: 10px 6px 8px;
  border-radius: 50px 50px 12px 12px;
  border: 2px solid var(--gold);
  background: linear-gradient(to bottom, var(--white-marble), #e8e8e8);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  overflow: hidden;
}

/* Stries de colonne antique */
.channel-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to right,
    rgba(0,0,0,0.03) 0px,
    rgba(0,0,0,0.03) 2px,
    transparent 2px,
    transparent 8px
  );
  pointer-events: none;
}

.channel-item:hover {
  transform: translateY(-5px) scale(1.06);
  box-shadow: 0 10px 22px rgba(212, 175, 55, 0.5);
}

/* =========================================
   IMAGE
   ========================================= */
.channel-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--gold);
  flex-shrink: 0;
  z-index: 1;
}

.channel-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* =========================================
   NOM DU CHANNEL
   ========================================= */
.channel-name {
  font-size: 0.65rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 68px;
  z-index: 1;
}

/* =========================================
   BOUTON SUPPRESSION
   ========================================= */
.delete-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 3px 8px;
  cursor: pointer;
  font-size: 0.8rem;
  opacity: 0.6;
  transition: opacity 0.2s ease, border-color 0.2s ease;
}

.delete-btn:hover:not(:disabled) {
  opacity: 1;
  border-color: #e74c3c;
}

.delete-btn:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

/* =========================================
   ÉTATS
   ========================================= */
.status {
  text-align: center;
  padding: 12px 20px;
  font-size: 0.85rem;
  color: #666;
}

.status.error { color: #c0392b; }
.status.empty { color: #999; font-style: italic; }
</style>
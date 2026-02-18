<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import ConfirmModal from '@/modals/ConfirmModal.vue'
import CreateChannelModal from '@/modals/CreateChannelModal.vue'
import { useStore } from '@/ts/store'
import { useChannelStore } from '@/ts/channelStore'
import { getUsernameFromToken } from '@/ts/saveload'
import { apiGetChannels, apiDeleteChannel } from '@/ts/api'

const tokenStore = useStore()
const channelStore = useChannelStore()
const channels = computed(() => channelStore.channels)

const loading = ref(false)
const error = ref<string | null>(null)
const deletingId = ref<number | null>(null)
const showDeleteChannel = ref<number | null>(null)
const showCreateChannel = ref(false)
const channelsRef = ref<HTMLElement | null>(null)

// L'utilisateur connecté (extrait du token)
const currentUser = computed(() => getUsernameFromToken(tokenStore.getToken()))

// Un channel est supprimable uniquement par son créateur
const isCreator = (creatorUsername: string) => creatorUsername === currentUser.value

const handleWheel = (e: WheelEvent) => {
  if (e.deltaY !== 0) {
    e.preventDefault()
    channelsRef.value!.scrollLeft += e.deltaY
  }
}

const fetchChannels = async () => {
  loading.value = true
  error.value = null
  try {
    const fetched = await apiGetChannels()
    channelStore.setChannels(fetched)
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
    await apiDeleteChannel(channelId)
    channelStore.removeChannel(channelId)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error deleting channel'
  } finally {
    deletingId.value = null
  }
}

const emit = defineEmits<{ 'open-split': [id: string] }>()

watch(channelsRef, (el) => {
  if (el) el.addEventListener('wheel', handleWheel, { passive: false })
})

onMounted(() => {
  fetchChannels()
  channelsRef.value?.addEventListener('wheel', handleWheel, { passive: false })
})

onUnmounted(() => {
  channelsRef.value?.removeEventListener('wheel', handleWheel)
})
</script>

<template>
  <div class="channel-list">
    <p v-if="loading" class="status">Loading channels…</p>
    <p v-if="error" class="status error">{{ error }}</p>

    <div v-if="!loading && channels.length === 0" class="status empty">
      No channels found. Create or join one to get started!
    </div>

    <div v-if="!loading && channels.length > 0" class="channels" ref="channelsRef">
      <div
        v-for="channel in channels"
        :key="channel.id"
        class="channel-item-wrapper"
        @contextmenu.prevent="emit('open-split', String(channel.id))"
      >
        <RouterLink :to="`/channel/${channel.id}`" class="channel-item">
          <div class="channel-img">
            <img
              :src="channel.img || '/src/assets/Olympians.webp'"
              :alt="channel.name ?? undefined"
            />
          </div>
          <span class="channel-name">{{ channel.name }}</span>
        </RouterLink>

        <!-- Bouton suppression : seulement visible si l'utilisateur est le créateur -->
        <button
          v-if="isCreator(channel.creator)"
          class="delete-btn"
          @click="openDeleteConfirm(channel.id, $event)"
          :disabled="deletingId === channel.id"
          title="Delete channel"
        >
          {{ deletingId === channel.id ? '…' : '🗑️' }}
        </button>
      </div>

      <!-- Bouton créer un channel -->
      <div class="channel-item-wrapper">
        <button class="channel-item new-channel-item" @click="showCreateChannel = true" title="Create a channel">
          <div class="channel-img new-channel-icon">
            <span>＋</span>
          </div>
          <span class="channel-name">New</span>
        </button>
      </div>
    </div>
  </div>

  <ConfirmModal
    v-if="showDeleteChannel !== null"
    message="Are you sure you want to delete this channel?"
    @confirm="deleteChannel(showDeleteChannel!)"
    @close="showDeleteChannel = null"
  />

  <CreateChannelModal
    v-if="showCreateChannel"
    @close="showCreateChannel = false"
    @created="fetchChannels"
  />
</template>

<style scoped>
.channel-list {
  width: 100%;
  flex-shrink: 0;
  background: linear-gradient(to bottom, var(--sky), var(--white-marble));
  border-bottom: 3px solid var(--gold);
}

.channels {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 16px 24px;
  scroll-behavior: smooth;
  align-items: flex-start;
  scrollbar-width: thin;
  scrollbar-color: var(--gold) var(--white-marble);
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.channels::-webkit-scrollbar { height: 6px; }
.channels::-webkit-scrollbar-thumb {
  background: linear-gradient(to right, var(--gold), var(--gold-light));
  border-radius: 10px;
}

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
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  cursor: pointer;
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
  box-shadow: var(--shadow-lg);
}

.new-channel-item {
  border-style: dashed;
  background: linear-gradient(to bottom, #fff, #f5f5f5);
  color: var(--gold);
}
.new-channel-item:hover {
  background: linear-gradient(to bottom, #fffde8, #fdf3c0);
  border-style: solid;
  box-shadow: 0 10px 22px rgba(212, 175, 55, 0.4);
}

.new-channel-icon {
  background: linear-gradient(135deg, var(--gold-light), var(--gold)) !important;
  border-color: var(--gold) !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.new-channel-icon span {
  font-size: 1.5rem;
  color: #fff;
  line-height: 1;
  font-weight: 300;
}

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

.channel-name {
  font-size: 0.65rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 68px;
  z-index: 1;
}

.delete-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: var(--radius-sm);
  padding: 3px 8px;
  cursor: pointer;
  font-size: 0.8rem;
  opacity: 0.6;
  transition: opacity 0.2s ease, border-color 0.2s ease;
}
.delete-btn:hover:not(:disabled) {
  opacity: 1;
  border-color: var(--error);
}
.delete-btn:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.status {
  text-align: center;
  padding: 12px 20px;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.status.error { color: var(--error); }
.status.empty { color: #999; font-style: italic; }
</style>

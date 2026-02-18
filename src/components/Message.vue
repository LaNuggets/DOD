<script setup lang="ts">
import { watch, onMounted, ref, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import MessageRainbow from '@/components/MessageRainbow.vue'
import ModifyChannel from '@/components/ModifyChannel.vue'
import MessageBox from '@/components/MessageBox.vue'
import AddUserModal from '@/modals/AddUserModal.vue'
import InfoModal from '@/modals/InfoModal.vue'
import MembersModal from '@/modals/MembersModal.vue'
import { useStore } from '@/ts/store'
import { useChannelStore } from '@/ts/channelStore'
import { getUsernameFromToken } from '@/ts/saveload'
import { apiGetMessages, apiGetChannels, apiAddUserToChannel, apiRemoveUserFromChannel } from '@/ts/api'
import type { Message } from '@/types/messageType'
import router from '@/ts/router'

const props = defineProps<{ forcedChannelId?: string }>()

const tokenStore = useStore()
const route = useRoute()
const channelStore = useChannelStore()

// Utilise le prop si présent, sinon l'URL
const channelId = computed(() => props.forcedChannelId ?? route.params.id as string)

const channel = computed(() => channelStore.getChannel(Number(channelId.value)))
const channelName = computed(() => channel.value?.name)
const theme = computed(() => channel.value?.theme)

// Utilisateur connecté
const currentUser = computed(() => getUsernameFromToken(tokenStore.getToken()))

// Le bouton "Add user" et "Modify channel" sont réservés au créateur
const isCreator = computed(() => channel.value?.creator === currentUser.value)

const loading = ref(false)
const error = ref<string | null>(null)
const messages = ref<Message[]>([])
const adding = ref(false)
const showAddUser = ref(false)
const showMembers = ref(false)
const membersLoading = ref(false)
const membersError = ref<string | null>(null)
const channelUsers = ref<string[]>([])
const channelCreator = ref<string | null>(null)
const showInfo = ref(false)
const infoText = ref('')

let ws: WebSocket | null = null

const loadMessages = async (id: string) => {
  loading.value = true
  error.value = null
  try {
    const data = await apiGetMessages(id)
    messages.value = data.reverse()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error loading messages'
  } finally {
    loading.value = false
  }
}

const connect = (id: string) => {
  const token = tokenStore.getToken()
  ws = new WebSocket(`wss://edu.tardigrade.land/msg/ws/channel/${id}/token/${token}`)
  ws.onopen = () => console.log('✅ Connected')
  ws.onmessage = (event) => messages.value.unshift(JSON.parse(event.data) as Message)
  ws.onclose = () => console.log('❌ Disconnected')
  ws.onerror = (e) => console.error('WS Error:', e)
}

onMounted(() => {
  loadMessages(channelId.value)
  connect(channelId.value)
})

watch(() => channelId.value, (newId, oldId) => {
  if (!newId || newId === oldId) return
  messages.value = []
  ws?.close()
  loadMessages(newId)
  connect(newId)
})

onUnmounted(() => ws?.close())

const openMembers = async () => {
  const id = channelId.value
  if (!id) return
  membersLoading.value = true
  membersError.value = null
  try {
    const list = await apiGetChannels()
    const ch = list.find(c => String(c.id) === String(id))
    if (!ch) throw new Error('Channel not found')
    channelUsers.value = ch.users || []
    channelCreator.value = ch.creator || null
    showMembers.value = true
  } catch (e: unknown) {
    membersError.value = e instanceof Error ? e.message : 'Error fetching members'
  } finally {
    membersLoading.value = false
  }
}

const addUser = async (username: string) => {
  const id = channelId.value
  if (!id) return
  adding.value = true
  error.value = null
  showAddUser.value = false
  try {
    await apiAddUserToChannel(id, username)
    infoText.value = 'User added successfully'
    showInfo.value = true
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error adding user'
  } finally {
    adding.value = false
  }
}

const doBanUser = async (username: string) => {
  const id = channelId.value
  if (!id) return
  try {
    await apiRemoveUserFromChannel(id, username)
    channelUsers.value = channelUsers.value.filter(u => u !== username)
    infoText.value = username === currentUser.value ? 'You have left the channel' : 'User banned successfully'
    showInfo.value = true
    showMembers.value = false
    if (username === currentUser.value) router.push({ path: '/' })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error removing user'
  }
}
</script>

<template>
  <div class="channel-wrapper">
    <div class="channel-header">
      <h1>{{ channelName }}</h1>

      <!-- "Add user" : réservé au créateur du channel -->
      <button
        v-if="isCreator"
        class="btn btn-secondary"
        @click="showAddUser = true"
        :disabled="adding"
      >
        {{ adding ? '…' : '➕ Add user' }}
      </button>

      <!-- "Members" : accessible à tous les membres -->
      <button
        class="btn btn-secondary"
        @click="openMembers"
        :disabled="membersLoading"
      >
        {{ membersLoading ? '…' : '👥 Members' }}
      </button>

      <!-- "Modify channel" : réservé au créateur -->
      <ModifyChannel v-if="isCreator" :channel-id="channelId" />
    </div>

    <p v-if="error || membersError" class="error-text">{{ error || membersError }}</p>

    <div class="chat-content" :style="{ backgroundColor: theme?.primary_color }">
      <p v-if="loading" class="loading-text">Loading message history…</p>
      <div v-for="message in messages" :key="String(message.timestamp) + message.author">
        <MessageBox :data="message" />
      </div>
    </div>

    <MessageRainbow :channel-id="channelId" />

    <AddUserModal v-if="showAddUser" @confirm="addUser" @close="showAddUser = false" />
    <MembersModal
      v-if="showMembers"
      :users="channelUsers"
      :current-user="currentUser"
      :creator="channelCreator"
      @ban="doBanUser"
      @quit="doBanUser"
      @close="showMembers = false"
    />
    <InfoModal v-if="showInfo" :text="infoText" @close="showInfo = false" />
  </div>
</template>

<style scoped>
.channel-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: var(--black);
}

.channel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  background: linear-gradient(to bottom, var(--white-marble), #ececec);
  border-bottom: 2px solid var(--gold);
  box-shadow: 0 2px 10px rgba(212, 175, 55, 0.15);
  flex-shrink: 0;
}

.channel-header h1 {
  margin: 0;
  font-size: 1.15rem;
  letter-spacing: 3px;
  text-transform: uppercase;
}

/* Premier bouton poussé à droite */
.channel-header .btn:first-of-type {
  margin-left: auto;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 28px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-content::-webkit-scrollbar { width: 6px; }
.chat-content::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, var(--black), var(--gold-light));
  border-radius: 10px;
}

.loading-text {
  text-align: center;
  color: #999;
  font-size: 0.9rem;
  padding: 20px 0;
}

.error-text {
  flex-shrink: 0;
}
</style>

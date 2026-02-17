<script setup lang="ts">
import MessageRainbow from '@/components/MessageRainbow.vue';
import ModifyChannel from '@/components/ModifyChannel.vue';
import { useRoute } from 'vue-router';
import { watch, onMounted, ref, onUnmounted, computed} from 'vue';
import MessageBox from './MessageBox.vue';
import { useStore } from '@/ts/store';
import AddUserModal from '@/modals/AddUserModal.vue'
import InfoModal from '@/modals/InfoModal.vue'
import MembersModal from '@/modals/MembersModal.vue'
import router from '@/ts/router'
import type { Content, Message } from '@/types/message';


let ws: WebSocket | null = null
const tokenStore = useStore()
const route = useRoute();

const props = defineProps<{ forcedChannelId?: string }>()

// if there is a props use it, otherwise, use url param
const channelId = computed(() =>
  props.forcedChannelId ?? route.params.id as string
)

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
const currentUser = ref<string | null>(null)
const showInfo = ref(false)
const infoText = ref('')

async function loadMessage(id : string) {
    try {
        const token = tokenStore.getToken()
        const response = await fetch('https://edu.tardigrade.land/msg/protected/channel/'+ id +'/messages/0', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Erreur ${response.status}`)
        }
        messages.value = await response.json()
    } catch (e: unknown) {
        error.value = e instanceof Error ? e.message : 'Error during conection'
    } finally {
        loading.value = false
    }
};

const connect = (id : string) => {
    const token = tokenStore.getToken()
    ws = new WebSocket('https://edu.tardigrade.land/msg/ws/channel/'+id+'/token/'+token)
    ws.onopen = () => console.log('✅ Connecté')
    ws.onmessage = (event) => {
        messages.value.push(JSON.parse(event.data) as Message)
    }
    ws.onclose = () => console.log('❌ Déconnecté')
    ws.onerror = (error) => console.error('Erreur:', error)
}

onMounted(() => {
	loadMessage(channelId.value);
    connect(channelId.value);
});

watch(
  () => channelId.value,
  (newId, oldId) => {
    if (!newId || newId === oldId) return
    messages.value = []
    ws?.close()
    loadMessage(newId)
    connect(newId)
  }
)

onUnmounted(() => ws?.close())

const openAddUser = () => { showAddUser.value = true }

const getUsernameFromToken = (token: string | null) => {
    if (!token) return null
    try {
        const parts = token.split('.')
        if (!parts[1] || parts.length < 2) return null
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
        return payload.username || payload.preferred_username || payload.sub || payload.name || null
    } catch {
        return null
    }
}

const openMembers = async () => {
    const id = channelId.value
    if (!id) return
    membersLoading.value = true
    membersError.value = null
    try {
        const token = tokenStore.getToken()
        currentUser.value = getUsernameFromToken(token) as string | null
        const resp = await fetch('https://edu.tardigrade.land/msg/protected/user/channels', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!resp.ok) throw new Error(`Error ${resp.status}: Failed to fetch channels`)
        const list = await resp.json()
        const ch = (list as any[]).find(c => String(c.id) === String(id))
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
        const token = tokenStore.getToken()
        const resp = await fetch(`https://edu.tardigrade.land/msg/protected/channel/${id}/user/${encodeURIComponent(username)}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!resp.ok) {
            throw new Error(resp.status === 401 ? 'You do not have permission to add users to this channel' : `Error ${resp.status}: Failed to add user`)
        }
        infoText.value = 'User added successfully'
        showInfo.value = true
    } catch (e: unknown) {
        error.value = e instanceof Error ? e.message : 'Error adding user'
    } finally {
        adding.value = false
    }
}

const doBanUser = async (username: string) => {
    const id = route.params.id as string
    if (!id) return
    try {
        const token = tokenStore.getToken()
        const resp = await fetch(`https://edu.tardigrade.land/msg/protected/channel/${id}/user/${encodeURIComponent(username)}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!resp.ok) throw new Error(resp.status === 401 ? "You don't have permission to perform this action" : `Error ${resp.status}: Failed to remove user`)
        channelUsers.value = channelUsers.value.filter(u => u !== username)
        infoText.value = username === currentUser.value ? 'You have left the channel' : 'User banned successfully'
        showInfo.value = true
        showMembers.value = false
        if (username === currentUser.value) {
            router.push({ path: '/' })
        }
    } catch (e: unknown) {
        error.value = e instanceof Error ? e.message : 'Error removing user'
    }
}

</script>

<template>
  <div class="channel-wrapper">
    <!-- Header collé sous le ChannelList -->
    <div class="channel-header">
      <h1>Channel</h1>
      <button class="action-btn" @click="openAddUser" :disabled="adding">
        {{ adding ? '...' : '➕ Add user' }}
      </button>
      <button class="action-btn" @click="openMembers" :disabled="membersLoading">
        {{ membersLoading ? '...' : '👥 Members' }}
      </button>
	  <ModifyChannel :channel-id="channelId" />
    </div>

    <p v-if="error || membersError" class="error">{{ error || membersError }}</p>

    <!-- Zone de messages scrollable -->
    <div class="chat-content">
      <p v-if="loading" class="loading-text">Loading messages history...</p>
      <div v-for="message in messages" :key="String(message.timestamp) + message.author">
        <MessageBox :data="message" />
      </div>
    </div>

    <!-- Input fixé en bas -->
    <MessageRainbow :channel-id="channelId" />

    <AddUserModal v-if="showAddUser" @confirm="addUser" @close="showAddUser = false" />
    <MembersModal v-if="showMembers" :users="channelUsers" :currentUser="currentUser" :creator="channelCreator" @ban="doBanUser" @quit="doBanUser" @close="showMembers = false" />
    <InfoModal v-if="showInfo" :text="infoText" @close="showInfo = false" />
  </div>
</template>

<style scoped>
/* =========================================
   VARIABLES
   ========================================= */
.channel-wrapper {
  --gold: #d4af37;
  --gold-light: #f5d76e;
  --white-marble: #f8f8f8;
  --black: #111;

  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: 'Cinzel', serif;
  color: var(--black);
}

/* =========================================
   HEADER
   ========================================= */
.channel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  background: linear-gradient(to bottom, var(--white-marble), #ececec);
  border-bottom: 2px solid var(--gold);
  box-shadow: 0 2px 10px rgba(212, 175, 55, 0.15);
  flex-shrink: 0; /* ne rétrécit jamais */
}

.channel-header h1 {
  margin: 0;
  font-size: 1.15rem;
  letter-spacing: 3px;
  color: var(--black);
  text-transform: uppercase;
}

/* =========================================
   BOUTONS
   ========================================= */
.action-btn {
  padding: 8px 16px;
  font-size: 0.85rem;
  font-family: 'Cinzel', serif;
  font-weight: 500;
  letter-spacing: 0.5px;
  border: 2px solid var(--gold);
  border-radius: 6px;
  background: linear-gradient(to bottom, #fff, #ebebeb);
  color: var(--black);
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Le premier bouton est poussé à droite */
.action-btn:first-of-type {
  margin-left: auto;
}

.action-btn:hover:not(:disabled) {
  background: linear-gradient(to bottom, #fff, #f8f8f8);
  border-color: var(--gold-light);
  box-shadow: 0 4px 10px rgba(212, 175, 55, 0.3);
  transform: translateY(-2px);
}

.action-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.action-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  border-color: #ccc;
}

/* =========================================
   ZONE DE MESSAGES
   ========================================= */
.chat-content {
  flex: 1;          /* prend tout l'espace disponible entre header et footer */
  overflow-y: auto;
  padding: 20px 28px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-content::-webkit-scrollbar {
  width: 6px;
}

.chat-content::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, var(--gold), var(--gold-light));
  border-radius: 10px;
}

.loading-text {
  text-align: center;
  color: #999;
  font-size: 0.9rem;
  padding: 20px 0;
}

/* =========================================
   ERREUR
   ========================================= */
.error {
  color: #c0392b;
  font-size: 0.85rem;
  padding: 6px 28px;
  background: #fff0f0;
  border-left: 3px solid #c0392b;
  flex-shrink: 0;
}
</style>
<script setup lang="ts">
import MessageRainbow from '@/components/MessageRainbow.vue';
import { useRoute } from 'vue-router';
import { watch, onMounted, ref, onUnmounted} from 'vue';
import MessageBox from './MessageBox.vue';
import { useStore } from '@/ts/store';
import AddUserModal from '@/modals/AddUserModal.vue'
import InfoModal from '@/modals/InfoModal.vue'
import MembersModal from '@/modals/MembersModal.vue'
import router from '@/ts/router'

interface Content {
    type: string, // Image or Text
    value: string,
}

interface Message {
    channel_id: number,
    timestamp: Date,
    author: string,
    content: Content
};

let ws: WebSocket | null = null
const tokenStore = useStore()
const route = useRoute();
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
    messages.value.reverse()

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
        console.log(event.data)
        messages.value.unshift(JSON.parse(event.data) as Message)
    }
    ws.onclose = () => console.log('❌ Déconnecté')
    ws.onerror = (error) => console.error('Erreur:', error)
}

onMounted(() => {
	loadMessage(route.params.id as string);
    connect(route.params.id as string);
});

// Load new id on url change.
watch(
	() => route.params.id as string,
	(newId) => {
		loadMessage(newId)
        connect(newId)
	}
)

onUnmounted(() => ws?.close())

const openAddUser = () => {
	showAddUser.value = true
}

const getUsernameFromToken = (token: string | null) => {
	if (!token) return null
	try {
		const parts = token.split('.')
		if (!parts[1]) return null
		if (parts.length < 2) return null
		const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
		return payload.username || payload.preferred_username || payload.sub || payload.name || null
	} catch {
		return null
	}
}

const openMembers = async () => {
	const id = route.params.id as string
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
	const id = route.params.id as string
	if (!id) return

	adding.value = true
	error.value = null
	showAddUser.value = false
	try {
		const token = tokenStore.getToken()
		const resp = await fetch(`https://edu.tardigrade.land/msg/protected/channel/${id}/user/${encodeURIComponent(username)}`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`
			}
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

<div class="channel-messages-area">
		<div class="channel-header">
		<h1>Channel</h1>
		<button class="add-user-btn" @click="openAddUser" :disabled="adding">{{ adding ? '...' : '➕ Add user' }}</button>
		<button class="members-btn" @click="openMembers" :disabled="membersLoading">{{ membersLoading ? '...' : '👥 Members' }}</button>
	</div>
	<p v-if="error" class="error">{{ error }}</p>
    <div class="chat-content">
        <p>{{ loading ? 'Loading messages history ...' : '' }}</p>
        <p v-if="error" class="error">{{ error }}</p>
        <div v-else v-for="message in messages" > 
            <MessageBox :data="message"/>
        </div>
    </div>
	<MessageRainbow />
	<AddUserModal v-if="showAddUser" @confirm="addUser" @close="showAddUser = false" />
	<MembersModal v-if="showMembers" :users="channelUsers" :currentUser="currentUser" :creator="channelCreator" @ban="doBanUser" @quit="doBanUser" @close="showMembers = false" />
	<InfoModal v-if="showInfo" :text="infoText" @close="showInfo = false" />
	<p v-if="membersError" class="error">{{ membersError }}</p>
</div>

</template>

<style scoped>
.chat-content {
  margin-top: 150px; 
  margin-bottom: 100px; 
  overflow-y: auto;
  height: calc(100vh - 250px);
}

.channel-header {
	display: flex;
	align-items: center;
	gap: 12px;
}
.add-user-btn {
	margin-left: auto;
	padding: 6px 10px;
	border-radius: 6px;
	border: 1px solid #ccc;
	background: #fff;
	cursor: pointer;
}
.members-btn {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
}
.add-user-btn:disabled {
	opacity: 0.6;
	cursor: default;
}
.error { color: red; }
</style>
<script setup lang="ts">
import MessageRainbow from '@/components/MessageRainbow.vue';
import { useRoute } from 'vue-router';
import { watch, onMounted, ref, onUpdated, onUnmounted} from 'vue';
import MessageBox from './MessageBox.vue';
import { useStore } from '@/ts/store';

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
        console.log(event.data)
        messages.value.push(JSON.parse(event.data) as Message)
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

</script>

<template>

<div class="chat-content">
    <p>{{ loading ? 'Loading messages history ...' : '' }}</p>
    <p v-if="error" class="error">{{ error }}</p>
    <div v-else v-for="message in messages" > 
        <MessageBox :data="message"/>
    </div>
</div>
<MessageRainbow />

</template>

<style scoped>
.chat-content {
  margin-top: 150px; 
  margin-bottom: 100px; 
  overflow-y: auto;
  height: calc(100vh - 250px);
}
</style>
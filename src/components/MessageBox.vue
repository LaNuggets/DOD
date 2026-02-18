<script setup lang="ts">
import ModifyMessage from '@/modals/ModifyMessage.vue';
import { useStore } from '@/ts/store';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useChannelStore } from '@/ts/channelStore';


defineProps<{
  data: Message
}>()

interface Content {
    type: string,
    value: string,
}

interface Message {
    channel_id: number,
    timestamp: Date,
    author: string,
    content: Content
};

const tokenStore = useStore()
const showModifyMessage = ref(false)
const modify = ref(false)
const error = ref<string | null>(null)
const route = useRoute();
const id = ref(route.params.id as string);
const channelStore = useChannelStore();

const test: number = +id.value
const channel = channelStore.getChannel(test);
const theme = channel?.theme

watch(
    () => route.params.id as string,
    (newId) => { id.value = newId }
)

const openModifyMessage = () => { showModifyMessage.value = true }

const modifyMessage = async (mesage : Message) =>{
    console.log(mesage)
    const imgRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
    mesage.content.type = imgRegex.test(mesage.content.value) ? "Image" : "Text";

    modify.value = true
    error.value = null

    try {
        const token = tokenStore.getToken()
        const response = await fetch('https://edu.tardigrade.land/msg/protected/channel/'+ id.value +'/message/moderate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(mesage)
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Erreur ${response.status}`)
        }
    } catch (e: unknown) {
        error.value = e instanceof Error ? e.message : 'Error during connection'
    } finally {
        modify.value = false
    }
    showModifyMessage.value = false
}

</script>

<template>
    <div class="message-item">
        <p>{{ data.author }}</p>
        <p v-if="new Date(data.timestamp).getDate() != new Date(Date.now()).getDate()" class="time">{{ new Date(data.timestamp).toLocaleString() }}</p>
        <p v-else class="time">{{ new Date(data.timestamp).getHours() + ":" + new Date(data.timestamp).getMinutes()}}</p>
        <p v-if="data.content.type == 'Text'">{{ data.content.value }}</p>
        <img v-else :src="data.content.value" />
        <button class="action-btn" @click="openModifyMessage" :disabled="modify">
            {{ modify ? '...' : 'Modify' }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
        <ModifyMessage v-if="showModifyMessage" @confirm="modifyMessage" @close="showModifyMessage = false" :data="data"/>
    </div>
</template>

<style scoped>
:root {
  --sky-blue: #cfe9ff;
  --deep-sky: #87cfff;
  --gold: #d4af37;
  --gold-light: #f5d76e;
  --white-marble: #f8f8f8;
  --black: #111;
}
/* ============================= */ /* STYLE GLOBAL COMMUN */ /* ============================= */ 
.message-item {   
    font-family: 'Cinzel', serif;   
    color: v-bind('theme?.text_color'); } 
/* ============================= */ /* AFFICHAGE D’UN MESSAGE */ /* ============================= */ 
.message-item {   
    margin: 15px 0;   
    padding: 15px 20px;   
    border: 2px solid v-bind('theme?.accent_color');   
    border-radius: 15px;   
    background: linear-gradient(to bottom, v-bind('theme?.primary_color_dark'), #f3f3f3);   
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);   
    max-width: 500px;   
    margin-left: auto;   
    margin-right: auto;   
    transition: transform 0.2s ease; } 
.message-item:hover {   
    transform: scale(1.02); } 
.message-item p {   
    margin: 5px 0;   
    word-wrap: break-word; } 
.message-item p:first-child {   
    color: v-bind('theme?.accent_text_color');   
    font-weight: bold;   
    font-size: 1rem; } 
.message-item img {   
    display: block;  
    max-width: 100%;   
    border-radius: 10px;   
    border: 2px solid v-bind('theme?.accent_color');   
    margin-top: 10px; } 
/* ============================= */ /* TIMESTAMP */ /* ============================= */ 
.message-item time {   
    display: block;   
    font-size: 0.8rem;   
    color: #666;   
    margin-bottom: 5px;   
    text-align: right; }
</style>
<script setup lang="ts">
import type { Message } from '@/types/message';

defineProps<{
  data: Message
}>()

</script>

<template>
    <div class="message-item">
        <p>{{ data.author }}</p>
        <p v-if="new Date(data.timestamp).getDate() != new Date(Date.now()).getDate()" class="time">{{ new Date(data.timestamp).toLocaleString() }}</p>
        <p v-else class="time">{{ new Date(data.timestamp).getHours() + ":" + new Date(data.timestamp).getMinutes()}}</p>
        <p v-if="data.content.type == 'Text'">{{ data.content.value }}</p>
        <img v-else :src="data.content.value" />
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
    color: var(--black); } 
/* ============================= */ /* AFFICHAGE D’UN MESSAGE */ /* ============================= */ 
.message-item {   
    margin: 15px 0;   
    padding: 15px 20px;   
    border: 2px solid var(--gold);   
    border-radius: 15px;   
    background: linear-gradient(to bottom, var(--white-marble), #f3f3f3);   
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
    color: var(--gold);   
    font-weight: bold;   
    font-size: 1rem; } 
.message-item img {   
    display: block;  
    max-width: 100%;   
    border-radius: 10px;   
    border: 2px solid var(--gold);   
    margin-top: 10px; } 
/* ============================= */ /* TIMESTAMP */ /* ============================= */ 
.message-item time {   
    display: block;   
    font-size: 0.8rem;   
    color: #666;   
    margin-bottom: 5px;   
    text-align: right; }
</style>
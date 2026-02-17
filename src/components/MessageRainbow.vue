<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from 'vue';
import { useStore } from '@/ts/store'
import { watch } from 'vue';

interface Message {
    type: string, // Image or Text
    value: string,
};

const message : Message = {
  type : '',
  value : '',
}

const tokenStore = useStore()

const route = useRoute();
const id = ref(route.params.id as string);

// Load new id on url change.
watch(
	() => route.params.id as string,
	(newId) => {
		id.value = newId
	}
)

const loading = ref(false)
const error = ref<string | null>(null)
    
const postMessage = async () => {

    // Define the image type
    const imgRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
    if (imgRegex.test(message.value)){
        message.type = "Image";
    }
    else {
        message.type = "Text";
    }

    // Verify the user is conected to a chanel
    if (id.value == undefined) {
        error.value = "You'r curently outside a chanel you c'ant post message !"
        return
    }
    loading.value = true
    error.value = null

    try {
        const requestBody: Message = message
        const token = tokenStore.getToken()
    
        const response = await fetch("https://edu.tardigrade.land/msg/protected/channel/"+ id.value +"/message", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erreur ${response.status}`)
    }

    const data = await response.json()

    } catch (e: unknown) {
        error.value = e instanceof Error ? e.message : 'Error during conection'
    } finally {
        loading.value = false
    }
};
</script>

<template>
    <form @submit.prevent="postMessage" class="message-form">
        <input 
            v-model="message.value"
            type="text" 
            required 
            placeholder="message..."
        />
        <button type="submit" :disabled="loading">
		      {{ loading ? 'Posting...' : 'Post' }}
        </button>
        
        <p v-if="error" class="error">{{ error }}</p>
    </form>
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
.message-form {   
    font-family: 'Cinzel', serif;   
    color: var(--black); } 
/* ============================= */ /* FORMULAIRE D’ENVOI DE MESSAGE */ /* ============================= */ 
.message-form {   
    display: flex;   
    align-items: center;   
    justify-content: center;   
    gap: 15px;   
    padding: 20px;   
    background: linear-gradient(to bottom, white, var(--sky-blue));   
    border-top: 3px solid var(--gold);   
    border-bottom: 3px solid var(--gold);   
    box-shadow: 0 6px 15px rgba(0,0,0,0.1); } 
.message-form input[type="text"] {   
    flex: 1;   
    padding: 10px 15px;   
    border: 2px solid var(--gold);   
    border-radius: 25px;   
    font-size: 1rem;   
    background: var(--white-marble);   
    transition: all 0.3s ease; } 
.message-form input[type="text"]:focus {   
    outline: none;   
    box-shadow: 0 0 10px rgba(212,175,55,0.6);   
    border-color: var(--gold-light);   
    background: white; } 
.message-form button {   
    background: linear-gradient(to bottom, var(--gold-light), var(--gold));  
    border: none;   
    border-radius: 25px;   
    color: var(--gold);   
    font-weight: bold;   
    padding: 10px 25px;   
    cursor: pointer;   
    transition: all 0.3s ease;   
    box-shadow: 0 4px 8px rgba(0,0,0,0.2); } 
.message-form button:hover:not(:disabled) {  
    transform: translateY(-2px);   
    box-shadow: 0 8px 15px rgba(212,175,55,0.6); } 
.message-form button:disabled {   
    opacity: 0.6;   cursor: not-allowed; } 
.message-form .error {   
    width: 100%;   
    text-align: center;   
    margin-top: 10px;   
    color: red;   
    font-size: 0.9rem; } 
.message-form {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}
</style>
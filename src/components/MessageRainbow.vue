<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from 'vue';
import { useStore } from '@/ts/store'

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
const id = route.params.id as string;

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
    console.log(message)

    // Verify the user is conected to a chanel
    if (id == undefined) {
        error.value = "You'r curently outside a chanel you c'ant post message !"
        return
    }
    loading.value = true
    error.value = null

    try {
        const requestBody: Message = message
        const token = tokenStore.getToken()
    
        const response = await fetch("https://edu.tardigrade.land/msg/protected/channel/"+ id +"/message", {
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
        <div>
            <input 
                v-model="message.value"
                type="text" 
                required 
                placeholder="message..."
            />
        </div>
        <button type="submit" :disabled="loading">
		      {{ loading ? 'Posting...' : 'Post' }}
        </button>
        
        <p v-if="error" class="error">{{ error }}</p>
    </form>
</template>

<style scoped></style>
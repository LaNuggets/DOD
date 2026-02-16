<script setup lang="ts">
import { saveToken } from '@/ts/saveload.ts';
import router from "@/ts/router";
import { ref } from 'vue';

interface Message {
    type: string, // Image or 
    value: string,
};


const message : Message = {
  type : '',
  value : '',
}

const loading = ref(false)
const error = ref<string | null>(null)
    
const postMessage = async () => {

    // Define the image type
    if (message.value) {

    } else {
        message.type = "";
    };

    loading.value = true
    error.value = null

    try {
        const requestBody: Message = message
    
        const response = await fetch("https://edu.tardigrade.land/msg/protected/channel/"+ 1 +"/message", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erreur ${response.status}`)
    }

    const data: Response = await response.json()

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
        
        <p v-if="error" class="error">{{ error }}</p>
    
        <button type="submit" :disabled="loading">
		      {{ loading ? 'Posting...' : 'Post' }}
        </button>
    </form>
</template>

<style scoped></style>
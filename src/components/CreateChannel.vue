<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/ts/store'
import type { ChannelMetaData, CreateChannelResponse }  from '@/types/channel';

const form: ChannelMetaData = {
  name: '',
  img: ''
}

const tokenStore = useStore()
const router = useRouter()
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const createdChannel = ref<CreateChannelResponse | null>(null)

const createChannel = async () => {
  if (!form.name || form.name.trim() === '') {
    error.value = 'Channel name is required'
    return
  }

  loading.value = true
  error.value = null
  success.value = false

  try {
    const token = tokenStore.getToken()

    const requestBody: ChannelMetaData = {
      name: form.name.trim()
    }

    const trimmedImg = form.img?.trim()
    if (trimmedImg) {
      requestBody.img = trimmedImg
    }

    const response = await fetch('https://edu.tardigrade.land/msg/protected/channel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Error ${response.status}`)
    }

    const data: CreateChannelResponse = await response.json()
    createdChannel.value = data
    success.value = true
    router.push({ name: 'Home' })
    
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error creating channel'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="create-channel">
    <h2>Create Channel</h2>
    
    <form @submit.prevent="createChannel" class="channel-form">
      <div>
        <label for="name">Channel Name *</label>
        <input 
          id="name"
          v-model="form.name" 
          type="text" 
          required 
          placeholder="Enter channel name"
        />
      </div>

      <div>
        <label for="img">Image URL</label>
        <input 
          id="img"
          v-model="form.img" 
          type="url" 
          placeholder="Enter image URL (optional)"
        />
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Creating...' : 'Create Channel' }}
      </button>

      <p v-if="success && createdChannel" class="success">
        Channel "{{ createdChannel.name }}" created successfully!
      </p>
    </form>
  </div>
</template>

<style scoped>

</style>
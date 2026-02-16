<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from '@/ts/store'

interface Channel {
  id: number
  name: string
  img?: string
  creator: string
  theme?: object
  users: string[]
}

const tokenStore = useStore()
const channels = ref<Channel[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchChannels = async () => {
  loading.value = true
  error.value = null

  try {
    const token = tokenStore.getToken()

    const response = await fetch('https://edu.tardigrade.land/msg/protected/user/channels', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: Failed to fetch channels`)
    }

    channels.value = await response.json()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error fetching channels'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchChannels()
})
</script>

<template>
  <div class="channel-list">
    <h2>Channels</h2>
    
    <p v-if="loading" class="loading">Loading channels...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="!loading && channels.length === 0" class="empty">
      No Channels found. Create or join a channel to get started!
    </div>

    <div v-if="!loading && channels.length > 0" class="channels">
      <RouterLink 
        v-for="channel in channels"
        :key="channel.id"
        :to="`/channel/${channel.id}`"
        class="channel-item"
      >
        <div v-if="channel.img" class="channel-img">
          <img :src="channel.img" :alt="channel.name" />
        </div>
        <div v-else class="channel-img placeholder">
          <img src="../assets/Olympians.webp" alt="default channel image" />
        </div>
        <div class="channel-info">
          <h3>{{ channel.name }}</h3>
          <p class="creator">by {{ channel.creator }}</p>
          <p class="users">{{ channel.users.length }} user(s)</p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>

</style>
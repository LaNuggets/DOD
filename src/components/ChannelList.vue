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
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet">

:root {
  --sky-blue: #cfe9ff;
  --deep-sky: #87cfff;
  --gold: #d4af37;
  --gold-light: #f5d76e;
  --white-marble: #f8f8f8;
  --black: #111;
}

/* ============================= */
/* CONTAINER PRINCIPAL */
/* ============================= */
.channel-list {
  min-height: 100vh;
  background: linear-gradient(to bottom, var(--sky-blue), white);
  font-family: 'Cinzel', serif;
  color: var(--black);
  padding: 0;
}

/* TITRE */
.channel-list h2 {
  text-align: center;
  padding: 25px 0;
  font-size: 2.2rem;
  letter-spacing: 3px;
  color: var(--gold);
  text-shadow: 0 0 10px rgba(212,175,55,0.5);
}

/* ============================= */
/* BARRE HORIZONTALE DES COLONNES */
/* ============================= */
.channels {
  display: flex;
  gap: 25px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 20px 30px;
  background: linear-gradient(to bottom, white, #f3f3f3);
  border-top: 3px solid var(--gold);
  border-bottom: 3px solid var(--gold);
  scroll-behavior: smooth;
}

/* Scrollbar dorée */
.channels::-webkit-scrollbar {
  height: 10px;
}

.channels::-webkit-scrollbar-thumb {
  background: linear-gradient(to right, var(--gold), var(--gold-light));
  border-radius: 10px;
}

/* ============================= */
/* MINI COLONNES */
/* ============================= */
.channel-item {
  flex: 0 0 90px;
  height: 100px;
  background: linear-gradient(to bottom, var(--white-marble), #eaeaea);
  border-radius: 60px 60px 15px 15px;
  border: 3px solid var(--gold);
  text-decoration: none;
  color: var(--black);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 8px 15px rgba(0,0,0,0.15);
}

/* Ligne des colonnes */
.channel-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 70%;
  height: 100%;
  transform: translateX(-50%);
  background: repeating-linear-gradient(
    to right,
    rgba(0,0,0,0.04),
    rgba(0,0,0,0.04) 3px,
    transparent 3px,
    transparent 9px
  );
  border-radius: 60px 60px 15px 15px;
  pointer-events: none;
}

/* Hover style */
.channel-item:hover {
  transform: translateY(-6px) scale(1.08);
  box-shadow: 0 12px 25px rgba(212,175,55,0.6);
}

/* ============================= */
/* IMAGE */
/* ============================= */
.channel-img {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--gold);
  margin-bottom: 8px;
  z-index: 1;
}

.channel-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ============================= */
/* TEXTE SIMPLIFIÉ */
/* ============================= */
.channel-info {
  text-align: center;
  z-index: 1;
}

.channel-info h3 {
  font-size: 0.7rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70px;
}

.creator,
.users {
  display: none;
}

/* ============================= */
/* MESSAGES */
/* ============================= */
.loading,
.error,
.empty {
  text-align: center;
  padding: 20px;
}

</style>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import ModifyMessage from '@/modals/ModifyMessage.vue'
import { useStore } from '@/ts/store'
import { useChannelStore } from '@/ts/channelStore'
import { getUsernameFromToken } from '@/ts/saveload'
import { apiModerateMessage } from '@/ts/api'
import type { Message } from '@/types/messageType'

const props = defineProps<{ data: Message }>()

const tokenStore = useStore()
const route = useRoute()
const channelStore = useChannelStore()

const channelId = computed(() => route.params.id as string)
const channel = computed(() => channelStore.getChannel(Number(channelId.value)))
const theme = computed(() => channel.value?.theme)

// Modify button only for creator
const currentUser = computed(() => getUsernameFromToken(tokenStore.getToken()))
const isCreator = computed(() => channel.value?.creator === currentUser.value)

const showModifyMessage = ref(false)
const modifying = ref(false)
const error = ref<string | null>(null)

const formatTime = (timestamp: Date) => {
  const date = new Date(timestamp)
  const now = new Date()
  if (date.getDate() !== now.getDate()) return date.toLocaleString()
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

const imgRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i

const modifyMessage = async (message: Message) => {
  message.content.type = imgRegex.test(message.content.value) ? 'Image' : 'Text'
  modifying.value = true
  error.value = null
  try {
    await apiModerateMessage(channelId.value, message)
    showModifyMessage.value = false
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error moderating message'
  } finally {
    modifying.value = false
  }
}
</script>

<template>
  <div
    class="message-item"
    :style="{
      color: theme?.text_color,
      borderColor: theme?.accent_color,
      background: `linear-gradient(to bottom, ${theme?.primary_color_dark ?? '#e8e8e8'}, #f3f3f3)`,
    }"
  >
    <p class="author" :style="{ color: theme?.accent_text_color }">{{ data.author }}</p>
    <p class="time">{{ formatTime(data.timestamp) }}</p>

    <p v-if="data.content.type === 'Text'">{{ data.content.value }}</p>
    <img v-else :src="data.content.value" :style="{ borderColor: theme?.accent_color }" />

     <!-- Moderate button only for creator -->
    <button
      v-if="isCreator"
      class="btn btn-ghost modify-btn"
      @click="showModifyMessage = true"
      :disabled="modifying"
    >
      {{ modifying ? '…' : 'Moderate' }}
    </button>

    <p v-if="error" class="error-text">{{ error }}</p>

    <ModifyMessage
      v-if="showModifyMessage"
      :data="data"
      @confirm="modifyMessage"
      @close="showModifyMessage = false"
    />
  </div>
</template>

<style scoped>
.message-item {
  margin: 15px 0;
  padding: 15px 20px;
  border: 2px solid;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  transition: transform 0.2s ease;
}
.message-item:hover { transform: scale(1.02); }

.message-item p { margin: 5px 0; word-wrap: break-word; }

.author { font-weight: bold; font-size: 1rem; }

.time {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 5px;
  text-align: right;
}

.message-item img {
  display: block;
  max-width: 100%;
  border-radius: 10px;
  border: 2px solid;
  margin-top: 10px;
}

.modify-btn {
  margin-top: 8px;
  padding: 4px 12px;
  font-size: 0.75rem;
  border-radius: var(--radius-sm);
}
</style>

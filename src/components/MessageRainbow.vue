<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiPostMessage } from '@/ts/api'
import type { Content } from '@/types/messageType'

const props = defineProps<{ channelId?: string }>()
const route = useRoute()

const id = computed(() => props.channelId ?? route.params.id as string)

const message = reactive<Content>({ type: '', value: '' })
const loading = ref(false)
const error = ref<string | null>(null)

const imgRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i

const postMessage = async () => {
  if (!id.value) {
    error.value = "You're not in a channel — can't post a message."
    return
  }

  loading.value = true
  error.value = null

  try {
    message.type = imgRegex.test(message.value) ? 'Image' : 'Text'
    await apiPostMessage(id.value, { ...message })
    message.value = ''
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error posting message'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="postMessage" class="message-form">
    <input
      v-model="message.value"
      class="input-base message-input"
      type="text"
      required
      placeholder="Message…"
    />
    <button type="submit" class="btn btn-primary" :disabled="loading">
      {{ loading ? 'Posting…' : 'Post' }}
    </button>
    <p v-if="error" class="error-text full-width">{{ error }}</p>
  </form>
</template>

<style scoped>
.message-form {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 24px;
  background: linear-gradient(to top, var(--sky), var(--white-marble));
  border-top: 3px solid var(--gold);
  box-shadow: 0 -4px 12px rgba(212, 175, 55, 0.12);
}

.message-input {
  flex: 1;
  min-width: 0;
  border-radius: var(--radius-lg);
}

.full-width { width: 100%; text-align: center; }
</style>

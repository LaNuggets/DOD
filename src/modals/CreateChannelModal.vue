<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useChannelStore } from '@/ts/channelStore'
import { apiCreateChannel, apiGetChannels } from '@/ts/api'
import type { ChannelMetaData } from '@/types/channel'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const channelStore = useChannelStore()

const form = reactive<ChannelMetaData>({
  name: '',
  img: '',
})

const loading = ref(false)
const error = ref<string | null>(null)

const createChannel = async () => {
  if (!form.name?.trim()) {
    error.value = 'Channel name is required'
    return
  }
  loading.value = true
  error.value = null
  try {
    const requestBody: ChannelMetaData = { name: form.name.trim() }
    if (form.img?.trim()) requestBody.img = form.img.trim()

    await apiCreateChannel(requestBody)

    // Refresh the channel list
    const channels = await apiGetChannels()
    channelStore.setChannels(channels)

    emit('created')
    emit('close')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error creating channel'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card" style="max-width: 440px; animation: slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden;">

      <div class="modal-header">
        <span class="modal-icon">✦</span>
        <h3>New Channel</h3>
        <button class="close-x" @click="$emit('close')" aria-label="Close">✕</button>
      </div>

      <div class="modal-body">
        <div class="field">
          <label for="ch-name">Channel name <span class="required">*</span></label>
          <input
            id="ch-name"
            v-model="form.name"
            class="input-base"
            type="text"
            placeholder="general, design, random…"
            autocomplete="off"
            @keyup.enter="createChannel"
          />
        </div>

        <div class="field">
          <label for="ch-img">Image (URL)</label>
          <input
            id="ch-img"
            v-model="form.img"
            class="input-base"
            type="url"
            placeholder="https://… (optional)"
            autocomplete="off"
          />
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>
      </div>

      <div class="modal-footer">
        <button class="btn btn-ghost" @click="$emit('close')">Cancel</button>
        <button class="btn btn-primary" @click="createChannel" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'Creating…' : 'Create channel' }}
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.required { color: var(--error); }
</style>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useChannelStore } from '@/ts/channelStore'
import { apiGetChannels, apiUpdateChannelMetadata } from '@/ts/api'
import type { ChannelNewMetaData, Theme } from '@/types/channel'

const props = defineProps<{ channelId: string }>()

const channelStore = useChannelStore()

const showPopup = ref(false)
const error = ref<string | null>(null)

const baseTheme: Theme = {
  primary_color: '#FFFFFF',
  primary_color_dark: '#1C1C1C',
  accent_color: '#FFD700',
  text_color: '#1C1C1C',
  accent_text_color: '#FFFFFF',
}

const form = reactive<ChannelNewMetaData>({
  name: null,
  img: null,
  theme: { ...baseTheme },
})

const colorInputs = reactive({ ...baseTheme })

watch(showPopup, async (isOpen) => {
  if (isOpen) await loadChannelData()
})

const loadChannelData = async () => {
  error.value = null
  try {
    const list = await apiGetChannels()
    const ch = list.find(c => c.id === Number(props.channelId))
    if (ch) {
      form.name = ch.name
      form.img = ch.img ?? null
      const theme = ch.theme ?? baseTheme
      form.theme = { ...theme }
      Object.assign(colorInputs, { ...theme })
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error fetching channel data'
  }
}

const submitForm = async () => {
  error.value = null
  const requestBody: ChannelNewMetaData = {
    name: form.name?.trim() || null,
    img: form.img?.trim() || null,
    theme: {
      primary_color: colorInputs.primary_color.toUpperCase(),
      primary_color_dark: colorInputs.primary_color_dark.toUpperCase(),
      accent_color: colorInputs.accent_color.toUpperCase(),
      text_color: colorInputs.text_color.toUpperCase(),
      accent_text_color: colorInputs.accent_text_color.toUpperCase(),
    },
  }
  try {
    await apiUpdateChannelMetadata(props.channelId, requestBody)
    channelStore.updateChannel({ id: Number(props.channelId), ...requestBody })
    showPopup.value = false
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error during modification.'
  }
}
</script>

<template>
  <div>
    <button class="btn btn-secondary" @click="showPopup = true">⚙️ Modify channel</button>

    <div v-if="showPopup" class="modal-backdrop" @click.self="showPopup = false">
      <div class="modal-card popup">

        <div class="modal-header">
          <h3>Modify Channel</h3>
          <button class="close-x" @click="showPopup = false">✕</button>
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>

        <div class="modal-body">
          <div class="field">
            <label>Channel name</label>
            <input class="input-base" type="text" v-model="form.name" />
          </div>

          <div class="field">
            <label>Channel image (URL)</label>
            <input class="input-base" type="url" v-model="form.img" placeholder="https://…" />
          </div>

          <div class="field">
            <label>Theme colors</label>
            <div class="color-row">
              <label class="color-label">
                <input type="color" v-model="colorInputs.primary_color" />
                Background
              </label>
              <label class="color-label">
                <input type="color" v-model="colorInputs.primary_color_dark" />
                Message fade
              </label>
              <label class="color-label">
                <input type="color" v-model="colorInputs.accent_color" />
                Border
              </label>
              <label class="color-label">
                <input type="color" v-model="colorInputs.text_color" />
                Text
              </label>
              <label class="color-label">
                <input type="color" v-model="colorInputs.accent_text_color" />
                Author
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-ghost" @click="showPopup = false">Cancel</button>
          <button class="btn btn-primary" @click="submitForm">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup {
  max-width: 480px;
  animation: slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.color-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.color-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #555;
  cursor: pointer;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 400;
}

input[type="color"] {
  -webkit-appearance: none;
  appearance: none;
  width: 32px;
  height: 32px;
  border: 1.5px solid rgba(212, 175, 55, 0.5);
  border-radius: var(--radius-sm);
  cursor: pointer;
  padding: 2px;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
}
input[type="color"]:hover {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
}
</style>

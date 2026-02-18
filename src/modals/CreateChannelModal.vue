<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useStore } from '@/ts/store'
import type { ChannelMetaData, CreateChannelResponse } from '@/types/channel'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', channel: CreateChannelResponse): void
}>()

const form = reactive<ChannelMetaData>({
  name: '',
  img: ''
})

const tokenStore = useStore()
const loading = ref(false)
const error = ref<string | null>(null)

const createChannel = async () => {
  if (!form.name || form.name.trim() === '') {
    error.value = 'Le nom du channel est requis'
    return
  }

  loading.value = true
  error.value = null

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
      throw new Error(errorData.message || `Erreur ${response.status}`)
    }

    const data: CreateChannelResponse = await response.json()
    emit('created', data)
    emit('close')

  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Erreur lors de la création'
  } finally {
    loading.value = false
  }
}

const close = () => emit('close')
</script>

<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-card">

      <div class="modal-header">
        <h3>✦ Nouveau Channel</h3>
        <button class="close-btn" @click="close" aria-label="Fermer">✕</button>
      </div>

      <div class="modal-body">
        <div class="field">
          <label for="ch-name">Nom du channel <span class="required">*</span></label>
          <input
            id="ch-name"
            v-model="form.name"
            type="text"
            placeholder="ex: général, design, random…"
            autocomplete="off"
            @keyup.enter="createChannel"
          />
        </div>

        <div class="field">
          <label for="ch-img">Image (URL)</label>
          <input
            id="ch-img"
            v-model="form.img"
            type="url"
            placeholder="https://…  (optionnel)"
            autocomplete="off"
          />
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="close">Annuler</button>
        <button class="btn-create" @click="createChannel" :disabled="loading">
          <span v-if="loading" class="spinner-inline"></span>
          {{ loading ? 'Création…' : 'Créer le channel' }}
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ── Backdrop ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  padding: 16px;
  z-index: 1000;
  animation: fadeIn 0.18s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── Card ── */
.modal-card {
  width: 100%;
  max-width: 440px;
  background: linear-gradient(160deg, #fff 50%, #fdf8e8 100%);
  border: 2px solid #d4af37;
  border-radius: 16px;
  font-family: 'Cinzel', serif;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(212,175,55,0.15);
  animation: slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

/* ── Header ── */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 14px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.25);
}

.modal-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111;
  letter-spacing: 1px;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #999;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
  line-height: 1;
}

.close-btn:hover {
  color: #111;
  background: rgba(212, 175, 55, 0.12);
}

/* ── Body ── */
.modal-body {
  padding: 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #444;
  letter-spacing: 0.4px;
}

.required {
  color: #c0392b;
}

.field input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  border: 2px solid #e0c96a;
  border-radius: 10px;
  background: #fffef8;
  color: #111;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field input:focus {
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
}

.field input::placeholder {
  color: #bbb;
  font-style: italic;
}

/* ── Error ── */
.error-msg {
  margin: 0;
  padding: 8px 12px;
  font-size: 0.78rem;
  color: #c0392b;
  background: #fff0f0;
  border-left: 3px solid #c0392b;
  border-radius: 4px;
}

/* ── Footer ── */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 22px 18px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.btn-cancel {
  padding: 9px 20px;
  font-family: 'Cinzel', serif;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  color: #666;
  background: transparent;
  border: 2px solid #ccc;
  border-radius: 22px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  border-color: #999;
  color: #333;
}

.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 22px;
  font-family: 'Cinzel', serif;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #111;
  background: linear-gradient(to bottom, #f5d76e, #d4af37);
  border: none;
  border-radius: 22px;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(212, 175, 55, 0.35);
  transition: all 0.2s;
}

.btn-create:hover:not(:disabled) {
  background: linear-gradient(to bottom, #fce47c, #e0ba3e);
  box-shadow: 0 5px 16px rgba(212, 175, 55, 0.5);
  transform: translateY(-1px);
}

.btn-create:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(212, 175, 55, 0.3);
}

.btn-create:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* ── Spinner inline ── */
.spinner-inline {
  display: inline-block;
  width: 13px;
  height: 13px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: #111;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from 'vue';
import { useStore } from '@/ts/store'
import { watch } from 'vue';
import type { Content } from '@/types/messageType';

const message : Content = { type: '', value: '' }
const tokenStore = useStore()
const route = useRoute();
const id = ref(route.params.id as string);

watch(
    () => route.params.id as string,
    (newId) => { id.value = newId }
)

const loading = ref(false)
const error = ref<string | null>(null)

const postMessage = async () => {
    const imgRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
    message.type = imgRegex.test(message.value) ? "Image" : "Text";

    if (id.value == undefined) {
        error.value = "You're not in a channel — can't post a message."
        return
    }
    loading.value = true
    error.value = null

    try {
        const token = tokenStore.getToken()
        const response = await fetch("https://edu.tardigrade.land/msg/protected/channel/" + id.value + "/message", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(message)
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Erreur ${response.status}`)
        }
        message.value = ''
    } catch (e: unknown) {
        error.value = e instanceof Error ? e.message : 'Error during connection'
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <form @submit.prevent="postMessage" class="message-form">
    <input
      v-model="message.value"
      type="text"
      required
      placeholder="message..."
    />
    <button type="submit" :disabled="loading">
      {{ loading ? 'Posting...' : 'Post' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<style scoped>
.message-form {
  --gold: #d4af37;
  --gold-light: #f5d76e;
  --sky: #dff0ff;
  --white-marble: #f8f8f8;

  /* Colle naturellement en bas du flex parent */
  flex-shrink: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 24px;
  background: linear-gradient(to top, var(--sky), var(--white-marble));
  border-top: 3px solid var(--gold);
  box-shadow: 0 -4px 12px rgba(212, 175, 55, 0.12);
  font-family: 'Cinzel', serif;
}

/* =========================================
   INPUT
   ========================================= */
.message-form input[type="text"] {
  flex: 1;
  min-width: 0; /* évite le débordement sur petits écrans */
  padding: 10px 18px;
  border: 2px solid var(--gold);
  border-radius: 25px;
  font-size: 0.95rem;
  font-family: 'Cinzel', serif;
  background: var(--white-marble);
  color: #111;
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}

.message-form input[type="text"]:focus {
  outline: none;
  border-color: var(--gold-light);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
  background: white;
}

/* =========================================
   BOUTON ENVOYER
   ========================================= */
.message-form button {
  padding: 10px 28px;
  border: none;
  border-radius: 25px;
  background: linear-gradient(to bottom, var(--gold-light), var(--gold));
  color: #5a3e00;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 3px 8px rgba(212, 175, 55, 0.4);
  white-space: nowrap;
}

.message-form button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(212, 175, 55, 0.5);
}

.message-form button:active:not(:disabled) {
  transform: translateY(0);
}

.message-form button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* =========================================
   ERREUR
   ========================================= */
.message-form .error {
  width: 100%;
  text-align: center;
  color: #c0392b;
  font-size: 0.82rem;
  margin: 0;
}
</style>
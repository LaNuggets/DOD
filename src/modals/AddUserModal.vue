<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['confirm', 'close'])
const username = ref('')

const confirm = () => {
  if (!username.value.trim()) return
  emit('confirm', username.value.trim())
  username.value = ''
}

const close = () => {
  username.value = ''
  emit('close')
}
</script>

<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <span class="modal-icon">➕</span>
        <h3>Add user to channel</h3>
      </div>
      <input
        v-model="username"
        placeholder="Username (e.g. a.dupont)"
        @keyup.enter="confirm"
        autofocus
      />
      <div class="actions">
        <button class="btn-cancel" @click="close">Cancel</button>
        <button class="btn-confirm" @click="confirm" :disabled="!username.trim()">Add</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* =========================================
   BACKDROP
   ========================================= */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

/* =========================================
   CARD
   ========================================= */
.modal-card {
  --gold: #d4af37;
  --gold-light: #f5d76e;
  --white-marble: #f8f8f8;
  --black: #111;

  background: linear-gradient(160deg, #fff 60%, #fdf6e3);
  border: 2px solid var(--gold);
  border-radius: 12px;
  padding: 28px 32px;
  width: 100%;
  max-width: 380px;
  box-shadow:
    0 0 0 1px rgba(212, 175, 55, 0.15),
    0 20px 50px rgba(0, 0, 0, 0.25);
  font-family: 'Cinzel', serif;
  color: var(--black);
  animation: modal-in 0.2s ease;
}

@keyframes modal-in {
  from { opacity: 0; transform: translateY(-12px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* =========================================
   HEADER
   ========================================= */
.modal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
}

.modal-icon {
  font-size: 1.2rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1rem;
  letter-spacing: 1.5px;
  color: var(--black);
}

/* =========================================
   INPUT
   ========================================= */
.modal-card input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 16px;
  border: 2px solid var(--gold);
  border-radius: 25px;
  font-family: 'Cinzel', serif;
  font-size: 0.9rem;
  background: var(--white-marble);
  color: var(--black);
  margin-bottom: 20px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.modal-card input:focus {
  outline: none;
  border-color: var(--gold-light);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
  background: white;
}

.modal-card input::placeholder {
  color: #bbb;
  font-style: italic;
}

/* =========================================
   ACTIONS
   ========================================= */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel,
.btn-confirm {
  padding: 9px 22px;
  border-radius: 25px;
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: transparent;
  border: 2px solid #ccc;
  color: #666;
}

.btn-cancel:hover {
  border-color: #aaa;
  color: #333;
}

.btn-confirm {
  background: linear-gradient(to bottom, var(--gold-light), var(--gold));
  border: none;
  color: #5a3e00;
  box-shadow: 0 3px 8px rgba(212, 175, 55, 0.4);
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(212, 175, 55, 0.5);
}

.btn-confirm:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
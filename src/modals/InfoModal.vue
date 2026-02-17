<script setup lang="ts">
const props = defineProps<{ text?: string; okLabel?: string }>()
const emit = defineEmits(['close'])
const close = () => emit('close')
</script>

<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <span class="modal-icon">✅</span>
        <h3>Info</h3>
      </div>
      <p class="modal-message">{{ text || '' }}</p>
      <div class="actions">
        <button class="btn-confirm" @click="close">{{ okLabel || 'OK' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  max-width: 340px;
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

.modal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
}

.modal-icon { font-size: 1.2rem; }

.modal-header h3 {
  margin: 0;
  font-size: 1rem;
  letter-spacing: 1.5px;
}

.modal-message {
  margin: 0 0 24px;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #444;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.btn-confirm {
  padding: 9px 28px;
  border-radius: 25px;
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  background: linear-gradient(to bottom, var(--gold-light), var(--gold));
  border: none;
  color: #5a3e00;
  box-shadow: 0 3px 8px rgba(212, 175, 55, 0.4);
  transition: all 0.2s ease;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(212, 175, 55, 0.5);
}
</style>
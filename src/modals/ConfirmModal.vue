<script setup lang="ts">

const props = defineProps<{ message?: string; confirmLabel?: string; cancelLabel?: string }>()
const emit = defineEmits(['confirm','close'])

const doConfirm = () => emit('confirm')
const doClose = () => emit('close')
</script>

<template>
  <div class="modal-backdrop" @click.self="doClose">
    <div class="modal-card">
      <p>{{ message || 'Confirm action?' }}</p>
      <div class="actions">
        <button @click="doClose">{{ cancelLabel || 'Cancel' }}</button>
        <button @click="doConfirm">{{ confirmLabel || 'OK' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;z-index:1000}
.modal-card{background:#fff;padding:16px;border-radius:8px;min-width:260px;box-shadow:0 8px 24px rgba(0,0,0,0.2)}
.actions{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}
.actions button{padding:6px 10px;border-radius:4px;border:1px solid #bbb;background:#fff;cursor:pointer}
</style>
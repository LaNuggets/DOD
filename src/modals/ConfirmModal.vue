<script setup lang="ts">
defineProps<{ message?: string; confirmLabel?: string; cancelLabel?: string }>()
const emit = defineEmits(['confirm', 'close'])
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card" style="max-width: 360px;">
      <div class="modal-header">
        <span class="modal-icon">⚠️</span>
        <h3>Confirmation</h3>
      </div>
      <p class="modal-message">{{ message || 'Confirm this action?' }}</p>
      <div class="modal-footer">
        <button class="btn btn-ghost" @click="$emit('close')">{{ cancelLabel || 'Cancel' }}</button>
        <button class="btn btn-danger" @click="$emit('confirm')">{{ confirmLabel || 'Confirm' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-message {
  margin: 0 0 4px;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #444;
}
</style>

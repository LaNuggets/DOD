<script setup lang="ts">
defineProps<{ text?: string; okLabel?: string }>()
const emit = defineEmits(['close'])
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card" style="max-width: 340px;">
      <div class="modal-header">
        <span class="modal-icon">✅</span>
        <h3>Info</h3>
      </div>
      <p class="modal-message">{{ text || '' }}</p>
      <div class="modal-footer">
        <button class="btn btn-primary" @click="$emit('close')">{{ okLabel || 'OK' }}</button>
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

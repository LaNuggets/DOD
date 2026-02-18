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
    <div class="modal-card" style="max-width: 380px;">
      <div class="modal-header">
        <span class="modal-icon">➕</span>
        <h3>Add user to channel</h3>
      </div>

      <div class="modal-body">
        <input
          v-model="username"
          class="input-base"
          placeholder="Username (e.g. a.dupont)"
          @keyup.enter="confirm"
          autofocus
        />
      </div>

      <div class="modal-footer">
        <button class="btn btn-ghost" @click="close">Cancel</button>
        <button class="btn btn-primary" @click="confirm" :disabled="!username.trim()">Add</button>
      </div>
    </div>
  </div>
</template>

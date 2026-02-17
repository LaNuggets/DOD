<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['confirm','close'])
const username = ref('')

const confirm = () => {
  if (!username.value) return
  emit('confirm', username.value)
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
      <h3>Add user to channel</h3>
      <input v-model="username" placeholder="username (e.g. a.dupont)" />
      <div class="actions">
        <button @click="close">Cancel</button>
        <button @click="confirm" :disabled="!username">Add</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:1000;
}
.modal-card{
  background: white;
  padding: 16px;
  border-radius: 8px;
  min-width: 280px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}
.modal-card h3{
  margin: 0 0 8px 0;
}
.modal-card input{
  width:100%;
  padding:8px;
  margin-bottom:12px;
  border:1px solid #ccc;
  border-radius:4px;
}
.actions{
  display:flex;
  justify-content:flex-end;
  gap:8px;
}
.actions button{
  padding:6px 10px;
  border-radius:4px;
  border:1px solid #bbb;
  background:#fff;
  cursor:pointer;
}
.actions button:disabled{
  opacity:0.6;
  cursor:default;
}
</style>
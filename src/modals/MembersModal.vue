<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ users: string[]; currentUser?: string | null; creator?: string | null }>()
const emit = defineEmits(['ban','quit','close'])

const pending = ref<string | null>(null)
const toConfirm = ref<{ username: string; action: 'ban'|'quit' } | null>(null)

const requestBan = (username: string) => {
  toConfirm.value = { username, action: 'ban' }
}
const requestQuit = (username: string) => {
  toConfirm.value = { username, action: 'quit' }
}

const doConfirm = () => {
  if (!toConfirm.value) return
  const { username, action } = toConfirm.value
  pending.value = username
  toConfirm.value = null
  if (action === 'ban') emit('ban', username)
  else emit('quit', username)
  pending.value = null
}
const doClose = () => emit('close')
</script>

<template>
  <div class="modal-backdrop" @click.self="doClose">
    <div class="modal-card members-card">
      <h3>Channel members</h3>
      <ul class="members-list">
        <li v-for="u in users" :key="u">
          <span class="username">{{ u }}</span>
          <span class="actions">
            <button v-if="u === props.currentUser" @click="requestQuit(u)">Quit</button>
            <button v-else-if="props.currentUser && props.creator && props.currentUser === props.creator" @click="requestBan(u)">Ban</button>
          </span>
        </li>
      </ul>

      <div class="actions">
        <button @click="doClose">Close</button>
      </div>

      <div v-if="toConfirm" class="confirm-inline">
        <p>Are you sure you want to {{ toConfirm.action }} <strong>{{ toConfirm.username }}</strong>?</p>
        <div class="actions">
          <button @click="toConfirm = null">Cancel</button>
          <button @click="doConfirm">Yes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;z-index:1000}
.modal-card{background:#fff;padding:16px;border-radius:8px;min-width:320px;box-shadow:0 8px 24px rgba(0,0,0,0.2)}
.members-list{list-style:none;padding:0;margin:12px 0;max-height:320px;overflow:auto}
.members-list li{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #eee}
.members-list .username{font-weight:500}
.actions{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}
.members-card .actions{margin-top:10px}
.confirm-inline{margin-top:12px;padding:8px;border-top:1px solid #eee}
.members-list button{padding:4px 8px;border-radius:4px;border:1px solid #bbb;background:#fff;cursor:pointer}
</style>

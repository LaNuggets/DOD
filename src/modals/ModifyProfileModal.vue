<script setup lang="ts">
import { ref } from 'vue'
import type { UserMeta } from '@/types/userType'

const props = defineProps<{ data: UserMeta }>()

const emit = defineEmits<{
  confirm: [payload: Partial<UserMeta>]
  close: []
}>()

const displayName = ref(props.data.display_name)
const img         = ref(props.data.img)
const status      = ref(props.data.status)

const confirm = () => {
  const payload: Partial<UserMeta> = {}
  const dn = displayName.value.trim()
  const im = img.value.trim()
  const st = status.value.trim()
  if (dn !== props.data.display_name) payload.display_name = dn
  if (im !== props.data.img)          payload.img          = im
  if (st !== props.data.status)       payload.status       = st
  emit('confirm', payload)
}
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card" style="max-width: 420px; overflow: hidden; animation: slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);">

      <div class="modal-header">
        <span class="modal-icon">✦</span>
        <h3>Edit profile</h3>
        <button class="close-x" @click="$emit('close')" aria-label="Close">✕</button>
      </div>

      <div class="modal-body">
        <div class="field">
          <label>Display name</label>
          <input v-model="displayName" class="input-base" placeholder="Adrien the GOAT" autocomplete="off" />
        </div>

        <div class="field">
          <label>Avatar <span class="hint">(URL)</span></label>
          <input v-model="img" class="input-base" type="url" placeholder="https://…" autocomplete="off" />
        </div>

        <div class="field">
          <label>Status</label>
          <input v-model="status" class="input-base" placeholder="Coding stuff! It's fun!" autocomplete="off" />
        </div>

        <p class="hint-text">Leave a field empty to keep it unchanged.</p>
      </div>

      <div class="modal-footer">
        <button class="btn btn-ghost" @click="$emit('close')">Cancel</button>
        <button class="btn btn-primary" @click="confirm">Save</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.hint { font-weight: 400; color: #999; font-size: 0.72rem; text-transform: none; letter-spacing: 0; }
.hint-text { margin: 0; font-size: 0.72rem; color: #aaa; font-style: italic; text-align: center; }
</style>

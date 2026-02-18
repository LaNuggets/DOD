<script setup lang="ts">
import { ref } from 'vue'
import type { Message } from '@/types/messageType'

const props = defineProps<{ data: Message }>()
const emit = defineEmits(['confirm', 'close'])

const messageValue = ref('')

const confirm = () => {
  props.data.content.value = messageValue.value
  emit('confirm', props.data)
  messageValue.value = ''
}

const close = () => {
  messageValue.value = ''
  emit('close')
}
</script>

<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-card" style="max-width: 380px;">
      <div class="modal-header">
        <span class="modal-icon">✏️</span>
        <h3>Moderate message</h3>
      </div>

      <div class="modal-body">
        <input
          v-model="messageValue"
          class="input-base"
          placeholder="New content…"
          @keyup.enter="confirm"
          autofocus
        />
      </div>

      <div class="modal-footer">
        <button class="btn btn-ghost" @click="close">Cancel</button>
        <button class="btn btn-primary" @click="confirm">Apply</button>
      </div>
    </div>
  </div>
</template>

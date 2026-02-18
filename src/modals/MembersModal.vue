<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ users: string[]; currentUser?: string | null; creator?: string | null }>()
const emit = defineEmits(['ban', 'quit', 'close'])

const toConfirm = ref<{ username: string; action: 'ban' | 'quit' } | null>(null)

const requestBan  = (username: string) => { toConfirm.value = { username, action: 'ban' } }
const requestQuit = (username: string) => { toConfirm.value = { username, action: 'quit' } }

const doConfirm = () => {
  if (!toConfirm.value) return
  const { username, action } = toConfirm.value
  toConfirm.value = null
  emit(action === 'ban' ? 'ban' : 'quit', username)
}
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card" style="max-width: 420px; padding: 24px 28px;">

      <div class="modal-header">
        <span class="modal-icon">👥</span>
        <h3>Channel members</h3>
        <button class="close-x" @click="$emit('close')" title="Close">✕</button>
      </div>

      <ul class="members-list">
        <li v-for="u in users" :key="u" class="member-row">
          <div class="member-info">
            <span class="member-avatar">{{ u[0]?.toUpperCase() }}</span>
            <span class="member-name">
              {{ u }}
              <span v-if="u === props.creator" class="badge badge-creator">creator</span>
              <span v-if="u === props.currentUser" class="badge badge-you">you</span>
            </span>
          </div>

          <div class="member-actions">
            <!-- Quitter : disponible pour soi-même -->
            <button v-if="u === props.currentUser" class="btn btn-quit" @click="requestQuit(u)">
              Leave
            </button>
            <!-- Bannir : réservé au créateur, sur les autres membres -->
            <button
              v-else-if="props.currentUser === props.creator"
              class="btn btn-ban"
              @click="requestBan(u)"
            >
              Ban
            </button>
          </div>
        </li>
      </ul>

      <!-- Confirmation inline -->
      <div v-if="toConfirm" class="confirm-banner">
        <p>
          {{ toConfirm.action === 'ban' ? '⚠️ Ban' : '🚪 Leave for' }}
          <strong>{{ toConfirm.username }}</strong> ?
        </p>
        <div class="confirm-actions">
          <button class="btn btn-ghost btn-sm" @click="toConfirm = null">Cancel</button>
          <button
            :class="toConfirm.action === 'ban' ? 'btn btn-danger btn-sm' : 'btn btn-quit btn-sm'"
            @click="doConfirm"
          >
            Yes
          </button>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-ghost" @click="$emit('close')">Close</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.members-list {
  list-style: none;
  padding: 0;
  margin: 0 0 8px;
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--gold) transparent;
}
.members-list::-webkit-scrollbar { width: 5px; }
.members-list::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 10px; }

.member-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
  gap: 12px;
}
.member-row:last-child { border-bottom: none; }

.member-info { display: flex; align-items: center; gap: 10px; min-width: 0; }

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: linear-gradient(to bottom, var(--gold-light), var(--gold));
  color: #5a3e00;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(212, 175, 55, 0.3);
}

.member-name {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  font-size: 0.6rem;
  padding: 2px 7px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  font-weight: 700;
  flex-shrink: 0;
}
.badge-creator {
  background: linear-gradient(to right, var(--gold-light), var(--gold));
  color: #5a3e00;
}
.badge-you { background: #e8f4fd; color: #2980b9; border: 1px solid #aad4f0; }

.member-actions { flex-shrink: 0; }

/* Boutons petits pour liste membres */
.btn-quit {
  padding: 6px 14px;
  border-radius: 20px;
  font-family: var(--font-primary);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  background: transparent;
  border: 2px solid #e67e22;
  color: #e67e22;
}
.btn-quit:hover { background: #e67e22; color: white; }

.btn-ban {
  padding: 6px 14px;
  border-radius: 20px;
  font-family: var(--font-primary);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  background: transparent;
  border: 2px solid var(--error);
  color: var(--error);
}
.btn-ban:hover { background: var(--error); color: white; }

.btn-sm { padding: 5px 14px; font-size: 0.75rem; }

.confirm-banner {
  margin-top: 12px;
  padding: 14px 16px;
  background: #fffbf0;
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: var(--radius-sm);
}
.confirm-banner p { margin: 0 0 12px; font-size: 0.88rem; color: #555; }

.confirm-actions { display: flex; gap: 8px; justify-content: flex-end; }
</style>

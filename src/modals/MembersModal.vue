<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ users: string[]; currentUser?: string | null; creator?: string | null }>()
const emit = defineEmits(['ban', 'quit', 'close'])

const toConfirm = ref<{ username: string; action: 'ban' | 'quit' } | null>(null)

const requestBan = (username: string) => { toConfirm.value = { username, action: 'ban' } }
const requestQuit = (username: string) => { toConfirm.value = { username, action: 'quit' } }

const doConfirm = () => {
  if (!toConfirm.value) return
  const { username, action } = toConfirm.value
  toConfirm.value = null
  if (action === 'ban') emit('ban', username)
  else emit('quit', username)
}

const doClose = () => emit('close')
</script>

<template>
  <div class="modal-backdrop" @click.self="doClose">
    <div class="modal-card">

      <div class="modal-header">
        <span class="modal-icon">👥</span>
        <h3>Channel members</h3>
        <button class="close-x" @click="doClose" title="Close">✕</button>
      </div>

      <ul class="members-list">
        <li v-for="u in users" :key="u" class="member-row">
          <div class="member-info">
            <span class="member-avatar">{{ u[0]?.toUpperCase() }}</span>
            <span class="member-name">
              {{ u }}
              <span v-if="u === props.creator" class="badge-creator">creator</span>
              <span v-if="u === props.currentUser" class="badge-you">you</span>
            </span>
          </div>
          <div class="member-actions">
            <button
              v-if="u === props.currentUser"
              class="btn-quit"
              @click="requestQuit(u)"
            >
              Leave
            </button>
            <button
              v-else-if="props.currentUser && props.creator && props.currentUser === props.creator"
              class="btn-ban"
              @click="requestBan(u)"
            >
              Ban
            </button>
          </div>
        </li>
      </ul>

      <div v-if="toConfirm" class="confirm-banner">
        <p>
          {{ toConfirm.action === 'ban' ? '⚠️ Ban' : '🚪 Leave for' }}
          <strong>{{ toConfirm.username }}</strong> ?
        </p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="toConfirm = null">Cancel</button>
          <button
            :class="toConfirm.action === 'ban' ? 'btn-danger' : 'btn-quit'"
            @click="doConfirm"
          >
            Yes
          </button>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="doClose">Close</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* =========================================
   BACKDROP
   ========================================= */
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

/* =========================================
   CARD
   ========================================= */
.modal-card {
  --gold: #d4af37;
  --gold-light: #f5d76e;
  --white-marble: #f8f8f8;
  --black: #111;

  background: linear-gradient(160deg, #fff 60%, #fdf6e3);
  border: 2px solid var(--gold);
  border-radius: 12px;
  padding: 24px 28px;
  width: 100%;
  max-width: 420px;
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

/* =========================================
   HEADER
   ========================================= */
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
  flex: 1;
}

.close-x {
  background: none;
  border: none;
  font-size: 1rem;
  color: #aaa;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;
}
.close-x:hover { color: #333; background: #f0f0f0; }

/* =========================================
   LISTE DES MEMBRES
   ========================================= */
.members-list {
  list-style: none;
  padding: 0;
  margin: 0 0 8px;
  max-height: 300px;
  overflow-y: auto;
}

.members-list::-webkit-scrollbar { width: 5px; }
.members-list::-webkit-scrollbar-thumb {
  background: var(--gold);
  border-radius: 10px;
}

.member-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
  gap: 12px;
}

.member-row:last-child { border-bottom: none; }

/* =========================================
   AVATAR + NOM
   ========================================= */
.member-info {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
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

.badge-creator,
.badge-you {
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

.badge-you {
  background: #e8f4fd;
  color: #2980b9;
  border: 1px solid #aad4f0;
}

/* =========================================
   BOUTONS PAR MEMBRE
   ========================================= */
.member-actions { flex-shrink: 0; }

.btn-quit,
.btn-ban,
.btn-cancel,
.btn-danger {
  padding: 6px 14px;
  border-radius: 20px;
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.3px;
}

.btn-quit {
  background: transparent;
  border: 2px solid #e67e22;
  color: #e67e22;
}
.btn-quit:hover {
  background: #e67e22;
  color: white;
}

.btn-ban {
  background: transparent;
  border: 2px solid #c0392b;
  color: #c0392b;
}
.btn-ban:hover {
  background: #c0392b;
  color: white;
}

.btn-cancel {
  background: transparent;
  border: 2px solid #ccc;
  color: #666;
}
.btn-cancel:hover { border-color: #aaa; color: #333; }

.btn-danger {
  background: linear-gradient(to bottom, #e74c3c, #c0392b);
  border: none;
  color: white;
  box-shadow: 0 2px 6px rgba(192, 57, 43, 0.3);
}
.btn-danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(192, 57, 43, 0.4);
}

/* =========================================
   CONFIRMATION INLINE
   ========================================= */
.confirm-banner {
  margin-top: 12px;
  padding: 14px 16px;
  background: #fffbf0;
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 8px;
}

.confirm-banner p {
  margin: 0 0 12px;
  font-size: 0.88rem;
  color: #555;
}

.confirm-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* =========================================
   FOOTER
   ========================================= */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  margin-top: 4px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}
</style>
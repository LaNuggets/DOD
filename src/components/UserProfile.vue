<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from '@/ts/store'
import { getUsernameFromToken } from '@/ts/saveload'
import ModifyProfileModal from '@/modals/ModifyProfileModal.vue'

interface UserMeta {
  username: string
  display_name: string
  img: string
  status: string
}

const store = useStore()
const token = store.getToken()
const username = getUsernameFromToken(token)

// Valeurs par défaut : chaînes vides (jamais null/undefined)
const user = ref<UserMeta>({
  username: username ?? '?',
  display_name: '',
  img: '',
  status: '',
})

const loading = ref(false)
const saving  = ref(false)
const error   = ref<string | null>(null)
const showEdit = ref(false)

// ── Chargement du profil ──────────────────────────────────────────────────────
const loadProfile = async () => {
  if (!username) return
  loading.value = true
  error.value   = null
  try {
    const resp = await fetch(
      `https://edu.tardigrade.land/msg/protected/user/meta?users=${encodeURIComponent(username)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!resp.ok) throw new Error(`Erreur ${resp.status}`)

    const data = await resp.json()
    if (Array.isArray(data) && data.length > 0) {
      const d = data[0]
      user.value = {
        username:     d.username     ?? username,
        display_name: d.display_name ?? '',
        img:          d.img          ?? '',
        status:       d.status       ?? '',
      }
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

onMounted(loadProfile)

// ── Sauvegarde du profil ──────────────────────────────────────────────────────
// L'API exige TOUJOURS tous les champs (dont display_name).
// On fusionne les nouvelles valeurs avec les valeurs actuelles pour ne jamais
// omettre un champ.
const onConfirm = async (payload: Partial<UserMeta>) => {
  if (!token) return
  saving.value = true
  error.value  = null
  try {
    // Fusion : si le champ n'a pas été modifié dans la modal, on garde l'existant
    const body: UserMeta = {
      username:     user.value.username,
      display_name: payload.display_name ?? user.value.display_name,
      img:          payload.img          ?? user.value.img,
      status:       payload.status       ?? user.value.status,
    }

    const resp = await fetch('https://edu.tardigrade.land/msg/protected/user/meta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!resp.ok) {
      const text = await resp.text()
      throw new Error(text || `Erreur ${resp.status}`)
    }

    // Mise à jour locale
    user.value = body
    showEdit.value = false
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Erreur lors de l'enregistrement"
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="user-profile">

    <div v-if="error" class="error-msg">{{ error }}</div>

    <div class="profile-card" :class="{ 'is-loading': loading }">
      <div class="avatar-wrapper">
        <img v-if="user.img" :src="user.img" alt="avatar" class="avatar" />
        <div v-else class="avatar-placeholder">
          {{ (user.display_name || user.username || '?').charAt(0).toUpperCase() }}
        </div>
        <span class="online-dot"></span>
      </div>

      <div class="profile-info">
        <p class="display-name">{{ user.display_name || user.username || 'Utilisateur' }}</p>
        <p class="username">@{{ user.username }}</p>
        <p class="status">
          <span class="status-dot"></span>
          {{ user.status || 'Aucun statut' }}
        </p>
      </div>
    </div>

    <button class="edit-btn" @click="showEdit = true" :disabled="saving || loading">
      {{ saving ? '⏳ Sauvegarde…' : '✏️ Modifier le profil' }}
    </button>

    <ModifyProfileModal
      v-if="showEdit"
      :data="user"
      @confirm="onConfirm"
      @close="showEdit = false"
    />

  </div>
</template>

<style scoped>
.user-profile {
  --gold: #d4af37;
  --gold-light: #f5d76e;
  --black: #111;
  font-family: 'Cinzel', serif;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.error-msg {
  color: #c0392b;
  font-size: 0.78rem;
  background: #fff0f0;
  border-left: 3px solid #c0392b;
  padding: 6px 10px;
  border-radius: 4px;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: linear-gradient(135deg, #fff 0%, #fdf8e8 100%);
  border: 1.5px solid var(--gold);
  border-radius: 14px;
  box-shadow: 0 3px 12px rgba(212, 175, 55, 0.15);
  transition: opacity 0.3s;
}
.profile-card.is-loading { opacity: 0.5; }

.avatar-wrapper { position: relative; flex-shrink: 0; }

.avatar,
.avatar-placeholder {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid var(--gold);
  object-fit: cover;
}

.avatar-placeholder {
  background: linear-gradient(135deg, var(--gold-light), var(--gold));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.25);
}

.online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 11px;
  height: 11px;
  background: #27ae60;
  border: 2px solid #fff;
  border-radius: 50%;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.display-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--black);
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.username {
  margin: 0;
  font-size: 0.72rem;
  color: var(--gold);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status {
  margin: 4px 0 0;
  font-size: 0.72rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  background: #27ae60;
  border-radius: 50%;
}

.edit-btn {
  width: 100%;
  padding: 9px 14px;
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--black);
  background: linear-gradient(to bottom, #fff, #f0f0f0);
  border: 1.5px solid var(--gold);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(212, 175, 55, 0.12);
}

.edit-btn:hover:not(:disabled) {
  background: linear-gradient(to bottom, var(--gold-light), var(--gold));
  color: #fff;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.35);
  transform: translateY(-1px);
}

.edit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
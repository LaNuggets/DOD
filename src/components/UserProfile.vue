<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from '@/ts/store'
import { getUsernameFromToken } from '@/ts/saveload'
import { apiGetUsersMeta, apiSaveUserMeta } from '@/ts/api'
import ModifyProfileModal from '@/modals/ModifyProfileModal.vue'
import type { UserMeta } from '@/types/userType'

const store = useStore()
const username = getUsernameFromToken(store.getToken())

const user = ref<UserMeta>({
  username: username ?? '?',
  display_name: '',
  img: '',
  status: '',
})

const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const showEdit = ref(false)

const loadProfile = async () => {
  if (!username) return

  loading.value = true
  error.value = null

  try {
    const data = await apiGetUsersMeta([username])
    const d = data[0]

    if (!d) return

    user.value = {
      username: d.username ?? username,
      display_name: d.display_name ?? '',
      img: d.img ?? '',
      status: d.status ?? '',
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error loading profile'
  } finally {
    loading.value = false
  }
}



const onConfirm = async (payload: Partial<UserMeta>) => {
  saving.value = true
  error.value = null
  try {
    const body: UserMeta = {
      username: user.value.username,
      display_name: payload.display_name ?? user.value.display_name,
      img: payload.img ?? user.value.img,
      status: payload.status ?? user.value.status,
    }
    await apiSaveUserMeta(body)
    user.value = body
    showEdit.value = false
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error saving profile'
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <div class="user-profile">

    <div v-if="error" class="error-text">{{ error }}</div>

    <div class="profile-card" :class="{ 'is-loading': loading }">
      <div class="avatar-wrapper">
        <img v-if="user.img" :src="user.img" alt="avatar" class="avatar" />
        <div v-else class="avatar-placeholder">
          {{ (user.display_name || user.username || '?').charAt(0).toUpperCase() }}
        </div>
        <span class="online-dot"></span>
      </div>

      <div class="profile-info">
        <p class="display-name">{{ user.display_name || user.username || 'User' }}</p>
        <p class="username">@{{ user.username }}</p>
        <p class="status">
          <span class="status-dot"></span>
          {{ user.status || 'No status' }}
        </p>
      </div>
    </div>

    <button class="btn btn-secondary edit-btn" @click="showEdit = true" :disabled="saving || loading">
      {{ saving ? '⏳ Saving…' : '✏️ Edit profile' }}
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
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  border-radius: var(--radius-full);
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
  background: var(--success);
  border: 2px solid #fff;
  border-radius: var(--radius-full);
}

.profile-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }

.display-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
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
  color: var(--text-muted);
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
  background: var(--success);
  border-radius: var(--radius-full);
}

.edit-btn {
  width: 100%;
  justify-content: center;
  border-radius: var(--radius-sm);
}
</style>

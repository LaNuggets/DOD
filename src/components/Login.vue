<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useStore } from '@/ts/store'
import { apiLogin } from '@/ts/api'
import router from '@/ts/router'
import type { Form } from '@/types/login'

const tokenStore = useStore()

const form = reactive<Form>({
  username: '',
  password: '',
})

const loading = ref(false)
const error = ref<string | null>(null)

const connection = async () => {
  if (!form.username || !form.password) {
    error.value = 'Username and password are required'
    return
  }

  loading.value = true
  error.value = null

  try {
    const data = await apiLogin(form.username, form.password)
    tokenStore.setToken(data.token)
    router.push({ path: '/' })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error during connection'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="connection" class="login-form">

    <div class="field">
      <label for="username">Username</label>
      <input
        id="username"
        v-model="form.username"
        class="input-base"
        type="text"
        required
        placeholder="username"
        autocomplete="username"
      />
    </div>

    <div class="field">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="form.password"
        class="input-base"
        type="password"
        required
        minlength="6"
        placeholder="••••••••"
        autocomplete="current-password"
      />
    </div>

    <p v-if="error" class="error-text">{{ error }}</p>

    <button type="submit" class="btn btn-primary login-btn" :disabled="loading">
      <span v-if="loading" class="spinner"></span>
      {{ loading ? 'Logging in…' : 'Login' }}
    </button>

  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  padding: 36px 40px;
  background: linear-gradient(to bottom, var(--white-marble), var(--sky));
  border: 3px solid var(--gold);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.field label {
  color: var(--gold);
  letter-spacing: 1px;
  text-align: left;
}

.login-btn {
  width: 100%;
  justify-content: center;
  font-size: 1rem;
  padding: 12px;
  margin-top: 4px;
}
</style>
